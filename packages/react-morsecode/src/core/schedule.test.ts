import { describe, expect, it } from "vitest";
import { buildSchedule } from "./schedule.js";

const DOT = 0.1;

describe("buildSchedule", () => {
  it("returns an empty schedule for an empty morse string", () => {
    const schedule = buildSchedule("", { dotSeconds: DOT });
    expect(schedule.pulses).toEqual([]);
    expect(schedule.duration).toBe(0);
  });

  it("schedules a dot as one dot-length pulse", () => {
    const schedule = buildSchedule(".", { dotSeconds: DOT });
    expect(schedule.pulses).toEqual([{ start: 0, duration: DOT }]);
    expect(schedule.duration).toBeCloseTo(DOT);
  });

  it("schedules a dash as three dot-lengths", () => {
    const schedule = buildSchedule("-", { dotSeconds: DOT });
    expect(schedule.pulses).toEqual([{ start: 0, duration: 3 * DOT }]);
  });

  it("puts one dot of silence between symbols", () => {
    // "A" = .-  → dot(1) gap(1) dash(3) = 5 dots total
    const schedule = buildSchedule(".-", { dotSeconds: DOT });
    expect(schedule.pulses).toEqual([
      { start: 0, duration: DOT },
      { start: 2 * DOT, duration: 3 * DOT },
    ]);
    expect(schedule.duration).toBeCloseTo(5 * DOT);
  });

  it("puts three dots of silence between letters", () => {
    // "EE" = ". ." → dot(1) letter-gap(3) dot(1) = 5 dots total
    const schedule = buildSchedule(". .", { dotSeconds: DOT });
    expect(schedule.pulses).toEqual([
      { start: 0, duration: DOT },
      { start: 4 * DOT, duration: DOT },
    ]);
  });

  it("puts seven dots of silence between words", () => {
    // "E E" = ". / ." → dot(1) word-gap(7) dot(1) = 9 dots total
    const schedule = buildSchedule(". / .", { dotSeconds: DOT });
    expect(schedule.pulses).toEqual([
      { start: 0, duration: DOT },
      { start: 8 * DOT, duration: DOT },
    ]);
    expect(schedule.duration).toBeCloseTo(9 * DOT);
  });

  it("ignores characters that are not dots or dashes", () => {
    const schedule = buildSchedule(".x.", { dotSeconds: DOT });
    expect(schedule.pulses).toHaveLength(2);
  });
});
