import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/react-app/components/admin/AdminLayout';
import { BookingType } from '@/shared/types';

export default function AdminMessagesPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  const uniqueCustomers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string }>();
    bookings.forEach(b => {
      const key = b.customer_phone || b.customer_name;
      if (!map.has(key)) map.set(key, { name: b.customer_name, phone: b.customer_phone });
    });
    return Array.from(map.values());
  }, [bookings]);

  const filteredCustomers = uniqueCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      router.push('/admin');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AdminLayout search={search} onSearchChange={setSearch} onRefresh={fetchBookings} loading={loading} adminName="Admin" onLogout={handleLogout}>
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Messages</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="border rounded-xl p-3 space-y-2">
            {filteredCustomers.slice(0, 20).map((c) => (
              <div key={c.phone} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.phone}</p>
                </div>
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
            ))}
            {filteredCustomers.length === 0 && (
              <p className="text-sm text-gray-600">No customers found.</p>
            )}
          </div>
          <div className="lg:col-span-2 border rounded-xl p-3 flex flex-col h-80">
            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              <div className="self-start max-w-[70%] bg-gray-100 rounded-2xl px-3 py-2 text-sm">Hello! I’d like to reschedule my booking.</div>
              <div className="self-end max-w-[70%] bg-primary text-white rounded-2xl px-3 py-2 text-sm">Sure! Please share your preferred date and time.</div>
              <div className="self-start max-w-[70%] bg-gray-100 rounded-2xl px-3 py-2 text-sm">Friday morning works.</div>
              <div className="self-end max-w-[70%] bg-primary text-white rounded-2xl px-3 py-2 text-sm">Done. I’ve updated it to Friday 10 AM.</div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input className="flex-1 px-3 py-2 border rounded-xl" placeholder="Type a message..." />
              <button className="btn-primary">Send</button>
            </div>
            <div className="mt-2 flex gap-2">
              {['Thanks!','On the way 🚐','Resolved ✅'].map((q) => (
                <button key={q} className="btn-outline text-xs px-2 py-1">{q}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
