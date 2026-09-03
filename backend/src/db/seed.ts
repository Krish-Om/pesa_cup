import { dbSession } from "../config/database";
import {
  contactMessages,
  fixtures,
  galleryCategories,
  galleryMedia,
  galleryPhotos,
  scorers,
  standings,
  tournaments,
} from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");
  // 1. Contact Messages
  await dbSession.insert(contactMessages).values([
    {
      name: "Suman Shrestha",
      email: "suman.s@example.com",
      subject: "Registration Inquiry",
      message: "When does the registration for the futsal tournament close?",
      status: "new",
    },
    {
      name: "Aarav Sharma",
      email: "aarav@example.com",
      subject: "Sponsorship",
      message: "We would like to sponsor the upcoming Pesa Cup trophy.",
      status: "read",
    },
  ]);

  // 2. Tournaments
  const tournamentRows = await dbSession
      .insert(tournaments)
      .values([
        {
          name: "Pesa Cup Futsal Championship 2026",
          slug: "pesa-cup-futsal-2026",
          startDate: "2026-10-01",
          endDate: "2026-10-05",
          status: "UPCOMING",
          venue: "Samriddhi Futsal Arena",
          organizer: "Sports Committee",
        },
        {
          name: "Inter-Faculty Football League",
          slug: "inter-faculty-football-league",
          startDate: "2026-08-10",
          endDate: "2026-08-20",
          status: "COMPLETED",
          venue: "Main Ground",
          organizer: "Student Club",
        },
      ])
      .returning();

  const tourneyAId = tournamentRows[0]?.id ?? 1;
  const tourneyBId = tournamentRows[1]?.id ?? 2;

  // 3. Scorers
  await dbSession.insert(scorers).values([
    {
      playerName: "Rohan KC",
      teamName: "CSIT Strikers",
      tournamentId: tourneyAId,
      goals: 8,
      assists: 3,
      rank: 1,
      avatar: "/uploads/avatars/rohan.webp",
    },
    {
      playerName: "Bishal Thapa",
      teamName: "BCA Warriors",
      tournamentId: tourneyAId,
      goals: 6,
      assists: 5,
      rank: 2,
      avatar: "/uploads/avatars/bishal.webp",
    },
    {
      playerName: "Anish Maharjan",
      teamName: "BBA Lions",
      tournamentId: tourneyBId,
      goals: 11,
      assists: 2,
      rank: 1,
      avatar: "/uploads/avatars/anish.webp",
    },
  ]);

  // 4. Fixtures (Omit null score fields so Drizzle uses undefined defaults)
  await dbSession.insert(fixtures).values([
    {
      teamA: "CSIT Strikers",
      teamB: "BCA Warriors",
      date: "2026-10-01",
      time: "10:00 AM",
      venue: "Court A",

    },
    {
      teamA: "BBA Lions",
      teamB: "BIM United",
      date: "2026-10-01",
      time: "11:30 AM",
      venue: "Court B",

    },
    {
      teamA: "CSIT Strikers",
      teamB: "BBA Lions",
      date: "2026-08-15",
      time: "02:00 PM",
      venue: "Main Ground",
      scoreA: 3,
      scoreB: 2,
    },
  ]);

  // 5. Standings
  await dbSession.insert(standings).values([
    {
      team: "CSIT Strikers",
      group: "Group A",
      played: 3,
      won: 3,
      draw: 0,
      lost: 0,
      goalFor: 9,
      goalAgainst: 2,
      goalDifference: 7,
      points: 9,
      position: 1,
    },
    {
      team: "BCA Warriors",
      group: "Group A",
      played: 3,
      won: 2,
      draw: 0,
      lost: 1,
      goalFor: 6,
      goalAgainst: 4,
      goalDifference: 2,
      points: 6,
      position: 2,
    },
    {
      team: "BBA Lions",
      group: "Group A",
      played: 3,
      won: 1,
      draw: 0,
      lost: 2,
      goalFor: 4,
      goalAgainst: 6,
      goalDifference: -2,
      points: 3,
      position: 3,
    },
  ]);

  // 6. Gallery Categories
  const categoryRows = await dbSession
      .insert(galleryCategories)
      .values([
        {
          id: "opening-ceremony",
          label: "Opening Ceremony",
          description: "Highlights from the tournament inauguration",
          coverImage: "/uploads/gallery/opening-cover.webp",
          photoCount: 2,
        },
        {
          id: "matchday-1",
          label: "Matchday 1 Highlights",
          description: "Action shots from group stage matches",
          coverImage: "/uploads/gallery/matchday1-cover.webp",
          photoCount: 1,
        },
      ])
      .returning();

  const catOpeningId = categoryRows[0]?.id ?? "opening-ceremony";
  const catMatchesId = categoryRows[1]?.id ?? "matchday-1";

  // 7. Gallery Photos
  await dbSession.insert(galleryPhotos).values([
    {
      categoryId: catOpeningId,
      caption: "Chief Guest inaugurating the event",
      imagePath: "/uploads/gallery/opening-1.webp",
      sortOrder: 1
    },
    {
      categoryId: catOpeningId,
      caption: "Team captain oath ceremony",
      imagePath: "/uploads/gallery/opening-2.webp",
      sortOrder: 2
    },
    {
      categoryId: catMatchesId,
      caption: "Winning goal celebration by CSIT",
      imagePath: "/uploads/gallery/goal-celebration.webp",
      sortOrder: 1
    },
  ]);

  // 8. Gallery Media
  await dbSession.insert(galleryMedia).values([
    {
      title: "Opening Banner High-Res",
      description: "Official banner graphic for promotion",
      category: "promo",
      albumId: null,
      mediaUrl: "/uploads/1725300000_banner.webp",
      fileKey: "1725300000_banner.webp",
      mimeType: "image/webp",
      fileSize: 245120
    },
    {
      title: "Trophy Reveal",
      description: "Unveiling the 2026 winner trophy",
      category: "ceremony",
      albumId: 1,
      mediaUrl: "/uploads/1725300500_trophy.webp",
      fileKey: "1725300500_trophy.webp",
      mimeType: "image/webp",
      fileSize: 312000
    },
  ]);

  console.log("✅ Seed completed successfully!");
}

seed()
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    })
    .then(() => process.exit(0));