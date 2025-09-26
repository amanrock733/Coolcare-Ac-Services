"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  CalendarCheck2,
  Users,
  BarChart3,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import React from "react";

interface SidebarProps {
  active?: string;
  onLogout?: () => void;
}

const navItems = [
  { key: "Overview", label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { key: "Bookings", label: "Bookings", href: "/admin/bookings", icon: CalendarCheck2 },
  { key: "Customers", label: "Customers", href: "/admin/customers", icon: Users },
  { key: "Analytics", label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { key: "Notifications", label: "Notifications", href: "/admin/notifications", icon: Bell },
  { key: "Messages", label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { key: "Settings", label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar({ active = "Bookings", onLogout }: SidebarProps) {
  const router = useRouter();
  const pathMap: Record<string, string> = {
    "/admin/dashboard": "Overview",
    "/admin/bookings": "Bookings",
    "/admin/customers": "Customers",
    "/admin/analytics": "Analytics",
    "/admin/notifications": "Notifications",
    "/admin/messages": "Messages",
    "/admin/settings": "Settings",
  };
  const activeKey = pathMap[router.pathname] || active;
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0B0B0D] text-white p-4 rounded-3xl ml-0 my-4 mr-4 shadow-2xl">
      <div className="px-3 py-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-bold">CC</div>
          <div className="leading-tight">
            <p className="font-semibold">CoolCare AC Services</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ key, label, href, icon: Icon }) => (
          <Link key={key} href={href} className={`sidebar-link ${activeKey === key ? "sidebar-link-active" : ""}`}>
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
