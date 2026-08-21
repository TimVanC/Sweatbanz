import type { Dossier } from "../types";

export const dossier: Dossier = {
  id: "2011-dal",
  season: "2010-11",
  team: "Dallas Mavericks",
  city: "Dallas",
  aliases: ["Mavericks", "Mavs", "Dallas", "Big D", "MFFL", "DFW"],

  facts: {
    conference: "West",
    division: "Southwest",
    timezone: "Central",
    arena: "American Airlines Center",
    record: "57-25",
    seed: 3,
    playoffResult:
      "Won the NBA Finals 4-2 over a newly assembled superteam. Beat Portland 4-2, swept the two-time defending champs 4-0 (ending their legendary coach's career), and beat Oklahoma City 4-1 to get there.",
    coach: "Rick Carlisle",
    coachNotes:
      "First title as a coach; had won one as a bench player on a famous 1980s team. Previously won Coach of the Year elsewhere. Not a Hall of Famer at the time.",
    roster: [
      { name: "Dirk Nowitzki", position: "PF", allStarThisYear: true, hofStatus: "in", notable: "Finals MVP. The team's only All-Star. German 7-footer with the one-legged fadeaway. Played a Finals game with a 101-degree fever." },
      { name: "Jason Kidd", position: "PG", allStarThisYear: false, hofStatus: "in", notable: "37-year-old point guard, in his second stint with the franchise. Finally got his ring." },
      { name: "Jason Terry", position: "SG (bench)", allStarThisYear: false, hofStatus: "no", notable: "Sixth man and closer. Got a championship trophy tattooed on his arm BEFORE the season and then backed it up." },
      { name: "Shawn Marion", position: "SF", allStarThisYear: false, hofStatus: "no", notable: "'The Matrix.' Ugliest jumper in the league, guarded the other team's best wing every night." },
      { name: "Tyson Chandler", position: "C", allStarThisYear: false, hofStatus: "no", notable: "Acquired in the offseason; transformed the defense. Won Defensive Player of the Year the following season elsewhere." },
      { name: "J.J. Barea", position: "G (bench)", allStarThisYear: false, hofStatus: "no", notable: "Six-foot Puerto Rican backup who got inserted into the starting lineup mid-Finals and wrecked the opponent's defense." },
      { name: "Peja Stojakovic", position: "F (bench)", allStarThisYear: false, hofStatus: "no", notable: "Veteran sniper signed in January after a key wing went down. Retired as a champion that summer." },
      { name: "DeShawn Stevenson", position: "SG", allStarThisYear: false, hofStatus: "no", notable: "Starting shooting guard, tattoo of a president on his neck, had beef with the other team's superstar." },
      { name: "Brendan Haywood", position: "C (bench)", allStarThisYear: false, hofStatus: "no", notable: "Backup center." },
      { name: "Caron Butler", position: "SF", allStarThisYear: false, hofStatus: "no", notable: "Starting wing who tore his patellar tendon on New Year's Day and missed the entire run." },
      { name: "Brian Cardinal", position: "F (bench)", allStarThisYear: false, hofStatus: "no", notable: "'The Custodian.' End-of-bench vet who played real Finals minutes." },
      { name: "Ian Mahinmi", position: "C (bench)", allStarThisYear: false, hofStatus: "no", notable: "Backup big." },
      { name: "Corey Brewer", position: "F (bench)", allStarThisYear: false, hofStatus: "no", notable: "Midseason pickup." },
    ],
    teamLeaders:
      "Scoring: the German at 23.0 ppg. Rebounds: the center at 9.4. Assists: the old point guard at 8.2. A veteran team — the rotation was full of guys over 30 — built on a zone defense and one unguardable scorer.",
    transactions:
      "Traded for a rim-protecting center in the offseason, the move that made the defense real. Signed a veteran European shooter in January after losing a starting wing to a season-ending injury.",
  },

  vibes: {
    era: "iPhone 4, Instagram had launched a few months earlier, BlackBerry Messenger still alive. 'Friday' by Rebecca Black was the meme of the spring. The Decision had happened the previous summer and the whole league was waiting to see the superteam win. A lockout started right after this season.",
    techMarkers:
      "Twitter had gone mainstream; the Finals were the first truly tweeted-through Finals. Vine and Snapchat didn't exist. League Pass was on cable boxes.",
    cityCulture:
      "Texas. Sweet tea, absolutely — it comes sweet by default and you ask for unsweet. Brisket, Tex-Mex, big trucks, new money, a famous football team that overshadows everything. The owner was louder and more famous than the fanbase.",
    climate:
      "Crazy hot summers, no debate — 100-degree weeks in a row. Mild winters, though a freak ice storm that February shut the whole city down during a Super Bowl it was hosting.",
    geography:
      "North Texas. Flat, sprawling, landlocked — hours from any coast. Part of a huge metro with a twin city to the west.",
    fanbase:
      "Fair-weather reputation for years, but this run made believers. The owner is the most visible fan in the building, sitting courtside and screaming at refs. Nationally, most people rooted for this team because of who they were playing.",
    styleOfPlay:
      "Flow offense running through a 7-footer who shot like a guard. Zone defense, which almost nobody played then. Smart, old, unselfish. Not athletic at all, and it didn't matter.",
    culturalFootprint:
      "The team that beat the Heatles in year one. Seen as revenge for a Finals collapse five years earlier. The 'team beats superteam' story of the 2010s. A franchise's only title. Classic team in 2K.",
    aesthetic:
      "Navy and royal blue with silver. A horse-head logo. Fairly generic 2000s look, honestly.",
    respectLevel:
      "Deeply respected, universally liked, and a one-hit wonder — the core never got back. Basketball nerds romanticize this team more than the general public does.",
  },
};
