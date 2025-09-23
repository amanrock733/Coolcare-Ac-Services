"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Calendar, Clock, MapPin, User, Phone, Mail, Wrench, Settings, Home, MessageSquare } from 'lucide-react';
import { CreateBookingType, ServiceTypes, ACTypes } from '@/shared/types';

const serviceOptions = [
  { value: ServiceTypes.REPAIR, label: 'AC Repair', icon: Wrench, description: 'Fix broken AC units' },
  { value: ServiceTypes.MAINTENANCE, label: 'AC Maintenance', icon: Settings, description: 'Regular servicing and cleaning' },
  { value: ServiceTypes.RENT, label: 'AC Rental', icon: Home, description: 'Short-term and long-term rentals' }
];

const acTypeOptions = [
  { value: ACTypes.WINDOW, label: 'Window AC', description: 'Compact window-mounted units' },
  { value: ACTypes.SPLIT, label: 'Split AC', description: 'Wall-mounted split systems' },
  { value: ACTypes.CENTRAL, label: 'Central AC', description: 'Whole-house central systems' }
];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

export default function BookingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CreateBookingType>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    service_type: ServiceTypes.REPAIR,
    ac_type: ACTypes.SPLIT,
    address: '',
    preferred_date: '',
    preferred_time: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<CreateBookingType>>({});

  useEffect(() => {
    const serviceParam = (router.query?.service as string) || '';
    if (serviceParam && (Object.values(ServiceTypes) as string[]).includes(serviceParam)) {
      setFormData(prev => ({ ...prev, service_type: serviceParam as any }));
    }
    // Only run when the query param changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query?.service]);

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateBookingType> = {};

    if (!formData.customer_name.trim()) newErrors.customer_name = 'Name is required';
    if (!formData.customer_phone.trim()) newErrors.customer_phone = 'Phone number is required';
    if (formData.customer_phone.length < 10) newErrors.customer_phone = 'Valid phone number is required';
    if (formData.customer_email && !/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Valid email is required';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.preferred_date) newErrors.preferred_date = 'Date is required';
    if (!formData.preferred_time) newErrors.preferred_time = 'Time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      const data = await response.json();
      router.push(`/success?bookingId=${data.bookingId}`);
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateBookingType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Book Your AC Service</h1>
          <p className="text-blue-100">Fill out the form below and we'll get back to you quickly</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Service Type Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Select Service Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {serviceOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('service_type', option.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.service_type === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mb-2 ${
                      formData.service_type === option.value ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <h3 className="font-semibold text-gray-900">{option.label}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AC Type Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              AC Unit Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {acTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('ac_type', option.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    formData.ac_type === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{option.label}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customer_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.customer_name && (
                <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customer_phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="(555) 123-4567"
              />
              {errors.customer_phone && (
                <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 mr-2" />
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={formData.customer_email}
              onChange={(e) => handleInputChange('customer_email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customer_email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
            />
            {errors.customer_email && (
              <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              Service Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter complete address including apartment/unit number"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                Preferred Date *
              </label>
              <input
                type="date"
                min={today}
                value={formData.preferred_date}
                onChange={(e) => handleInputChange('preferred_date', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.preferred_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.preferred_date && (
                <p className="text-red-500 text-sm mt-1">{errors.preferred_date}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 mr-2" />
                Preferred Time *
              </label>
              <select
                value={formData.preferred_time}
                onChange={(e) => handleInputChange('preferred_time', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.preferred_time ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.preferred_time && (
                <p className="text-red-500 text-sm mt-1">{errors.preferred_time}</p>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="h-4 w-4 mr-2" />
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the issue, special instructions, or any other relevant information..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? 'Submitting...' : 'Book Service Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
