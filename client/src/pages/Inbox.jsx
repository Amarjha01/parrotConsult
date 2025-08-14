import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function Inbox() {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    async function fetchInbox() {
      try {
        const resp = await axios.get(`${BASE_URL}/chat/inbox`, {
          withCredentials: true,
        });
        console.log(resp.data.inbox);
        console.log(`${BASE_URL}/chat/inbox`);
        
        setInbox(resp.data.inbox);
      } catch (e) {
        console.error('fetch inbox failed', e);
      } finally {
        setLoading(false);
      }
    }

    fetchInbox();
  }, []);

  if (loading) 
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading conversations...</p>
        </div>
      </div>
    );

  if (inbox.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No conversations yet</h3>
          <p className="text-slate-500">Start a conversation to see it appear in your inbox.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent mb-2">
            Your Inbox
          </h1>
          <p className="text-slate-600">
            {inbox.length} conversation{inbox.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Conversations List */}
        <div className="space-y-3">
          {inbox.map((c, index) => (
            <div
              key={c.chatId}
              className="group relative bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`
              }}
              onClick={() => {
                window.location.href = `/chat?chatId=${c.chatId}&otherId=${c.otherId}&otherName=${encodeURIComponent(
                  c.otherName
                )}&otherprofileImage=${encodeURIComponent(c.otherprofileImage)}`;
              }}
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-indigo-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex justify-between items-center p-6">
                {/* Left side */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Avatar with online indicator */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={c.otherprofileImage || 'https://i.postimg.cc/bryMmCQB/profile-image.jpg'}
                      alt="avatar"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-800 truncate text-lg">
                        {c.otherName}
                      </span>
                      {c.unreadCountForMe > 0 && (
                        <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                          {c.unreadCountForMe}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-600">
                      {c.lastMessageSender && (
                        <span className="font-medium text-sm bg-slate-100 px-2 py-0.5 rounded-lg">
                          {c.lastMessageSender}
                        </span>
                      )}
                      <span className="text-sm truncate max-w-[280px] sm:max-w-[400px]">
                        {c.lastMessage || 'No messages yet'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100/70 px-2 py-1 rounded-lg">
                    {dayjs(c.updatedAt).fromNow()}
                  </span>
                  
                  {/* Arrow indicator */}
                  <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors duration-300">
                    <svg className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200/50">
          <p className="text-sm text-slate-500">
            Stay connected with your conversations
          </p>
        </div>
      </div>
    </div>
  );
}