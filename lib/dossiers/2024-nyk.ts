import type { Dossier } from "../types";

export const dossier: Dossier = {
  id: "2024-nyk",
  season: "2023-24",
  team: "New York Knicks",
  city: "New York",
  aliases: ["Knicks", "New York", "NY", "NYC", "Knickerbockers", "Nova Knicks", "Villanova Knicks", "MSG", "the Garden", "Manhattan"],

  facts: {
    conference: "East",
    division: "Atlantic",
    timezone: "Eastern",
    arena: "Madison Square Garden",
    record: "50-32",
    seed: 2,
    playoffResult:
      "Lost in the second round 4-3 to Indiana, with the roster so wrecked by injuries that the Game 7 rotation was basically six guys. Beat Philadelphia 4-2 in round one.",
    coach: "Tom Thibodeau",
    coachNotes:
      "Two-time Coach of the Year (not this year). Famous for playing starters 40+ minutes. Not a Hall of Famer. Defense and rebounding or you don't play.",
    roster: [
      { name: "Jalen Brunson", position: "PG", allStarThisYear: true, hofStatus: "tracking", notable: "First All-Star selection, All-NBA Second Team, Clutch Player of the Year. 28.7 ppg. Broke his hand in Game 7." },
      { name: "Julius Randle", position: "PF", allStarThisYear: true, hofStatus: "no", notable: "All-Star, then dislocated his shoulder in late January and never came back." },
      { name: "OG Anunoby", position: "SF", allStarThisYear: false, hofStatus: "no", notable: "Acquired December 30 from Toronto. Team went 20-3 with him healthy. Hamstring went in the second round." },
      { name: "Josh Hart", position: "G/F", allStarThisYear: false, hofStatus: "no", notable: "Led the team in rebounds as a 6'4\" guard. Played entire 48-minute games. Former college teammate of the point guard." },
      { name: "Donte DiVincenzo", position: "SG", allStarThisYear: false, hofStatus: "no", notable: "Set the franchise single-season three-point record. Also a former college teammate of the point guard." },
      { name: "Isaiah Hartenstein", position: "C", allStarThisYear: false, hofStatus: "no", notable: "Starting center after the regular starter got hurt; push-shot floater, elite screener." },
      { name: "Mitchell Robinson", position: "C", allStarThisYear: false, hofStatus: "no", notable: "Starting center until a December ankle injury; came back for the playoffs and got hurt again." },
      { name: "Precious Achiuwa", position: "F/C (bench)", allStarThisYear: false, hofStatus: "no", notable: "Came in the December trade; thrust into big minutes." },
      { name: "Bojan Bogdanovic", position: "F (bench)", allStarThisYear: false, hofStatus: "no", notable: "Deadline pickup, got hurt in the playoffs too." },
      { name: "Alec Burks", position: "G (bench)", allStarThisYear: false, hofStatus: "no", notable: "Deadline pickup, second stint with the team. Forced into real Game 7 minutes." },
      { name: "Miles McBride", position: "G (bench)", allStarThisYear: false, hofStatus: "no", notable: "'Deuce.' Backup guard who broke out as the injuries piled up." },
      { name: "Jericho Sims", position: "C (bench)", allStarThisYear: false, hofStatus: "no", notable: "Backup big, pure athlete." },
    ],
    teamLeaders:
      "Scoring: the point guard at 28.7 ppg, including a 47-point playoff game. Rebounds: a 6'4\" wing at 8.3. Offensive rebounding was the whole identity — they led the league. Traded two starters (a former #3 pick and a young guard) away on December 30.",
    transactions:
      "Traded a former #3 overall pick and a young combo guard to Toronto on December 30 for an elite wing defender. Added two veterans at the deadline. The front office was run by a former agent with a reputation for hoarding picks.",
  },

  vibes: {
    era: "TikTok everything. The Drake–Kendrick beef detonated that spring, right during the playoffs. Threads had launched the previous summer and died. ChatGPT was a year and a half old. 'Espresso' was the song of the summer that followed. NIL money, sports betting ads every 30 seconds.",
    techMarkers:
      "League Pass, streaming on every device, highlight accounts on X and TikTok before the game ends. The whole world watches the crowd reaction shots.",
    cityCulture:
      "Dollar-slice pizza (now $1.50), bodegas, the subway, bagels, every celebrity courtside. Iced tea is unsweetened — this is the Northeast; sweet tea is a Southern thing. The city's most famous building is the arena. Three starters went to the same Philadelphia-area college and the fanbase adopted that as the team's identity.",
    climate:
      "Humid summers that get hot — 90s in July — but nobody from the South would call it crazy hot. Real winters with snow. Four genuine seasons.",
    geography:
      "Northeast, Atlantic coast, the arena is on an island at the center of the biggest metro in the country. Rivers on both sides. You can't drive anywhere.",
    fanbase:
      "The most starved, most loyal, most abused fanbase in the sport. Had been a punchline for 20 years. This season brought the arena back to life — celebrity row, 'Bing Bong,' a crowd that made Game 7s feel like riots. Absolutely not bandwagon; they never left.",
    styleOfPlay:
      "Grinding, physical, offensive-rebound-everything, play your starters 45 minutes. A point guard who's 6'2\" and lives in the mid-range and the foul line. Old-school toughness in a pace-and-space league.",
    culturalFootprint:
      "The revival season. The college-reunion backcourt. The injury apocalypse — fans list the injuries like a litany. The December trade that flipped the season. A Game 7 where the bench was empty. Still a current-era team in 2K, not a classic.",
    aesthetic:
      "Orange and blue. Classic wordmark. Black alternates. The arena's famous ceiling. Timeless, hasn't really changed.",
    respectLevel:
      "Nationally respected for the first time in two decades — 'lovable grinders.' Also pitied, because the injuries were absurd. Fans of this team think it was a title team if healthy; nobody else is sure.",
  },
};
