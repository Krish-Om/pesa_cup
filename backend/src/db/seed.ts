import dbSession from "../config/database";

export async function seedFixtures(): Promise<void> {
  const fixturesData = [
    {
      teamA: "Rising Stars",
      teamB: "Eagles FC",
      date: "2025-06-15",
      time: "14:00",
      venue: "Prabhat Sports Complex",
      status: "upcoming",
      scoreA: null,
      scoreB: null,
    },
    {
      teamA: "Pioneers FC",
      teamB: "Unity FC",
      date: "2025-06-15",
      time: "16:00",
      venue: "Prabhat Sports Complex",
      status: "upcoming",
      scoreA: null,
      scoreB: null,
    },
    {
      teamA: "Batch '18 FC",
      teamB: "Alumni United",
      date: "2025-06-16",
      time: "14:00",
      venue: "Prabhat Sports Complex",
      status: "finished",
      scoreA: 3,
      scoreB: 2,
    },
    {
      teamA: "Phoenix SC",
      teamB: "Titan Kings",
      date: "2025-06-16",
      time: "16:00",
      venue: "Prabhat Sports Complex",
      status: "finished",
      scoreA: 4,
      scoreB: 1,
    },
    {
      teamA: "Elite Warriors",
      teamB: "Metro Strikers",
      date: "2025-06-17",
      time: "14:00",
      venue: "Prabhat Sports Complex",
      status: "finished",
      scoreA: 5,
      scoreB: 2,
    },
    {
      teamA: "Legacy Green",
      teamB: "Fusion United",
      date: "2025-06-17",
      time: "16:00",
      venue: "Prabhat Sports Complex",
      status: "finished",
      scoreA: 3,
      scoreB: 1,
    },
  ];

  // Check if data already exists
  const existing = await dbSession.query("SELECT COUNT(*) as count FROM fixtures");
  if (existing.length > 0 && (existing[0] as any).count > 0) {
    console.log("✓ Fixtures already seeded");
    return;
  }

  for (const fixture of fixturesData) {
    await dbSession.execute(
      `INSERT INTO fixtures (teamA, teamB, date, time, venue, status, scoreA, scoreB)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fixture.teamA,
        fixture.teamB,
        fixture.date,
        fixture.time,
        fixture.venue,
        fixture.status,
        fixture.scoreA,
        fixture.scoreB,
      ]
    );
  }

  console.log("✓ Fixtures seeded successfully");
}

export async function seedScorers(): Promise<void> {
  const scorersData = [
    {
      name: "Aakash Sharma",
      team: "Rising Stars",
      goals: 14,
      assists: 6,
      rank: 1,
      avatar: "AS",
    },
    {
      name: "Bikram Thapa",
      team: "Phoenix SC",
      goals: 12,
      assists: 8,
      rank: 2,
      avatar: "BT",
    },
    {
      name: "Chirag Rai",
      team: "Batch 18 FC",
      goals: 10,
      assists: 5,
      rank: 3,
      avatar: "CR",
    },
    {
      name: "Deepak Gurung",
      team: "Legacy Green",
      goals: 9,
      assists: 7,
      rank: 4,
      avatar: "DG",
    },
    {
      name: "Eshan Karki",
      team: "Eagles FC",
      goals: 8,
      assists: 4,
      rank: 5,
      avatar: "EK",
    },
    {
      name: "Firoz Malla",
      team: "Titan Kings",
      goals: 7,
      assists: 9,
      rank: 6,
      avatar: "FM",
    },
    {
      name: "Gaurav Shrestha",
      team: "Alumni United",
      goals: 7,
      assists: 3,
      rank: 7,
      avatar: "GS",
    },
    {
      name: "Hari Basnet",
      team: "Fusion United",
      goals: 6,
      assists: 6,
      rank: 8,
      avatar: "HB",
    },
  ];

  const existing = await dbSession.query("SELECT COUNT(*) as count FROM scorers");
  if (existing.length > 0 && (existing[0] as any).count > 0) {
    console.log("✓ Scorers already seeded");
    return;
  }

  for (const scorer of scorersData) {
    await dbSession.execute(
      `INSERT INTO scorers (name, team, goals, assists, rank, avatar)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [scorer.name, scorer.team, scorer.goals, scorer.assists, scorer.rank, scorer.avatar]
    );
  }

  console.log("✓ Scorers seeded successfully");
}

