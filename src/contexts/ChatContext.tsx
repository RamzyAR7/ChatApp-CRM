import React, { createContext, useContext, useState } from 'react';
import { Chat, Message, ChatContextType } from '@/types';
import { mockChats, mockMessages } from '@/data/mockData';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const selectChat = (chat: Chat) => {
    setSelectedChat(chat);
    // Mark messages as read
    if (chat.unreadCount > 0) {
      setChats(prev => prev.map(c => 
        c._id === chat._id ? { ...c, unreadCount: 0 } : c
      ));
    }
  };

  const updateChatStatus = (chatId: string, status: Chat['status']) => {
    setChats(prev => prev.map(chat => 
      chat._id === chatId ? { ...chat, status } : chat
    ));
  };

  const reassignChat = (chatId: string, userId: string) => {
    setChats(prev => prev.map(chat => 
      chat._id === chatId ? { ...chat, assignedTo: userId } : chat
    ));
  };

  const sendMessage = (chatId: string, text: string, type: Message['type'] = 'text') => {
    const newMessage: Message = {
      _id: Date.now().toString(),
      chatId,
      senderName: 'You',
      text,
      timestamp: new Date().toISOString(),
      status: 'sent',
      route: 'outgoing',
      type
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Update last message in chat
    setChats(prev => prev.map(chat => 
      chat._id === chatId ? { 
        ...chat, 
        lastMessage: text,
        lastMessageAt: new Date().toISOString()
      } : chat
    ));
  };

  return (
    <ChatContext.Provider value={{
      chats,
      messages,
      selectedChat,
      selectChat,
      updateChatStatus,
      reassignChat,
      sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};