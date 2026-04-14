import { Link } from 'react-router-dom';
import { Scissors, Phone, Mail, MapPin, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Scissors className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Fortune <span className="text-blue-400">Barber</span></span>
          </Link>
          <p className="text-sm leading-relaxed">
            Premium grooming services in Kakamega. We combine traditional barbering with modern technology to give you the best look.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-400 transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-blue-400 transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            <li><Link to="/services" className="hover:text-blue-400 transition-colors">Services</Link></li>
            <li><Link to="/gallery" className="hover:text-blue-400 transition-colors">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Contact Info</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>0112478220</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>info@fortunebarber.com</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Kakamega Town, Kenya</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Newsletter</h4>
          <p className="text-sm mb-4">Join our community for style tips and special offers.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-blue-500"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© 2024 Fortune Barber Shop. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/254112478220" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>
    </footer>
  );
}
