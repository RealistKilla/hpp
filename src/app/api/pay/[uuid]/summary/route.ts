import { bvnkApi } from "@/lib/bvnkApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const uuid = searchParams.get("uuid");
  const safeUUID = uuid ? encodeURIComponent(uuid) : null;

  if (!uuid) {
    return new NextResponse("No uuid provided", { status: 400 });
  }

  try {
    const response = await bvnkApi.get(`pay/${safeUUID}/summary`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  }
}
