import { relations } from "drizzle-orm/relations";
import { tournaments, fixtures, teams, galleryCategories, galleryPhotos, scorers, standings, registrations } from "./schema";

export const fixturesRelations = relations(fixtures, ({one}) => ({
	tournament: one(tournaments, {
		fields: [fixtures.tournamentId],
		references: [tournaments.id]
	}),
	team_awayTeamId: one(teams, {
		fields: [fixtures.awayTeamId],
		references: [teams.id],
		relationName: "fixtures_awayTeamId_teams_id"
	}),
	team_homeTeamId: one(teams, {
		fields: [fixtures.homeTeamId],
		references: [teams.id],
		relationName: "fixtures_homeTeamId_teams_id"
	}),
}));

export const tournamentsRelations = relations(tournaments, ({many}) => ({
	fixtures: many(fixtures),
	scorers: many(scorers),
	standings: many(standings),
	registrations: many(registrations),
}));

export const teamsRelations = relations(teams, ({many}) => ({
	fixtures_awayTeamId: many(fixtures, {
		relationName: "fixtures_awayTeamId_teams_id"
	}),
	fixtures_homeTeamId: many(fixtures, {
		relationName: "fixtures_homeTeamId_teams_id"
	}),
	scorers: many(scorers),
	standings: many(standings),
	registrations: many(registrations),
}));

export const galleryPhotosRelations = relations(galleryPhotos, ({one}) => ({
	galleryCategory: one(galleryCategories, {
		fields: [galleryPhotos.categoryId],
		references: [galleryCategories.id]
	}),
}));

export const galleryCategoriesRelations = relations(galleryCategories, ({many}) => ({
	galleryPhotos: many(galleryPhotos),
}));

export const scorersRelations = relations(scorers, ({one}) => ({
	tournament: one(tournaments, {
		fields: [scorers.tournamentId],
		references: [tournaments.id]
	}),
	team: one(teams, {
		fields: [scorers.teamId],
		references: [teams.id]
	}),
}));

export const standingsRelations = relations(standings, ({one}) => ({
	tournament: one(tournaments, {
		fields: [standings.tournamentId],
		references: [tournaments.id]
	}),
	team: one(teams, {
		fields: [standings.teamId],
		references: [teams.id]
	}),
}));

export const registrationsRelations = relations(registrations, ({one}) => ({
	team: one(teams, {
		fields: [registrations.teamId],
		references: [teams.id]
	}),
	tournament: one(tournaments, {
		fields: [registrations.tournamentId],
		references: [tournaments.id]
	}),
}));