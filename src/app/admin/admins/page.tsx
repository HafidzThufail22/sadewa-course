export default function AdminUsersPage() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-950">Manajemen Admin</h1>
        <p className="mt-2 text-gray-600">
          Kelola akun admin yang dapat mengakses dashboard.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">
          Halaman ini hanya ditampilkan untuk role super_admin.
        </p>
      </div>
    </section>
  );
}
