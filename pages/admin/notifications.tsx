import React, { useState } from 'react';
import AdminLayout from '@/react-app/components/admin/AdminLayout';

export default function AdminNotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'system' | 'customer'>('all');

  const items = [
    { type: 'system', text: 'System update completed successfully.' },
    { type: 'customer', text: 'New booking request from Aman (Repair).' },
    { type: 'customer', text: 'Booking #124 status changed to Completed.' },
  ] as const;

  const filtered = items.filter(i => filter === 'all' || i.type === filter);

  return (
    <AdminLayout>
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <div className="flex gap-2">
            <button onClick={() => setFilter('all')} className={`btn-outline text-sm ${filter==='all' ? 'ring-2 ring-primary/60' : ''}`}>All</button>
            <button onClick={() => setFilter('system')} className={`btn-outline text-sm ${filter==='system' ? 'ring-2 ring-primary/60' : ''}`}>System</button>
            <button onClick={() => setFilter('customer')} className={`btn-outline text-sm ${filter==='customer' ? 'ring-2 ring-primary/60' : ''}`}>Customer</button>
          </div>
        </div>
        <div className="space-y-3">
          {filtered.map((n, i) => (
            <div key={i} className="border rounded-xl p-3 flex items-center justify-between">
              <p className="text-sm text-gray-700">{n.text}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${n.type === 'system' ? 'bg-gray-100 text-gray-700' : 'bg-primary/10 text-primary'}`}>{n.type}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-gray-600">No notifications.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
