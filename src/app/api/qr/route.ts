import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  const data = req.nextUrl.searchParams.get("data");
  if (!data) {
    return NextResponse.json({ error: "Missing data parameter" }, { status: 400 });
  }

  try {
    const svg = await QRCode.toString(data, {
      type: "svg",
      margin: 2,
      width: 240,
      color: {
        dark: "#111515",
        light: "#f5f5f1",
      },
    });
    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to render QR code" }, { status: 500 });
  }
}
