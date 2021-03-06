export const GROUPS: string[] = [
  'FRONTEND',
  'JAVA',
  '.NET',
  'TESTING',
  'INFRA',
];

export const PLAYERS: any = {
  FRONTEND: [
    'Joey Comhaire',
    'Arno Chauveau',
    'Lorenzo Borghs',
    'Yannick Houbrix',
  ],
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
    'JorgiLeus',
  ],
  '.NET': [
    'leechuckfon',
    'Robin Laevaert',
    'LorenzCleymans',
    'Dario',
    'Tom Houben',
    '1114001',
  ],
  TESTING: ['JohanLaebens', 'stanleywong123', 'Bart Van Raemdonck'],
  INFRA: ['Gertjan Roggemans'],
};

export function getPlayerInfo(members: Member[], player: string) {
  const p = members.find((member) => member.name === player);
  const cc = Object.keys(PLAYERS).find((cc) => PLAYERS[cc].includes(player));
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
  return Number(member.last_star_ts);
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
  id: string;
  name: string;
  stars: number;
  local_score: number;
  last_star_ts: string;
  completion_day_level: {
    [key: string]: {
      [key: string]: Level;
    };
  };
}
