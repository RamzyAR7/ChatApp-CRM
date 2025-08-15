export interface User {
  _id: string;
  name: string;
  role: 'admin' | 'sales';
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Chat {
  _id: string;
  jid: string;
  name: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  assignedTo: string;
  status: 'open' | 'in-progress' | 'closed';
  notes?: string;
  avatar?: string;
}

export interface Message {
  _id: string;
  chatId: string;
  senderName: string;
  text?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  route: 'incoming' | 'outgoing';
  type: 'text' | 'image' | 'voice' | 'document';
  mediaUrl?: string;
}

export interface Instance {
  _id: string;
  adminId: string;
  instanceId: string;
  token: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: 'admin' | 'sales') => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ChatContextType {
  chats: Chat[];
  messages: Message[];
  selectedChat: Chat | null;
  selectChat: (chat: Chat) => void;
  updateChatStatus: (chatId: string, status: Chat['status']) => void;
  reassignChat: (chatId: string, userId: string) => void;
  sendMessage: (chatId: string, text: string, type?: Message['type']) => void;
}