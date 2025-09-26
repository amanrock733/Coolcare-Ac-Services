"use client";
import { useState } from 'react';
import { Search, Filter, Eye, Calendar, Phone, MapPin, User, Download, FileText } from 'lucide-react';
import { BookingType, BookingStatus } from '@/shared/types';

interface BookingTableProps {
  bookings: BookingType[];
  onStatusUpdate: (id: number, status: string) => void;
  globalSearchTerm?: string;
}

const statusColors = {
  [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [BookingStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-200',
  [BookingStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
  [BookingStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-200'
};

export default function BookingTable({ bookings, onStatusUpdate, globalSearchTerm }: BookingTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);

  const filteredBookings = bookings.filter(booking => {
    const term = globalSearchTerm !== undefined ? globalSearchTerm : searchTerm;
    const matchesSearch = 
      booking.customer_name.toLowerCase().includes(term.toLowerCase()) ||
      booking.customer_phone.includes(term) ||
      booking.address.toLowerCase().includes(term.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesDate = !dateFilter || booking.preferred_date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = [
      'ID', 'Customer Name', 'Phone', 'Email', 'Service Type', 'AC Type',
      'Address', 'Preferred Date', 'Preferred Time', 'Status', 'Created At'
    ];
    const rows = filteredBookings.map(b => [
      b.id ?? '', b.customer_name, b.customer_phone, b.customer_email ?? '', b.service_type,
      b.ac_type, b.address, b.preferred_date, b.preferred_time, b.status, b.created_at ?? ''
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(String)
      .map(v => '"' + v.replace(/"/g, '""') + '"')
      .join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const html = `
      <html><head><title>Bookings</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
        th { background: #f3f4f6; }
      </style>
      </head><body>
      <h2>CoolCare AC Services - Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Customer</th><th>Phone</th><th>Service</th><th>AC Type</th>
            <th>Date</th><th>Time</th><th>Status</th><th>Created</th>
          </tr>
        </thead>
        <tbody>
          ${filteredBookings.map(b => `
            <tr>
              <td>${b.id ?? ''}</td>
              <td>${b.customer_name}</td>
              <td>${b.customer_phone}</td>
              <td>${b.service_type}</td>
              <td>${b.ac_type}</td>
              <td>${b.preferred_date}</td>
              <td>${b.preferred_time}</td>
              <td>${b.status}</td>
              <td>${b.created_at ?? ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      </body></html>
    `;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden" id="bookings">
      {/* Header and Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Booking Management</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-3xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent placeholder:text-gray-400"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 pl-11 pr-10 rounded-3xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-11 px-4 rounded-3xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={exportToCSV} className="btn-outline">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button onClick={exportToPDF} className="btn-primary">
              <FileText className="h-4 w-4" /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                    <div className="text-sm text-gray-500">{booking.customer_phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 capitalize">{booking.service_type}</div>
                    <div className="text-sm text-gray-500 capitalize">{booking.ac_type} AC</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{formatDate(booking.preferred_date)}</div>
                    <div className="text-sm text-gray-500">{booking.preferred_time}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={booking.status}
                    onChange={(e) => onStatusUpdate(booking.id!, e.target.value)}
                    className={`text-xs px-3 py-1 rounded-full border capitalize ${statusColors[booking.status as keyof typeof statusColors]} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.created_at ? formatDateTime(booking.created_at) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="text-blue-600 hover:text-blue-900 flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Booking Details #{selectedBooking.id}
                </h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Customer</p>
                      <p className="text-sm text-gray-600">{selectedBooking.customer_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{selectedBooking.customer_phone}</p>
                    </div>
                  </div>

                  {selectedBooking.customer_email && (
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{selectedBooking.customer_email}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Address</p>
                      <p className="text-sm text-gray-600">{selectedBooking.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Service Date</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(selectedBooking.preferred_date)} at {selectedBooking.preferred_time}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">Service Type</p>
                    <p className="text-sm text-gray-600 capitalize">{selectedBooking.service_type}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">AC Type</p>
                    <p className="text-sm text-gray-600 capitalize">{selectedBooking.ac_type}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">Status</p>
                    <span className={`inline-block text-xs px-3 py-1 rounded-full capitalize ${statusColors[selectedBooking.status as keyof typeof statusColors]}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-900 mb-2">Notes</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Created: {selectedBooking.created_at ? formatDateTime(selectedBooking.created_at) : 'N/A'}
                </p>
                {selectedBooking.updated_at && selectedBooking.updated_at !== selectedBooking.created_at && (
                  <p className="text-xs text-gray-500">
                    Updated: {formatDateTime(selectedBooking.updated_at)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
