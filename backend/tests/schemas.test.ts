import { describe, expect, test } from "bun:test";
import { insertContactSchema } from "../src/modules/contact/contacts.schema";
import { insertFixtureSchema } from "../src/modules/fixtures/fixture.schema";
import { insertRegistrationSchema } from "../src/modules/registrations/registrations.schema";
import { insertStandingSchema } from "../src/modules/standings/standings.schema";

const fixture = {
  homeTeamId: 1,
  awayTeamId: 2,
  tournamentId: 1,
  date: "2026-09-05",
  time: "18:30",
  venue: "Main court",
};

describe("module schemas", () => {
  test("applies fixture defaults and rejects invalid dates, scores, and IDs", () => {
    expect(insertFixtureSchema.parse(fixture)).toMatchObject({
      status: "upcoming",
    });
    expect(() =>
      insertFixtureSchema.parse({ ...fixture, date: "05/09/2026" }),
    ).toThrow();
    expect(() =>
      insertFixtureSchema.parse({ ...fixture, scoreA: -1 }),
    ).toThrow();
    expect(() =>
      insertFixtureSchema.parse({ ...fixture, homeTeamId: 0 }),
    ).toThrow();
  });

  test("applies standing statistic defaults and preserves partial updates", () => {
    expect(
      insertStandingSchema.parse({
        teamId: 1,
        tournamentId: 1,
        group: " Group A ",
      }),
    ).toMatchObject({
      group: "Group A",
      played: 0,
      won: 0,
      points: 0,
    });
    expect(insertStandingSchema.partial().parse({ points: 3 })).toMatchObject({
      points: 3,
      played: 0,
      won: 0,
      draw: 0,
      lost: 0,
    });
    expect(() =>
      insertStandingSchema.parse({ teamId: 1, tournamentId: 1, group: "" }),
    ).toThrow();
  });

  test("validates contact messages and email addresses", () => {
    const payload = {
      name: "Alex",
      email: "alex@example.com",
      subject: "Question",
      message: "Please contact me.",
    };
    expect(insertContactSchema.parse(payload)).toMatchObject(payload);
    expect(() =>
      insertContactSchema.parse({ ...payload, email: "invalid" }),
    ).toThrow();
    expect(() =>
      insertContactSchema.parse({ ...payload, message: "" }),
    ).toThrow();
  });

  test("applies registration payment defaults and validates required fields", () => {
    const payload = {
      tournamentId: 1,
      teamName: "Falcons",
      captainName: "Alex",
      captainEmail: "alex@example.com",
      captainPhone: "9812345678",
      playerCount: 8,
      batchYear: "2026",
      transactionUuid: "txn-1",
      amountPaid: 5000,
    };
    expect(insertRegistrationSchema.parse(payload)).toMatchObject({
      paymentMethod: "ESEWA",
      status: "PENDING",
    });
    expect(() =>
      insertRegistrationSchema.parse({ ...payload, amountPaid: 0 }),
    ).toThrow();
    expect(() =>
      insertRegistrationSchema.parse({ ...payload, captainEmail: "invalid" }),
    ).toThrow();
  });
});
