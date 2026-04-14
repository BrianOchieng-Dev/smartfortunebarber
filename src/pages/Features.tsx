import { Sparkles, Users, Calendar, MessageCircle, Shield, Zap } from 'lucide-react';

export default function Features() {
  const features = [
    { title: 'AI Hairstyle Preview', desc: 'Use our advanced AI to see how different hairstyles look on you before the cut.', icon: Sparkles },
    { title: 'Community Membership', desc: 'Join the Fortune Barber community for exclusive rewards and style updates.', icon: Users },
    { title: 'Easy Booking', desc: 'Schedule your appointments seamlessly through our platform or via WhatsApp.', icon: Calendar },
    { title: 'Direct Chat', desc: 'Communicate directly with our master barbers for style advice and inquiries.', icon: MessageCircle },
    { title: 'Secure Profiles', desc: 'Your profile and hairstyle history are stored securely for your convenience.', icon: Shield },
    { title: 'Real-time Updates', desc: 'Get instant notifications about special offers and new styles in our gallery.', icon: Zap },
  ];

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">App Features</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover the powerful tools and community benefits we've built to enhance your grooming journey.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all">
            <div className="bg-blue-600/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-8">
              <feature.icon className="text-blue-400 w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
