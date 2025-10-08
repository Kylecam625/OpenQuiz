import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";

// GET user settings
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    let settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId: user.id,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PATCH update user settings
export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const {
      cardsPerSession,
      defaultStudyMode,
      enableNotifications,
      theme,
    } = body;

    // Upsert settings (update if exists, create if doesn't)
    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        ...(cardsPerSession !== undefined && { cardsPerSession }),
        ...(defaultStudyMode !== undefined && { defaultStudyMode }),
        ...(enableNotifications !== undefined && { enableNotifications }),
        ...(theme !== undefined && { theme }),
      },
      create: {
        userId: user.id,
        cardsPerSession: cardsPerSession || 20,
        defaultStudyMode: defaultStudyMode || "flip",
        enableNotifications: enableNotifications !== undefined ? enableNotifications : true,
        theme: theme || "light",
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

