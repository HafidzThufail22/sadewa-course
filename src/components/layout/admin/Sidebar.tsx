"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  FaBox,
  FaTachometerAlt,
  FaUsers,
  FaSignOutAlt,
  FaCar,
  FaTimes,
} from "react-icons/fa";
import Button from "../../ui/Button";
import { supabase } from "../../../lib/supabase";

type AdminRole = "admin" | "super_admin";

function getStoredRole(): AdminRole | null {
  if (typeof window === "undefined") {
    return null;
  }

  const role = localStorage.getItem("userRole");
  return role === "admin" || role === "super_admin" ? role : null;
}

function subscribeToRole(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("userRoleChange", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("userRoleChange", callback);
  };
}

interface SidebarProps {
  isCollapsed: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isCollapsed,
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [email, setEmail] = useState<string>("");

  // State untuk menyimpan role yang login
  const role = useSyncExternalStore(subscribeToRole, getStoredRole, () => null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setEmail(data.user.email);
      }
    });
  }, []);

  // Fungsi untuk Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("userRole"); // Hapus memori role
    window.dispatchEvent(new Event("userRoleChange"));
    router.push("/login"); // Kembalikan ke halaman login
  };

  // Daftar menu dengan aturan hak akses (allowedRoles)
  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: FaTachometerAlt,
      allowedRoles: ["super_admin", "admin"], // Keduanya boleh melihat
    },
    {
      name: "Paket",
      href: "/admin/packages",
      icon: FaBox,
      allowedRoles: ["super_admin", "admin"], // Keduanya boleh melihat
    },
    {
      name: "Manajemen Admin",
      href: "/admin/admins",
      icon: FaUsers,
      allowedRoles: ["super_admin"], // HANYA Super Admin yang boleh melihat
    },
  ];

  // Menyaring menu: Hanya tampilkan menu yang role-nya diizinkan
  const visibleMenus = menuItems.filter((item) =>
    role ? item.allowedRoles.includes(role) : false,
  );

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col bg-white border-r border-gray-200 text-gray-900 transition-[transform,width] duration-300 ${
        isCollapsed ? "md:w-20" : "md:w-64"
      } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} w-64`}
    >
      {/* Logo Area */}
      <div
        className={`flex h-16 w-full items-center justify-between border-b border-gray-200 px-4 ${
          isCollapsed ? "md:justify-center md:px-0" : ""
        }`}
      >
        <div className={`flex items-center gap-3 ${isCollapsed ? "md:gap-0" : ""}`}>
          <FaCar className="text-primary text-3xl shrink-0" />
          <div className={isCollapsed ? "md:hidden" : ""}>
            <span className="block font-heading text-xl font-bold leading-5 tracking-wide">
              Admin
            </span>
            <p className="mt-0.5 text-xs font-semibold text-gray-400">
              LPK Sadewa
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Tutup sidebar"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* Menu Navigasi Dinamis */}
      <nav className="flex-1 space-y-3 px-4 py-8">
        {visibleMenus.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              title={isCollapsed ? item.name : undefined}
              className={`flex h-12 items-center gap-4 px-5 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-gray-950 hover:bg-blue-100 hover:text-gray-950"
              } ${isCollapsed ? "md:justify-center md:px-0 md:gap-0" : ""}`}
            >
              <Icon className="shrink-0 text-xl" />
              <span
                className={`whitespace-nowrap font-semibold ${
                  isCollapsed ? "md:hidden" : ""
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Area Bawah (Tombol Keluar Aktif) */}
      <div className="space-y-4 border-t border-gray-200 p-4">
        {/* Profile Card */}
        <div className={`flex items-center gap-3 rounded-2xl bg-blue-50 p-3 transition-all ${isCollapsed ? "md:justify-center md:px-0 md:bg-transparent" : ""}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-inner">
            {email ? email.charAt(0).toUpperCase() : "A"}
          </div>
          <div className={`flex-1 overflow-hidden ${isCollapsed ? "md:hidden" : ""}`}>
            <p className="truncate text-sm font-bold text-gray-900" title={email}>
              {email || "Memuat..."}
            </p>
            <p className="mt-0.5 text-xs font-semibold capitalize text-primary">
              {role === "super_admin" ? "Super Admin" : "Admin"}
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          size="md"
          className={`w-full !rounded-2xl flex items-center justify-center gap-2 ${isCollapsed ? "md:!px-0 md:!w-12 md:!h-12 md:mx-auto" : ""}`}
          onClick={handleLogout} // Memanggil fungsi logout saat diklik
          title="Keluar"
        >
          <FaSignOutAlt className="shrink-0" />
          <span className={isCollapsed ? "md:hidden" : ""}>Keluar</span>
        </Button>
      </div>
    </aside>
  );
}
