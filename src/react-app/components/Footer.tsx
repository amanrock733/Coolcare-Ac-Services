import Link from 'next/link';
import { Snowflake, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-2 rounded-lg">
                <Snowflake className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">CoolCare AC Services</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Professional AC repair, maintenance, and rental services with over 5 years of experience. 
              Trusted by thousands of customers for reliable and efficient cooling solutions.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span>info@coolcare.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span>123 Cool Street, AC City, State 12345</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/booking?service=repair" className="hover:text-blue-400 transition-colors">
                  AC Repair
                </Link>
              </li>
              <li>
                <Link href="/booking?service=maintenance" className="hover:text-blue-400 transition-colors">
                  AC Maintenance
                </Link>
              </li>
              <li>
                <Link href="/booking?service=rent" className="hover:text-blue-400 transition-colors">
                  AC Rental
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-blue-400 transition-colors">
                  Emergency Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours & Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Business Hours</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-400" />
                <div>
                  <p>Mon - Fri: 8:00 AM - 8:00 PM</p>
                  <p>Sat - Sun: 9:00 AM - 6:00 PM</p>
                  <p className="text-blue-400 font-medium">24/7 Emergency Service</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 CoolCare AC Services. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/admin" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              Admin Portal
            </Link>
            <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
