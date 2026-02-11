import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^0[17]\d{8}$/, 'Invalid phone number (e.g., 0700123456)'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  );
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        checkUserStatus(session.user.id);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkUserStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUserStatus = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('status')
      .eq('user_id', userId)
      .maybeSingle();

    if (profile) {
      if (profile.status === 'approved') {
        navigate('/dashboard');
      } else if (profile.status === 'pending') {
        toast({
          title: 'Account Pending Approval',
          description: 'Your account is awaiting admin approval. You will be notified once approved.',
        });
      } else if (profile.status === 'rejected') {
        toast({
          title: 'Account Rejected',
          description: 'Your membership application was not approved. Please contact the admin.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image under 5MB',
          variant: 'destructive',
        });
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (mode === 'signin') {
        const validation = signInSchema.safeParse(formData);
        if (!validation.success) {
          const fieldErrors: Record<string, string> = {};
          validation.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            toast({
              title: 'Email not verified',
              description: 'Please check your email and verify your account.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Sign in failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        }
      } else {
        const validation = signUpSchema.safeParse(formData);
        if (!validation.success) {
          const fieldErrors: Record<string, string> = {};
          validation.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        if (!avatarFile) {
          setErrors({ avatar: 'Profile picture is required' });
          setLoading(false);
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });

        if (authError) {
          if (authError.message.includes('already registered')) {
            toast({
              title: 'Email already registered',
              description: 'This email is already in use. Please sign in instead.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Sign up failed',
              description: authError.message,
              variant: 'destructive',
            });
          }
          setLoading(false);
          return;
        }

        if (authData.user) {
          // Upload avatar
          const fileExt = avatarFile.name.split('.').pop();
          const filePath = `${authData.user.id}/${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile);

          let avatarUrl = null;
          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);
            avatarUrl = urlData.publicUrl;
          }

          // Create profile
          const { error: profileError } = await supabase.from('profiles').insert({
            user_id: authData.user.id,
            full_name: formData.fullName,
            phone_number: formData.phone,
            email: formData.email,
            avatar_url: avatarUrl,
            status: 'pending',
          });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          toast({
            title: 'Account created!',
            description: 'Please check your email to verify your account. Once verified, an admin will approve your membership.',
          });
          setMode('signin');
        }
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="golden-leaf-border rounded-2xl p-8 bg-card shadow-elevated">

          {/* Logo and Title */}
          <div className="text-center mb-8">
            <img src={logo} alt="TUJENGANE" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-bold text-foreground">
              {mode === 'signin' ? 'Welcome Back!' : 'Join TUJENGANE'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === 'signin'
                ? 'Sign in to access your account'
                : 'Create an account to become a member'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-muted rounded-lg p-1 mb-6">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'signin'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Avatar Upload */}
                  <div className="text-center">
                    <Label className="text-sm font-medium">
                      Profile Picture <span className="text-destructive">*</span>
                    </Label>
                    <div className="mt-2 flex flex-col items-center gap-3">
                      <div 
                        className={`w-24 h-24 rounded-full border-2 border-dashed ${
                          errors.avatar ? 'border-destructive' : 'border-gold/50'
                        } flex items-center justify-center overflow-hidden bg-muted cursor-pointer hover:border-gold transition-colors`}
                        onClick={() => document.getElementById('avatar-input')?.click()}
                      >
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <i className="fas fa-camera text-2xl text-muted-foreground" />
                        )}
                      </div>
                      <input
                        id="avatar-input"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <span className="text-xs text-muted-foreground">Click to upload</span>
                      {errors.avatar && (
                        <span className="text-xs text-destructive">{errors.avatar}</span>
                      )}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      className={errors.fullName ? 'border-destructive' : ''}
                    />
                    {errors.fullName && (
                      <span className="text-xs text-destructive">{errors.fullName}</span>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g., 0700123456"
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                      <span className="text-xs text-destructive">{errors.phone}</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <span className="text-xs text-destructive">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <span className="text-xs text-destructive">{errors.password}</span>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-gold hover:opacity-90 text-primary font-semibold py-6"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin mr-2" />
              ) : mode === 'signin' ? (
                <i className="fas fa-sign-in-alt mr-2" />
              ) : (
                <i className="fas fa-user-plus mr-2" />
              )}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-muted-foreground hover:text-gold transition-colors">
              <i className="fas fa-arrow-left mr-2" />
              Back to Home
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
