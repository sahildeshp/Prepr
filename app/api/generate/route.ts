import { NextRequest, NextResponse } from "next/server";
import { generatePlan } from "@/lib/generatePlan";
import { FormInput } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const input: FormInput = await req.json();
    const plan = await generatePlan(input);
    return NextResponse.json(plan);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
