import Sidebar from "../../components/layout/admin/Sidebar";

export const metadata = {
  title: "Admin - LPK Sadewa",
  description: "Halaman admin LPK Sadewa.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}
