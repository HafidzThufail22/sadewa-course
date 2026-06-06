"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { FaBox, FaUsers, FaSignOutAlt, FaCar } from "react-icons/fa";
import Button from "../../ui/Button";
import { supabase } from "../../../lib/supabase"; // Untuk fungsi logout

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

export default function Sidebar() {
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
    <aside className="w-64 h-screen bg-gray-950 text-white flex flex-col fixed left-0 top-0 z-50">
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-gray-800">
        <FaCar className="text-primary text-3xl mr-3" />
        <span className="font-heading font-bold text-2xl tracking-wide">
          LPK Admin
        </span>
      </div>

      {/* Menu Navigasi Dinamis */}
      <nav className="flex-1 px-4 py-8 space-y-3">
        {visibleMenus.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="text-xl" />
              <span className="font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Area Bawah (Tombol Keluar Aktif) */}
      <div className="p-6 border-t border-gray-800">
        <Button
          variant="danger"
          size="md"
          className="w-full !rounded-2xl"
          onClick={handleLogout} // Memanggil fungsi logout saat diklik
        >
          <FaSignOutAlt /> Keluar
        </Button>
      </div>
    </aside>
  );
}
