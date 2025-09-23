"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CheckCircle, MessageCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import Navbar from '@/react-app/components/Navbar';
import Footer from '@/react-app/components/Footer';

export default function Success() {
  const router = useRouter();
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const bookingId = (router.query?.bookingId as string) || '';

  useEffect(() => {
    if (bookingId) {
      fetch(`/api/whatsapp/${bookingId}`)
        .then(res => res.json())
        .then(data => {
          if (data.whatsappUrl) {
            setWhatsappUrl(data.whatsappUrl);
          }
        })
        .catch(error => {
          console.error('Error fetching WhatsApp URL:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-400 px-8 py-12 text-center text-white">
              <CheckCircle className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-green-100">Your service request has been submitted successfully</p>
              {bookingId && (
                <p className="text-green-100 mt-2">Booking ID: #{bookingId}</p>
              )}
            </div>

            <div className="p-8">
              {/* What's Next */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2 mt-0.5">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Confirmation Call</h3>
                      <p className="text-gray-600">We'll call you within 30 minutes to confirm your appointment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2 mt-0.5">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Technician Assignment</h3>
                      <p className="text-gray-600">Our certified technician will be assigned to your service</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2 mt-0.5">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Service Completion</h3>
                      <p className="text-gray-600">Professional service at your scheduled time</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact */}
              {!loading && whatsappUrl && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MessageCircle className="h-5 w-5 text-green-600 mr-2" />
                    Continue on WhatsApp
                  </h3>
                  <p className="text-gray-600 mb-4">
                    For faster communication, you can also reach us directly on WhatsApp with your booking details.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Open WhatsApp
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Need immediate assistance?</h3>
                <div className="space-y-2 text-gray-600">
                  <p>📞 Phone: +1 (555) 123-4567</p>
                  <p>📧 Email: info@coolcare.com</p>
                  <p>🕒 24/7 Emergency Service Available</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Home
                </Link>
                <Link
                  href="/booking"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all"
                >
                  Book Another Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
