import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function Inbox() {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInbox() {
      try {
        const resp = await axios.get('http://localhost:8011/api/v1/chat/inbox', {
          withCredentials: true,
        });
        console.log(resp.data.inbox);
        setInbox(resp.data.inbox);
      } catch (e) {
        console.error('fetch inbox failed', e);
      } finally {
        setLoading(false);
      }
    }

    fetchInbox();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-600">Loading conversations...</div>;

  if (inbox.length === 0)
    return <div className="p-6 text-center text-gray-600">No conversations yet.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">Your Inbox</h2>

      <div className="space-y-4">
        {inbox.map((c) => (
          <div
            key={c.chatId}
            className="flex justify-between items-center p-4 bg-white shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition cursor-pointer"
            onClick={() => {
              window.location.href = `/chat?chatId=${c.chatId}&otherId=${c.otherId}&otherName=${encodeURIComponent(
                c.otherName
              )}&otherprofileImage=${encodeURIComponent(c.otherprofileImage)}`;
            }}
          >
            {/* Left side */}
            <div className="flex items-center gap-4">
              <img
                src={c.otherprofileImage || 'https://i.postimg.cc/bryMmCQB/profile-image.jpg'}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border border-gray-300"
              />

              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 truncate w-44 sm:w-64">
                  {c.otherName}
                </span>
                <div className="text-sm text-gray-600 truncate flex gap-1 max-w-[250px] sm:max-w-[300px]">
                  {c.lastMessageSender && <span className="font-medium">{c.lastMessageSender}:</span>}
                  <span className="truncate">{c.lastMessage || 'No messages yet'}</span>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-500">{dayjs(c.updatedAt).fromNow()}</span>

              {c.unreadCountForMe > 0 && (
                <span className="bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {c.unreadCountForMe}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
