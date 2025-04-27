import { Quote } from "@/app/payin/atoms/quote";
import { GetQuoteForCurrencyBody } from "@/app/payin/lib/types";
import { bvnkApi } from "@/lib/bvnkApi";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const body = (await req.json()) as GetQuoteForCurrencyBody;
  const uuid = searchParams.get("uuid");
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
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  }
}
