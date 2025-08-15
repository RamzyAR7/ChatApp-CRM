import { User, Chat, Message, Instance } from '@/types';

export const mockUsers: User[] = [
  {
    _id: '1',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@whatsappcrm.com',
    passwordHash: 'admin123',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    name: 'John Sales',
    role: 'sales',
    email: 'john@whatsappcrm.com',
    passwordHash: 'sales123',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    _id: '3',
    name: 'Sarah Marketing',
    role: 'sales',
    email: 'sarah@whatsappcrm.com',
    passwordHash: 'sales123',
    createdAt: '2024-01-03T00:00:00Z'
  },
  {
    _id: '4',
    name: 'Mike Support',
    role: 'sales',
    email: 'mike@whatsappcrm.com',
    passwordHash: 'sales123',
    createdAt: '2024-01-04T00:00:00Z'
  }
];

export const mockChats: Chat[] = [
  {
    _id: '1',
    jid: '5511999999999@c.us',
    name: 'Ana Silva',
    lastMessage: 'Olá, gostaria de saber mais sobre os produtos',
    lastMessageAt: '2024-08-15T10:30:00Z',
    unreadCount: 3,
    assignedTo: '2',
    status: 'open',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  },
  {
    _id: '2',
    jid: '5511888888888@c.us',
    name: 'Carlos Santos',
    lastMessage: 'Obrigado pela atenção!',
    lastMessageAt: '2024-08-15T09:15:00Z',
    unreadCount: 0,
    assignedTo: '3',
    status: 'closed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    _id: '3',
    jid: '5511777777777@c.us',
    name: 'Maria Costa',
    lastMessage: 'Quando vocês fazem entrega?',
    lastMessageAt: '2024-08-15T08:45:00Z',
    unreadCount: 1,
    assignedTo: '2',
    status: 'in-progress',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
  },
  {
    _id: '4',
    jid: '5511666666666@c.us',
    name: 'João Oliveira',
    lastMessage: 'Perfeito, muito obrigado!',
    lastMessageAt: '2024-08-14T16:20:00Z',
    unreadCount: 0,
    assignedTo: '4',
    status: 'closed',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    _id: '5',
    jid: '5511555555555@c.us',
    name: 'Fernanda Lima',
    lastMessage: 'Preciso de ajuda com meu pedido',
    lastMessageAt: '2024-08-14T14:10:00Z',
    unreadCount: 2,
    assignedTo: '3',
    status: 'open',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  }
];

export const mockMessages: Message[] = [
  {
    _id: '1',
    chatId: '1',
    senderName: 'Ana Silva',
    text: 'Olá, boa tarde!',
    timestamp: '2024-08-15T10:25:00Z',
    status: 'read',
    route: 'incoming',
    type: 'text'
  },
  {
    _id: '2',
    chatId: '1',
    senderName: 'John Sales',
    text: 'Olá Ana! Como posso ajudá-la hoje?',
    timestamp: '2024-08-15T10:26:00Z',
    status: 'read',
    route: 'outgoing',
    type: 'text'
  },
  {
    _id: '3',
    chatId: '1',
    senderName: 'Ana Silva',
    text: 'Gostaria de saber mais sobre os produtos que vocês oferecem',
    timestamp: '2024-08-15T10:30:00Z',
    status: 'delivered',
    route: 'incoming',
    type: 'text'
  },
  {
    _id: '4',
    chatId: '2',
    senderName: 'Carlos Santos',
    text: 'Vocês fazem entrega para toda cidade?',
    timestamp: '2024-08-15T09:10:00Z',
    status: 'read',
    route: 'incoming',
    type: 'text'
  },
  {
    _id: '5',
    chatId: '2',
    senderName: 'Sarah Marketing',
    text: 'Sim, fazemos entrega para toda a região metropolitana!',
    timestamp: '2024-08-15T09:12:00Z',
    status: 'read',
    route: 'outgoing',
    type: 'text'
  },
  {
    _id: '6',
    chatId: '2',
    senderName: 'Carlos Santos',
    text: 'Obrigado pela atenção!',
    timestamp: '2024-08-15T09:15:00Z',
    status: 'read',
    route: 'incoming',
    type: 'text'
  }
];

export const mockInstances: Instance[] = [
  {
    _id: '1',
    adminId: '1',
    instanceId: 'inst_001',
    token: 'waCRM_token_abcd1234efgh5678',
    createdAt: '2024-08-01T00:00:00Z',
    status: 'active'
  },
  {
    _id: '2',
    adminId: '1',
    instanceId: 'inst_002',
    token: 'waCRM_token_ijkl9012mnop3456',
    createdAt: '2024-08-10T00:00:00Z',
    status: 'inactive'
  }
];