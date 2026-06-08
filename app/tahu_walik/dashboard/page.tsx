"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiX, FiCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AdminNavbar from "../components/AdminNavbar";

interface OmzetItem {
  id: number;
  nominal: number;
  tanggal: string;
  metode: string;
}

export default function AdminOmzet() {
  const [omzetList, setOmzetList] = useState<OmzetItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<OmzetItem | null>(null);

  // Form state
  const [form, setForm] = useState({ nominal: "", tanggal: new Date().toISOString().split('T')[0], metode: "Cash" });

  // PO status state
  const [isPOOpen, setIsPOOpen] = useState(false);

  useEffect(() => {
    fetchData();
    fetchPOStatus();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/omzet");
      const data = await res.json();
      setOmzetList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPOStatus = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.isPOOpen !== undefined) {
        setIsPOOpen(data.isPOOpen === "true");
      }
    } catch (error) {
      console.error("Failed to fetch PO status:", error);
    }
  };

  const togglePOStatus = async () => {
    const newValue = !isPOOpen;
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "isPOOpen", value: newValue.toString() }),
      });
      if (res.ok) {
        setIsPOOpen(newValue);
      }
    } catch (error) {
      alert("Gagal memperbarui status PO");
    }
  };

  const totalOmzet = omzetList.reduce((acc, curr) => acc + curr.nominal, 0);

  const handleOpenCreate = () => {
    setModalType("create");
    setForm({ nominal: "", tanggal: new Date().toISOString().split('T')[0], metode: "Cash" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: OmzetItem) => {
    setModalType("edit");
    setEditingItem(item);
    setForm({
      nominal: item.nominal.toString(),
      tanggal: new Date(item.tanggal).toISOString().split('T')[0],
      metode: item.metode
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (item: OmzetItem) => {
    setEditingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = modalType === "create" ? "/api/omzet" : `/api/omzet/${editingItem?.id}`;
    const method = modalType === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        nominal: Number(form.nominal) // Pastikan dikirim sebagai angka
      }),
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchData();
    } else {
      const errorData = await res.json();
      alert("Gagal menyimpan data: " + (errorData.error || "Terjadi kesalahan"));
    }
  };

  const handleDelete = async () => {
    if (!editingItem) return;
    const res = await fetch(`/api/omzet/${editingItem.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setIsDeleteModalOpen(false);
      fetchData();
    } else {
      const errorData = await res.json();
      alert("Gagal menghapus data: " + (errorData.error || "Terjadi kesalahan"));
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = omzetList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(omzetList.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-[#fff0c7] flex items-center justify-center pt-20">
          <div className="text-center">
            {/* Beautiful Custom Pepper Loader */}
            <div className="relative w-20 h-20 mx-auto mb-4 animate-bounce">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg border border-red-500 shadow-red-600/30">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C11.5 2 11 3 11 4.5C11 5.3 11.2 6.1 11.5 6.7C8.4 7.2 6 9.8 6 13C6 16.9 9.1 20 13 20C16.9 20 20 16.9 20 13C20 10 18 7.5 15.2 6.8C15.3 6.6 15.4 6.3 15.4 6C15.4 4.5 14.5 2 14 2C13.5 2 13 3.5 13 4.5C13 4.8 12.9 5.2 12.7 5.5C12.5 5.2 12.3 4.8 12.3 4.5C12.3 3.5 12.5 2 12 2Z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 animate-pulse">Memuat Dashboard Nuampoll...</h2>
            <p className="text-gray-500 text-sm mt-1">Sabar ya bro, lagi ngambil data ter-update</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-[#fff0c7] pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Dashboard <span className="text-red-600">Nuampoll</span>
            </h1>
            <p className="text-gray-600 mt-2">Kelola data omzet harian dengan mudah.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-red-50 text-red-600 font-bold rounded-full transition-all shadow-lg hover:scale-105 cursor-pointer"
          >
            <FiPlus className="w-5 h-5" />
            Tambah Omzet
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-[#1a1a1a] text-white p-8 rounded-3xl mb-8 shadow-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-red-600/30 transition-all"></div>
          <p className="text-gray-400 font-medium mb-1">Total Omzet Keseluruhan</p>
          <h2 className="text-4xl md:text-5xl font-black text-red-600">
            Rp {totalOmzet.toLocaleString("id-ID")}
          </h2>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-bottom border-gray-100">
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Nominal</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Metode</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Memuat data...</td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Belum ada data omzet.</td>
                  </tr>
                ) : (
                  currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-red-600 font-bold">
                        Rp {item.nominal.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.metode === 'Cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                          {item.metode}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <FiEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(item)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination & Controls */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Baris per halaman:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 p-1 cursor-pointer"
              >
                {[5, 10, 25, 50].map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Halaman {currentPage} dari {totalPages || 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => paginate(currentPage + 1)}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-3xl bg-[#111111] p-8 text-white shadow-2xl relative border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {modalType === "create" ? "Tambah" : "Edit"} <span className="text-red-600">Omzet</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition cursor-pointer">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  value={form.nominal}
                  onChange={(e) => setForm({ ...form, nominal: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Masukkan nominal"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={form.tanggal}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Metode Pembayaran</label>
                <select
                  value={form.metode}
                  onChange={(e) => setForm({ ...form, metode: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer"
                >
                  <option value="Cash">Cash</option>
                  <option value="Transfer/QRIS">Transfer/QRIS</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full mt-4 rounded-full bg-red-600 hover:bg-red-700 py-4 font-bold text-lg transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                {modalType === "create" ? "Simpan Data" : "Update Data"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="max-w-sm w-full rounded-3xl bg-[#111111] p-8 text-white shadow-2xl relative border border-white/10 text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Hapus Data?</h3>
            <p className="text-gray-400 mb-6">Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded-full bg-white/5 hover:bg-white/10 py-3 font-bold transition"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-full bg-red-600 hover:bg-red-700 py-3 font-bold transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Controls Section */}
      <div className="max-w-6xl mx-auto mt-12 pb-12 border-t border-gray-200 pt-8 text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={togglePOStatus}
            className={`inline-flex items-center gap-2 px-8 py-3 font-bold rounded-full transition-all shadow-md cursor-pointer border-2 ${isPOOpen
              ? "bg-green-600 border-green-600 text-white hover:bg-green-700"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
          >
            <div className={`w-3 h-3 rounded-full ${isPOOpen ? "bg-white animate-pulse" : "bg-gray-300"}`}></div>
            Status PO Website: {isPOOpen ? "DIBUKA" : "DITUTUP"}
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-4 italic">Masuk sebagai Admin Nuampoll</p>
      </div>
    </div>
    </>
  );
}