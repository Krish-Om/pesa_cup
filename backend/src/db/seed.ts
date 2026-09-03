import { dbSession } from "../config/database";
import {
  contactMessages,
  fixtures,
  galleryCategories,
  galleryMedia,
  galleryPhotos,
  registrations,
  scorers,
  standings,
  teams,
  tournaments,
} from "./schema";

async function seed() {
  console.log("Seeding database...");

  await dbSession.delete(galleryPhotos);
  await dbSession.delete(galleryMedia);
  await dbSession.delete(galleryCategories);
  await dbSession.delete(registrations);
  await dbSession.delete(scorers);
  await dbSession.delete(standings);
  await dbSession.delete(fixtures);
  await dbSession.delete(teams);
  await dbSession.delete(contactMessages);
  await dbSession.delete(tournaments);

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

  const [currentTournament, completedTournament] = await dbSession
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
  if (!currentTournament || !completedTournament)
    throw new Error("Failed to seed tournaments");

  const seededTeams = await dbSession
    .insert(teams)
    .values(
      ["CSIT Strikers", "BCA Warriors", "BBA Lions", "BIM United"].map(
        (name) => ({
          name,
          captainName: `${name} Captain`,
          captainEmail: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
          captainPhone: "9800000000",
        }),
      ),
    )
    .returning();
  const team = Object.fromEntries(
    seededTeams.map((item) => [item.name, item.id]),
  );

  await dbSession.insert(scorers).values([
    {
      playerName: "Rohan KC",
      teamId: team["CSIT Strikers"],
      tournamentId: currentTournament.id,
      goals: 8,
      assists: 3,
      rank: 1,
      avatar: "/uploads/avatars/rohan.webp",
    },
    {
      playerName: "Bishal Thapa",
      teamId: team["BCA Warriors"],
      tournamentId: currentTournament.id,
      goals: 6,
      assists: 5,
      rank: 2,
      avatar: "/uploads/avatars/bishal.webp",
    },
    {
      playerName: "Anish Maharjan",
      teamId: team["BBA Lions"],
      tournamentId: completedTournament.id,
      goals: 11,
      assists: 2,
      rank: 1,
      avatar: "/uploads/avatars/anish.webp",
    },
  ]);
  await dbSession.insert(fixtures).values([
    {
      homeTeamId: team["CSIT Strikers"],
      awayTeamId: team["BCA Warriors"],
      tournamentId: currentTournament.id,
      date: "2026-10-01",
      time: "10:00 AM",
      venue: "Court A",
    },
    {
      homeTeamId: team["BBA Lions"],
      awayTeamId: team["BIM United"],
      tournamentId: currentTournament.id,
      date: "2026-10-01",
      time: "11:30 AM",
      venue: "Court B",
    },
    {
      homeTeamId: team["CSIT Strikers"],
      awayTeamId: team["BBA Lions"],
      tournamentId: completedTournament.id,
      date: "2026-08-15",
      time: "02:00 PM",
      venue: "Main Ground",
      status: "finished",
      scoreA: 3,
      scoreB: 2,
    },
  ]);
  await dbSession.insert(standings).values([
    {
      teamId: team["CSIT Strikers"],
      tournamentId: currentTournament.id,
      group: "Group A",
      played: 3,
      won: 3,
      goalFor: 9,
      goalAgainst: 2,
      goalDifference: 7,
      points: 9,
      position: 1,
    },
    {
      teamId: team["BCA Warriors"],
      tournamentId: currentTournament.id,
      group: "Group A",
      played: 3,
      won: 2,
      lost: 1,
      goalFor: 6,
      goalAgainst: 4,
      goalDifference: 2,
      points: 6,
      position: 2,
    },
    {
      teamId: team["BBA Lions"],
      tournamentId: currentTournament.id,
      group: "Group A",
      played: 3,
      won: 1,
      lost: 2,
      goalFor: 4,
      goalAgainst: 6,
      goalDifference: -2,
      points: 3,
      position: 3,
    },
  ]);
  await dbSession
    .insert(registrations)
    .values({
      tournamentId: currentTournament.id,
      teamName: "Pesa Cup Newcomers",
      captainName: "Nabin Rai",
      captainEmail: "nabin@example.com",
      captainPhone: "9811111111",
      playerCount: 8,
      status: "PENDING",
      teamId: null,
    });

  const [opening, matchday] = await dbSession
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
  if (!opening || !matchday)
    throw new Error("Failed to seed gallery categories");
  await dbSession.insert(galleryPhotos).values([
    {
      categoryId: opening.id,
      caption: "Chief Guest inaugurating the event",
      imagePath: "/uploads/gallery/opening-1.webp",
      sortOrder: 1,
    },
    {
      categoryId: opening.id,
      caption: "Team captain oath ceremony",
      imagePath: "/uploads/gallery/opening-2.webp",
      sortOrder: 2,
    },
    {
      categoryId: matchday.id,
      caption: "Winning goal celebration by CSIT",
      imagePath: "/uploads/gallery/goal-celebration.webp",
      sortOrder: 1,
    },
  ]);
  await dbSession.insert(galleryMedia).values([
    {
      title: "Opening Banner High-Res",
      description: "Official banner graphic for promotion",
      category: "promo",
      albumId: null,
      mediaUrl: "/uploads/1725300000_banner.webp",
      fileKey: "1725300000_banner.webp",
      mimeType: "image/webp",
      fileSize: 245120,
    },
    {
      title: "Trophy Reveal",
      description: "Unveiling the 2026 winner trophy",
      category: "ceremony",
      albumId: 1,
      mediaUrl: "/uploads/1725300500_trophy.webp",
      fileKey: "1725300500_trophy.webp",
      mimeType: "image/webp",
      fileSize: 312000,
    },
  ]);
  console.log("Seed completed successfully!");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .then(() => process.exit(0));
