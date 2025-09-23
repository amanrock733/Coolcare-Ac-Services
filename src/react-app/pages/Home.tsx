import Navbar from '@/react-app/components/Navbar';
import HeroSection from '@/react-app/components/HeroSection';
import Services from '@/react-app/components/Services';
import ChatbotWidget from '@/react-app/components/ChatbotWidget';
import Footer from '@/react-app/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <Services />
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
