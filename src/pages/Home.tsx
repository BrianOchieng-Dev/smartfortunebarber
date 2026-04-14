import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Scissors, Sparkles, Users, Calendar, ArrowRight, Star, CheckCircle2, Play, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { db } from '@/src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Home() {
  const [content, setContent] = useState({
    headline: 'THE FUTURE OF GROOMING.',
    slogan: 'Fortune Barber Shop blends master craftsmanship with AI-powered style prediction to redefine your look.'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'site_content', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContent({
            headline: data.headline || content.headline,
            slogan: data.slogan || content.slogan
          });
        }
      } catch (error) {
        console.error('Error fetching home content:', error);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[150px] rounded-full animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=2070" 
            alt="Barber Shop" 
            className="w-full h-full object-cover scale-110"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass rounded-full border-white/10"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400">
                Kakamega's Finest Grooming
              </span>
            </motion.div>
            
            <h1 className="text-6xl md:text-[100px] font-extrabold mb-8 tracking-tighter leading-[0.9] text-gradient uppercase whitespace-pre-line">
              {content.headline}
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              {content.slogan}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-8 rounded-3xl text-xl font-bold group shadow-2xl shadow-blue-600/40 transition-all duration-500 hover:scale-105">
                  JOIN THE CLUB
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/ai-preview">
                <Button variant="outline" className="glass border-white/10 text-white px-10 py-8 rounded-3xl text-xl font-bold hover:bg-white/10 transition-all duration-500 hover:scale-105">
                  <Sparkles className="mr-3 w-6 h-6 text-blue-400" />
                  AI PREVIEW
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Discover More</span>
          <div className="w-px h-12 bg-gradient-to-b from-blue-600 to-transparent" />
        </motion.div>
      </section>

      {/* Services Section - Bento Grid Style */}
      <section className="py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">MASTER SERVICES.</h2>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto">Precision cuts and premium care for the modern gentleman.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-8 glass-card p-10 flex flex-col justify-end relative overflow-hidden group"
            >
              <img 
                src="https://images.unsplash.com/photo-1593702295094-aec3e597e991?auto=format&fit=crop&q=80&w=1000" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                alt="Haircut"
              />
              <div className="relative z-10">
                <Scissors className="text-blue-500 w-12 h-12 mb-6" />
                <h3 className="text-4xl font-bold mb-4">Signature Haircuts</h3>
                <p className="text-gray-400 max-w-md mb-6">Our master barbers analyze your face shape and hair texture to deliver a cut that's uniquely yours.</p>
                <Link to="/services"><Button className="bg-white text-black rounded-xl font-bold">EXPLORE STYLES</Button></Link>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-4 glass-card p-10 flex flex-col justify-between group"
            >
              <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center">
                <Star className="text-blue-400 w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">Beard Sculpting</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Expert shaping, hot towel treatment, and premium oils for the perfect beard.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-4 glass-card p-10 flex flex-col justify-between group"
            >
              <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center">
                <Users className="text-blue-400 w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">Kids Grooming</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Patience and precision for the next generation of gentlemen.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-8 glass-card p-10 flex flex-col justify-end relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent z-0" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-4xl font-bold mb-4">The Fortune Experience</h3>
                  <p className="text-gray-400 max-w-md">Full service package including facial, massage, and premium styling.</p>
                </div>
                <div className="text-5xl font-black text-blue-500/20">PREMIUM</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Feature Section - Immersive */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="glass rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
                <Sparkles className="w-4 h-4" /> AI POWERED
              </div>
              <h2 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-[0.9]">
                SEE YOUR <br />
                <span className="text-blue-500">NEW SELF.</span>
              </h2>
              <p className="text-gray-400 text-xl mb-12 leading-relaxed">
                Our proprietary AI engine analyzes your features to predict the perfect hairstyle. No more guessing, just pure confidence.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[
                  { title: 'Face Analysis', desc: 'Precise feature mapping' },
                  { title: 'Style Library', desc: '50+ curated hairstyles' },
                  { title: 'Instant Results', desc: 'Generated in seconds' },
                  { title: 'Barber Sync', desc: 'Directly linked to our shop' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="bg-blue-600/20 p-2 rounded-lg mt-1">
                      <CheckCircle2 className="text-blue-400 w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-gray-500 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/ai-preview">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-8 rounded-3xl text-xl font-bold shadow-2xl shadow-blue-600/40">
                  TRY AI PREVIEW
                </Button>
              </Link>
            </div>

            <div className="flex-1 relative">
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=1000" 
                  alt="AI Preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">Current Prediction</div>
                    <div className="text-lg font-bold">SKIN FADE TAPER</div>
                  </div>
                  <Sparkles className="text-white w-6 h-6" />
                </div>
              </motion.div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/30 blur-[60px] rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-900/30 blur-[60px] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-7xl font-bold mb-16 tracking-tight">HOW IT WORKS.</h2>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="aspect-video max-w-5xl mx-auto rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl bg-white/5 relative group cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&q=80&w=2000" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-1000 group-hover:scale-110"
              alt="Demo Video"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 group-hover:scale-110 transition-transform duration-500">
                <Play className="text-white w-10 h-10 fill-current ml-1" />
              </div>
            </div>
            <div className="absolute bottom-10 left-10 text-left z-20">
              <h3 className="text-3xl font-bold mb-2">AI Hairstyle Demo</h3>
              <p className="text-gray-400">Watch how our AI transforms your look in seconds.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 z-0" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter">JOIN THE <br /> <span className="text-blue-500">COMMUNITY.</span></h2>
              <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
                Unlock exclusive offers, track your style history, and be part of the most advanced barber shop in Kakamega.
              </p>
              <Link to="/register">
                <Button className="bg-white text-black hover:bg-gray-200 px-12 py-8 rounded-3xl text-2xl font-black transition-all duration-500 hover:scale-105 shadow-2xl">
                  GET STARTED NOW
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/254112478220" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-10 right-10 z-50 group"
      >
        <div className="absolute inset-0 bg-green-500 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
        <div className="relative bg-green-500 text-white p-5 rounded-full shadow-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
          <MessageCircle className="w-8 h-8 fill-current" />
        </div>
      </a>
    </div>
  );
}
