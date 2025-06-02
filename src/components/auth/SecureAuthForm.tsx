
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateEmail, validatePassword, cleanupAuthState, logSecurityEvent } from '@/utils/security';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface SecureAuthFormProps {
  mode: 'login' | 'register';
  onSuccess: () => void;
}

export const SecureAuthForm: React.FC<SecureAuthFormProps> = ({ mode, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const { checkLoginRateLimit, logFailedLogin, logSuccessfulLogin } = useSecurityMonitoring();

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!validateEmail(email)) {
      newErrors.push('Please enter a valid email address');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.push(...passwordValidation.errors);
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        newErrors.push('Passwords do not match');
      }
      if (!firstName.trim()) {
        newErrors.push('First name is required');
      }
      if (!lastName.trim()) {
        newErrors.push('Last name is required');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Rate limiting check for login attempts
    if (mode === 'login' && !checkLoginRateLimit(email)) {
      toast.error('Too many login attempts. Please wait 15 minutes before trying again.');
      logFailedLogin(email, 'Rate limit exceeded');
      return;
    }

    setIsLoading(true);

    try {
      // Clean up any existing auth state
      cleanupAuthState();

      if (mode === 'login') {
        logSecurityEvent('login_attempt', { email });

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          logFailedLogin(email, error.message);
          
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please check your credentials.');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('Please check your email and click the confirmation link.');
          } else {
            toast.error('Login failed. Please try again.');
          }
          return;
        }

        if (data.user) {
          logSuccessfulLogin();
          toast.success('Logged in successfully!');
          onSuccess();
        }
      } else {
        logSecurityEvent('registration_attempt', { email });

        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            }
          }
        });

        if (error) {
          logSecurityEvent('registration_failed', { email, error: error.message });
          
          if (error.message.includes('User already registered')) {
            toast.error('An account with this email already exists.');
          } else {
            toast.error(error.message || 'Registration failed.');
          }
          return;
        }

        if (data.user) {
          logSecurityEvent('registration_successful', { email });
          toast.success('Account created successfully!');
          onSuccess();
        }
      }
    } catch (error: any) {
      logSecurityEvent('auth_error', { 
        mode, 
        email, 
        error: error.message 
      });
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-6 text-green-600">
        <Shield className="h-5 w-5" />
        <span className="text-sm font-medium">Secure Authentication</span>
      </div>

      {mode === 'register' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {mode === 'register' && (
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (mode === 'login' ? 'Sign In' : 'Create Account')}
      </Button>

      <div className="text-xs text-gray-500 mt-4">
        <p>🔒 Your data is protected with enterprise-grade security</p>
        <p>🛡️ All communications are encrypted</p>
      </div>
    </form>
  );
};
