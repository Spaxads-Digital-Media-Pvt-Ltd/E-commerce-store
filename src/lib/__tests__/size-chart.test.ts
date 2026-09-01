import { describe, expect, it } from "vitest";
import { getSizeChart } from "@/lib/size-chart";

describe("getSizeChart", () => {
  it("returns null for one-size products", () => {
    expect(getSizeChart([])).toBeNull();
  });

  it("builds an apparel chart for letter sizes", () => {
    const c = getSizeChart(["S", "M", "L"]);
    expect(c?.columns).toContain("Chest / Bust");
    expect(c?.rows).toHaveLength(3);
    expect(c?.rows[0]).toEqual(["S", "36", "30", "26"]);
  });

  it("builds an adult footwear chart for numeric sizes", () => {
    const c = getSizeChart(["6", "7", "8"], [
      { label: "Size Type", value: "UK / India (Men's)" },
    ]);
    expect(c?.columns[0]).toBe("UK Size");
    expect(c?.rows[0]).toEqual(["6", "24.1"]);
  });

  it("uses the kids chart when Size Type says kids", () => {
    const c = getSizeChart(["8", "9"], [
      { label: "Size Type", value: "UK Kids'" },
    ]);
    expect(c?.columns[0]).toBe("UK Kids");
    expect(c?.rows[0]).toEqual(["8", "15.8"]);
  });
});
