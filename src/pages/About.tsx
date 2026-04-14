import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Scissors, Award, Users, MapPin, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { db } from '@/src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function About() {
  const [aboutText, setAboutText] = useState('Fortune Barber Shop is more than just a place for a haircut. It\'s where tradition meets technology in the heart of Kakamega.');

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const docRef = doc(db, 'site_content', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutText(docSnap.data().aboutText || aboutText);
        }
      } catch (error) {
        console.error('Error fetching about text:', error);
      }
    };
    fetchAbout();
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-black relative overflow-hidden">
      <div className="blue-glow top-0 left-0 w-[500px] h-[500px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 mb-6"
          >
            <Scissors className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-blue-400">Our Story</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-gradient">CRAFTING CONFIDENCE.</h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium">
            {aboutText}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold tracking-tight">A Legacy of Excellence.</h2>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              Founded with the vision of elevating the grooming standards in Western Kenya, Fortune Barber Shop has grown into a community hub for those who value precision and professionalism.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              We believe that a great haircut is the foundation of confidence. That's why we've invested in the best tools, the most skilled barbers, and cutting-edge AI technology to ensure every client leaves satisfied.
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <div className="text-4xl font-black text-blue-500 mb-2">10+</div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl font-black text-blue-500 mb-2">5k+</div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Happy Clients</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass p-4 rounded-[3rem] border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1000" 
                alt="Barber Shop Interior" 
                className="rounded-[2.5rem] w-full h-full object-cover shadow-3xl"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 glass p-8 rounded-3xl border-white/10 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <Award className="text-white w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">Award Winning</div>
                  <div className="text-xs text-gray-500">Best in Kakamega 2024</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Precision", desc: "Every cut is executed with surgical precision and attention to detail.", icon: Scissors },
            { title: "Community", desc: "We're not just a shop, we're a family. Everyone is welcome at Fortune.", icon: Users },
            { title: "Innovation", desc: "We embrace the future with AI-powered style predictions and modern tools.", icon: Sparkles },
          ].map((value, i) => (
            <Card key={i} className="glass-card p-10 border-white/10">
              <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <value.icon className="text-blue-400 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{value.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
