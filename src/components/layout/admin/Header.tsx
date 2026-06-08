"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  BsLayoutSidebarInset,
  BsLayoutSidebarInsetReverse,
} from "react-icons/bs";
import Sidebar from "./Sidebar";

const pageTitles = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/packages", label: "Paket" },
  { href: "/admin/admins", label: "Manajemen Admin" },
];

export default function Header({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isMobileSidebarVisible = isSidebarOpen;
  const isDesktopSidebarVisible = !isSidebarCollapsed;
  const activePage =
    pageTitles.find((page) => pathname.startsWith(page.href))?.label ?? "Admin";

  const handleToggleSidebar = () => {
    setIsSidebarOpen((value) => !value);
    setIsSidebarCollapsed((value) => !value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Tutup sidebar"
        />
      )}

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <header
        className={`fixed left-0 right-0 top-0 z-40 flex h-16 items-center border-b border-gray-200 bg-white px-4 transition-[margin] duration-300 md:px-6 ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <button
          type="button"
          onClick={handleToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-950"
          aria-label={
            isMobileSidebarVisible || isDesktopSidebarVisible
              ? "Tutup sidebar"
              : "Buka sidebar"
          }
        >
          <span className="md:hidden">
            {isMobileSidebarVisible ? (
              <BsLayoutSidebarInsetReverse className="text-xl" />
            ) : (
              <BsLayoutSidebarInset className="text-xl" />
            )}
          </span>
          <span className="hidden md:block">
            {isDesktopSidebarVisible ? (
              <BsLayoutSidebarInsetReverse className="text-xl" />
            ) : (
              <BsLayoutSidebarInset className="text-xl" />
            )}
          </span>
        </button>

        <h1 className="ml-4 truncate text-lg font-bold text-gray-950">
          {activePage}
        </h1>
      </header>

      <main
        className={`min-h-screen p-5 pt-24 transition-[margin] duration-300 md:p-8 md:pt-24 ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
