import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import dayjs from 'dayjs';

const SIGNALING_OR_CHAT_SERVER ='http://localhost:8011'

const Chats = ({ userId, consultantId }) => {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingByOther, setTypingByOther] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!userId || !consultantId) return;

    const socket = io(SIGNALING_OR_CHAT_SERVER, {
      transports: ['websocket'],
      withCredentials: true,
    });
    socketRef.current = socket;

    // Join (lazy chat creation) – backend will create if missing
    socket.emit('join-chat', { userId, consultantId });

    socket.on('chat-joined', async ({ chatId }) => {
      // fetch history
      try {
        const resp = await axios.get(
          `${SIGNALING_OR_CHAT_SERVER}/api/v1/chat/${userId}/${consultantId}`
        );
        setChat(resp.data.chat);
        setMessages(resp.data.messages || []);

        // mark read immediately
        socket.emit('mark-read', { chatId: resp.data.chat._id, userId });
      } catch (e) {
        console.warn('history fetch failed', e);
      }
    });

    socket.on('new-message', ({ chat: updatedChat, message }) => {
      setChat(prev => ({ ...prev, ...updatedChat }));
      setMessages(prev => [...prev, message]);
      // auto-mark read if current user is receiver
      if (message.receiver === userId) {
        socket.emit('mark-read', { chatId: updatedChat._id, userId });
      }
    });

    socket.on('typing', ({ fromId }) => {
      if (fromId === (userId === chat?.user?._id ? consultantId : userId)) {
        setTypingByOther(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingByOther(false), 1200);
      }
    });

    socket.on('read-updated', ({ unreadCountForUser, unreadCountForConsultant }) => {
      setChat(prev => ({
        ...prev,
        unreadCountForUser,
        unreadCountForConsultant,
      }));
    });

    return () => {
      socket.disconnect();
      clearTimeout(typingTimeout.current);
    };
  }, [userId, consultantId]);

  const sendMessage = () => {
    if (!input.trim() || !chat) return;
    const toId =
      userId.toString() === chat.user.toString() ? consultantId : userId;
    socketRef.current.emit('send-message', {
      chatId: chat._id,
      fromId: userId,
      toId,
      content: input.trim(),
      type: 'text',
    });
    setInput('');
  };

  const handleTyping = () => {
    if (!chat) return;
    socketRef.current.emit('typing', { chatId: chat._id, fromId: userId });
  };

  const formatTime = (iso) => {
    return dayjs(iso).format('h:mm A');
  };

  return (
    <div className="max-w-xl mx-auto border rounded shadow p-4 flex flex-col h-[600px] z-40">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-lg">
          Chat with {userId === chat?.user?._id ? 'Consultant' : 'User'}
        </div>
        {typingByOther && (
          <div className="text-sm text-gray-500 italic">Typing...</div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg) => {
          const isMe = msg.sender === userId;
          return (
            <div
              key={msg._id || Math.random()}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`bg-${
                  isMe ? 'blue-600 text-white' : 'gray-200 text-gray-800'
                } rounded-xl px-4 py-2 max-w-[70%] relative`}
              >
                <div className="text-sm">{msg.content}</div>
                <div className="text-[10px] mt-1 flex justify-between gap-2">
                  <div>{formatTime(msg.createdAt)}</div>
                  {isMe && msg.readBy?.includes(consultantId) && (
                    <div className="ml-2">✓✓</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
            handleTyping();
          }}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chats;
