import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MessageCircle, Users, MessageSquare, Smartphone } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { mockUsers } from '@/data/mockData';

const Dashboard: React.FC = () => {
  const { chats, messages } = useChat();

  // Statistics calculations
  const totalChats = chats.length;
  const totalSalesUsers = mockUsers.filter(u => u.role === 'sales').length;
  const totalUnreadMessages = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);
  const totalActiveInstances = 2; // Mock data

  // Chart data
  const chatsByUser = mockUsers
    .filter(u => u.role === 'sales')
    .map(user => ({
      name: user.name,
      chats: chats.filter(chat => chat.assignedTo === user._id).length
    }));

  const chatStatusData = [
    { name: 'Open', value: chats.filter(c => c.status === 'open').length, color: 'hsl(var(--success))' },
    { name: 'In Progress', value: chats.filter(c => c.status === 'in-progress').length, color: 'hsl(var(--warning))' },
    { name: 'Closed', value: chats.filter(c => c.status === 'closed').length, color: 'hsl(var(--muted))' }
  ];

  const StatCard: React.FC<{
    title: string;
    value: number;
    description: string;
    icon: React.ElementType;
    trend?: string;
  }> = ({ title, value, description, icon: Icon, trend }) => (
    <Card className="transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-card)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <p className="text-xs text-success mt-1">{trend}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your WhatsApp CRM overview</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Chats"
          value={totalChats}
          description="Active conversations"
          icon={MessageCircle}
          trend="+12% from last month"
        />
        <StatCard
          title="Sales Users"
          value={totalSalesUsers}
          description="Active team members"
          icon={Users}
          trend="+2 new this week"
        />
        <StatCard
          title="Unread Messages"
          value={totalUnreadMessages}
          description="Pending responses"
          icon={MessageSquare}
          trend="-5% from yesterday"
        />
        <StatCard
          title="Active Instances"
          value={totalActiveInstances}
          description="WhatsApp connections"
          icon={Smartphone}
          trend="All systems operational"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bar Chart - Chats per Sales User */}
        <Card>
          <CardHeader>
            <CardTitle>Chats by Sales User</CardTitle>
            <CardDescription>
              Distribution of conversations across team members
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chatsByUser}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                />
                <Bar 
                  dataKey="chats" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Chat Status */}
        <Card>
          <CardHeader>
            <CardTitle>Chat Status Distribution</CardTitle>
            <CardDescription>
              Current status of all conversations
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chatStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chatStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest interactions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.slice(-5).reverse().map((message) => {
              const chat = chats.find(c => c._id === message.chatId);
              return (
                <div key={message._id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {message.route === 'incoming' ? 'New message from' : 'Message sent to'} {chat?.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {message.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;