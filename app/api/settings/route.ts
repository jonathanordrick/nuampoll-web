import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const settings = await prisma.setting.findMany();
        const settingsMap = settings.reduce((acc: any, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        return NextResponse.json(settingsMap);
    } catch (error: any) {
        console.error("GET /api/settings error:", error);
        return NextResponse.json({ error: "Failed to fetch settings", details: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { key, value } = await req.json();

        const setting = await prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });

        return NextResponse.json(setting);
    } catch (error: any) {
        console.error("POST /api/settings error:", error);
        return NextResponse.json({ error: "Failed to update setting", details: error.message }, { status: 500 });
    }
}
