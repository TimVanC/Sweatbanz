-- Sweatbanz Phase 2 schema (PRD §5). All access is server-side via the
-- service role; RLS is enabled with no policies so the anon key can't read anything.

create table if not exists puzzles (
  id            text primary key,            -- "2004-det"
  play_date     date unique,                 -- null until scheduled
  puzzle_number int  unique,
  dossier       jsonb not null,
  difficulty    text not null default 'medium',
  published     boolean not null default false,
  created_at    timestamptz not null default now()
);

create table if not exists sessions (
  id             uuid primary key,
  puzzle_id      text not null references puzzles(id),
  user_key       text not null,              -- anonymous local id
  ip_hash        text,
  started_at     timestamptz not null default now(),
  solved_at      timestamptz,
  question_count int not null default 0,
  wrong_guesses  int not null default 0
);
create index if not exists sessions_puzzle_user_idx on sessions(puzzle_id, user_key);
create index if not exists sessions_ip_day_idx on sessions(ip_hash, started_at);

create table if not exists turns (
  id         bigserial primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  idx        int  not null,
  question   text not null,
  response   jsonb not null,
  created_at timestamptz not null default now(),
  unique (session_id, idx)
);

create table if not exists stats_daily (
  puzzle_id     text primary key references puzzles(id),
  plays         int not null default 0,
  solves        int not null default 0,
  avg_questions numeric,
  distribution  jsonb not null default '{}'::jsonb   -- {"7": 12, "8": 30, ...}
);

alter table puzzles     enable row level security;
alter table sessions    enable row level security;
alter table turns       enable row level security;
alter table stats_daily enable row level security;

-- Called when a session is created.
create or replace function bump_plays(p_puzzle_id text) returns void
language sql security definer as $$
  insert into stats_daily (puzzle_id, plays) values (p_puzzle_id, 1)
  on conflict (puzzle_id) do update set plays = stats_daily.plays + 1;
$$;

-- Called when a session is solved; keeps a running average and a histogram.
create or replace function record_solve(p_puzzle_id text, p_questions int) returns void
language plpgsql security definer as $$
begin
  insert into stats_daily (puzzle_id, plays, solves, avg_questions, distribution)
  values (p_puzzle_id, 1, 1, p_questions, jsonb_build_object(p_questions::text, 1))
  on conflict (puzzle_id) do update set
    solves        = stats_daily.solves + 1,
    avg_questions = ((coalesce(stats_daily.avg_questions, 0) * stats_daily.solves) + p_questions)
                    / (stats_daily.solves + 1),
    distribution  = stats_daily.distribution
                    || jsonb_build_object(
                         p_questions::text,
                         coalesce((stats_daily.distribution ->> p_questions::text)::int, 0) + 1
                       );
end;
$$;
