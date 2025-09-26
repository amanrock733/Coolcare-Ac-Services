import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/react-app/components/admin/AdminLayout';
import BookingTable from '@/react-app/components/BookingTable';
import { AlertCircle } from 'lucide-react';
import { BookingType } from '@/shared/types';

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/bookings');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin');
          return;
        }
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data.bookings || []);
      setError('');
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/bookings/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update booking status');
      setBookings(prev => prev.map(booking => booking.id === id ? { ...booking, status: newStatus as any, updated_at: new Date().toISOString() } : booking));
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Failed to update booking status');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      router.push('/admin');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AdminLayout
      search={search}
      onSearchChange={setSearch}
      onRefresh={fetchBookings}
      loading={loading}
      adminName="Admin"
      onLogout={handleLogout}
    >
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <BookingTable bookings={bookings} onStatusUpdate={handleStatusUpdate} globalSearchTerm={search} />
    </AdminLayout>
  );
}
