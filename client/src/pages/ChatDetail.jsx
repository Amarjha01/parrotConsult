import React, { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import clsx from 'clsx';
import {
  ArrowLeft,
  Send,
  Smile,
  Phone,
  Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import EmojiPicker from "emoji-picker-react";
const CHAT_SERVER = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:8011';

const getId = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (val._id) return val._id.toString();
  return val.toString();
};

export default function ChatDetail({ currentUserId, otherName, otherProfileImage }) {
  const params = new URLSearchParams(window.location.search);
  const chatId = params.get('chatId');
  const otherId = params.get('otherId');

  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [input, setInput] = useState('');
  const [typingByOther, setTypingByOther] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const socketRef = useRef();
  const messagesEndRef = useRef();
  const typingTimeout = useRef();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const role = currentUser.role;
  const userId = role === 'consultant' ? otherId : currentUserId;
  const consultantId = role === 'consultant' ? currentUserId : otherId;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!chatId || !otherId || !currentUserId) {
      setError('Missing required identifiers');
      setLoading(false);
      return;
    }

    const socket = io(CHAT_SERVER, {
      transports: ['websocket'],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.emit('join-chat', { chatId, userId, consultantId });

    socket.on('chat-joined', async () => {
      try {
        const resp = await axios.get(`${CHAT_SERVER}/api/v1/chat/${userId}/${consultantId}`, {
          withCredentials: true,
        });

        setChat(resp.data.chat);
        setMessages(resp.data.messages || []);

        socket.emit('mark-read', {
          chatId: resp.data.chat._id,
          userId: currentUserId,
        });
      } catch (e) {
        console.error('history fetch failed', e);
        setError('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    });

    socket.on('new-message', ({ message, chat: updatedChat }) => {
      setMessages((prev) => [...prev, message]);
      setChat((prev) => ({ ...prev, ...updatedChat }));

      if (getId(message.receiver) === currentUserId) {
        socket.emit('mark-read', {
          chatId: updatedChat._id,
          userId: currentUserId,
        });
      }
    });

    socket.on('typing', ({ fromId }) => {
      if (fromId !== currentUserId) {
        setTypingByOther(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingByOther(false), 1200);
      }
    });

    socket.on('read-updated', ({ unreadCountForUser, unreadCountForConsultant }) => {
      setChat((prev) => ({
        ...prev,
        unreadCountForUser,
        unreadCountForConsultant,
      }));
    });

    return () => {
      clearTimeout(typingTimeout.current);
      socket.disconnect();
    };
  }, [chatId, otherId, currentUserId, role, userId, consultantId]);

  const sendMessage = () => {
    if (!input.trim() || !chat) return;
    const toId = currentUserId === userId ? consultantId : userId;
    socketRef.current.emit('send-message', {
      chatId: chat._id,
      fromId: currentUserId,
      toId,
      content: input.trim(),
      type: 'text',
    });
    setInput('');
  };

  const handleTyping = () => {
    if (!chat) return;
    socketRef.current.emit('typing', {
      chatId: chat._id,
      fromId: currentUserId,
    });
  };

  if (loading) return <div className="p-6 text-center">Loading conversation...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!chat) return <div className="p-6">Chat not found.</div>;


  const handleEmojiClick = (emojiData) => {
    setMessages(prev => prev + emojiData.emoji);
  };


  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full bg-white border border-gray-200 shadow rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-100 rounded-t-xl">
        <div className="flex items-center gap-4">
         <Link to={'/inbox'}>
          <ArrowLeft className="lg:hidden cursor-pointer" />
         </Link>
          <div className="relative">
            <img
              src={otherProfileImage || 'https://i.postimg.cc/bryMmCQB/profile-image.jpg'}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-200"
              alt="Avatar"
            />
            {onlineStatus && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 truncate max-w-[200px]">{otherName}</h2>
            <p className="text-sm text-gray-500">
              {typingByOther ? 'Typing...' : onlineStatus ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex gap-3 text-gray-600">
          <Phone className="cursor-pointer" />
          <Video className="cursor-pointer" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-sm text-gray-500 mt-10">No messages yet.</div>
        )}
        {messages.map((m) => {
          const isMe = m.sender?._id === currentUserId;
          return (
            <div
              key={m._id}
              className={clsx('flex', isMe ? 'justify-end' : 'justify-start')}
            >
              <div
                className={clsx(
                  'rounded-2xl px-4 py-2 max-w-[75%] text-sm transition-shadow duration-200',
                  isMe
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-800 border shadow-sm'
                )}
              >
                <div>{m.content}</div>
                <div className="text-[10px] mt-1 flex justify-between text-gray-400">
                  <span>
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isMe && (
                    <span>
                      {Array.isArray(m.readBy) && m.readBy.includes(currentUserId)
                        ? '✓✓'
                        : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-5 py-4 border-t rounded-b-xl bg-white flex items-center gap-3">
          <button
        className="text-gray-500 hover:text-gray-700"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        <Smile size={20} />
      </button>

      {showEmojiPicker && (
        <div className="absolute bottom-12 left-4 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
            handleTyping();
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
