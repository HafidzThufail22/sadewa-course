"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  FaBox,
  FaTachometerAlt,
  FaUsers,
  FaSignOutAlt,
  FaCar,
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

  // State untuk menyimpan role yang login
  const role = useSyncExternalStore(subscribeToRole, getStoredRole, () => null);

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
      className={`fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] flex-col bg-white/95  text-gray-900 shadow-2xl transition-[transform,width] duration-300 md:top-0 md:h-screen ${
        isCollapsed ? "md:w-20" : "md:w-64"
      } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} w-64`}
    >
      {/* Logo Area */}
      <div
        className={`flex h-16 items-center border-b border-gray-200 px-4 ${
          isCollapsed ? "md:justify-center" : "justify-start"
        }`}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "md:justify-center" : "gap-3"
          }`}
        >
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
              className={`flex h-12 items-center rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-gray-950 hover:bg-primary/15 hover:text-gray-950"
              } ${isCollapsed ? "md:justify-center md:px-0" : "gap-4 px-5"}`}
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
      <div className="space-y-3 border-t border-gray-800 p-4">
        <Button
          variant="danger"
          size="md"
          className={`w-full !rounded-2xl ${isCollapsed ? "md:!px-0" : ""}`}
          onClick={handleLogout} // Memanggil fungsi logout saat diklik
          title="Keluar"
        >
          <FaSignOutAlt />
          <span className={isCollapsed ? "md:hidden" : ""}>Keluar</span>
        </Button>
      </div>
    </aside>
  );
}
