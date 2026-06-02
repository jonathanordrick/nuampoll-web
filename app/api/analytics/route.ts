import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { path } = body;

        // Mendapatkan IP address dari headers
        const forwardedFor = req.headers.get("x-forwarded-for");
        const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

        // Mendapatkan User Agent
        const userAgent = req.headers.get("user-agent") || "Unknown";

        const visit = await prisma.pageVisit.create({
            data: {
                path: path || "/",
                ip,
                userAgent,
            },
        });

        return NextResponse.json({ success: true, id: visit.id });
    } catch (error: any) {
        console.error("POST /api/analytics error:", error);
        return NextResponse.json({ error: "Failed to record visit", details: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        // 1. Total Page Views (All Time)
        const totalViews = await prisma.pageVisit.count();

        // 2. Unique Visitors (berdasarkan IP)
        const uniqueVisitsGroup = await prisma.pageVisit.groupBy({
            by: ["ip"],
        });
        const uniqueVisitors = uniqueVisitsGroup.length;

        // 3. Views Today (sejak tengah malam hari ini)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const viewsToday = await prisma.pageVisit.count({
            where: {
                createdAt: {
                    gte: todayStart,
                },
            },
        });

        // 4. Views Yesterday
        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        const yesterdayEnd = new Date(todayStart);
        const viewsYesterday = await prisma.pageVisit.count({
            where: {
                createdAt: {
                    gte: yesterdayStart,
                    lt: yesterdayEnd,
                },
            },
        });

        // 5. Views This Month (sejak awal bulan ini)
        const monthStart = new Date(todayStart);
        monthStart.setDate(1);
        const viewsThisMonth = await prisma.pageVisit.count({
            where: {
                createdAt: {
                    gte: monthStart,
                },
            },
        });

        // 6. Chart Data 7d (Kunjungan harian 7 hari terakhir)
        const chartData7d = [];
        for (let i = 6; i >= 0; i--) {
            const start = new Date(todayStart);
            start.setDate(start.getDate() - i);
            const end = new Date(start);
            end.setDate(end.getDate() + 1);

            const count = await prisma.pageVisit.count({
                where: {
                    createdAt: {
                        gte: start,
                        lt: end,
                    },
                },
            });

            const label = start.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
            chartData7d.push({ label, count });
        }

        // 7. Data 30 hari terakhir untuk Grafik Bulanan (diolah dalam memori agar cepat)
        const thirtyDaysAgo = new Date(todayStart);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentVisits = await prisma.pageVisit.findMany({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
            select: {
                createdAt: true,
                userAgent: true,
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        const hourStats = { pagi: 0, siang: 0, sore: 0, malam: 0 };
        const deviceStats = { mobile: 0, desktop: 0 };
        const dayMap30d: { [key: string]: number } = {};

        // Inisialisasi map 30 hari terakhir
        for (let i = 29; i >= 0; i--) {
            const d = new Date(todayStart);
            d.setDate(d.getDate() - i);
            dayMap30d[d.toDateString()] = 0;
        }

        recentVisits.forEach((visit) => {
            // Waktu lokal jam berkunjung (dikonversi ke zona waktu Asia/Jakarta secara aman)
            const hourString = new Date(visit.createdAt).toLocaleTimeString("en-US", {
                timeZone: "Asia/Jakarta",
                hour12: false,
                hour: "2-digit",
            });
            const hour = parseInt(hourString, 10);

            if (hour >= 6 && hour < 12) hourStats.pagi++;
            else if (hour >= 12 && hour < 17) hourStats.siang++;
            else if (hour >= 17 && hour < 21) hourStats.sore++;
            else hourStats.malam++;

            // Deteksi device
            const ua = (visit.userAgent || "").toLowerCase();
            if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone") || ua.includes("ipad")) {
                deviceStats.mobile++;
            } else {
                deviceStats.desktop++;
            }

            // Hitung frekuensi harian
            const visitKey = new Date(visit.createdAt).toDateString();
            if (dayMap30d[visitKey] !== undefined) {
                dayMap30d[visitKey]++;
            }
        });

        const chartData30d = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date(todayStart);
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
            chartData30d.push({ label, count: dayMap30d[d.toDateString()] || 0 });
        }

        // 8. Chart Data All Time (Dikelompokkan per bulan-tahun secara kronologis)
        const allVisits = await prisma.pageVisit.findMany({
            select: {
                createdAt: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        const monthMapAllTime: { [key: string]: number } = {};
        allVisits.forEach((visit) => {
            const date = new Date(visit.createdAt);
            const label = date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
            monthMapAllTime[label] = (monthMapAllTime[label] || 0) + 1;
        });

        const chartDataAllTime = Object.entries(monthMapAllTime).map(([label, count]) => ({
            label,
            count,
        }));

        // 9. Recent logs (10 log kunjungan terakhir)
        const recentLogs = await prisma.pageVisit.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 10,
        });

        return NextResponse.json({
            totalViews,
            uniqueVisitors,
            viewsToday,
            viewsYesterday,
            viewsThisMonth,
            chartData7d,
            chartData30d,
            chartDataAllTime,
            hourStats,
            deviceStats,
            recentLogs,
        });
    } catch (error: any) {
        console.error("GET /api/analytics error:", error);
        return NextResponse.json({ error: "Failed to fetch analytics data", details: error.message }, { status: 500 });
    }
}
