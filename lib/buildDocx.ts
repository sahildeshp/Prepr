import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  PageBreak,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { Day, MealPlan } from "./types";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  accent:    "2C6E49", // deep green — titles, headers, accents
  accentMid: "4A9068", // mid green — checkbox icons
  accentBg:  "F0F7F3", // light green — info table background
  dark:      "1A1A1A",
  mid:       "3D3D3D",
  soft:      "6B6B6B",
  muted:     "A0A0A0",
  rule:      "E2E2E2",
  tagBg:     "F5F5F5",
  white:     "FFFFFF",
};

// Page margins and content width in DXA (twips)
const MARGIN = 1260;
const CONTENT_WIDTH = 9720; // 12240 − 2×1260

// ─── Border helpers ───────────────────────────────────────────────────────────
const NO_BORDER = {
  top:    { style: BorderStyle.NONE, size: 0, color: C.white },
  bottom: { style: BorderStyle.NONE, size: 0, color: C.white },
  left:   { style: BorderStyle.NONE, size: 0, color: C.white },
  right:  { style: BorderStyle.NONE, size: 0, color: C.white },
};

const RULE_BORDER = {
  top:    { style: BorderStyle.SINGLE, size: 4, color: C.rule },
  bottom: { style: BorderStyle.NONE,   size: 0, color: C.white },
  left:   { style: BorderStyle.NONE,   size: 0, color: C.white },
  right:  { style: BorderStyle.NONE,   size: 0, color: C.white },
};

// ─── Primitive helpers ────────────────────────────────────────────────────────
function spacer(before = 200): Paragraph {
  return new Paragraph({ children: [], spacing: { before } });
}

function sectionHeader(text: string, pageBreakBefore = false): Paragraph {
  return new Paragraph({
    pageBreakBefore,
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: "Arial",
        size: 40, // 20pt
        color: C.accent,
        characterSpacing: 60,
      }),
    ],
    border: RULE_BORDER,
    spacing: { before: 300, after: 140 },
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: "•  ", font: "Arial", size: 38, color: C.accentMid }),
      new TextRun({ text, font: "Arial", size: 38, color: C.mid }),
    ],
    indent: { left: 220, hanging: 220 },
    spacing: { after: 80 },
  });
}

// ─── Page 1: Title ────────────────────────────────────────────────────────────
function titleBlock(): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: "Meal Prep Plan",
          font: "Georgia",
          size: 128, // 64pt
          color: C.accent,
        }),
      ],
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Your weekly plan — cook once, eat well all week.",
          font: "Arial",
          size: 36, // 18pt
          color: C.soft,
        }),
      ],
      spacing: { after: 400 },
    }),
  ];
}

// ─── Page 1: Summary table ────────────────────────────────────────────────────
function summaryTable(plan: MealPlan): Table {
  const headerRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 2200, type: WidthType.DXA },
        shading: { type: ShadingType.SOLID, color: C.accent, fill: C.accent },
        borders: NO_BORDER,
        children: [
          new Paragraph({
            children: [new TextRun({ text: "DAY", font: "Arial", size: 32, bold: true, color: C.white })],
            spacing: { before: 120, after: 120 },
            indent: { left: 140 },
          }),
        ],
      }),
      new TableCell({
        width: { size: 7520, type: WidthType.DXA },
        shading: { type: ShadingType.SOLID, color: C.accent, fill: C.accent },
        borders: NO_BORDER,
        children: [
          new Paragraph({
            children: [new TextRun({ text: "MEAL", font: "Arial", size: 32, bold: true, color: C.white })],
            spacing: { before: 120, after: 120 },
            indent: { left: 140 },
          }),
        ],
      }),
    ],
  });

  const dataRows = plan.days.map((day, i) => {
    const bg = i % 2 === 0 ? C.accentBg : C.white;
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 2200, type: WidthType.DXA },
          shading: { type: ShadingType.SOLID, color: bg, fill: bg },
          borders: NO_BORDER,
          children: [
            new Paragraph({
              children: [new TextRun({ text: day.day, font: "Arial", size: 34, bold: true, color: C.dark })],
              spacing: { before: 100, after: 100 },
              indent: { left: 140 },
            }),
          ],
        }),
        new TableCell({
          width: { size: 7520, type: WidthType.DXA },
          shading: { type: ShadingType.SOLID, color: bg, fill: bg },
          borders: NO_BORDER,
          children: [
            new Paragraph({
              children: [new TextRun({ text: day.mealName, font: "Arial", size: 34, color: C.mid })],
              spacing: { before: 100, after: 100 },
              indent: { left: 140 },
            }),
          ],
        }),
      ],
    });
  });

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [headerRow, ...dataRows],
    borders: {
      top:     { style: BorderStyle.NONE, size: 0, color: C.white },
      bottom:  { style: BorderStyle.NONE, size: 0, color: C.white },
      left:    { style: BorderStyle.NONE, size: 0, color: C.white },
      right:   { style: BorderStyle.NONE, size: 0, color: C.white },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: C.white },
      insideVertical:   { style: BorderStyle.NONE, size: 0, color: C.white },
    },
  });
}

