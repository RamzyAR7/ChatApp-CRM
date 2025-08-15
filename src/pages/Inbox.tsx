import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Search, 
  MoreVertical,
  Info
} from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { mockUsers } from '@/data/mockData';
import { Chat, Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const Inbox: React.FC = () => {
  const { chats, messages, selectedChat, selectChat, updateChatStatus, reassignChat, sendMessage } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const salesUsers = mockUsers.filter(u => u.role === 'sales');
  
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chatMessages = messages.filter(m => m.chatId === selectedChat?._id);
  
  const getAssignedUser = (userId: string) => {
    return salesUsers.find(u => u._id === userId);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      sendMessage(selectedChat._id, newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status: Chat['status']) => {
    switch (status) {
      case 'open': return 'bg-success';
      case 'in-progress': return 'bg-warning';
      case 'closed': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const ChatListItem: React.FC<{ chat: Chat }> = ({ chat }) => {
    const assignedUser = getAssignedUser(chat.assignedTo);
    const isSelected = selectedChat?._id === chat._id;

    return (
      <div
        onClick={() => selectChat(chat)}
        className={`p-4 border-b border-border cursor-pointer transition-[var(--transition-fast)] hover:bg-chat-hover ${
          isSelected ? 'bg-accent' : ''
        }`}
      >
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chat.avatar} alt={chat.name} />
            <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground truncate">
                {chat.name}
              </h3>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: true })}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground truncate mt-1">
              {chat.lastMessage}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={`text-xs ${getStatusColor(chat.status)} text-white`}>
                  {chat.status}
                </Badge>
                {assignedUser && (
                  <span className="text-xs text-muted-foreground">
                    @{assignedUser.name}
                  </span>
                )}
              </div>
              
              {chat.unreadCount > 0 && (
                <Badge className="bg-status-unread text-white text-xs">
                  {chat.unreadCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isOutgoing = message.route === 'outgoing';
    
    return (
      <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-4`}>
        <div
          className={`max-w-[70%] rounded-lg p-3 ${
            isOutgoing
              ? 'bg-chat-sent text-primary-foreground'
              : 'bg-chat-received text-foreground border border-border'
          }`}
        >
          {!isOutgoing && (
            <p className="text-xs font-medium text-primary mb-1">{message.senderName}</p>
          )}
          <p className="text-sm">{message.text}</p>
          <div className="flex items-center justify-end mt-1 space-x-1">
            <span className={`text-xs ${isOutgoing ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isOutgoing && (
              <div className="text-primary-foreground/70">
                <span className="text-xs">✓✓</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Chat List */}
      <div className="w-1/3 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {filteredChats.map((chat) => (
            <ChatListItem key={chat._id} chat={chat} />
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
                  <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h2 className="font-medium text-foreground">{selectedChat.name}</h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={`text-xs ${getStatusColor(selectedChat.status)} text-white`}>
                      {selectedChat.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      @{getAssignedUser(selectedChat.assignedTo)?.name}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Actions */}
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Select 
                    value={selectedChat.status} 
                    onValueChange={(value: Chat['status']) => updateChatStatus(selectedChat._id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {user?.role === 'admin' && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Assign to:</span>
                    <Select 
                      value={selectedChat.assignedTo} 
                      onValueChange={(value) => reassignChat(selectedChat._id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {salesUsers.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-chat-bg">
              {chatMessages.map((message) => (
                <MessageBubble key={message._id} message={message} />
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-end space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1">
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[40px] max-h-[120px] resize-none"
                    rows={1}
                  />
                </div>
                
                <Button variant="ghost" size="sm">
                  <Mic className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-chat-bg">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Select a conversation
              </h3>
              <p className="text-muted-foreground">
                Choose a chat from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;