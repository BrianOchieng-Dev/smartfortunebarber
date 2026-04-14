import React from 'react';
import { motion } from 'motion/react';
import { Scissors, Star, Sparkles, User, Clock, CheckCircle2, Zap, ShieldCheck, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SERVICES = [
  {
    category: "Signature Cuts",
    items: [
      { name: "Executive Fade", price: "Ksh 800", desc: "Precision skin fade with hot towel finish and scalp massage.", icon: Scissors, popular: true },
      { name: "Classic Gentleman", price: "Ksh 500", desc: "Traditional scissor cut tailored to your head shape.", icon: User },
      { name: "Buzz & Lineup", price: "Ksh 400", desc: "Clean buzz cut with sharp, laser-like edge work.", icon: Zap },
    ]
  },
  {
    category: "Beard & Shave",
    items: [
      { name: "Royal Shave", price: "Ksh 600", desc: "Traditional straight razor shave with premium oils.", icon: ShieldCheck },
      { name: "Beard Sculpting", price: "Ksh 300", desc: "Expert shaping and conditioning for a sharp look.", icon: Star },
    ]
  },
  {
    category: "Premium Care",
    items: [
      { name: "Fortune Signature", price: "Ksh 1,500", desc: "The ultimate package: Cut, Shave, Facial, and Massage.", icon: Sparkles, premium: true },
      { name: "Deep Facial", price: "Ksh 700", desc: "Cleansing and rejuvenation for a fresh appearance.", icon: Heart },
    ]
  }
];

export default function Services() {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-black relative overflow-hidden">
      <div className="blue-glow top-0 right-0 w-[500px] h-[500px]" />
      <div className="blue-glow bottom-0 left-0 w-[500px] h-[500px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 mb-6"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-xs font-bold tracking-widest uppercase text-blue-400">Our Menu</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-gradient">MASTER SERVICES.</h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium">
            Every service is a masterpiece. We combine precision tools with premium products to ensure you leave looking your absolute best.
          </p>
        </div>

        <div className="space-y-24">
          {SERVICES.map((section, sIdx) => (
            <div key={sIdx}>
              <h2 className="text-2xl font-black tracking-widest uppercase text-blue-500 mb-12 flex items-center gap-4">
                {section.category}
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((service, iIdx) => (
                  <motion.div
                    key={iIdx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: iIdx * 0.1 }}
                  >
                    <Card className={`glass-card p-8 h-full flex flex-col justify-between group relative overflow-hidden ${
                      service.popular || service.premium ? 'border-blue-500/30 bg-blue-500/5' : ''
                    }`}>
                      {service.popular && (
                        <div className="absolute top-6 right-6 bg-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                          Most Popular
                        </div>
                      )}
                      {service.premium && (
                        <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-500 to-orange-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                          Premium Choice
                        </div>
                      )}
                      
                      <div>
                        <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <service.icon className="text-blue-400 w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4 tracking-tight">{service.name}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">
                          {service.desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-8 border-t border-white/5">
                        <div className="text-2xl font-black text-white">{service.price}</div>
                        <a href="https://wa.me/254112478220" target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-xl font-bold">
                            BOOK NOW
                          </Button>
                        </a>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <section className="mt-40 py-24 glass rounded-[4rem] border-white/10 overflow-hidden relative">
          <div className="absolute inset-0 bg-blue-600/5 z-0" />
          <div className="relative z-10 px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "Expert Barbers", desc: "Our team has over 20 years of combined experience in modern grooming.", icon: Scissors },
                { title: "Premium Products", desc: "We only use top-tier oils, waxes, and treatments for your hair and skin.", icon: ShieldCheck },
                { title: "AI Precision", desc: "Use our AI tool to visualize your next style before we even pick up the shears.", icon: Sparkles },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="text-blue-400 w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-4">{item.title}</h4>
                  <p className="text-gray-500 text-sm font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
