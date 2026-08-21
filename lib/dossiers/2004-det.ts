import type { Dossier } from "../types";

// Facts verified against Basketball Reference (2003-04 season).
export const dossier: Dossier = {
  id: "2004-det",
  season: "2003-04",
  team: "Detroit Pistons",
  city: "Detroit",
  aliases: [
    "Pistons",
    "Detroit",
    "Motown",
    "Motor City",
    "Goin' to Work",
    "Bad Boys",
    "DEEETROIT BASKETBALL",
  ],

  facts: {
    conference: "East",
    division: "Central",
    timezone: "Eastern",
    arena: "The Palace of Auburn Hills",
    record: "54-28",
    seed: 3,
    playoffResult:
      "Won the NBA Finals 4-1 over a heavily favored superteam. Beat Milwaukee 4-1, New Jersey 4-3, and Indiana 4-2 to get there.",
    coach: "Larry Brown",
    coachNotes:
      "Hall of Famer, already inducted at the time. The only coach to win both an NCAA title and an NBA title. First season with this team. Famous nomad — this was roughly his ninth NBA head job.",
    roster: [
      {
        name: "Chauncey Billups",
        position: "PG",
        allStarThisYear: false,
        hofStatus: "in",
        notable:
          "Finals MVP this season. A journeyman on his fifth team who finally found a home. Not yet an All-Star (first selection came later).",
      },
      {
        name: "Richard Hamilton",
        position: "SG",
        allStarThisYear: false,
        hofStatus: "no",
        notable:
          "Led the team in scoring. Famous for wearing a clear face mask and running defenders off endless screens. Not yet an All-Star.",
      },
      {
        name: "Tayshaun Prince",
        position: "SF",
        allStarThisYear: false,
        hofStatus: "no",
        notable:
          "Second-year wing. Authored one of the most famous chase-down blocks in playoff history in the conference finals this year.",
      },
      {
        name: "Rasheed Wallace",
        position: "PF",
        allStarThisYear: false,
        hofStatus: "no",
        notable:
          "Acquired at the trade deadline; widely seen as the final piece. Technical-foul legend. 'Ball don't lie.'",
      },
      {
        name: "Ben Wallace",
        position: "C",
        allStarThisYear: true,
        hofStatus: "in",
        notable:
          "The team's only All-Star this season. Undrafted. Four-time Defensive Player of the Year, though the award went to someone else this particular year. Giant afro, headbands.",
      },
      {
        name: "Corliss Williamson",
        position: "F (bench)",
        allStarThisYear: false,
        hofStatus: "no",
        notable: "Sixth man, nicknamed 'Big Nasty'. Won Sixth Man of the Year the season before.",
      },
      {
        name: "Mehmet Okur",
        position: "C/F (bench)",
        allStarThisYear: false,
        hofStatus: "no",
        notable: "Second-year Turkish big man off the bench; became an All-Star years later elsewhere.",
      },
      {
        name: "Lindsey Hunter",
        position: "G (bench)",
        allStarThisYear: false,
        hofStatus: "no",
        notable: "Veteran pest of a backup guard, full-court pressure specialist.",
      },
      {
        name: "Elden Campbell",
        position: "C (bench)",
        allStarThisYear: false,
        hofStatus: "no",
        notable: "Veteran backup center, came over in the deadline deal.",
      },
      {
        name: "Mike James",
        position: "G (bench)",
        allStarThisYear: false,
        hofStatus: "no",
        notable: "Backup combo guard, midseason pickup.",
      },
      {
        name: "Darvin Ham",
        position: "F (bench)",
        allStarThisYear: false,
        hofStatus: "no",
        notable: "End-of-bench energy forward; much later became an NBA head coach.",
      },
    ],
    teamLeaders:
      "Scoring: the shooting guard at 17.6 ppg, the point guard at 16.9. The center averaged 12.4 rpg and 3.0 bpg and led the team in rebounds, blocks, and steals. Nobody averaged 18. The identity was defense: #2 in points allowed, held opponents under 70 points multiple times.",
    transactions:
      "Traded for a mercurial, technical-foul-prone power forward at the February deadline in a three-team deal. Universally seen as the move that turned a good team into a champion.",
  },

  vibes: {
    era: "iPod era, pre-YouTube, MySpace just getting big. Flip phones. Ringtones were a whole economy. 'Hey Ya!' and 'Yeah!' on every radio.",
    techMarkers:
      "No YouTube, no Twitter, no Facebook for the public. Texting on T9. League Pass existed but highlights lived on SportsCenter, not your phone. If you missed the game, you actually missed it.",
    cityCulture:
      "Blue-collar, proudly unglamorous. Auto plants, a world-famous soul record label, coney dogs, Faygo and Vernors pop. Iced tea comes unsweetened — this is the North; ask for sweet tea and you'll get sugar packets and a look. The city's most famous musical export at the time was a white rapper whose movie about the city had just won an Oscar for its theme song.",
    climate:
      "Real winters — gray, long, snowy, lake-effect cold. Summers are warm and humid but nobody would call them crazy hot. You'd take the summers; the winters take you.",
    geography:
      "Midwest, on a river across from Canada — you can literally look south into another country. Great Lakes on multiple sides. Flat. Nearest big-league neighbors: Cleveland, Chicago, Toronto.",
    fanbase:
      "Die-hard, loud, and starving — the franchise had a championship past a decade-plus earlier and the fans never left. The arena PA's drawn-out pronunciation of the city before 'BASKETBALL' became iconic this exact season. Absolutely not a bandwagon crowd.",
    styleOfPlay:
      "Grind-it-out, ugly, low-scoring, elite defense. No superstar scorer — five guys who guarded, shared, and made your night miserable. Nobody wanted to play them. They won the title by strangling a team of future Hall of Famers.",
    culturalFootprint:
      "The ultimate 'team beats talent' story — beat a superteam with four future Hall of Famers in five games and it wasn't that close. Forever cited in every 'you don't need a superstar' argument. A frequent classic/legends team in 2K. The infamous brawl associated with this franchise happened the FOLLOWING season, not this one.",
    aesthetic:
      "Classic royal blue, red, and white. Traditional horse-power logo era, back after a weird teal experiment in the late 90s. Clean, no-frills look that matched the identity.",
    respectLevel:
      "Deeply respected, never romanticized. Praised as a 'right way' team, but the league marketed stars and this team had none by design. They're the answer to a trivia question more than a dynasty in the public memory — which is exactly how their fans like it.",
  },
};
