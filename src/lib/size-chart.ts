// Derives a size chart from a product's sizes + attributes. Pure + testable.
// Apparel (letter sizes) → body measurements; footwear (numeric) → foot length,
// with kids' vs adult chosen from the "Size Type" attribute.

export type SizeChart = {
  note: string;
  columns: string[];
  rows: string[][];
};

// Approximate body measurements (inches) for standard India apparel sizing.
const APPAREL: Record<string, [string, string, string]> = {
  XS: ["34", "28", "25"],
  S: ["36", "30", "26"],
  M: ["38", "32", "27"],
  L: ["40", "34", "28"],
  XL: ["42", "36", "29"],
  XXL: ["44", "38", "30"],
  "3XL": ["46", "40", "31"],
};

// UK size → approximate foot length (cm).
const FOOT_ADULT: Record<string, string> = {
  "3": "22.0",
  "4": "22.5",
  "5": "23.3",
  "6": "24.1",
  "7": "24.9",
  "8": "25.7",
  "9": "26.5",
  "10": "27.3",
  "11": "28.1",
};

const FOOT_KIDS: Record<string, string> = {
  "6": "14.2",
  "7": "15.0",
  "8": "15.8",
  "9": "16.7",
  "10": "17.5",
  "11": "18.3",
  "12": "19.1",
  "13": "20.0",
};

export function getSizeChart(
  sizes: string[],
  attributes: { label: string; value: string }[] = []
): SizeChart | null {
  if (sizes.length === 0) return null;

  const isNumeric = /^\d/.test(sizes[0]!);

  if (!isNumeric) {
    const rows = sizes
      .filter((s) => APPAREL[s])
      .map((s) => [s, ...APPAREL[s]!]);
    if (rows.length === 0) return null;
    return {
      note: "Approximate body measurements in inches. Actual garment measurements may vary by about ±1 inch.",
      columns: ["Size", "Chest / Bust", "Waist", "Length"],
      rows,
    };
  }

  const sizeType =
    attributes.find((a) => a.label.toLowerCase() === "size type")?.value ?? "";
  const kids = /kid/i.test(sizeType);
  const map = kids ? FOOT_KIDS : FOOT_ADULT;
  const rows = sizes.filter((s) => map[s]).map((s) => [s, map[s]!]);
  if (rows.length === 0) return null;
  return {
    note: "UK sizing. Measure the length of your foot and pick the closest size.",
    columns: [kids ? "UK Kids" : "UK Size", "Foot length (cm)"],
    rows,
  };
}
