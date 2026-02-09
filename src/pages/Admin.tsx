import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import logo from '@/assets/logo.png';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  email: string;
  avatar_url: string | null;
  status: string;
  created_at: string;
}

const Admin = () => {
  const [pendingMembers, setPendingMembers] = useState<Profile[]>([]);
  const [allMembers, setAllMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      // Check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleData) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges.',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }

      setIsAdmin(true);
      await fetchMembers();
      setLoading(false);
    };

    checkAdminAccess();
  }, [navigate, toast]);

  const fetchMembers = async () => {
    // Fetch pending members
    const { data: pending, error: pendingError } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!pendingError && pending) {
      setPendingMembers(pending);
    }

    // Fetch all members
    const { data: all, error: allError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!allError && all) {
      setAllMembers(all);
    }
  };

  const handleStatusChange = async (profileId: string, userId: string, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', profileId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update member status.',
        variant: 'destructive',
      });
      return;
    }

    // If approved, add member role
    if (newStatus === 'approved') {
      await supabase.from('user_roles').insert({
        user_id: userId,
        role: 'member',
      });
    }

    toast({
      title: 'Success',
      description: `Member has been ${newStatus}.`,
    });

    await fetchMembers();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-gold mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-gold flex items-center justify-center">
                <i className="fas fa-shield-alt text-xl text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">
                  Admin Panel
                </h1>
                <p className="text-muted-foreground">Manage TUJENGANE members</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-3 gap-4 mb-8"
          >
            <Card className="premium-card border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-2">
                <CardDescription className="text-yellow-700">Pending Approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-bold text-yellow-800">
                  {pendingMembers.length}
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardDescription className="text-green-700">Approved Members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-bold text-green-800">
                  {allMembers.filter(m => m.status === 'approved').length}
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card border-primary/20">
              <CardHeader className="pb-2">
                <CardDescription>Total Applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-bold text-foreground">
                  {allMembers.length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <div className="flex bg-muted rounded-lg p-1 mb-6 w-fit">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-6 rounded-md text-sm font-medium transition-all ${
                activeTab === 'pending'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Pending ({pendingMembers.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-6 rounded-md text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Members
            </button>
          </div>

          {/* Members List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <i className="fas fa-users text-gold" />
                  {activeTab === 'pending' ? 'Pending Applications' : 'All Members'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(activeTab === 'pending' ? pendingMembers : allMembers).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <i className="fas fa-inbox text-4xl mb-4" />
                    <p>No {activeTab === 'pending' ? 'pending applications' : 'members'} found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(activeTab === 'pending' ? pendingMembers : allMembers).map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-gold/30 transition-colors"
                      >
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold/30 bg-muted flex-shrink-0">
                          {member.avatar_url ? (
                            <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <i className="fas fa-user text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{member.full_name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                          <p className="text-sm text-muted-foreground">{member.phone_number}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Applied: {new Date(member.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            member.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : member.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </span>
                        </div>

                        {/* Actions */}
                        {member.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusChange(member.id, member.user_id, 'approved')}
                            >
                              <i className="fas fa-check mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(member.id, member.user_id, 'rejected')}
                            >
                              <i className="fas fa-times mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
