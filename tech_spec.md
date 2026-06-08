===================================================
SPESIFIKASI FITUR: /tahu_walik/growth
Tech Stack: Next.js + Supabase
===================================================

OVERVIEW
--------
Halaman /tahu_walik/growth adalah dashboard pertumbuhan bisnis Tahu Walik.
Admin dapat mencatat dan memvisualisasikan data pertumbuhan dari berbagai metrik
bisnis secara berkala (per tanggal), kemudian melihat tren dalam bentuk line chart.

Halaman ini berada dalam ekosistem yang sudah ada:
- /tahu_walik/dashboard  -> omzet total + CRUD transaksi
- /tahu_walik/analytics  -> analisis pengunjung website
- /tahu_walik/growth     -> (BARU) pencatatan & visualisasi pertumbuhan metrik


===================================================
1. DATABASE - SUPABASE
===================================================

Buat tabel baru di Supabase bernama: growth_metrics

Kolom:
- id              : uuid, primary key, default gen_random_uuid()
- recorded_at     : date, not null  (tanggal pencatatan, bisa diisi manual oleh admin)
- ig_followers    : integer, nullable  (jumlah followers Instagram)
- tiktok_followers: integer, nullable  (jumlah followers TikTok)
- total_customers : integer, nullable  (total customer yang pernah order)
- website_visitors: integer, nullable  (pengunjung website pada periode tersebut)
- active_orders   : integer, nullable  (jumlah customer yang sedang order saat ini)
- testimonials    : integer, nullable  (jumlah testimoni yang masuk)
- total_revenue   : bigint, nullable   (total omzet dalam rupiah)
- notes           : text, nullable     (catatan opsional dari admin)
- created_at      : timestamptz, default now()
- updated_at      : timestamptz, default now()

RLS (Row Level Security):
- Aktifkan RLS pada tabel growth_metrics
- Policy SELECT: allow semua user yang sudah login (authenticated)
- Policy INSERT, UPDATE, DELETE: hanya user dengan role 'admin' atau service_role

SQL untuk membuat tabel:

  CREATE TABLE growth_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recorded_at date NOT NULL,
    ig_followers integer,
    tiktok_followers integer,
    total_customers integer,
    website_visitors integer,
    active_orders integer,
    testimonials integer,
    total_revenue bigint,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  CREATE INDEX idx_growth_metrics_recorded_at ON growth_metrics(recorded_at DESC);


===================================================
2. FILE STRUCTURE - NEXT.JS
===================================================

Buat file-file berikut (sesuaikan dengan struktur proyek yang sudah ada):

  app/tahu_walik/growth/page.tsx
    -> Halaman utama /tahu_walik/growth
    -> Server component, fetch initial data dari Supabase
    -> Render komponen GrowthDashboard

  app/tahu_walik/growth/components/GrowthDashboard.tsx
    -> Client component ('use client')
    -> Mengatur state: data list, form add/edit, selected metrics untuk chart
    -> Menjadi container utama halaman

  app/tahu_walik/growth/components/GrowthChart.tsx
    -> Client component
    -> Menampilkan line chart menggunakan library Recharts (sudah umum di Next.js)
    -> Bisa toggle metrik mana yang ditampilkan

  app/tahu_walik/growth/components/GrowthTable.tsx
    -> Client component
    -> Tabel daftar semua entri data
    -> Tombol Edit dan Delete per baris

  app/tahu_walik/growth/components/GrowthForm.tsx
    -> Client component
    -> Form untuk Add dan Edit data
    -> Bisa berupa modal atau slide-over panel

  app/tahu_walik/growth/actions.ts
    -> Server actions Next.js (atau bisa pakai route handler)
    -> Fungsi: getGrowthMetrics, addGrowthMetric, updateGrowthMetric, deleteGrowthMetric

  lib/supabase/growth.ts  (atau sesuai konvensi project)
    -> Query functions ke Supabase untuk tabel growth_metrics


===================================================
3. FITUR HALAMAN - DETAIL
===================================================

A. HEADER HALAMAN
   - Judul: "Growth Tracker"
   - Subjudul: "Pantau pertumbuhan bisnis Tahu Walik"
   - Tombol "+ Tambah Data" di kanan atas untuk membuka form

B. LINE CHART (bagian atas halaman)

   Library: Recharts (gunakan LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer)

   Fitur chart:
   - Sumbu X: tanggal (recorded_at), diformat "DD MMM YYYY"
   - Sumbu Y: nilai metrik (auto-scale per metrik)
   - Setiap metrik tampil sebagai satu garis dengan warna berbeda
   - Legend di bawah chart, bisa diklik untuk show/hide garis
   - Tooltip saat hover menampilkan semua nilai pada tanggal tersebut
   - Responsive (gunakan ResponsiveContainer width="100%" height={400})

   Metrik yang ditampilkan sebagai garis:
   1. ig_followers      -> label: "Followers IG"       warna: #E1306C (pink Instagram)
   2. tiktok_followers  -> label: "Followers TikTok"   warna: #010101 atau #69C9D0 (tiktok)
   3. total_customers   -> label: "Total Customer"     warna: #3B82F6 (biru)
   4. website_visitors  -> label: "Pengunjung Website" warna: #10B981 (hijau)
   5. active_orders     -> label: "Order Aktif"        warna: #F59E0B (kuning)
   6. testimonials      -> label: "Testimoni"          warna: #8B5CF6 (ungu)
   7. total_revenue     -> label: "Total Omzet (Rp)"   warna: #EF4444 (merah)
                          (nilai ditampilkan di Y axis kanan karena skala beda)

   Kontrol chart:
   - Tombol toggle per metrik (chip/badge yang bisa diklik) di atas chart
   - Default: semua metrik aktif
   - Filter rentang waktu: dropdown pilihan (7 hari terakhir, 30 hari, 90 hari, semua)

