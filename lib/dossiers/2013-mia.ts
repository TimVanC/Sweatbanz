import type { Dossier } from "../types";

export const dossier: Dossier = {
  id: "2013-mia",
  season: "2012-13",
  team: "Miami Heat",
  city: "Miami",
  aliases: ["Heat", "Miami", "Heatles", "Big Three", "South Beach", "South Florida", "Dade"],

  facts: {
    conference: "East",
    division: "Southeast",
    timezone: "Eastern",
    arena: "AmericanAirlines Arena",
    record: "66-16",
    seed: 1,
    playoffResult:
      "Won the NBA Finals 4-3 over San Antonio, saved by one of the most famous shots ever — a corner three with five seconds left in Game 6 while fans were already leaving. Swept Milwaukee, beat Chicago 4-1, and survived Indiana in seven to get there.",
    coach: "Erik Spoelstra",
    coachNotes:
      "Second straight title. Started with the franchise as a video coordinator. Not a Hall of Famer at the time.",
    roster: [
      { name: "LeBron James", position: "SF/PF", allStarThisYear: true, hofStatus: "tracking", notable: "MVP and Finals MVP. Fourth MVP overall. Played power forward in the small-ball lineup. Shot 56% from the field." },
      { name: "Dwyane Wade", position: "SG", allStarThisYear: true, hofStatus: "in", notable: "Franchise icon, playing on bad knees by the Finals. Third ring." },
      { name: "Chris Bosh", position: "C/PF", allStarThisYear: true, hofStatus: "in", notable: "Grabbed the offensive rebound that set up the famous Game 6 three. Stretch big." },
      { name: "Ray Allen", position: "SG (bench)", allStarThisYear: false, hofStatus: "in", notable: "Signed that summer from a bitter rival. Hit THE shot — backpedaling corner three, Game 6." },
      { name: "Mario Chalmers", position: "PG", allStarThisYear: false, hofStatus: "no", notable: "Starting point guard who got yelled at by the stars constantly and didn't care." },
      { name: "Shane Battier", position: "F", allStarThisYear: false, hofStatus: "no", notable: "Corner-three specialist, hit six in Game 7 of the Finals." },
      { name: "Udonis Haslem", position: "PF", allStarThisYear: false, hofStatus: "no", notable: "Hometown enforcer, franchise lifer." },
      { name: "Norris Cole", position: "G (bench)", allStarThisYear: false, hofStatus: "no", notable: "Backup point guard with a flat-top." },
      { name: "Chris Andersen", position: "C (bench)", allStarThisYear: false, hofStatus: "no", notable: "'Birdman.' Signed in January, covered in tattoos, shot 80% in the playoffs for a stretch." },
      { name: "Mike Miller", position: "F (bench)", allStarThisYear: false, hofStatus: "no", notable: "Hit a three in the Finals with one shoe on." },
      { name: "Rashard Lewis", position: "F (bench)", allStarThisYear: false, hofStatus: "no", notable: "Veteran stretch forward." },
      { name: "Joel Anthony", position: "C (bench)", allStarThisYear: false, hofStatus: "no", notable: "Backup center who couldn't catch." },
      { name: "James Jones", position: "F (bench)", allStarThisYear: false, hofStatus: "no", notable: "Shooter, 'Champ' to his teammates." },
    ],
    teamLeaders:
      "Scoring, rebounding, and assists all led by the same guy: 26.8 ppg, 8.0 rpg, 7.3 apg. Won 27 straight games from February into March, the second-longest streak in league history.",
    transactions:
      "Signed a legendary shooter away from a hated rival that summer. Added a heavily tattooed backup center in January who became a cult hero.",
  },

  vibes: {
    era: "The Harlem Shake spring — this team made a famous one in the locker room. Vine had just launched, Instagram added video that June. 'Thrift Shop.' Obama's second term started. Twitter was the main character of the Finals.",
    techMarkers:
      "iPhone 5. Vine clips of the big shot went everywhere. League Pass on apps. The 'fans left early' footage spread on Twitter within minutes.",
    cityCulture:
      "Cuban coffee, cafecito windows, Spanish as the default language in half the city, clubs, beaches, plastic surgery. Iced tea? This is a Latin city in a Southern state — it's a coin flip, and a lot of places will just hand you a Materva. Not a sweet-tea town like the rest of the state.",
    climate:
      "Crazy hot and humid, no argument — swamp air nine months a year, hurricane season, afternoon thunderstorms. There is no winter; it's 75 in January.",
    geography:
      "The far southeastern corner of the country, on the Atlantic, flat as a table, with a chain of islands trailing off the bottom. Everglades to the west.",
    fanbase:
      "Infamous. Late-arriving, early-leaving, bandwagon reputation — and this season gave the critics their best footage ever when fans left Game 6 early and had to beg to get back in. Loud when it matters, though.",
    styleOfPlay:
      "Pace and space before it was everywhere: the superstar at power forward, shooters in every corner, a trapping, swarming defense. Deeply talented and deeply hated.",
    culturalFootprint:
      "The superteam at its peak. 'Not one, not two, not three...' finally had a second one. The 27-game streak. The corner three. The Harlem Shake video. Villains of the decade. Classic team in 2K.",
    aesthetic:
      "Red, black, and white with the flaming-ball logo. All-white 'White Hot' playoff crowds. Black alternate jerseys.",
    respectLevel:
      "Respected begrudgingly everywhere and loved in exactly one city. One of the best teams of the century, and most people still root against it in retrospect.",
  },
};
