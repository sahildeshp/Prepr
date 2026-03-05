import { NextRequest, NextResponse } from "next/server";
import { buildDocx } from "@/lib/buildDocx";
import { MealPlan } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const plan: MealPlan = await req.json();
    const buffer = await buildDocx(plan);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="meal-prep-plan.docx"',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
