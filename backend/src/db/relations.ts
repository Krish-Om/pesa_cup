import { relations } from "drizzle-orm";
import {
  contactMessages,
  fixtures,
  galleryCategories,
  galleryPhotos,
  registrations,
  scorers,
  standings,
  teams,
  tournaments,
} from "./schema";

export const tournamentsRelations = relations(tournaments, ({ many }) => ({
  registrations: many(registrations),
  fixtures: many(fixtures),
  standings: many(standings),
  scorers: many(scorers),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  registrations: many(registrations),
  homeFixtures: many(fixtures, { relationName: "homeTeam" }),
  awayFixtures: many(fixtures, { relationName: "awayTeam" }),
  standings: many(standings),
  scorers: many(scorers),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  tournament: one(tournaments, {
    fields: [registrations.tournamentId],
    references: [tournaments.id],
  }),
  team: one(teams, {
    fields: [registrations.teamId],
    references: [teams.id],
  }),
}));

export const fixturesRelations = relations(fixtures, ({ one }) => ({
  homeTeam: one(teams, {
    fields: [fixtures.homeTeamId],
    references: [teams.id],
    relationName: "homeTeam",
  }),
  awayTeam: one(teams, {
    fields: [fixtures.awayTeamId],
    references: [teams.id],
    relationName: "awayTeam",
  }),
  tournament: one(tournaments, {
    fields: [fixtures.tournamentId],
    references: [tournaments.id],
  }),
}));

export const standingsRelations = relations(standings, ({ one }) => ({
  team: one(teams, {
    fields: [standings.teamId],
    references: [teams.id],
  }),
  tournament: one(tournaments, {
    fields: [standings.tournamentId],
    references: [tournaments.id],
  }),
}));

export const scorersRelations = relations(scorers, ({ one }) => ({
  team: one(teams, {
    fields: [scorers.teamId],
    references: [teams.id],
  }),
  tournament: one(tournaments, {
    fields: [scorers.tournamentId],
    references: [tournaments.id],
  }),
}));

export const galleryPhotosRelations = relations(galleryPhotos, ({ one }) => ({
  galleryCategory: one(galleryCategories, {
    fields: [galleryPhotos.categoryId],
    references: [galleryCategories.id],
  }),
}));

export const galleryCategoriesRelations = relations(
  galleryCategories,
  ({ many }) => ({
    galleryPhotos: many(galleryPhotos),
  }),
);

export const contactMessagesRelations = relations(contactMessages, () => ({}));
