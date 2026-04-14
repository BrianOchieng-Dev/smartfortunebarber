import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from '@/components/ui/sonner';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
}
