"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Table, { TableColumn } from "../../../components/ui/Table";
import { supabase } from "../../../lib/supabase";
import { UserRole } from "../../../types";

type AdminRoleValue = "admin" | "super admin";
type ModalMode = "create" | "edit" | "delete" | null;

interface AdminFormState {
  user_id: string;
  role: AdminRoleValue;
}

const initialFormState: AdminFormState = {
  user_id: "",
  role: "admin",
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getRoleBadge(role: string) {
  const normalizedRole = role.toLowerCase().replace(/_/g, " ");
  const isSuperAdmin = normalizedRole === "super admin";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        isSuperAdmin
          ? "bg-blue-100 text-primary"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {isSuperAdmin ? "Super Admin" : "Admin"}
    </span>
  );
}

function normalizeFormRole(role: string): AdminRoleValue {
  return role.toLowerCase().replace(/_/g, " ") === "super admin"
    ? "super admin"
    : "admin";
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<UserRole[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminFormState>(initialFormState);
  const [selectedAdmin, setSelectedAdmin] = useState<UserRole | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAdmins = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const [{ data: authData }, { data, error: fetchError }] =
      await Promise.all([
        supabase.auth.getUser(),
        supabase
          .from("user_role")
          .select("id, created_at, user_id, role")
          .order("created_at", { ascending: false }),
      ]);

    setCurrentUserId(authData.user?.id ?? null);

    if (fetchError) {
      setError(fetchError.message);
      setAdmins([]);
    } else {
      setAdmins((data ?? []) as UserRole[]);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAdmins();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadAdmins]);

  const resetModal = () => {
    setModalMode(null);
    setSelectedAdmin(null);
    setForm(initialFormState);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    resetModal();
  };

  const openCreateModal = () => {
    setError("");
    setSuccess("");
    setForm(initialFormState);
    setSelectedAdmin(null);
    setModalMode("create");
  };

  const openEditModal = (admin: UserRole) => {
    setError("");
    setSuccess("");
    setSelectedAdmin(admin);
    setForm({
      user_id: admin.user_id,
      role: normalizeFormRole(admin.role),
    });
    setModalMode("edit");
  };

  const openDeleteModal = (admin: UserRole) => {
    setError("");
    setSuccess("");
    setSelectedAdmin(admin);
    setModalMode("delete");
  };

  const validateForm = () => {
    if (!form.user_id.trim()) {
      return "User ID wajib diisi.";
    }

    if (!uuidPattern.test(form.user_id.trim())) {
      return "User ID harus berupa UUID Supabase Auth yang valid.";
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      user_id: form.user_id.trim(),
      role: form.role,
    };

    const { error: submitError } =
      modalMode === "edit" && selectedAdmin
        ? await supabase
            .from("user_role")
            .update(payload)
            .eq("id", selectedAdmin.id)
        : await supabase.from("user_role").insert(payload);

    if (submitError) {
      setError(submitError.message);
    } else {
      setSuccess(
        modalMode === "edit"
          ? "Data admin berhasil diperbarui."
          : "Data admin berhasil ditambahkan.",
      );
      resetModal();
      await loadAdmins();
    }

    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("user_role")
      .delete()
      .eq("id", selectedAdmin.id);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      setSuccess("Data admin berhasil dihapus.");
      resetModal();
      await loadAdmins();
    }

    setIsSubmitting(false);
  };

  const columns = useMemo<TableColumn<UserRole>[]>(
    () => [
      {
        key: "user_id",
        header: "User ID",
        cell: (admin) => (
          <div>
            <p className="font-semibold text-gray-950">{admin.user_id}</p>
            {admin.user_id === currentUserId && (
              <p className="mt-1 text-xs font-semibold text-primary">
                Akun sedang login
              </p>
            )}
          </div>
        ),
        className: "min-w-72 whitespace-normal",
      },
      {
        key: "role",
        header: "Role",
        cell: (admin) => getRoleBadge(admin.role),
      },
      {
        key: "created_at",
        header: "Dibuat",
        cell: (admin) => formatDate(admin.created_at),
        className: "text-gray-500",
      },
      {
        key: "actions",
        header: "Aksi",
        align: "right",
        cell: (admin) => (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="!rounded-lg !shadow-none"
              onClick={() => openEditModal(admin)}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              className="!rounded-lg !shadow-none"
              onClick={() => openDeleteModal(admin)}
            >
              Hapus
            </Button>
          </div>
        ),
      },
    ],
    [currentUserId],
  );

  const isFormModalOpen = modalMode === "create" || modalMode === "edit";

  return (
    <>
      <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-950">Manajemen Admin</h1>
        <p className="mt-2 text-gray-600">
          Kelola akun admin yang dapat mengakses dashboard.
        </p>
      </div>

        <Table
          title="Daftar Admin"
          description="Data diambil langsung dari tabel user_role Supabase."
          columns={columns}
          data={admins}
          getRowKey={(admin) => admin.id}
          isLoading={isLoading}
          emptyMessage="Belum ada role admin di database."
          actions={
            <Button
              type="button"
              variant="primary"
              size="md"
              className="!rounded-lg !shadow-none"
              onClick={openCreateModal}
            >
              Tambah Admin
            </Button>
          }
          footer={
            <div className="flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <span>Total data: {admins.length}</span>
              <button
                type="button"
                className="font-semibold text-primary transition-colors hover:text-primary-hover"
                onClick={() => void loadAdmins()}
              >
                Muat ulang data
              </button>
            </div>
          }
        />

        {(error || success) && !modalMode && (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-blue-100 bg-blue-50 text-primary"
            }`}
          >
            {error || success}
          </div>
        )}
      </section>

      <Modal
        isOpen={isFormModalOpen}
        title={modalMode === "edit" ? "Edit Admin" : "Tambah Admin"}
        description="Masukkan UUID user dari Supabase Auth dan pilih role yang akan disimpan ke tabel user_role."
        onClose={closeModal}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="admin-user-id"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              User ID
            </label>
            <input
              id="admin-user-id"
              type="text"
              value={form.user_id}
              onChange={(event) =>
                setForm((value) => ({ ...value, user_id: event.target.value }))
              }
              placeholder="UUID user dari Supabase Auth"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="admin-role"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Role
            </label>
            <select
              id="admin-role"
              value={form.role}
              onChange={(event) =>
                setForm((value) => ({
                  ...value,
                  role: event.target.value as AdminRoleValue,
                }))
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-blue-100"
            >
              <option value="admin">Admin</option>
              <option value="super admin">Super Admin</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="white"
              size="md"
              className="!rounded-lg !shadow-none"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="!rounded-lg !shadow-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={modalMode === "delete"}
        title="Hapus Admin"
        description="Data role admin akan dihapus dari tabel user_role."
        onClose={closeModal}
        footer={
          <>
            <Button
              type="button"
              variant="white"
              size="md"
              className="!rounded-lg !shadow-none"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              size="md"
              className="!rounded-lg !shadow-none"
              onClick={() => void handleDelete()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menghapus..." : "Hapus"}
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm text-gray-600">
          <p>Anda yakin ingin menghapus role admin ini?</p>
          {selectedAdmin && (
            <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-4">
              <p className="font-semibold text-gray-950">
                {selectedAdmin.user_id}
              </p>
              <div className="mt-3">{getRoleBadge(selectedAdmin.role)}</div>
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