// ─── Page 1: Grocery list (two-column) ───────────────────────────────────────
function grocerySection(title: string, items: string[]): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: title.toUpperCase(),
          font: "Arial",
          size: 34,
          bold: true,
          color: C.accent,
          characterSpacing: 40,
        }),
      ],
      spacing: { before: 220, after: 80 },
    }),
    ...items.map(
      (item) =>
        new Paragraph({
          children: [
            new TextRun({ text: "\u2610  ", font: "Arial", size: 36, color: C.accentMid }),
            new TextRun({ text: item, font: "Arial", size: 36, color: C.mid }),
          ],
          spacing: { after: 60 },
        })
    ),
  ];
}

function groceryTable(plan: MealPlan): Table {
  const gl = plan.groceryList;

  const leftCol = [
    ...grocerySection("Proteins", gl.proteins),
    ...grocerySection("Carbs & Grains", gl.carbsAndGrains),
    ...grocerySection("Vegetables", gl.vegetables),
  ];

  const rightCol = [
    ...grocerySection("Fresh Produce", gl.freshProduce),
    ...grocerySection("Fruits", gl.fruits),
    ...grocerySection("Pantry & Condiments", gl.pantryAndCondiments),
  ];

  // Ensure each column has at least one child
  const ensureChildren = (paragraphs: Paragraph[]): Paragraph[] =>
    paragraphs.length > 0 ? paragraphs : [new Paragraph({ children: [] })];

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 4560, type: WidthType.DXA },
            borders: NO_BORDER,
            children: ensureChildren(leftCol),
          }),
          // Spacer column
          new TableCell({
            width: { size: 300, type: WidthType.DXA },
            borders: NO_BORDER,
            children: [new Paragraph({ children: [] })],
          }),
          new TableCell({
            width: { size: 4500, type: WidthType.DXA },
            borders: NO_BORDER,
            children: ensureChildren(rightCol),
          }),
        ],
      }),
    ],
    borders: {
      top:     { style: BorderStyle.NONE, size: 0, color: C.white },
      bottom:  { style: BorderStyle.NONE, size: 0, color: C.white },
      left:    { style: BorderStyle.NONE, size: 0, color: C.white },
      right:   { style: BorderStyle.NONE, size: 0, color: C.white },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: C.white },
      insideVertical:   { style: BorderStyle.NONE, size: 0, color: C.white },
    },
  });
}

// ─── Page 2: Sunday prep ──────────────────────────────────────────────────────
function sundayPrepPage(plan: MealPlan): Array<Paragraph | Table> {
  const out: Array<Paragraph | Table> = [];

  // Day heading with left green bar accent
  out.push(
    new Paragraph({
      pageBreakBefore: true,
      children: [
        new TextRun({ text: "Sunday Prep", font: "Georgia", size: 68, color: C.dark }),
      ],
      border: {
        left: { style: BorderStyle.SINGLE, size: 28, color: C.accent, space: 12 },
      },
      indent: { left: 240 },
      spacing: { after: 320 },
    })
  );

  out.push(sectionHeader("Chop & Store"));
  plan.sundayPrep.chopAndStore.forEach((item) => out.push(bullet(item)));

  out.push(spacer(240));

  out.push(sectionHeader("Cook Tonight"));
  plan.sundayPrep.cookTonight.forEach((item) => out.push(bullet(item)));

  return out;
}

// ─── Pages 3–N: Day pages ─────────────────────────────────────────────────────
function dayHeading(day: Day, pageBreakBefore: boolean): Paragraph {
  return new Paragraph({
    pageBreakBefore,
    children: [
      new TextRun({ text: day.day, font: "Georgia", size: 68, color: C.dark }),
      new TextRun({ text: "   " + day.mealName, font: "Arial", size: 36, color: C.soft }),
    ],
    border: {
      left: { style: BorderStyle.SINGLE, size: 28, color: C.accent, space: 12 },
    },
    indent: { left: 240 },
    spacing: { after: 280 },
  });
}