C. TABEL DATA (bagian bawah halaman)

   Kolom tabel:
   - Tanggal (recorded_at, format DD/MM/YYYY)
   - Followers IG
   - Followers TikTok
   - Total Customer
   - Pengunjung Website
   - Order Aktif
   - Testimoni
   - Total Omzet (format Rp xxx.xxx.xxx)
   - Catatan
   - Aksi (tombol Edit, tombol Delete)

   Fitur tabel:
   - Urutkan berdasarkan tanggal terbaru di atas (recorded_at DESC)
   - Tampilkan nilai "-" jika data kosong/null
   - Konfirmasi dialog sebelum delete ("Yakin ingin menghapus data tanggal ini?")

D. FORM ADD / EDIT (Modal atau Drawer)

   Tampil sebagai modal overlay atau side drawer.

   Field form:
   - Tanggal*           : input type="date" (required)
   - Followers IG       : input type="number" min=0
   - Followers TikTok   : input type="number" min=0
   - Total Customer     : input type="number" min=0
   - Pengunjung Website : input type="number" min=0
   - Order Aktif        : input type="number" min=0
   - Jumlah Testimoni   : input type="number" min=0
   - Total Omzet (Rp)   : input type="number" min=0
   - Catatan            : textarea (opsional)

   Tombol:
   - "Simpan" -> submit form (add atau update)
   - "Batal"  -> tutup modal tanpa menyimpan

   Validasi:
   - Tanggal wajib diisi
   - Semua field angka harus >= 0 jika diisi
   - Jika tanggal sudah ada di database, tampilkan warning:
     "Data untuk tanggal ini sudah ada. Lanjutkan akan menimpa data lama."
     (atau gunakan upsert berdasarkan recorded_at)

   Behavior:
   - Setelah simpan berhasil: tutup modal, refresh data chart dan tabel, tampilkan toast notifikasi sukses
   - Setelah delete berhasil: refresh data, tampilkan toast notifikasi


===================================================
4. SERVER ACTIONS / API FUNCTIONS
===================================================

File: app/tahu_walik/growth/actions.ts

  getGrowthMetrics(range?: '7d' | '30d' | '90d' | 'all')
    -> Query: SELECT * FROM growth_metrics ORDER BY recorded_at ASC
    -> Filter tanggal jika range diberikan
    -> Return: GrowthMetric[]

  addGrowthMetric(data: GrowthMetricInput)
    -> INSERT INTO growth_metrics (...) VALUES (...)
    -> Gunakan upsert on conflict(recorded_at) DO UPDATE jika ingin support overwrite
    -> Return: GrowthMetric

  updateGrowthMetric(id: string, data: Partial<GrowthMetricInput>)
    -> UPDATE growth_metrics SET ... WHERE id = $id
    -> Update juga kolom updated_at = now()
    -> Return: GrowthMetric

  deleteGrowthMetric(id: string)
    -> DELETE FROM growth_metrics WHERE id = $id
    -> Return: { success: boolean }


===================================================
5. TYPE DEFINITIONS
===================================================

  // types/growth.ts atau di dalam file actions.ts

  export type GrowthMetric = {
    id: string
    recorded_at: string          // format: YYYY-MM-DD
    ig_followers: number | null
    tiktok_followers: number | null
    total_customers: number | null
    website_visitors: number | null
    active_orders: number | null
    testimonials: number | null
    total_revenue: number | null
    notes: string | null
    created_at: string
    updated_at: string
  }

  export type GrowthMetricInput = Omit<GrowthMetric, 'id' | 'created_at' | 'updated_at'>


===================================================
6. STYLING & UI
===================================================

- Ikuti design system yang sudah ada di halaman /tahu_walik/dashboard dan /tahu_walik/analytics
- Gunakan Tailwind CSS (sesuai setup project yang ada)
- Gunakan komponen UI yang sudah ada (Button, Modal, Toast, dll dari shadcn/ui atau library yang dipakai)
- Chart menggunakan Recharts. Jika belum terinstall, jalankan:
    npm install recharts
- Format angka Rupiah menggunakan:
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
- Format angka besar (followers, customers) gunakan:
    new Intl.NumberFormat('id-ID').format(value)


===================================================
7. NAVIGASI
===================================================

Tambahkan link ke /tahu_walik/growth pada sidebar atau navbar yang sudah ada
di layout /tahu_walik. Label: "Growth" atau "Pertumbuhan".
Gunakan ikon yang sesuai, misalnya TrendingUp dari lucide-react.


===================================================
8. CATATAN PENTING UNTUK AGENT
===================================================

1. Cek dulu struktur folder project yang ada sebelum membuat file baru.
   Sesuaikan path dan konvensi penamaan dengan yang sudah dipakai.

2. Cek cara inisialisasi Supabase client yang dipakai di halaman lain
   (mungkin ada di lib/supabase/client.ts atau lib/supabase/server.ts),
   gunakan pola yang sama.

3. Cek apakah project menggunakan App Router atau Pages Router.
   Spesifikasi ini ditulis untuk App Router. Sesuaikan jika Pages Router.

4. Jika sudah ada komponen Modal, Toast, atau Button yang reusable,
   gunakan komponen tersebut daripada membuat baru.

5. Untuk autentikasi admin, ikuti pola yang sudah ada di halaman dashboard.
   Jangan buat sistem auth baru.

6. Recharts perlu di-import sebagai client component ('use client').
   Pastikan GrowthChart.tsx memiliki 'use client' di baris pertama.

7. Data chart harus diurutkan berdasarkan recorded_at ASC agar garis
   terbentuk dari kiri (lama) ke kanan (baru).

===================================================
END OF SPECIFICATION
===================================================