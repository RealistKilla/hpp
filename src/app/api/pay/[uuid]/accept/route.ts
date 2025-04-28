import { Quote } from "@/app/payin/lib/types";
import { AcceptQuoteForCurrencyBody } from "@/app/payin/lib/types";
import { bvnkApi } from "@/lib/bvnkApi";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;
  const body = (await req.json()) as Omit<AcceptQuoteForCurrencyBody, "uuid">;
  const safeUUID = uuid ? encodeURIComponent(uuid) : null;

  if (!uuid) {
    return new NextResponse("No uuid provided", { status: 400 });
  }

  try {
    const response: AxiosResponse<Quote> = await bvnkApi.put<Quote>(
      `pay/${safeUUID}/accept/summary`,
      body
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log("this is the real error", error.response.data);
    return NextResponse.json(
      { error: error.response.data.error },
      {
        status: error.response.status,
      }
    );
  }
}
