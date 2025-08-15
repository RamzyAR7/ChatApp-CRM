import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Smartphone, 
  Plus, 
  QrCode, 
  Copy, 
  Key, 
  Trash2, 
  CheckCircle, 
  XCircle,
  RefreshCw
} from 'lucide-react';
import { mockInstances } from '@/data/mockData';
import { Instance } from '@/types';
import { useToast } from '@/hooks/use-toast';

const InstanceManagement: React.FC = () => {
  const [instances, setInstances] = useState<Instance[]>(mockInstances);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [newInstanceId, setNewInstanceId] = useState<string>('');
  const [newToken, setNewToken] = useState<string>('');

  const { toast } = useToast();

  const generateNewInstance = () => {
    const instanceId = `inst_${Date.now()}`;
    
    setNewInstanceId(instanceId);
    setNewToken('');
    setIsQRDialogOpen(true);
  };

  const confirmInstance = () => {
    const newInstance: Instance = {
      _id: Date.now().toString(),
      adminId: '1',
      instanceId: newInstanceId,
      token: '', // Token will be generated separately
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setInstances(prev => [...prev, newInstance]);
    setIsQRDialogOpen(false);
    
    toast({
      title: "Instance created",
      description: "New WhatsApp instance has been added successfully.",
    });
  };

  const generateToken = (instanceId: string) => {
    const token = `waCRM_token_${Math.random().toString(36).substring(2, 15)}`;
    setInstances(prev => prev.map(i => 
      i._id === instanceId 
        ? { ...i, token }
        : i
    ));
    
    toast({
      title: "Token generated",
      description: "New API token has been generated successfully.",
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} has been copied to clipboard.`,
    });
  };

  const deleteInstance = (instanceId: string) => {
    setInstances(prev => prev.filter(i => i._id !== instanceId));
    toast({
      title: "Instance deleted",
      description: "WhatsApp instance has been removed successfully.",
    });
  };

  const toggleInstanceStatus = (instanceId: string) => {
    setInstances(prev => prev.map(i => 
      i._id === instanceId 
        ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' }
        : i
    ));
  };

  const activeInstances = instances.filter(i => i.status === 'active').length;
  const inactiveInstances = instances.filter(i => i.status === 'inactive').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">WhatsApp Instances</h1>
          <p className="text-muted-foreground">Manage your WhatsApp Business API connections</p>
        </div>
        
        <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={generateNewInstance} className="transition-[var(--transition-smooth)]">
              <Plus className="h-4 w-4 mr-2" />
              Add New Instance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New WhatsApp Instance</DialogTitle>
              <DialogDescription>
                Scan the QR code with your WhatsApp to connect a new instance
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* QR Code Placeholder */}
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-muted border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground text-center">
                    QR Code will appear here
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    (This is a mock QR code)
                  </p>
                </div>
              </div>

              {/* Instance Details */}
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Instance ID:</span>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{newInstanceId}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(newInstanceId, 'Instance ID')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Note: API token will be generated after instance creation
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <Button onClick={confirmInstance} className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Connection
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Click confirm after scanning the QR code with WhatsApp
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{instances.length}</div>
            <p className="text-xs text-muted-foreground">WhatsApp connections</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Instances</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeInstances}</div>
            <p className="text-xs text-muted-foreground">Currently connected</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Instances</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{inactiveInstances}</div>
            <p className="text-xs text-muted-foreground">Disconnected</p>
          </CardContent>
        </Card>
      </div>

      {/* Instances Table */}
      <Card>
        <CardHeader>
          <CardTitle>Instance Management</CardTitle>
          <CardDescription>
            Monitor and manage your WhatsApp Business API instances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instance ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>API Token</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instances.map((instance) => (
                  <TableRow key={instance._id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span>{instance.instanceId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={instance.status === 'active' ? 'default' : 'secondary'}
                        className={instance.status === 'active' ? 'bg-success' : ''}
                      >
                        {instance.status === 'active' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {instance.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center space-x-2">
                        {instance.token ? (
                          <>
                            <span className="truncate max-w-[200px]">{instance.token}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(instance.token, 'API Token')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateToken(instance._id)}
                          >
                            <Key className="h-3 w-3 mr-1" />
                            Generate Token
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(instance.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(instance.instanceId, 'Instance ID')}
                          title="Copy Instance ID"
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleInstanceStatus(instance._id)}
                          title={instance.status === 'active' ? 'Disconnect' : 'Reconnect'}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteInstance(instance._id)}
                          className="text-destructive hover:text-destructive"
                          title="Delete Instance"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {instances.length === 0 && (
            <div className="text-center py-8">
              <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No instances found</h3>
              <p className="text-muted-foreground mb-4">Connect your first WhatsApp instance to get started.</p>
              <Button onClick={generateNewInstance}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Instance
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Connect WhatsApp</CardTitle>
          <CardDescription>
            Follow these steps to connect a new WhatsApp Business account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium">Click "Add New Instance"</h4>
                <p className="text-sm text-muted-foreground">Generate a new instance ID and API token</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium">Scan QR Code</h4>
                <p className="text-sm text-muted-foreground">Open WhatsApp on your phone and scan the QR code</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium">Confirm Connection</h4>
                <p className="text-sm text-muted-foreground">Click confirm to complete the setup process</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstanceManagement;