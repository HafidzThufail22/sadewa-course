"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Table, { TableColumn } from "../../../components/ui/Table";
import { supabase } from "../../../lib/supabase";
import { Package } from "../../../types";

type ModalMode = "create" | "edit" | "delete" | null;

interface PackageFormState {
  name: string;
  price: string;
  description: string;
  duration: string;
  vehicle: string;
  is_popular: boolean;
}

const initialFormState: PackageFormState = {
  name: "",
  price: "",
  description: "",
  duration: "",
  vehicle: "",
  is_popular: false,
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [form, setForm] = useState<PackageFormState>(initialFormState);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPackages = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("packages")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setPackages([]);
    } else {
      setPackages((data ?? []) as Package[]);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadPackages();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadPackages]);

  const resetModal = () => {
    setModalMode(null);
    setSelectedPackage(null);
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
    setSelectedPackage(null);
    setModalMode("create");
  };

  const openEditModal = (pkg: Package) => {
    setError("");
    setSuccess("");
    setSelectedPackage(pkg);
    setForm({
      name: pkg.name || "",
      price: pkg.price ? pkg.price.toString() : "",
      description: pkg.description || "",
      duration: pkg.duration || "",
      vehicle: pkg.vehicle || "",
      is_popular: pkg.is_popular || false,
    });
    setModalMode("edit");
  };

  const openDeleteModal = (pkg: Package) => {
    setError("");
    setSuccess("");
    setSelectedPackage(pkg);
    setModalMode("delete");
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Nama paket wajib diisi.";
    if (!form.price || isNaN(Number(form.price))) return "Harga harus berupa angka yang valid.";
    if (!form.duration.trim()) return "Durasi paket wajib diisi.";
    if (!form.vehicle.trim()) return "Kendaraan wajib diisi.";
    if (!form.description.trim()) return "Deskripsi paket wajib diisi.";

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
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      duration: form.duration.trim(),
      vehicle: form.vehicle.trim(),
      is_popular: form.is_popular,
    };

    const { error: submitError } =
      modalMode === "edit" && selectedPackage
        ? await supabase
            .from("packages")
            .update(payload)
            .eq("id", selectedPackage.id)
        : await supabase.from("packages").insert(payload);

    if (submitError) {
      setError(submitError.message);
    } else {
      setSuccess(
        modalMode === "edit"
          ? "Data paket berhasil diperbarui."
          : "Data paket berhasil ditambahkan."
      );
      resetModal();
      await loadPackages();
    }

    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!selectedPackage) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("packages")
      .delete()
      .eq("id", selectedPackage.id);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      setSuccess("Data paket berhasil dihapus.");
      resetModal();
      await loadPackages();
    }

    setIsSubmitting(false);
  };

  const columns = useMemo<TableColumn<Package>[]>(
    () => [
      {
        key: "name",
        header: "Nama Paket",
        cell: (pkg) => (
          <div>
            <p className="font-bold text-gray-950">{pkg.name}</p>
            {pkg.is_popular && (
              <span className="mt-1 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                Populer
              </span>
            )}
          </div>
        ),
      },
      {
        key: "vehicle",
        header: "Kendaraan",
        cell: (pkg) => <span className="text-gray-700">{pkg.vehicle}</span>,
      },
      {
        key: "duration",
        header: "Durasi",
        cell: (pkg) => <span className="text-gray-700">{pkg.duration}</span>,
      },
      {
        key: "price",
        header: "Harga",
        cell: (pkg) => (
          <span className="font-semibold text-gray-900">
            {formatCurrency(pkg.price)}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Aksi",
        align: "right",
        cell: (pkg) => (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="!rounded-lg !shadow-none"
              onClick={() => openEditModal(pkg)}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              className="!rounded-lg !shadow-none"
              onClick={() => openDeleteModal(pkg)}
            >
              Hapus
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const isFormModalOpen = modalMode === "create" || modalMode === "edit";

  return (
    <>
      <section>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-950">Paket Kursus</h1>
          <p className="mt-2 text-gray-600">
            Kelola data paket kursus mengemudi LPK Sadewa.
          </p>
        </div>

        <Table
          title="Daftar Paket"
          description="Data paket kursus yang tersedia untuk ditampilkan di halaman utama."
          columns={columns}
          data={packages}
          getRowKey={(pkg) => pkg.id}
          isLoading={isLoading}
          emptyMessage="Belum ada data paket di database."
          actions={
            <Button
              type="button"
              variant="primary"
              size="md"
              className="!rounded-lg !shadow-none"
              onClick={openCreateModal}
            >
              Tambah Paket
            </Button>
          }
          footer={
            <div className="flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <span>Total paket: {packages.length}</span>
              <button
                type="button"
                className="font-semibold text-primary transition-colors hover:text-primary-hover"
                onClick={() => void loadPackages()}
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
        title={modalMode === "edit" ? "Edit Paket" : "Tambah Paket"}
        description="Lengkapi detail formulir paket kursus berikut."
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
              htmlFor="pkg-name"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Nama Paket
            </label>
            <input
              id="pkg-name"
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((v) => ({ ...v, name: e.target.value }))
              }
              placeholder="Contoh: Paket Pemula Manual"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="pkg-duration"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Durasi
              </label>
              <input
                id="pkg-duration"
                type="text"
                value={form.duration}
                onChange={(e) =>
                  setForm((v) => ({ ...v, duration: e.target.value }))
                }
                placeholder="Contoh: 10 Jam"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label
                htmlFor="pkg-vehicle"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Kendaraan
              </label>
              <input
                id="pkg-vehicle"
                type="text"
                value={form.vehicle}
                onChange={(e) =>
                  setForm((v) => ({ ...v, vehicle: e.target.value }))
                }
                placeholder="Contoh: Avanza Manual"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="pkg-price"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Harga (Rp)
            </label>
            <input
              id="pkg-price"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) =>
                setForm((v) => ({ ...v, price: e.target.value }))
              }
              placeholder="Contoh: 500000"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="pkg-description"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Deskripsi
            </label>
            <textarea
              id="pkg-description"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((v) => ({ ...v, description: e.target.value }))
              }
              placeholder="Jelaskan fasilitas paket ini..."
              className="w-full resize-y rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="pkg-popular"
              type="checkbox"
              checked={form.is_popular}
              onChange={(e) =>
                setForm((v) => ({ ...v, is_popular: e.target.checked }))
              }
              className="h-5 w-5 rounded border-gray-300 text-primary accent-primary focus:ring-primary"
            />
            <label
              htmlFor="pkg-popular"
              className="text-sm font-semibold text-gray-700"
            >
              Tandai sebagai Paket Populer
            </label>
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
        title="Hapus Paket"
        description="Data paket kursus akan dihapus secara permanen dari database."
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
          <p>Anda yakin ingin menghapus paket kursus ini?</p>
          {selectedPackage && (
            <div className="rounded-lg border border-red-100 bg-red-50/70 p-4">
              <p className="font-semibold text-gray-950">
                {selectedPackage.name}
              </p>
              <div className="mt-1 text-xs text-gray-500">
                {selectedPackage.vehicle} • {selectedPackage.duration}
              </div>
            </div>
          )}
          {error && (
            <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
