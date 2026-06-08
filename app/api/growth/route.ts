import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper untuk mengubah BigInt menjadi Number agar aman saat diserialisasi ke JSON, serta menangani objek Date
function serializeBigInt(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'bigint') return Number(obj);
    if (obj instanceof Date) return obj.toISOString();
    if (Array.isArray(obj)) return obj.map(serializeBigInt);
    if (typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, val]) => [key, serializeBigInt(val)])
        );
    }
    return obj;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const range = searchParams.get("range") || "all";

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        let whereClause = {};

        if (range === "7d") {
            const dateLimit = new Date(now);
            dateLimit.setDate(dateLimit.getDate() - 7);
            whereClause = { recordedAt: { gte: dateLimit } };
        } else if (range === "30d") {
            const dateLimit = new Date(now);
            dateLimit.setDate(dateLimit.getDate() - 30);
            whereClause = { recordedAt: { gte: dateLimit } };
        } else if (range === "90d") {
            const dateLimit = new Date(now);
            dateLimit.setDate(dateLimit.getDate() - 90);
            whereClause = { recordedAt: { gte: dateLimit } };
        }

        const metrics = await prisma.growthMetric.findMany({
            where: whereClause,
            orderBy: { recordedAt: "asc" }
        });

        return NextResponse.json(serializeBigInt(metrics));
    } catch (error: any) {
        console.error("GET /api/growth error:", error);
        return NextResponse.json({ error: "Failed to fetch growth metrics", details: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            recordedAt,
            igFollowers,
            tiktokFollowers,
            totalCustomers,
            websiteVisitors,
            activeOrders,
            testimonials,
            totalRevenue,
            notes,
            force
        } = body;

        if (!recordedAt) {
            return NextResponse.json({ error: "Tanggal wajib diisi" }, { status: 400 });
        }

        const parsedDate = new Date(recordedAt);
        parsedDate.setHours(0, 0, 0, 0);

        // Jika tidak dipaksa (force), cek apakah sudah ada data untuk tanggal ini
        if (!force) {
            const existing = await prisma.growthMetric.findFirst({
                where: { recordedAt: parsedDate }
            });
            if (existing) {
                return NextResponse.json(
                    {
                        error: "DUPLICATE_DATE",
                        message: "Data untuk tanggal ini sudah ada. Lanjutkan akan menimpa data lama."
                    },
                    { status: 409 }
                );
            }
        }

        const dataObj = {
            recordedAt: parsedDate,
            igFollowers: igFollowers !== "" && igFollowers !== null && igFollowers !== undefined ? Number(igFollowers) : null,
            tiktokFollowers: tiktokFollowers !== "" && tiktokFollowers !== null && tiktokFollowers !== undefined ? Number(tiktokFollowers) : null,
            totalCustomers: totalCustomers !== "" && totalCustomers !== null && totalCustomers !== undefined ? Number(totalCustomers) : null,
            websiteVisitors: websiteVisitors !== "" && websiteVisitors !== null && websiteVisitors !== undefined ? Number(websiteVisitors) : null,
            activeOrders: activeOrders !== "" && activeOrders !== null && activeOrders !== undefined ? Number(activeOrders) : null,
            testimonials: testimonials !== "" && testimonials !== null && testimonials !== undefined ? Number(testimonials) : null,
            totalRevenue: totalRevenue !== "" && totalRevenue !== null && totalRevenue !== undefined ? BigInt(totalRevenue) : null,
            notes: notes || null,
        };

        const result = await prisma.growthMetric.upsert({
            where: { recordedAt: parsedDate },
            create: dataObj,
            update: {
                ...dataObj,
                updatedAt: new Date()
            }
        });

        return NextResponse.json(serializeBigInt(result));
    } catch (error: any) {
        console.error("POST /api/growth error:", error);
        return NextResponse.json({ error: "Failed to save growth metric", details: error.message }, { status: 500 });
    }
}
