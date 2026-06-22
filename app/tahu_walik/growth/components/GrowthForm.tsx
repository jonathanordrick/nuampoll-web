"use client";
import { useState, useEffect } from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";

export interface GrowthMetric {
    id: string;
    recordedAt: string; // YYYY-MM-DD
    igFollowers: number | null;
    igViews: number | null;
    igPosts: number | null;
    igLikes: number | null;
    tiktokFollowers: number | null;
    tiktokViews: number | null;
    tiktokPosts: number | null;
    tiktokLikes: number | null;
    totalCustomers: number | null;
    websiteVisitors: number | null;
    websiteViews: number | null;
    activeOrders: number | null;
    testimonials: number | null;
    totalRevenue: number | null;
    notes: string | null;
}

interface GrowthFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingItem: GrowthMetric | null;
}

export default function GrowthForm({ isOpen, onClose, onSuccess, editingItem }: GrowthFormProps) {
    const [form, setForm] = useState({
        recordedAt: new Date().toISOString().split("T")[0],
        igFollowers: "",
        igViews: "",
        igPosts: "",
        igLikes: "",
        tiktokFollowers: "",
        tiktokViews: "",
        tiktokPosts: "",
        tiktokLikes: "",
        totalCustomers: "",
        websiteVisitors: "",
        websiteViews: "",
        activeOrders: "",
        testimonials: "",
        totalRevenue: "",
        notes: "",
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
    const [forceSave, setForceSave] = useState(false);

    useEffect(() => {
        if (editingItem) {
            // Konversi ISO string/Date ke format YYYY-MM-DD
            const dateStr = new Date(editingItem.recordedAt).toISOString().split("T")[0];
            const valToString = (val: any) => {
                return val !== null && val !== undefined ? val.toString() : "";
            };

            setForm({
                recordedAt: dateStr,
                igFollowers: valToString(editingItem.igFollowers),
                igViews: valToString(editingItem.igViews),
                igPosts: valToString(editingItem.igPosts),
                igLikes: valToString(editingItem.igLikes),
                tiktokFollowers: valToString(editingItem.tiktokFollowers),
                tiktokViews: valToString(editingItem.tiktokViews),
                tiktokPosts: valToString(editingItem.tiktokPosts),
                tiktokLikes: valToString(editingItem.tiktokLikes),
                totalCustomers: valToString(editingItem.totalCustomers),
                websiteVisitors: valToString(editingItem.websiteVisitors),
                websiteViews: valToString(editingItem.websiteViews),
                activeOrders: valToString(editingItem.activeOrders),
                testimonials: valToString(editingItem.testimonials),
                totalRevenue: valToString(editingItem.totalRevenue),
                notes: editingItem.notes || "",
            });
        } else {
            setForm({
                recordedAt: new Date().toISOString().split("T")[0],
                igFollowers: "",
                igViews: "",
                igPosts: "",
                igLikes: "",
                tiktokFollowers: "",
                tiktokViews: "",
                tiktokPosts: "",
                tiktokLikes: "",
                totalCustomers: "",
                websiteVisitors: "",
                websiteViews: "",
                activeOrders: "",
                testimonials: "",
                totalRevenue: "",
                notes: "",
            });
        }
        setErrorMsg("");
        setDuplicateWarning(null);
        setForceSave(false);
    }, [editingItem, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent, force = false) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const url = editingItem ? `/api/growth/${editingItem.id}` : "/api/growth";
        const method = editingItem ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recordedAt: form.recordedAt,
                    igFollowers: form.igFollowers !== "" ? Number(form.igFollowers) : null,
                    igViews: form.igViews !== "" ? Number(form.igViews) : null,
                    igPosts: form.igPosts !== "" ? Number(form.igPosts) : null,
                    igLikes: form.igLikes !== "" ? Number(form.igLikes) : null,
                    tiktokFollowers: form.tiktokFollowers !== "" ? Number(form.tiktokFollowers) : null,
                    tiktokViews: form.tiktokViews !== "" ? Number(form.tiktokViews) : null,
                    tiktokPosts: form.tiktokPosts !== "" ? Number(form.tiktokPosts) : null,
                    tiktokLikes: form.tiktokLikes !== "" ? Number(form.tiktokLikes) : null,
                    totalCustomers: form.totalCustomers !== "" ? Number(form.totalCustomers) : null,
                    websiteVisitors: form.websiteVisitors !== "" ? Number(form.websiteVisitors) : null,
                    websiteViews: form.websiteViews !== "" ? Number(form.websiteViews) : null,
                    activeOrders: form.activeOrders !== "" ? Number(form.activeOrders) : null,
                    testimonials: form.testimonials !== "" ? Number(form.testimonials) : null,
                    totalRevenue: form.totalRevenue !== "" ? Number(form.totalRevenue) : null,
                    notes: form.notes || null,
                    force: force || forceSave
                }),
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else if (res.status === 409) {
                const data = await res.json();
                if (data.error === "DUPLICATE_DATE") {
                    setDuplicateWarning(data.message);
                    setForceSave(true);
                } else {
                    setErrorMsg(data.error || "Gagal menyimpan data");
                }
            } else {
                const data = await res.json();
                setErrorMsg(data.error || "Gagal menyimpan data");
            }
        } catch (error) {
            setErrorMsg("Terjadi kesalahan jaringan atau server");
            console.error("Submit error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm overflow-y-auto py-8">
            <div className="max-w-xl w-full rounded-3xl bg-[#111111] p-6 text-white shadow-2xl relative border border-white/10 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">
                        {editingItem ? "Edit" : "Tambah"} Data <span className="text-red-600">Growth</span>
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition cursor-pointer">
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Error message */}
                {errorMsg && (
                    <div className="bg-red-950/40 border border-red-500/50 text-red-400 p-4 rounded-2xl mb-5 text-sm">
                        {errorMsg}
                    </div>
                )}

                {/* Warning message (Duplicate date check) */}
                {duplicateWarning && (
                    <div className="bg-amber-950/40 border border-amber-500/50 text-amber-300 p-4 rounded-2xl mb-5 text-sm flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <FiAlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                            <span className="font-bold">Peringatan Tanggal Duplikat</span>
                        </div>
                        <p>{duplicateWarning}</p>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={loading}
                            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-xl font-bold text-xs transition self-start cursor-pointer disabled:opacity-50"
                        >
                            {loading ? "Menyimpan..." : "Ya, Timpa Data Lama"}
                        </button>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1.5">Tanggal Pencatatan *</label>
                        <input
                            type="date"
                            value={form.recordedAt}
                            onChange={(e) => {
                                setForm({ ...form, recordedAt: e.target.value });
                                setDuplicateWarning(null); // Reset warning if date changes
                                setForceSave(false);
                            }}
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
                            required
                        />
                    </div>

                    {/* Instagram Group */}
                    <div className="border border-white/5 bg-white/5 p-4 rounded-2xl space-y-4">
                        <h4 className="text-sm font-bold text-pink-500 uppercase tracking-wider">Instagram Metrics</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Followers</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.igFollowers}
                                    onChange={(e) => setForm({ ...form, igFollowers: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="e.g. 15200"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Views</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.igViews}
                                    onChange={(e) => setForm({ ...form, igViews: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Views video/reels"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Postingan</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.igPosts}
                                    onChange={(e) => setForm({ ...form, igPosts: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Jumlah postingan"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Likes</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.igLikes}
                                    onChange={(e) => setForm({ ...form, igLikes: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Total likes"
                                />
                            </div>
                        </div>
                    </div>

                    {/* TikTok Group */}
                    <div className="border border-white/5 bg-white/5 p-4 rounded-2xl space-y-4">
                        <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">TikTok Metrics</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Followers</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.tiktokFollowers}
                                    onChange={(e) => setForm({ ...form, tiktokFollowers: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="e.g. 24500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Views</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.tiktokViews}
                                    onChange={(e) => setForm({ ...form, tiktokViews: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Views video"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Postingan</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.tiktokPosts}
                                    onChange={(e) => setForm({ ...form, tiktokPosts: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Jumlah postingan"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Likes</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.tiktokLikes}
                                    onChange={(e) => setForm({ ...form, tiktokLikes: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Total likes"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Website Group */}
                    <div className="border border-white/5 bg-white/5 p-4 rounded-2xl space-y-4">
                        <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Website Metrics</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Pengunjung (Viewer)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.websiteVisitors}
                                    onChange={(e) => setForm({ ...form, websiteVisitors: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Traffic pengunjung"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Views</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.websiteViews}
                                    onChange={(e) => setForm({ ...form, websiteViews: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Views halaman"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sales Group */}
                    <div className="border border-white/5 bg-white/5 p-4 rounded-2xl space-y-4">
                        <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider">Penjualan & Finansial</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Total Customers</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.totalCustomers}
                                    onChange={(e) => setForm({ ...form, totalCustomers: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="e.g. 120"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Order Aktif</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.activeOrders}
                                    onChange={(e) => setForm({ ...form, activeOrders: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Sedang berjalan"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Jumlah Testimoni</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.testimonials}
                                    onChange={(e) => setForm({ ...form, testimonials: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Total ulasan"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">Omzet (Rp)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.totalRevenue}
                                    onChange={(e) => setForm({ ...form, totalRevenue: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Total Omzet"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-1.5">Catatan Tambahan (Opsional)</label>
                        <textarea
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            rows={3}
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            placeholder="Catatan bisnis, kampanye pemasaran, dll..."
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-full bg-white/5 hover:bg-white/10 py-3.5 font-bold transition cursor-pointer text-center"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-full bg-red-600 hover:bg-red-700 py-3.5 font-bold transition shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 cursor-pointer"
                        >
                            {loading ? "Menyimpan..." : duplicateWarning ? "Timpa & Simpan" : "Simpan Data"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
