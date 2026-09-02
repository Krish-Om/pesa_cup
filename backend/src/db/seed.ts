import { dbSession } from "../config/database";

// src/db/seed.ts
import {
  fixtures,
  scorers,
  standings,
  galleryCategories,
  galleryPhotos,
  contactMessages,
} from "./schema";

import { count } from "drizzle-orm";

export async function seedFixtures(): Promise<void> {
  const [result] = await dbSession
    .select({ value: count() })
    .from(fixtures);
  const existingCount = result?.value ?? 0;

  if (existingCount > 0) {
    console.log(
      `Fixtures table already has ${existingCount} records. Skipping seeding.`,
    );
    return;
  }

  await dbSession.insert(fixtures).values([
    {
      teamA: 'Rising Stars',
      teamB: 'Eagles FC',
      date: '2026-06-15',
      time: '14:00',
      venue: 'Prabhat Sports Complex',
      status: 'upcoming',
      scoreA: null,
      scoreB: null,
    },
    {
      teamA: 'Pioneers FC',
      teamB: 'Unity FC',
      date: '2026-06-15',
      time: '16:00',
      venue: 'Prabhat Sports Complex',
      status: 'upcoming',
      scoreA: null,
      scoreB: null,
    },
    {
      teamA: "Batch '18 FC",
      teamB: 'Alumni United',
      date: '2026-06-16',
      time: '14:00',
      venue: 'Prabhat Sports Complex',
      status: 'finished',
      scoreA: 3,
      scoreB: 2,
    },
    {
      teamA: 'Phoenix SC',
      teamB: 'Titan Kings',
      date: '2026-06-16',
      time: '16:00',
      venue: 'Prabhat Sports Complex',
      status: 'finished',
      scoreA: 4,
      scoreB: 1,
    },
    {
      teamA: 'Elite Warriors',
      teamB: 'Metro Strikers',
      date: '2026-06-17',
      time: '14:00',
      venue: 'Prabhat Sports Complex',
      status: 'finished',
      scoreA: 5,
      scoreB: 2,
    },
    {
      teamA: 'Legacy Green',
      teamB: 'Fusion United',
      date: '2026-06-17',
      time: '16:00',
      venue: 'Prabhat Sports Complex',
      status: 'finished',
      scoreA: 3,
      scoreB: 1,
    },
  ]);
}

export async function seedScorers(): Promise<void> {
  const [result] = await dbSession.select({ value: count() }).from(scorers);
  const existingCount = result?.value ?? 0;
  
  if (existingCount > 0) {
    console.log(
      `Scorers table already has ${existingCount} records. Skipping seeding.`,
    );
    return;
  }

  await dbSession.insert(scorers).values([{ name: 'Aakash Sharma', team: 'Rising Stars', goals: 14, assists: 6, rank: 1, avatar: 'AS' },
    { name: 'Bikram Thapa', team: 'Phoenix SC', goals: 12, assists: 8, rank: 2, avatar: 'BT' },
    { name: 'Chirag Rai', team: "Batch '18 FC", goals: 10, assists: 5, rank: 3, avatar: 'CR' },
    { name: 'Deepak Gurung', team: 'Legacy Green', goals: 9, assists: 7, rank: 4, avatar: 'DG' },
    { name: 'Eshan Karki', team: 'Eagles FC', goals: 8, assists: 4, rank: 5, avatar: 'EK' },
    { name: 'Firoz Malla', team: 'Titan Kings', goals: 7, assists: 9, rank: 6, avatar: 'FM' },
    { name: 'Gaurav Shrestha', team: 'Alumni United', goals: 7, assists: 3, rank: 7, avatar: 'GS' },
    { name: 'Hari Basnet', team: 'Fusion United', goals: 6, assists: 6, rank: 8, avatar: 'HB' },
  ]);
  console.log("Scorers table seeded successfully.");
}

export async function seedStandings(): Promise<void> {
  const [result] = await dbSession.select({ value: count() }).from(standings);
  const existingCount = result?.value ?? 0;

  if (existingCount > 0) {
    console.log(
      `Standings table already has ${existingCount} records. Skipping seeding.`,
    );
    return;
  }
  
 await dbSession.insert(standings).values([
    { group: 'groupA', position: 1, team: 'Rising Stars', played: 5, won: 4, draw: 0, lost: 1, goalFor: 15, goalAgainst: 7, goalDifference: 8, points: 12 },
    { group: 'groupA', position: 2, team: 'Phoenix SC', played: 5, won: 3, draw: 1, lost: 1, goalFor: 12, goalAgainst: 8, goalDifference: 4, points: 10 },
    { group: 'groupA', position: 3, team: "Batch '18 FC", played: 5, won: 3, draw: 0, lost: 2, goalFor: 10, goalAgainst: 9, goalDifference: 1, points: 9 },
    { group: 'groupA', position: 4, team: 'Legacy Green', played: 5, won: 2, draw: 1, lost: 2, goalFor: 8, goalAgainst: 10, goalDifference: -2, points: 7 },
    { group: 'groupB', position: 1, team: 'Eagles FC', played: 5, won: 2, draw: 0, lost: 3, goalFor: 9, goalAgainst: 12, goalDifference: -3, points: 6 },
    { group: 'groupB', position: 2, team: 'Titan Kings', played: 5, won: 1, draw: 2, lost: 2, goalFor: 7, goalAgainst: 11, goalDifference: -4, points: 5 },
    { group: 'groupB', position: 3, team: 'Alumni United', played: 5, won: 1, draw: 1, lost: 3, goalFor: 6, goalAgainst: 13, goalDifference: -7, points: 4 },
    { group: 'groupB', position: 4, team: 'Fusion United', played: 5, won: 0, draw: 1, lost: 4, goalFor: 5, goalAgainst: 14, goalDifference: -9, points: 1 },
  ]);

  console.log("Standings table seeded successfully.");
}

