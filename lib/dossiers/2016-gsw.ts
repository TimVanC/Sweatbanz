import type { Dossier } from "../types";

export const dossier: Dossier = {
  id: "2016-gsw",
  season: "2015-16",
  team: "Golden State Warriors",
  city: "Oakland",
  aliases: ["Warriors", "Golden State", "Dubs", "Splash Brothers", "Death Lineup", "Roaracle", "Oakland", "Bay Area", "San Francisco"],

  facts: {
    conference: "West",
    division: "Pacific",
    timezone: "Pacific",
    arena: "Oracle Arena",
    record: "73-9",
    seed: 1,
    playoffResult:
      "Lost the NBA Finals 4-3 after leading 3-1 — the first team ever to blow a 3-1 Finals lead. Beat Houston 4-1, Portland 4-1, and came back from 3-1 down to beat Oklahoma City 4-3 to get there.",
    coach: "Steve Kerr",
    coachNotes:
      "Won Coach of the Year despite missing the first 43 games recovering from back surgery; his assistant went 39-4 in his absence. Five rings as a player. Not a Hall of Famer as a coach at the time.",
    roster: [
      { name: "Stephen Curry", position: "PG", allStarThisYear: true, hofStatus: "tracking", notable: "First unanimous MVP in league history. Made 402 threes, shattering his own record. Scoring champ at 30.1 per game." },
      { name: "Klay Thompson", position: "SG", allStarThisYear: true, hofStatus: "tracking", notable: "The other half of the league's most famous shooting duo. Saved the conference finals with 11 threes in a road Game 6." },
      { name: "Draymond Green", position: "PF", allStarThisYear: true, hofStatus: "tracking", notable: "Defensive Player of the Year runner-up. Suspended for Game 5 of the Finals for a groin shot, which is where the collapse started." },
      { name: "Harrison Barnes", position: "SF", allStarThisYear: false, hofStatus: "no", notable: "Starting wing in a contract year; went cold in the Finals and left that summer." },
      { name: "Andrew Bogut", position: "C", allStarThisYear: false, hofStatus: "no", notable: "Starting center, Australian, elite screener. Hurt his knee in Game 5 of the Finals." },
      { name: "Andre Iguodala", position: "G/F (bench)", allStarThisYear: false, hofStatus: "no", notable: "Previous year's Finals MVP coming off the bench by choice. Anchor of the small-ball closing lineup." },
      { name: "Shaun Livingston", position: "G (bench)", allStarThisYear: false, hofStatus: "no", notable: "Backup point guard who lived on mid-range post-ups. Famous career comeback from a catastrophic knee injury." },
      { name: "Leandro Barbosa", position: "G (bench)", allStarThisYear: false, hofStatus: "no", notable: "Veteran Brazilian spark plug." },
      { name: "Marreese Speights", position: "C (bench)", allStarThisYear: false, hofStatus: "no", notable: "'Mo Buckets.' Backup big who chucked." },
      { name: "Festus Ezeli", position: "C (bench)", allStarThisYear: false, hofStatus: "no", notable: "Backup center, Nigerian." },
      { name: "Brandon Rush", position: "F (bench)", allStarThisYear: false, hofStatus: "no", notable: "Spot starter while the coach was out." },
      { name: "Ian Clark", position: "G (bench)", allStarThisYear: false, hofStatus: "no", notable: "End-of-bench guard." },
      { name: "Anderson Varejao", position: "C (bench)", allStarThisYear: false, hofStatus: "no", notable: "Claimed off waivers in February; ended up playing in the Finals against the team that waived him." },
    ],
    teamLeaders:
      "Scoring: the point guard at 30.1 ppg (league leader). Rebounds and assists both led by the power forward (9.5 rpg, 7.4 apg). Set the all-time regular-season wins record (73) and the record for threes. Started 24-0.",
    transactions:
      "Quiet year by design — the core was intact from the previous title. Claimed a veteran center off waivers in February; that's about it.",
  },

  vibes: {
    era: "Snapchat at its peak, Vine in its final year, Pokemon Go blew up that July. 'Hotline Bling' and 'Hello' everywhere. Hamilton mania. Election year with the debates just starting.",
    techMarkers:
      "Everyone had an iPhone 6. Instagram was photos-only, no Stories yet (they launched that August). League Pass streamed fine. Twitter was where the 3-1 jokes were born.",
    cityCulture:
      "The home arena was on the unglamorous side of the bay, a blue-collar city with real grit and real pride, while the money and tech bros lived across the water. Mission burritos, sourdough, coffee snobs. Iced tea comes unsweetened; ask for sweet tea and you'll get a blank stare.",
    climate:
      "Mild year-round. Summers aren't hot at all — foggy mornings, sweater nights, 65 degrees in July. Nobody would ever call it crazy hot. No snow, no real winter. Best weather in the league, honestly.",
    geography:
      "West Coast, on a bay off the Pacific. Hills, bridges, earthquakes. The arena was in a gritty city across the bay from the famous one everyone thinks of.",
    fanbase:
      "The arena had a reputation as the loudest in the league and a nickname to match. Longtime fans suffered through decades of bad teams; by this season the bandwagon was enormous and the 'fake fan' accusations had started.",
    styleOfPlay:
      "Pace and space, threes from everywhere, motion offense, a small-ball closing lineup with a 6'7\" guy at center that nobody could match up with. Joy. Also, an elite defense people forget about.",
    culturalFootprint:
      "Best regular season ever, then the most famous collapse ever — the '3-1 lead' became a permanent internet meme. The unanimous MVP, the 402 threes, the 24-0 start. A frequent classic team in 2K. A footnote: a certain superstar joined them that summer partly because of this series.",
    aesthetic:
      "Royal blue and gold, the bridge logo. Slate-gray sleeved alternates that the star hated. Bright, clean, modern.",
    respectLevel:
      "Respected as the greatest regular-season team ever and mocked forever for how it ended. Both things are true, and fans of every other team make sure you remember the second one.",
  },
};
