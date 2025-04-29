import { GetQuoteForCurrencyBody } from "@/app/payin/lib/types";
import { getQuoteForCurrencySchema } from "@/app/payin/validation/schema";
import { bvnkApi } from "@/lib/bvnkApi";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;
  const body = (await req.json()) as Omit<GetQuoteForCurrencyBody, "uuid">;
  const safeUUID = uuid ? encodeURIComponent(uuid) : null;

  if (req.method !== "PUT") {
    return new NextResponse("Method not allowed", { status: 405 });
  }

  const validationResult = getQuoteForCurrencySchema.safeParse({
    ...body,
    uuid,
  });

  // if (!validationResult.success) {
  //   return new NextResponse(JSON.stringify(validationResult.error), {
  //     status: 400,
  //   });
  // }

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
