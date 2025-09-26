"use client";
import React, { useState } from "react";
import { Search, Bell, MessageSquare, RefreshCw, ChevronDown } from "lucide-react";

interface TopbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
  adminName?: string;
}

export default function Topbar({ search, onSearchChange, onRefresh, loading, adminName = "Admin" }: TopbarProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search bookings..."
            className="w-full h-11 pl-11 pr-4 rounded-3xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="btn-outline h-11"
          title="Refresh"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <button className="btn-outline h-11" title="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <button className="btn-outline h-11" title="Messages">
          <MessageSquare className="h-5 w-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-3 h-11 px-3 rounded-3xl bg-primary text-white hover:bg-primary/90"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-semibold">
              A
            </div>
            <span className="hidden sm:block font-medium">{adminName}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-3xl shadow-lg p-2 z-10">
              <button className="w-full text-left px-3 py-2 rounded-2xl hover:bg-gray-50">My Profile</button>
              <button className="w-full text-left px-3 py-2 rounded-2xl hover:bg-gray-50">Settings</button>
              <hr className="my-2" />
              <a href="/admin" className="block px-3 py-2 rounded-2xl text-red-600 hover:bg-red-50">Logout</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
