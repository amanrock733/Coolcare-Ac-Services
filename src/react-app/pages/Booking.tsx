import Navbar from '@/react-app/components/Navbar';
import BookingForm from '@/react-app/components/BookingForm';
import Footer from '@/react-app/components/Footer';
import ChatbotWidget from '@/react-app/components/ChatbotWidget';

export default function Booking() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12">
        <BookingForm />
      </div>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
