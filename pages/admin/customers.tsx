import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/react-app/components/admin/AdminLayout';
import SimplePieChart from '@/react-app/components/admin/SimplePieChart';
import { AlertCircle } from 'lucide-react';
import { BookingType } from '@/shared/types';

export default function AdminCustomersPage() {
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

  const uniqueCustomers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; count: number; last: string }>();
    bookings.forEach(b => {
      const key = b.customer_phone || b.customer_name;
      const item = map.get(key);
      const last = (b.created_at || b.preferred_date || '') as string;
      if (item) {
        item.count += 1;
        if (last && (!item.last || new Date(last) > new Date(item.last))) item.last = last;
      } else {
        map.set(key, { name: b.customer_name, phone: b.customer_phone, count: 1, last });
      }
    });
    return Array.from(map.values());
  }, [bookings]);

  const filteredCustomers = uniqueCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const loyalVsNew = useMemo(() => {
    let loyal = 0, fresh = 0;
    uniqueCustomers.forEach(c => (c.count > 1 ? loyal++ : fresh++));
    return [
      { label: 'Loyal', value: loyal, color: '#10B981' },
      { label: 'New', value: fresh, color: '#EAB308' },
    ];
  }, [uniqueCustomers]);

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

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Customers</h3>
          <SimplePieChart title="Customer Activity" data={loyalVsNew} totalLabel="Total" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((c) => (
            <div key={c.phone} className="border rounded-xl p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.phone}</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{c.count} bookings</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Last: {c.last ? new Date(c.last).toLocaleDateString() : '—'}</p>
              <div className="mt-3 flex gap-2">
                <button className="btn-outline text-sm px-3 py-1">View Profile</button>
                <button className="btn-primary text-sm px-3 py-1">Message</button>
              </div>
            </div>
          ))}
          {filteredCustomers.length === 0 && (
            <p className="text-sm text-gray-600">No customers found.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
