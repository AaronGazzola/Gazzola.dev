import { NextResponse } from "next/server";
import { parseThemesFromJSON } from "@/app/(components)/ThemeConfiguration.utils";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  try {
    const themes = parseThemesFromJSON();
    return NextResponse.json(themes);
  } catch (error) {
    throw error;
  }
}
