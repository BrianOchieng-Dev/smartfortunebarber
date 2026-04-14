import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Scissors, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function Contact() {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-black relative overflow-hidden">
      <div className="blue-glow top-0 right-0 w-[500px] h-[500px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 mb-6"
          >
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-blue-400">Get in Touch</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-gradient">LET'S CONNECT.</h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium">
            Have a question or ready to book your next transformation? We're here to help you elevate your style.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Call Us", value: "0112478220", icon: Phone, color: "text-blue-400" },
                { label: "Email Us", value: "info@fortune.com", icon: Mail, color: "text-purple-400" },
                { label: "Visit Us", value: "Kakamega Town", icon: MapPin, color: "text-red-400" },
                { label: "Open Hours", value: "8am - 8pm", icon: Clock, color: "text-green-400" },
              ].map((item, i) => (
                <Card key={i} className="glass-card p-6 border-white/10">
                  <div className={`bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">{item.label}</div>
                  <div className="font-bold text-white">{item.value}</div>
                </Card>
              ))}
            </div>

            <div className="glass rounded-[2.5rem] p-10 border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="bg-green-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <MessageCircle className="text-green-400 w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4">WhatsApp Direct</h3>
                <p className="text-gray-400 mb-8 font-medium">
                  The fastest way to book an appointment or ask a quick question. Our team is usually online.
                </p>
                <a href="https://wa.me/254112478220" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-8 rounded-2xl text-xl font-bold shadow-2xl shadow-green-600/20">
                    CHAT ON WHATSAPP
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <Card className="glass rounded-[3rem] p-10 md:p-16 border-white/10">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name</Label>
                    <Input className="bg-white/5 border-white/10 py-8 rounded-2xl focus:border-blue-500 transition-all" placeholder="John Doe" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Email Address</Label>
                    <Input className="bg-white/5 border-white/10 py-8 rounded-2xl focus:border-blue-500 transition-all" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Subject</Label>
                  <Input className="bg-white/5 border-white/10 py-8 rounded-2xl focus:border-blue-500 transition-all" placeholder="How can we help?" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Message</Label>
                  <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl min-h-[200px] p-6 focus:border-blue-500 transition-all outline-none" placeholder="Tell us more..." />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-10 rounded-3xl text-2xl font-black shadow-2xl shadow-blue-600/40 transition-all duration-500 hover:scale-105">
                  <Send className="w-6 h-6 mr-3" /> SEND MESSAGE
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Map Placeholder */}
        <section className="mt-32">
          <Card className="glass rounded-[4rem] h-[600px] border-white/10 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-center p-12">
              <div className="relative z-10">
                <div className="bg-blue-600/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-700">
                  <MapPin className="text-blue-400 w-12 h-12" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">FIND US IN KAKAMEGA.</h2>
                <p className="text-gray-500 text-xl max-w-xl mx-auto mb-12 font-medium">
                  Visit our flagship shop for the ultimate grooming experience. We're located in the heart of the town.
                </p>
                <Button variant="outline" className="glass border-white/10 px-10 py-8 rounded-3xl text-xl font-bold hover:bg-white/10">
                  GET DIRECTIONS
                </Button>
              </div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')] opacity-10 grayscale group-hover:scale-105 transition-transform duration-1000" />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
