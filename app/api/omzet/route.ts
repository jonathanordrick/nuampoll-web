import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const data = await prisma.omzet.findMany({
        orderBy: { tanggal: 'desc' }
    });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const { nominal, tanggal, metode } = await req.json();
    const newOmzet = await prisma.omzet.create({
        data: {
            nominal: Number(nominal),
            tanggal: new Date(tanggal),
            metode,
        },
    });
    return NextResponse.json(newOmzet);
}