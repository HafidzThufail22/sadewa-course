export default function AdminDashboardPage() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-950">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Ringkasan aktivitas admin LPK Sadewa.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">
          Gunakan menu di samping untuk mengelola data admin.
        </p>
      </div>
    </section>
  );
}