function infoTable(day: Day): Table {
  const rows: [string, string][] = [
    ["PROTEIN",    day.protein],
    ["CARB",       day.carb],
    ["VEGETABLES", day.vegetables],
    ["FRUIT",      day.fruit],
  ];

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: rows.map(
      ([label, value]) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 2200, type: WidthType.DXA },
              shading: { type: ShadingType.SOLID, color: C.accentBg, fill: C.accentBg },
              borders: {
                top:    { style: BorderStyle.SINGLE, size: 2, color: C.white },
                bottom: { style: BorderStyle.SINGLE, size: 2, color: C.white },
                left:   { style: BorderStyle.NONE,   size: 0, color: C.white },
                right:  { style: BorderStyle.SINGLE, size: 4, color: C.white },
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: label,
                      font: "Arial",
                      size: 36,
                      bold: true,
                      color: C.accent,
                    }),
                  ],
                  spacing: { before: 120, after: 120 },
                  indent: { left: 160 },
                }),
              ],
            }),
            new TableCell({
              width: { size: 7520, type: WidthType.DXA },
              shading: { type: ShadingType.SOLID, color: C.accentBg, fill: C.accentBg },
              borders: {
                top:    { style: BorderStyle.SINGLE, size: 2, color: C.white },
                bottom: { style: BorderStyle.SINGLE, size: 2, color: C.white },
                left:   { style: BorderStyle.NONE,   size: 0, color: C.white },
                right:  { style: BorderStyle.NONE,   size: 0, color: C.white },
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: value, font: "Arial", size: 36, color: C.mid }),
                  ],
                  spacing: { before: 120, after: 120 },
                  indent: { left: 160 },
                }),
              ],
            }),
          ],
        })
    ),
    borders: {
      top:     { style: BorderStyle.NONE, size: 0, color: C.white },
      bottom:  { style: BorderStyle.NONE, size: 0, color: C.white },
      left:    { style: BorderStyle.NONE, size: 0, color: C.white },
      right:   { style: BorderStyle.NONE, size: 0, color: C.white },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: C.white },
      insideVertical:   { style: BorderStyle.NONE, size: 0, color: C.white },
    },
  });
}

function macrosBar(day: Day): Table {
  const items = [
    { label: "CALORIES", value: day.macros.calories },
    { label: "PROTEIN",  value: `${day.macros.protein}g` },
    { label: "CARBS",    value: `${day.macros.carbs}g` },
    { label: "FAT",      value: `${day.macros.fat}g` },
  ];

  const cellWidth = Math.floor(CONTENT_WIDTH / 4); // 2430 DXA each

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    rows: [
      new TableRow({
        children: items.map((item) =>
          new TableCell({
            width: { size: cellWidth, type: WidthType.DXA },
            shading: { type: ShadingType.SOLID, color: C.tagBg, fill: C.tagBg },
            borders: {
              top:    { style: BorderStyle.SINGLE, size: 4, color: C.rule },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: C.rule },
              left:   { style: BorderStyle.SINGLE, size: 4, color: C.rule },
              right:  { style: BorderStyle.SINGLE, size: 4, color: C.rule },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: item.label,
                    font: "Arial",
                    size: 28, // 14pt
                    color: C.muted,
                    characterSpacing: 30,
                  }),
                ],
                spacing: { before: 140, after: 40 },
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: item.value,
                    font: "Arial",
                    size: 44, // 22pt
                    bold: true,
                    color: C.dark,
                  }),
                ],
                spacing: { after: 140 },
              }),
            ],
          })
        ),
      }),
    ],
    borders: {
      top:     { style: BorderStyle.NONE, size: 0, color: C.white },
      bottom:  { style: BorderStyle.NONE, size: 0, color: C.white },
      left:    { style: BorderStyle.NONE, size: 0, color: C.white },
      right:   { style: BorderStyle.NONE, size: 0, color: C.white },
      insideHorizontal: { style: BorderStyle.NONE,   size: 0, color: C.white },
      insideVertical:   { style: BorderStyle.SINGLE, size: 4, color: C.rule },
    },
  });
}

function dayPage(day: Day, isFirst: boolean, isLast: boolean): Array<Paragraph | Table> {
  const out: Array<Paragraph | Table> = [];

  out.push(dayHeading(day, !isFirst));
  out.push(infoTable(day));
  out.push(spacer(200));
  out.push(macrosBar(day));

  out.push(sectionHeader("Ingredients"));
  day.ingredients.forEach((item) => out.push(bullet(item)));

  out.push(sectionHeader("Cooking Instructions"));
  day.cookingInstructions.forEach((item) => out.push(bullet(item)));

  if (!isLast && day.tonightPrep && day.tonightPrep.length > 0) {
    out.push(sectionHeader("Tonight's Prep for Tomorrow"));
    day.tonightPrep.forEach((item) => out.push(bullet(item)));
  }

  return out;
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function buildDocx(plan: MealPlan): Promise<Buffer> {
  const children: Array<Paragraph | Table> = [];

  // ── Page 1: Title + Summary + Grocery list
  children.push(...titleBlock());
  children.push(sectionHeader("This Week's Meals"));
  children.push(summaryTable(plan));
  children.push(spacer(360));
  children.push(sectionHeader("Grocery List"));
  children.push(groceryTable(plan));

  // ── Page 2: Sunday Prep
  children.push(...sundayPrepPage(plan));

  // ── Pages 3–N: One per day
  plan.days.forEach((day, i) => {
    children.push(...dayPage(day, i === 0, i === plan.days.length - 1));
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top:    MARGIN,
              right:  MARGIN,
              bottom: MARGIN,
              left:   MARGIN,
            },
          },
        },
        children,
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
