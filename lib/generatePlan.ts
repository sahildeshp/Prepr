import Anthropic from "@anthropic-ai/sdk";
import { FormInput, MealPlan } from "./types";

const client = new Anthropic();

function buildPrompt(input: FormInput): string {
  const adventurenessLabel = {
    simple: "Simple & familiar",
    moderate: "Moderately adventurous",
    bold: "Bold flavors",
  }[input.adventurousness];

  return `Generate a ${input.planLength}-day meal plan for ${input.servings} people with these preferences:

Proteins available: ${input.proteins.join(", ")}
Carbs available: ${input.carbs.join(", ")}
Dietary restrictions: ${input.restrictions.length ? input.restrictions.join(", ") : "None"}
Flavor profile: ${adventurenessLabel}

Rules:
- Each day must have exactly one meal (dinner, also packed for next-day lunch)
- Every meal must include: a protein, a carb, vegetables, and a fruit (for afternoon snack)
- No protein should repeat more than twice across the plan
- No carb should repeat more than twice across the plan
- Macros are per person per serving
- Include realistic macros (calories, protein in grams, carbs in grams, fat in grams)
- Sunday is always prep day — include what to chop/store on Sunday
- Each weekday (except the last) includes a "Tonight's Prep" note for the next day
- Shrimp and fish must always be cooked fresh the day before eating, never on Sunday
- Eggs should always be cooked fresh, never pre-cooked days in advance

Return JSON with this exact shape — no extra keys, no prose:
{ "days": [{ "day", "mealName", "protein", "carb", "vegetables", "fruit", "macros": { "calories": "Xkcal", "protein": N, "carbs": N, "fat": N }, "ingredients": [...], "cookingInstructions": [...], "tonightPrep": [...] }], "sundayPrep": { "chopAndStore": [...], "cookTonight": [...] }, "groceryList": { "proteins": [...], "carbsAndGrains": [...], "vegetables": [...], "freshProduce": [...], "fruits": [...], "pantryAndCondiments": [...] } }`;
}

async function callClaude(input: FormInput): Promise<MealPlan> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system:
      "You are a meal planning assistant. You create weekly meal plans that are practical, healthy, high-protein, and delicious. You always respond with valid JSON only — no explanation, no markdown. Be concise: keep ingredient lines under 12 words, cooking steps under 25 words each.",
    messages: [{ role: "user", content: buildPrompt(input) }],
  });

  if (message.stop_reason === "max_tokens") {
    throw new Error("Response was truncated — retrying");
  }

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Strip any accidental markdown fences before parsing
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  return JSON.parse(cleaned) as MealPlan;
}

export async function generatePlan(input: FormInput): Promise<MealPlan> {
  try {
    return await callClaude(input);
  } catch {
    // Retry once before surfacing the error
    return await callClaude(input);
  }
}