export async function seedGalleryCategories(): Promise<void> {
  const [result] = await dbSession.select({ value: count() }).from(galleryCategories);
  const existingCount = result?.value ?? 0;
  
  if (existingCount > 0) {
    console.log(
      `Gallery Categories table already has ${existingCount} records. Skipping seeding.`,
    );
    return;
  }
  await dbSession.insert(galleryCategories).values([
    {
      id: 'tournament-moments',
      label: 'Tournament Moments',
      description: 'Highlights and memorable moments from the tournament',
      coverImage: '/gallery/tournament-moments-cover.jpg',
      photoCount: 2,
    },
    {
      id: 'team-photos',
      label: 'Team Photos',
      description: 'Team pictures and group photos',
      coverImage: '/gallery/team-photos-cover.jpg',
      photoCount: 2,
    },
    {
      id: 'match-action',
      label: 'Match Action',
      description: 'In-game action shots and plays',
      coverImage: '/gallery/match-action-cover.jpg',
      photoCount: 2,
    },
    {
      id: 'awards-ceremony',
      label: 'Awards Ceremony',
      description: 'Prize distribution and awards event',
      coverImage: '/gallery/awards-ceremony-cover.jpg',
      photoCount: 2,
    },
  ]);

  console.log('✓ Gallery categories seeded successfully');
}

export async function seedGalleryPhotos(): Promise<void> {
  const [result] = await dbSession.select({ value: count() }).from(galleryPhotos);
  const existingCount = result?.value ?? 0;
  
  if (existingCount > 0) {
    console.log(
      `Gallery Photos table already has ${existingCount} records. Skipping seeding.`,
    );
    return;
  }
  await dbSession.insert(galleryPhotos).values([
    { categoryId: 'tournament-moments', caption: 'Opening ceremony parade', imagePath: '/gallery/photos/tournament-moments-1.jpg', sortOrder: 1 },
    { categoryId: 'tournament-moments', caption: 'Crowd celebration', imagePath: '/gallery/photos/tournament-moments-2.jpg', sortOrder: 2 },
    { categoryId: 'team-photos', caption: 'Rising Stars team', imagePath: '/gallery/photos/team-photos-1.jpg', sortOrder: 1 },
    { categoryId: 'team-photos', caption: 'Phoenix SC squad', imagePath: '/gallery/photos/team-photos-2.jpg', sortOrder: 2 },
    { categoryId: 'match-action', caption: 'Goal celebration', imagePath: '/gallery/photos/match-action-1.jpg', sortOrder: 1 },
    { categoryId: 'match-action', caption: 'Defensive play', imagePath: '/gallery/photos/match-action-2.jpg', sortOrder: 2 },
    { categoryId: 'awards-ceremony', caption: 'Trophy presentation', imagePath: '/gallery/photos/awards-ceremony-1.jpg', sortOrder: 1 },
    { categoryId: 'awards-ceremony', caption: 'Winners group photo', imagePath: '/gallery/photos/awards-ceremony-2.jpg', sortOrder: 2 },
  ]);

  console.log('✓ Gallery photos seeded successfully');
}

export async function seedContactMessages(): Promise<void> {
  const [result] = await dbSession.select({ value: count() }).from(contactMessages);
  const existingCount = result?.value ?? 0;
  
  if (existingCount > 0) {
    console.log(
      `Contact Messages table already has ${existingCount} records. Skipping seeding.`,
    );
    return;
  }
  await dbSession.insert(contactMessages).values([
    { name: 'John Doe', email: 'john@example.com', subject: 'Tournament Inquiry', message: 'I would like to register my team for the next tournament.', status: 'new' },
    { name: 'Jane Smith', email: 'jane@example.com', subject: 'Sponsorship Opportunity', message: 'We are interested in sponsoring the tournament.', status: 'read' },
    { name: 'Ram Sharma', email: 'ram@example.com', subject: 'Ticket Inquiry', message: 'How can I purchase tickets for the final match?', status: 'read' },
    { name: 'Priya Patel', email: 'priya@example.com', subject: 'Media Coverage', message: 'Can you provide media access for tournament coverage?', status: 'new' },
  ]);

  console.log('✓ Contact messages seeded successfully');
}

export async function seedAll(): Promise<void> {
  console.log('Starting database seeding...');
  await seedFixtures();
  await seedScorers();
  await seedStandings();
  await seedGalleryCategories();
  await seedGalleryPhotos();
  await seedContactMessages();
  
  console.log('Database seeding completed.');

}

if(import.meta.main){
  seedAll().then(()=>process.exit(0)).catch((err)=>{
    console.error('Error during seeding:', err);
    process.exit(1);
  })
}
