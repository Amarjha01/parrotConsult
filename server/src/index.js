import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import app from "./app.js";
import connectDB from "./db/index.js";
import { createServer } from "http";
import { Server } from "socket.io";
import {Chat , Message} from "./models/ChatModel.js";
import { log } from "util";

// Wrap express app in HTTP server
const server = createServer(app);
console.log('yha log hua');

// socket.io Server Initialization (Instance creation of Server class getting from Socket.io)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Utility: resolve who is user vs consultant (you can replace with role logic)
function resolvePair(fromId, toId, userDoc, consultantDoc) {
  // assume caller passes correct user & consultant ids externally
  return { user: userDoc, consultant: consultantDoc };
}
console.log('yha bhi hua');

io.on("connection", (socket) => {
  // console.log('loging socket :' , socket);
  
  console.log("Socket connected:", socket.id);

  // join a chat room (chatId or pair)
  socket.on("join-chat", async ({ chatId, userId, consultantId }) => {
    console.log(chatId , userId , consultantId);
    
    let chat;

    if (chatId) {
      chat = await Chat.findById(chatId);
    } else if (userId && consultantId) {
      chat = await Chat.findOne({ user: userId, consultant: consultantId });
      if (!chat) {
        chat = await Chat.create({ user: userId, consultant: consultantId });
      }
    } else {
      socket.emit("error", "missing chat identification");
      return;
    }

    socket.join(chat._id.toString());
    socket.chatId = chat._id.toString();
    socket.userId = userId;
    socket.consultantId = consultantId;

    // send existing lastMessage summary if needed
    socket.emit("chat-joined", { chatId: chat._id, lastMessage: chat.lastMessage });
  });

  // typing indicator
  socket.on("typing", ({ chatId, fromId }) => {
    socket.to(chatId).emit("typing", { fromId });
  });

  // send message
  socket.on("send-message", async ({ chatId, fromId, toId, content, type = "text" }) => {
    if (!chatId || !fromId || !toId || !content) return;

    // fetch or create chat to ensure consistency
    const chat = await Chat.findById(chatId) || await Chat.findOneAndUpdate(
      { user: fromId, consultant: toId },
      {},
      { upsert: true, new: true }
    );

    // create message
    const message = await Message.create({
      chat: chat._id,
      sender: fromId,
      receiver: toId,
      content,
      type,
    });

    // update lastMessage + unread counts
    chat.lastMessage = message._id;
    if (fromId.toString() === chat.user.toString()) {
      chat.unreadCountForConsultant += 1;
    } else {
      chat.unreadCountForUser += 1;
    }
    await chat.save();

  await message.populate([
  { path: 'sender', select: 'name avatar' },
  { path: 'receiver', select: 'name avatar' },
]);

io.to(chat._id.toString()).emit("new-message", {
  chat: {
    _id: chat._id,
    lastMessage: message,
    unreadCountForUser: chat.unreadCountForUser,
    unreadCountForConsultant: chat.unreadCountForConsultant,
  },
  message,
});

  });

  // mark as read
  socket.on("mark-read", async ({ chatId, userId }) => {
    if (!chatId || !userId) return;
    const messages = await Message.find({ chat: chatId, readBy: { $ne: userId } });
    await Promise.all(messages.map(m => {
      m.readBy.push(userId);
      return m.save();
    }));

    // reset unread counters
    const chat = await Chat.findById(chatId);
    if (!chat) return;
    if (userId.toString() === chat.user.toString()) {
      chat.unreadCountForUser = 0;
    } else {
      chat.unreadCountForConsultant = 0;
    }
    await chat.save();

    io.to(chatId).emit("read-updated", {
      chatId,
      unreadCountForUser: chat.unreadCountForUser,
      unreadCountForConsultant: chat.unreadCountForConsultant,
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

connectDB()
  .then(() => {
    const port = process.env.PORT ? Number(process.env.PORT) : 8011; // fallback
    server.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  })
  .catch((err) => {
    console.error("MONGODB connection failed", err);
    process.exit(1);
  });
