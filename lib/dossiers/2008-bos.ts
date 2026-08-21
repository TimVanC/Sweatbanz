import type { Dossier } from "../types";

export const dossier: Dossier = {
  id: "2008-bos",
  season: "2007-08",
  team: "Boston Celtics",
  city: "Boston",
  aliases: ["Celtics", "Boston", "C's", "Big Three", "Ubuntu", "Beantown", "New England"],

  facts: {
    conference: "East",
    division: "Atlantic",
    timezone: "Eastern",
    arena: "TD Banknorth Garden",
    record: "66-16",
    seed: 1,
    playoffResult:
      "Won the NBA Finals 4-2 over their historic rival, closing it out with a 39-point blowout. Needed seven games in each of the first two rounds (Atlanta, Cleveland), then beat Detroit 4-2.",
    coach: "Doc Rivers",
    coachNotes:
      "First title as a coach, one season after going 24-58. Not a Hall of Famer at the time. Preached a South African philosophy about community that became the team's rallying cry.",
    roster: [
      { name: "Paul Pierce", position: "SF", allStarThisYear: true, hofStatus: "in", notable: "Finals MVP. The franchise lifer who suffered through the bad years. The wheelchair game." },
      { name: "Kevin Garnett", position: "PF", allStarThisYear: true, hofStatus: "in", notable: "Defensive Player of the Year this season. Acquired in a summer blockbuster. 'Anything is possible!'" },
      { name: "Ray Allen", position: "SG", allStarThisYear: true, hofStatus: "in", notable: "Acquired on draft night. Purest jumper of his generation. Hit seven threes in a Finals game." },
      { name: "Rajon Rondo", position: "PG", allStarThisYear: false, hofStatus: "no", notable: "Second-year point guard nobody trusted in October; running the show by June." },
      { name: "Kendrick Perkins", position: "C", allStarThisYear: false, hofStatus: "no", notable: "Starting center, permanent scowl, enforcer." },
      { name: "James Posey", position: "F (bench)", allStarThisYear: false, hofStatus: "no", notable: "Veteran glue guy off the bench, corner threes and hard fouls. Already had a ring." },
      { name: "Eddie House", position: "G (bench)", allStarThisYear: false, hofStatus: "no", notable: "Microwave shooter off the bench." },
      { name: "Leon Powe", position: "F (bench)", allStarThisYear: false, hofStatus: "no", notable: "Had a 21-point Finals game in 15 minutes." },
      { name: "Glen Davis", position: "F (bench)", allStarThisYear: false, hofStatus: "no", notable: "'Big Baby.' Rookie, famously got yelled at on the bench by the star power forward." },
      { name: "Tony Allen", position: "G (bench)", allStarThisYear: false, hofStatus: "no", notable: "Defensive specialist, later famous elsewhere." },
      { name: "P.J. Brown", position: "F (bench)", allStarThisYear: false, hofStatus: "no", notable: "Came out of retirement midseason; hit a huge Game 7 jumper in round two." },
      { name: "Sam Cassell", position: "G (bench)", allStarThisYear: false, hofStatus: "no", notable: "Veteran point guard signed midseason after a buyout." },
      { name: "Brian Scalabrine", position: "F (bench)", allStarThisYear: false, hofStatus: "no", notable: "End-of-bench cult hero." },
    ],
    teamLeaders:
      "Scoring: the small forward at 19.6 ppg. The power forward 18.8 ppg and 9.2 rpg. The three stars all sacrificed shots. Best defense in the league by a mile, run by an assistant who later became a famous head coach.",
    transactions:
      "Two summer blockbusters: traded five players for a future Hall of Fame shooting guard on draft night, then seven players for a future Hall of Fame power forward. Went from 24 wins to 66 — the biggest single-season turnaround in league history.",
  },

  vibes: {
    era: "The first iPhone had just come out. Facebook had opened to everyone; YouTube was two years old. Flip phones still common. 'Low' by Flo Rida, 'Crank That.' The city's football team went 18-1 that same season and its baseball team had just won the World Series — peak title-town arrogance.",
    techMarkers:
      "No Twitter to speak of. Highlights lived on SportsCenter and early YouTube. League Pass existed on cable. Texting cost money per message.",
    cityCulture:
      "Clam chowder, a regional donut chain on every corner, thick accents, Irish everything. Iced tea is unsweetened, obviously — you're in the Northeast. Sports are a religion and the fans think they're the smartest in the country.",
    climate:
      "Cold, snowy, long winters. Summers are warm and humid but nobody would call them crazy hot — low 80s, with ocean breeze.",
    geography:
      "Northeast, on the Atlantic coast, a harbor city. Cold water, old brick, colonial history.",
    fanbase:
      "Die-hard, historic, entitled, loud. Had been waiting 22 years for a title, which is a long time for THIS franchise. Parquet floor, banners everywhere.",
    styleOfPlay:
      "Smothering, rotating team defense — the blueprint the whole league copied. Three stars who each gave up numbers to win. Not pretty on offense; didn't need to be.",
    culturalFootprint:
      "The original modern superteam — the trade-for-stars model everyone copied. A one-word South African philosophy as the team motto. 'Anything is possible!' screamed on live TV. A Finals comeback from 24 down. 2K classic team.",
    aesthetic:
      "Green and white, the leprechaun, the parquet floor. The most recognizable look in the sport. Nothing about it changed and nothing needed to.",
    respectLevel:
      "Respected as the blueprint and hated outside the region. The 'they only won one' criticism follows them despite three Finals-caliber years.",
  },
};
