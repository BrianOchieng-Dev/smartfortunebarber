import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Scissors, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth } from '@/src/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back to Fortune Barber!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 bg-black relative overflow-hidden">
      <div className="blue-glow top-0 left-0 w-[600px] h-[600px]" />
      <div className="blue-glow bottom-0 right-0 w-[600px] h-[600px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="glass rounded-[3.5rem] p-10 md:p-16 border-white/10 shadow-5xl">
          <div className="text-center mb-12">
            <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/40">
              <Scissors className="text-white w-10 h-10" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 text-gradient">WELCOME BACK.</h1>
            <p className="text-gray-500 font-medium text-lg">Sign in to access your AI predictions and community profile.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className="pl-14 bg-white/5 border-white/10 rounded-2xl py-8 focus:border-blue-500 transition-all text-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center ml-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Password</Label>
                  <a href="#" className="text-xs text-blue-400 font-bold hover:text-blue-300">Forgot?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-14 bg-white/5 border-white/10 rounded-2xl py-8 focus:border-blue-500 transition-all text-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-10 rounded-3xl text-2xl font-black shadow-2xl shadow-blue-600/40 transition-all duration-500 hover:scale-105 group"
              disabled={loading}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 text-center">
            <p className="text-gray-500 font-medium">
              New to the club? <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 ml-2">Join Now</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
