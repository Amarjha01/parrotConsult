import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatDetail from './ChatDetail';

export default function ChatPageWrapper() {
  const [searchParams] = useSearchParams();

  const chatId = searchParams.get('chatId');
  const otherId = searchParams.get('otherId');
  const otherName = searchParams.get('otherName');
  const otherProfileImage = searchParams.get('otherprofileImage');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser._id;

  return (
    <ChatDetail
      currentUserId={currentUserId}
      chatId={chatId}
      otherId={otherId}
      otherName={otherName}
      otherProfileImage={otherProfileImage}
    />
  );
}
