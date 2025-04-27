import { Quote } from "@/app/payin/atoms/quote";
import { GetQuoteForCurrencyBody } from "@/app/payin/lib/types";
import { bvnkApi } from "@/lib/bvnkApi";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;
  const searchParams = req.nextUrl.searchParams;
  const body = (await req.json()) as GetQuoteForCurrencyBody;
  const safeUUID = uuid ? encodeURIComponent(uuid) : null;

  if (!uuid) {
    return new NextResponse("No uuid provided", { status: 400 });
  }

  try {
    const response = await bvnkApi.put<Quote>(
      `pay/${safeUUID}/accept/summary`,
      body
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response.data.error },
      {
        status: error.response.status,
      }
    );
  }
}
