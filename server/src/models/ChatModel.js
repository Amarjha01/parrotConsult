import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  user: { // client
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true,
  },
  consultant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true,
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  unreadCountForConsultant: { type: Number, default: 0 },
  unreadCountForUser: { type: Number, default: 0 },
}, {
  timestamps: true,
});

ChatSchema.index({ user: 1, consultant: 1 }, { unique: true });

export const Chat = mongoose.model('Chat', ChatSchema);



const MessageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true,
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text',
  },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, {
  timestamps: true,
});

export const Message = mongoose.model('Message', MessageSchema);

