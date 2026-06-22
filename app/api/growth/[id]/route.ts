import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const {
            recordedAt,
            igFollowers,
            igViews,
            igPosts,
            igLikes,
            tiktokFollowers,
            tiktokViews,
            tiktokPosts,
            tiktokLikes,
            totalCustomers,
            websiteVisitors,
            websiteViews,
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

        // Cari entri lain yang memiliki tanggal yang sama
        const duplicate = await prisma.growthMetric.findFirst({
            where: {
                recordedAt: parsedDate,
                id: { not: id }
            }
        });

        if (duplicate) {
            if (!force) {
                return NextResponse.json(
                    {
                        error: "DUPLICATE_DATE",
                        message: "Data untuk tanggal ini sudah ada di entri lain. Lanjutkan akan menghapus entri lain tersebut dan menggantinya dengan entri ini."
                    },
                    { status: 409 }
                );
            } else {
                // Hapus entri lain yang duplikat agar constraint unik terpenuhi
                await prisma.growthMetric.delete({
                    where: { id: duplicate.id }
                });
            }
        }

        const updated = await prisma.growthMetric.update({
            where: { id },
            data: {
                recordedAt: parsedDate,
                igFollowers: igFollowers !== "" && igFollowers !== null && igFollowers !== undefined ? Number(igFollowers) : null,
                igViews: igViews !== "" && igViews !== null && igViews !== undefined ? Number(igViews) : null,
                igPosts: igPosts !== "" && igPosts !== null && igPosts !== undefined ? Number(igPosts) : null,
                igLikes: igLikes !== "" && igLikes !== null && igLikes !== undefined ? Number(igLikes) : null,
                tiktokFollowers: tiktokFollowers !== "" && tiktokFollowers !== null && tiktokFollowers !== undefined ? Number(tiktokFollowers) : null,
                tiktokViews: tiktokViews !== "" && tiktokViews !== null && tiktokViews !== undefined ? Number(tiktokViews) : null,
                tiktokPosts: tiktokPosts !== "" && tiktokPosts !== null && tiktokPosts !== undefined ? Number(tiktokPosts) : null,
                tiktokLikes: tiktokLikes !== "" && tiktokLikes !== null && tiktokLikes !== undefined ? Number(tiktokLikes) : null,
                totalCustomers: totalCustomers !== "" && totalCustomers !== null && totalCustomers !== undefined ? Number(totalCustomers) : null,
                websiteVisitors: websiteVisitors !== "" && websiteVisitors !== null && websiteVisitors !== undefined ? Number(websiteVisitors) : null,
                websiteViews: websiteViews !== "" && websiteViews !== null && websiteViews !== undefined ? Number(websiteViews) : null,
                activeOrders: activeOrders !== "" && activeOrders !== null && activeOrders !== undefined ? Number(activeOrders) : null,
                testimonials: testimonials !== "" && testimonials !== null && testimonials !== undefined ? Number(testimonials) : null,
                totalRevenue: totalRevenue !== "" && totalRevenue !== null && totalRevenue !== undefined ? BigInt(totalRevenue) : null,
                notes: notes || null,
                updatedAt: new Date()
            }
        });

        return NextResponse.json(serializeBigInt(updated));
    } catch (error: any) {
        console.error(`PUT /api/growth/[id] error:`, error);
        return NextResponse.json({ error: "Failed to update growth metric", details: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.growthMetric.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "Deleted successfully" });
    } catch (error: any) {
        console.error(`DELETE /api/growth/[id] error:`, error);
        return NextResponse.json({ error: "Failed to delete growth metric", details: error.message }, { status: 500 });
    }
}
