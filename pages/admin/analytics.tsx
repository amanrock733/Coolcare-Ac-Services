import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/react-app/components/admin/AdminLayout';
import SimpleAreaChart from '@/react-app/components/admin/SimpleAreaChart';
import SimplePieChart from '@/react-app/components/admin/SimplePieChart';
import StatsCard from '@/react-app/components/admin/StatsCard';
import { AlertCircle, Clock, TrendingUp, CheckCircle, Users } from 'lucide-react';
import { BookingType, ServiceTypes } from '@/shared/types';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

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

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }), [bookings]);

  const monthlyTrend = useMemo(() => {
    const months = new Array(12).fill(0);
    bookings.forEach(b => {
      const dateStr = b.created_at || b.preferred_date;
      if (!dateStr) return;
      const d = new Date(dateStr);
      const m = d.getMonth();
      if (!isNaN(m)) months[m] += 1;
    });
    return months;
  }, [bookings]);

  const monthlyRevenue = useMemo(() => {
    const months = new Array(12).fill(0);
    bookings.forEach(b => {
      if (b.status !== 'completed') return;
      const dateStr = b.created_at || b.preferred_date;
      if (!dateStr) return;
      const d = new Date(dateStr);
      const m = d.getMonth();
      if (!isNaN(m)) months[m] += 1500; // estimate per completed job
    });
    return months;
  }, [bookings]);

  const serviceTypeData = useMemo(() => {
    const counts = { repair: 0, maintenance: 0, install: 0 } as Record<string, number>;
    bookings.forEach(b => {
      if (b.service_type === ServiceTypes.REPAIR) counts.repair += 1;
      else if (b.service_type === ServiceTypes.MAINTENANCE) counts.maintenance += 1;
      else counts.install += 1;
    });
    return [
      { label: 'Installation', value: counts.install, color: '#0EA5E9' },
      { label: 'Repair', value: counts.repair, color: '#0056FF' },
      { label: 'Maintenance', value: counts.maintenance, color: '#10B981' },
    ];
  }, [bookings]);

  const activeCustomers = useMemo(() => {
    const map = new Map<string, number>();
    bookings.forEach(b => {
      const key = b.customer_phone || b.customer_name;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.values()).filter(v => v > 1).length;
  }, [bookings]);

  return (
    <AdminLayout onRefresh={fetchBookings} loading={loading} adminName="Admin">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SimpleAreaChart title="Monthly Bookings" data={monthlyTrend} />
          <SimpleAreaChart title="Monthly Revenue (₹)" data={monthlyRevenue} />
        </div>
        <div className="space-y-6">
          <SimplePieChart title="Service Type Demand" data={serviceTypeData} totalLabel="Total" />

          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Booking Source</h3>
            <ul className="space-y-3">
              {[
                { label: 'Website', value: 45, color: 'bg-primary' },
                { label: 'Phone Call', value: 30, color: 'bg-green-500' },
                { label: 'Mobile App', value: 25, color: 'bg-yellow-500' },
              ].map((s) => (
                <li key={s.label} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">{s.label}</span>
                    <span className="font-medium text-gray-900">{s.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: `${s.value}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <StatsCard title="Conversion Rate" value="32%" Icon={TrendingUp} color="primary" />
        <StatsCard title="Avg Response Time" value="18m" Icon={Clock} color="yellow" />
        <StatsCard title="Satisfaction Score" value="4.7/5" Icon={CheckCircle} color="green" />
        <StatsCard title="Active Customers" value={activeCustomers} Icon={Users} color="primary" />
      </div>
    </AdminLayout>
  );
}
