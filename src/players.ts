import { createEnumMember } from 'typescript';

export const GROUPS: string[] = [
  'FRONTEND',
  'JAVA',
  '.NET',
  'TESTING',
  'INFRA',
];

export const PLAYERS: any = {
  FRONTEND: ['Joey Comhaire', 'Arno Chauveau', 'Lorenzo Borghs', 'sh33dafi'],
  JAVA: [
    'Arne Hendrickx',
    'selske',
    'Dylan H.',
    'NickVermeylen',
    'Nick Van den Putte',
    'Ben Alen',
    'Pieter Drijkoningen',
    'mathiasclaus',
    'Cel Pynenborg',
  ],
  '.NET': [
    'leechuckfon',
    'Robin Laevaert',
    'LorenzCleymans',
    'Dario',
    'Tom Houben',
  ],
  TESTING: ['JohanLaebens', 'stanleywong123', 'Bart Van Raemdonck'],
  INFRA: ['Gertjan Roggemans'],
};

export function getPlayerInfo(members: Member[], player: string) {
  const p = members.find((member) => member.name === player);
  const cc = Object.keys(PLAYERS).find((cc) =>
    PLAYERS[cc].includes((p && p.name) || '')
  );
  return {
    ...p,
    cc,
  };
}

export function getSortedPlayersByStars({
  members,
}: {
  members: { [key: string]: Member };
}): Member[] {
  const m = Object.values(members).filter((m) => m.stars);
  m.sort((a: Member, b: Member) => b.local_score - a.local_score);
  return m;
}

export function getTopPlayer(data: { members: { [key: string]: Member } }) {
  return getSortedPlayersByStars(data)[0];
}

export function getMaxLevel(members: Member[]): number {
  let maxLevel = 0;
  members.forEach((member) => {
    Object.keys(member.completion_day_level).forEach((level) => {
      if (Number(level) > maxLevel) {
        maxLevel = Number(level);
      }
    });
  });
  return maxLevel;
}

export function getLastStarAchieved(member: Member): number {
  let lastStarAchieved = 0;
  Object.values(member.completion_day_level).forEach((day) => {
    Object.values(day)
      .map((d: Level) => d.get_star_ts)
      .forEach((ts) => {
        if (Number(ts) > lastStarAchieved) {
          lastStarAchieved = Number(ts);
        }
      });
  });
  return lastStarAchieved;
}

export function isFastestOfDay(time: number, day: string, members: Member[]) {
  if (!time) {
    return false;
  }
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    if (
      member.completion_day_level[day] &&
      member.completion_day_level[day]['2'] &&
      Number(member.completion_day_level[day]['2'].get_star_ts) < time
    ) {
      return false;
    }
  }
  return true;
}

export interface Level {
  get_star_ts: string;
}

export interface Member {
  name: string;
  stars: number;
  local_score: number;
  completion_day_level: {
    [key: string]: {
      [key: string]: Level;
    };
  };
}
