import Header from "../../components/layout/admin/Header";

export const metadata = {
  title: "Admin - LPK Sadewa",
  description: "Halaman admin LPK Sadewa.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Header>{children}</Header>;
}