export async function seedStandings(): Promise<void> {
  const standingsData = [
    {
      group: "groupA",
      position: 1,
      team: "Rising Stars",
      played: 5,
      won: 4,
      draw: 0,
      lost: 1,
      goalFor: 15,
      goalAgainst: 7,
      goalDifference: 8,
      points: 12,
    },
    {
      group: "groupA",
      position: 2,
      team: "Phoenix SC",
      played: 5,
      won: 3,
      draw: 1,
      lost: 1,
      goalFor: 12,
      goalAgainst: 8,
      goalDifference: 4,
      points: 10,
    },
    {
      group: "groupA",
      position: 3,
      team: "Batch '18 FC",
      played: 5,
      won: 3,
      draw: 0,
      lost: 2,
      goalFor: 10,
      goalAgainst: 9,
      goalDifference: 1,
      points: 9,
    },
    {
      group: "groupA",
      position: 4,
      team: "Legacy Green",
      played: 5,
      won: 2,
      draw: 1,
      lost: 2,
      goalFor: 8,
      goalAgainst: 10,
      goalDifference: -2,
      points: 7,
    },
    {
      group: "groupB",
      position: 1,
      team: "Eagles FC",
      played: 5,
      won: 2,
      draw: 0,
      lost: 3,
      goalFor: 9,
      goalAgainst: 12,
      goalDifference: -3,
      points: 6,
    },
    {
      group: "groupB",
      position: 2,
      team: "Titan Kings",
      played: 5,
      won: 1,
      draw: 2,
      lost: 2,
      goalFor: 7,
      goalAgainst: 11,
      goalDifference: -4,
      points: 5,
    },
    {
      group: "groupB",
      position: 3,
      team: "Alumni United",
      played: 5,
      won: 1,
      draw: 1,
      lost: 3,
      goalFor: 6,
      goalAgainst: 13,
      goalDifference: -7,
      points: 4,
    },
    {
      group: "groupB",
      position: 4,
      team: "Fusion United",
      played: 5,
      won: 0,
      draw: 1,
      lost: 4,
      goalFor: 5,
      goalAgainst: 14,
      goalDifference: -9,
      points: 1,
    },
  ];

  const existing = await dbSession.query("SELECT COUNT(*) as count FROM standings");
  if (existing.length > 0 && (existing[0] as any).count > 0) {
    console.log("✓ Standings already seeded");
    return;
  }

  for (const standing of standingsData) {
    await dbSession.execute(
      `INSERT INTO standings (team, "group", played, won, draw, lost, goalFor, goalAgainst, goalDifference, points, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        standing.team,
        standing.group,
        standing.played,
        standing.won,
        standing.draw,
        standing.lost,
        standing.goalFor,
        standing.goalAgainst,
        standing.goalDifference,
        standing.points,
        standing.position,
      ]
    );
  }

  console.log("✓ Standings seeded successfully");
}

export async function seedGalleryCategories(): Promise<void> {
  const categoriesData = [
    {
      id: "tournament-moments",
      label: "Tournament Moments",
      description: "Highlights and memorable moments from the tournament",
      cover_image: "/gallery/tournament-moments-cover.jpg",
      photo_count: 0,
    },
    {
      id: "team-photos",
      label: "Team Photos",
      description: "Team pictures and group photos",
      cover_image: "/gallery/team-photos-cover.jpg",
      photo_count: 0,
    },
    {
      id: "match-action",
      label: "Match Action",
      description: "In-game action shots and plays",
      cover_image: "/gallery/match-action-cover.jpg",
      photo_count: 0,
    },
    {
      id: "awards-ceremony",
      label: "Awards Ceremony",
      description: "Prize distribution and awards event",
      cover_image: "/gallery/awards-ceremony-cover.jpg",
      photo_count: 0,
    },
  ];

  const existing = await dbSession.query("SELECT COUNT(*) as count FROM gallery_categories");
  if (existing.length > 0 && (existing[0] as any).count > 0) {
    console.log("✓ Gallery categories already seeded");
    return;
  }

  for (const category of categoriesData) {
    await dbSession.execute(
      `INSERT INTO gallery_categories (id, label, description, cover_image, photo_count)
       VALUES (?, ?, ?, ?, ?)`,
      [category.id, category.label, category.description, category.cover_image, category.photo_count]
    );
  }

  console.log("✓ Gallery categories seeded successfully");
}

export async function seedGalleryPhotos(): Promise<void> {
  const photosData = [
    {
      category_id: "tournament-moments",
      caption: "Opening ceremony parade",
      image_path: "/gallery/photos/tournament-moments-1.jpg",
      sort_order: 1,
    },
    {
      category_id: "tournament-moments",
      caption: "Crowd celebration",
      image_path: "/gallery/photos/tournament-moments-2.jpg",
      sort_order: 2,
    },
    {
      category_id: "team-photos",
      caption: "Rising Stars team",
      image_path: "/gallery/photos/team-photos-1.jpg",
      sort_order: 1,
    },
    {
      category_id: "team-photos",
      caption: "Phoenix SC squad",
      image_path: "/gallery/photos/team-photos-2.jpg",
      sort_order: 2,
    },
    {
      category_id: "match-action",
      caption: "Goal celebration",
      image_path: "/gallery/photos/match-action-1.jpg",
      sort_order: 1,
    },
    {
      category_id: "match-action",
      caption: "Defensive play",
      image_path: "/gallery/photos/match-action-2.jpg",
      sort_order: 2,
    },
    {
      category_id: "awards-ceremony",
      caption: "Trophy presentation",
      image_path: "/gallery/photos/awards-ceremony-1.jpg",
      sort_order: 1,
    },
    {
      category_id: "awards-ceremony",
      caption: "Winners group photo",
      image_path: "/gallery/photos/awards-ceremony-2.jpg",
      sort_order: 2,
    },
  ];

  const existing = await dbSession.query("SELECT COUNT(*) as count FROM gallery_photos");
  if (existing.length > 0 && (existing[0] as any).count > 0) {
    console.log("✓ Gallery photos already seeded");
    return;
  }

  for (const photo of photosData) {
    await dbSession.execute(
      `INSERT INTO gallery_photos (category_id, caption, image_path, sort_order)
       VALUES (?, ?, ?, ?)`,
      [photo.category_id, photo.caption, photo.image_path, photo.sort_order]
    );
  }

  console.log("✓ Gallery photos seeded successfully");
}

export async function seedContactMessages(): Promise<void> {
  const messagesData = [
    {
      name: "John Doe",
      email: "john@example.com",
      subject: "Tournament Inquiry",
      message: "I would like to register my team for the next tournament.",
      status: "new",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      subject: "Sponsorship Opportunity",
      message: "We are interested in sponsoring the tournament.",
      status: "read",
    },
    {
      name: "Ram Sharma",
      email: "ram@example.com",
      subject: "Ticket Inquiry",
      message: "How can I purchase tickets for the final match?",
      status: "replied",
    },
    {
      name: "Priya Patel",
      email: "priya@example.com",
      subject: "Media Coverage",
      message: "Can you provide media access for tournament coverage?",
      status: "new",
    },
  ];

  const existing = await dbSession.query("SELECT COUNT(*) as count FROM contact_messages");
  if (existing.length > 0 && (existing[0] as any).count > 0) {
    console.log("✓ Contact messages already seeded");
    return;
  }

  for (const message of messagesData) {
    await dbSession.execute(
      `INSERT INTO contact_messages (name, email, subject, message, status)
       VALUES (?, ?, ?, ?, ?)`,
      [message.name, message.email, message.subject, message.message, message.status]
    );
  }

  console.log("✓ Contact messages seeded successfully");
}

export async function seedAll(): Promise<void> {
  await seedFixtures();
  await seedScorers();
  await seedStandings();
  await seedGalleryCategories();
  await seedGalleryPhotos();
  await seedContactMessages();
}