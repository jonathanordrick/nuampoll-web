import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { nominal, tanggal, metode } = await req.json();

        const updatedOmzet = await prisma.omzet.update({
            where: { id: parseInt(id) },
            data: {
                nominal: Number(nominal),
                tanggal: new Date(tanggal),
                metode,
            },
        });

        return NextResponse.json(updatedOmzet);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.omzet.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
