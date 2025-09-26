import React from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/react-app/components/admin/AdminLayout';

export default function AdminSettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      router.push('/admin');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AdminLayout adminName="Admin" onLogout={handleLogout}>
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">Profile</p>
            <input className="w-full px-3 py-2 border rounded-xl" placeholder="Admin name" />
            <input className="w-full px-3 py-2 border rounded-xl" placeholder="Email" />
            <div className="flex gap-2">
              <input type="password" className="w-full px-3 py-2 border rounded-xl" placeholder="New password" />
              <input type="password" className="w-full px-3 py-2 border rounded-xl" placeholder="Confirm" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">Preferences</p>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /> Dark mode</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" defaultChecked /> Email notifications</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" defaultChecked /> WhatsApp alerts</label>
            <div className="pt-2">
              <button className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
