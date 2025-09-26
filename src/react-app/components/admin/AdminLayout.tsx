"use client";
import React, { PropsWithChildren } from "react";
import Sidebar from "@/react-app/components/admin/Sidebar";
import Topbar from "@/react-app/components/admin/Topbar";

interface AdminLayoutProps extends PropsWithChildren {
  search?: string;
  onSearchChange?: (val: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
  adminName?: string;
  onLogout?: () => void;
}

export default function AdminLayout({
  children,
  search = "",
  onSearchChange,
  onRefresh,
  loading = false,
  adminName = "Admin",
  onLogout,
}: AdminLayoutProps) {
  const handleSearchChange = onSearchChange || (() => {});
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-10 px-4 lg:px-6 pt-4">
          <div className="card border border-gray-200">
            <Topbar
              search={search}
              onSearchChange={handleSearchChange}
              onRefresh={onRefresh}
              loading={loading}
              adminName={adminName}
            />
          </div>
        </div>
        <main className="p-4 lg:p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}
