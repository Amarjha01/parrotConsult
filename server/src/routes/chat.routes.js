import express from 'express';
import { Chat, Message } from '../models/ChatModel.js';
import jwt from 'jsonwebtoken';

const Chatrouter = express.Router();

// Middleware to extract user from JWT (cookie or Authorization header)
function extractUser(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  const token = tokenFromHeader || req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.currentUser = decoded; // { _id, role, ... }
    next();
  } catch (err) {
    console.warn('JWT verify failed', err);
    return res.status(401).json({ error: 'Invalid auth token' });
  }
}

// Inbox: list all chats for current user (user or consultant)
Chatrouter.get('/inbox', extractUser, async (req, res) => {
  try {
    const userId = req.currentUser._id.toString();
    const isConsultant = req.currentUser.role === 'consultant';
  
    const filter = isConsultant ? { consultant: userId } : { user: userId };
     console.log(filter);
     
    const chats = await Chat.find(filter)
      .sort({ updatedAt: -1 })
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'FullName profileImage' },
      })
      .populate(isConsultant ? 'user' : 'consultant', 'fullName profileImage');
  console.log('dfgukjygguytgfduchat' , chats);
// console.log(chats.lastMessage.sender);

  
    const inbox = chats.map((c) => {
      const other = isConsultant ? c.user : c.consultant;
      return {
        chatId: c._id,
        otherId: other?._id,
        otherName: other?.fullName || '',
        otherprofileImage: other?.profileImage || '',
        lastMessage: c.lastMessage ? c.lastMessage.content : null,
        lastMessageSender:
          c.lastMessage && c.lastMessage.sender
            ? c.lastMessage.sender.name
            : null,
        updatedAt: c.updatedAt,
        unreadCountForMe: isConsultant
          ? c.unreadCountForConsultant
          : c.unreadCountForUser,
      };
    });

    res.json({ inbox });
  } catch (err) {
    console.error('Inbox load failed', err);
    res.status(500).json({ error: 'failed to load inbox' });
  }
});

// Fetch or create specific chat + its history
Chatrouter.get('/:userId/:consultantId', extractUser, async (req, res) => {
  console.log('yhi call hua hai ');
  
  try {
    const { userId, consultantId } = req.params;
    console.log(userId , consultantId);

    // Ensure the requester is either the user or consultant in this pair
    const requesterId = req.currentUser._id.toString();
    if (
      requesterId !== userId &&
      requesterId !== consultantId &&
      req.currentUser.role !== 'admin' // optionally allow admin
    ) {
      return res.status(403).json({ error: 'Not authorized for this chat' });
    }

    let chat = await Chat.findOne({ user: userId, consultant: consultantId });
    if (!chat) {
      chat = await Chat.create({ user: userId, consultant: consultantId });
    }

    const messages = await Message.find({ chat: chat._id })
      .sort({ createdAt: 1 })
      .populate('sender', 'fullName profileImage')
      .populate('receiver', 'fullName profileImage');

    res.json({ chat, messages });
    console.log('sdgfhkio;uytdtyufx' , messages);
    
  } catch (err) {
    console.error('Chat fetch failed', err);
    res.status(500).json({ error: 'failed to fetch chat' });
  }
});

export default Chatrouter;

