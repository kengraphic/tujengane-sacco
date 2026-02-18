import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import logo from '@/assets/logo.png';

interface Profile {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  avatar_url: string | null;
  status: string;
}

interface Contribution {
  id: string;
  amount: number;
  payment_method: string;
  phone_number: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [contributionAmount, setContributionAmount] = useState('150');
  const [contributionPhone, setContributionPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      await fetchProfile(session.user.id);
      await fetchContributions(session.user.id);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data);
    setContributionPhone(data.phone_number || '');
  };

  const fetchContributions = async (userId: string) => {
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contributions:', error);
      return;
    }

    setContributions(data || []);
  };

  const handleContribution = async () => {
    if (!profile || profile.status !== 'approved') {
      toast({
        title: 'Not authorized',
        description: 'Your account must be approved to make contributions.',
        variant: 'destructive',
      });
      return;
    }

    if (!contributionAmount || parseFloat(contributionAmount) < 50) {
      toast({
        title: 'Invalid amount',
        description: 'Minimum contribution is KES 50.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    // Create contribution record
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const { error } = await supabase.from('contributions').insert({
      user_id: session.session.user.id,
      amount: parseFloat(contributionAmount),
      phone_number: contributionPhone,
      payment_method: 'mpesa',
      status: 'pending',
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create contribution. Please try again.',
        variant: 'destructive',
      });
      setSubmitting(false);
      return;
    }

    // Show STK push simulation
    toast({
      title: 'M-Pesa Request Sent!',
      description: `Please check your phone (${contributionPhone}) and enter your M-Pesa PIN to complete the payment of KES ${contributionAmount} to 0700 464 272 (Doreen Wasera).`,
    });

    // Refresh contributions
    await fetchContributions(session.session.user.id);
    setSubmitting(false);
  };

  const totalContributions = contributions
    .filter((c) => c.status === 'completed')
    .reduce((sum, c) => sum + Number(c.amount), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-gold mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold bg-muted">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="fas fa-user text-2xl text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">
                  Welcome, {profile?.full_name}!
                </h1>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    profile?.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : profile?.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <i className={`fas ${
                      profile?.status === 'approved' ? 'fa-check-circle' : 
                      profile?.status === 'pending' ? 'fa-clock' : 'fa-times-circle'
                    } mr-1`} />
                    {profile?.status?.charAt(0).toUpperCase() + profile?.status?.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Warning */}
          {profile?.status !== 'approved' && (
            <div className="mb-8 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-start gap-3">
                <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Account Pending Approval</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your account is awaiting approval from an administrator. You will be able to make contributions once approved.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              <Card className="premium-card border-gold/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <i className="fas fa-piggy-bank text-gold" />
                    Total Contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-serif font-bold text-foreground">
                    KES {totalContributions.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card border-gold/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <i className="fas fa-calendar-check text-gold" />
                    Weekly Target
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-serif font-bold text-foreground">
                    KES 150
                  </div>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2 premium-card border-gold/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <i className="fas fa-history text-gold" />
                    Contributions Made
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-serif font-bold text-foreground">
                    {contributions.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Make Contribution */}
            <div>
              <Card className="golden-leaf-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <i className="fas fa-money-bill-wave text-gold" />
                    Make Contribution
                  </CardTitle>
                  <CardDescription>
                    Send to: 0700 464 272 (Doreen Wasera)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (KES)</Label>
                    <div className="flex gap-2 mt-2">
                      {['150', '300', '500'].map((amt) => (
                        <Button
                          key={amt}
                          type="button"
                          variant={contributionAmount === amt ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setContributionAmount(amt)}
                          className={contributionAmount === amt ? 'bg-gradient-gold text-primary' : ''}
                        >
                          {amt}
                        </Button>
                      ))}
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="mt-2"
                      placeholder="Custom amount"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">M-Pesa Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={contributionPhone}
                      onChange={(e) => setContributionPhone(e.target.value)}
                      placeholder="0700123456"
                    />
                  </div>

                  <Button
                    onClick={handleContribution}
                    disabled={submitting || profile?.status !== 'approved'}
                    className="w-full bg-gradient-gold hover:opacity-90 text-primary"
                  >
                    {submitting ? (
                      <i className="fas fa-spinner fa-spin mr-2" />
                    ) : (
                      <i className="fas fa-mobile-alt mr-2" />
                    )}
                    Send M-Pesa Request
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contribution History */}
          <div className="mt-8">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <i className="fas fa-list text-gold" />
                  Contribution History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contributions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <i className="fas fa-inbox text-4xl mb-4" />
                    <p>No contributions yet. Make your first contribution today!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Phone</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contributions.map((c) => (
                          <tr key={c.id} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 px-4 text-sm">
                              {new Date(c.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-sm font-medium">
                              KES {Number(c.amount).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{c.phone_number}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                c.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : c.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {c.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
