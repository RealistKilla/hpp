import { GetQuoteForCurrencyBody } from "@/app/payin/lib/types";
import { bvnkApi } from "@/lib/bvnkApi";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  console.log("PUT");
  const { uuid } = await params;
  const body = (await req.json()) as Omit<GetQuoteForCurrencyBody, "uuid">;
  const safeUUID = uuid ? encodeURIComponent(uuid) : null;

  if (!uuid) {
    return new NextResponse("No uuid provided", { status: 400 });
  }

  try {
    const response = await bvnkApi.put(`pay/${safeUUID}/update/summary`, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response.data },
      {
        status: error.response.status,
      }
    );
  }
}
