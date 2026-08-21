export type Dossier = {
  id: string;                 // "2004-det"
  season: string;             // "2003-04"
  team: string;               // "Detroit Pistons"
  city: string;
  aliases: string[];

  facts: {
    conference: "East" | "West";
    division: string;
    timezone: string;
    arena: string;
    record: string;
    seed: number;
    playoffResult: string;
    coach: string;
    coachNotes: string;
    roster: Array<{
      name: string;
      position: string;
      allStarThisYear: boolean;
      hofStatus: "in" | "tracking" | "no";
      notable: string;
    }>;
    teamLeaders: string;
    transactions: string;
  };

  vibes: {
    era: string;
    techMarkers: string;
    cityCulture: string;
    climate: string;
    geography: string;
    fanbase: string;
    styleOfPlay: string;
    culturalFootprint: string;
    aesthetic: string;
    respectLevel: string;
  };
};

export type Tone = "clean" | "hedge" | "dunno";

export type TurnResponse = {
  kind: "answer" | "guess_wrong" | "guess_right" | "refuse";
  text: string;          // ≤ 40 tokens, in character
  countsAsQuestion: boolean;
  tone: Tone;
};

export type Turn = {
  question: string;
  response: TurnResponse;
};
