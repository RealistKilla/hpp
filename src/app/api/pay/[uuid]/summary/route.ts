import { getQuoteSummarySchema } from "@/app/payin/validation/schema";
import { bvnkApi } from "@/lib/bvnkApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;
  const safeUUID = uuid ? encodeURIComponent(uuid) : null;

  if (!uuid) {
    return new NextResponse("No uuid provided", { status: 400 });
  }

  if (req.method !== "GET") {
    return new NextResponse("Method not allowed", { status: 405 });
  }

  const validationResult = getQuoteSummarySchema.safeParse({ uuid });

  // if (!validationResult.success) {
  //   return new NextResponse(JSON.stringify(validationResult.error), {
  //     status: 400,
  //   });
  // }

  try {
    const response = await bvnkApi.get(`pay/${safeUUID}/summary`);
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
