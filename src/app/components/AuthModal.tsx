import { useState } from 'react';
import { X, Eye, EyeOff, ShoppingCart, Leaf, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import * as api from '../../utils/api';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: api.AuthUser) => void;
  initialTab?: 'login' | 'signup';
}

export function AuthModal({ onClose, onAuthSuccess, initialTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const user = await api.login(loginForm.email, loginForm.password);
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (signupForm.password !== signupForm.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const user = await api.signup(signupForm.name, signupForm.email, signupForm.password);
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Header band */}
        <div className="bg-primary px-8 pt-10 pb-8 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="relative">
              <ShoppingCart className="w-7 h-7 text-white" />
              <Leaf className="w-3.5 h-3.5 text-accent absolute -top-1 -right-1" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">The Grocers <span className="font-extrabold">Market</span></span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {tab === 'login' ? 'Welcome back!' : 'Create an account'}
          </h2>
          <p className="text-white/70 text-sm">
            {tab === 'login'
              ? 'Sign in to continue shopping'
              : 'Join us for fresh groceries delivered daily'}
          </p>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">

          {/* Tab switcher */}
          <div className="flex mx-8 mt-6 mb-6 bg-muted rounded-xl p-1">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === 'signup'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Forms */}
          <div className="px-8 pb-8">
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={loginForm.email}
                      onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                      className="pl-10 h-11 rounded-xl bg-muted border-0"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <Label className="text-sm font-medium text-foreground">Password</Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      className="pl-10 pr-10 h-11 rounded-xl bg-muted border-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary hover:bg-primary/85 text-white rounded-xl font-semibold mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground pt-1">
                  {"Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => { setTab('signup'); setError(''); }}
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign up free
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">Full name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Jane Smith"
                      value={signupForm.name}
                      onChange={e => setSignupForm(f => ({ ...f, name: e.target.value }))}
                      className="pl-10 h-11 rounded-xl bg-muted border-0"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={signupForm.email}
                      onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
                      className="pl-10 h-11 rounded-xl bg-muted border-0"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={signupForm.password}
                      onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
                      className="pl-10 pr-10 h-11 rounded-xl bg-muted border-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat password"
                      value={signupForm.confirm}
                      onChange={e => setSignupForm(f => ({ ...f, confirm: e.target.value }))}
                      className="pl-10 pr-10 h-11 rounded-xl bg-muted border-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary hover:bg-primary/85 text-white rounded-xl font-semibold mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground pt-1">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('login'); setError(''); }}
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>

        </div>{/* end scrollable body */}
      </div>
    </div>
  );
}
