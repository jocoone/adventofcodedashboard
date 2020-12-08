import { GROUPS, Member, PLAYERS } from './players';

export function getPlayersData({ members }: { members: Member[] }) {
  const starsPerGroup: any = {};
  GROUPS.forEach((group: string) => {
    starsPerGroup[group] = Object.values(members)
      .filter((member: Member) => PLAYERS[group].includes(member.name))
      .map((member: Member) => member.stars)
      .reduce((acc, x) => acc + x, 0);
  });
  return {
    totalPlayers: Object.values(PLAYERS)
      .map((arr: any) => arr.length)
      .reduce((acc, x) => acc + x, 0),
    chartData: {
      labels: Object.keys(starsPerGroup),
      datasets: [
        {
          label: 'Stars per CC',
          data: [...Object.values(starsPerGroup), 0],
          backgroundColor: [
            '#E9531D',
            '#90B6BB',
            '#5B6770',
            '#035D67',
            '#1d242b',
          ],
        },
      ],
    },
  };
}

export function totalStars({ members }: { members: Member[] }) {
  const starsPerGroup: any = {};
  let totalStars = 0;
  GROUPS.forEach((group: string) => {
    const stars = Object.values(members)
      .filter((member: Member) => PLAYERS[group].includes(member.name))
      .map((member: Member) => member.stars)
      .reduce((acc, x) => acc + x, 0);
    starsPerGroup[group] = stars;
    totalStars += stars;
  });
  GROUPS.forEach(
    (group) => (starsPerGroup[group] = starsPerGroup[group] / totalStars)
  );
  return {
    totalStars,
    chartData: {
      labels: Object.keys(starsPerGroup),
      datasets: [
        {
          data: [...Object.values(starsPerGroup), 0],
          backgroundColor: [
            '#E9531D',
            '#90B6BB',
            '#5B6770',
            '#035D67',
            '#1d242b',
          ],
        },
      ],
    },
  };
}

export function getPlayersPerCCData(members: Member[]) {
  const playersPerGroup: any = {};
  GROUPS.forEach((group: string) => {
    playersPerGroup[group] = PLAYERS[group].length;
  });
  const unknownPlayers = members.filter((member) => {
    for (let i = 0; i < GROUPS.length; i++) {
      const group = GROUPS[i];
      if (PLAYERS[group].includes(member.name)) {
        return false;
      }
    }
    return true;
  }).length;
  return {
    chartData: {
      labels: [...Object.keys(playersPerGroup), 'UNKNOWN'],
      datasets: [
        {
          label: 'Players / CC',
          data: [...Object.values(playersPerGroup), unknownPlayers],
          backgroundColor: [
            '#E9531D',
            '#90B6BB',
            '#5B6770',
            '#035D67',
            '#1d242b',
          ],
        },
      ],
    },
  };
}

export function averageStarsPerGroup({ members }: { members: Member[] }) {
  const starsPerGroup: any = {};
  GROUPS.forEach((group: string) => {
    const stars = Object.values(members)
      .filter((member: Member) => PLAYERS[group].includes(member.name))
      .map((member: Member) => member.stars);
    starsPerGroup[group] = stars.reduce((acc, x) => acc + x, 0) / stars.length;
  });
  return {
    chartData: {
      labels: Object.keys(starsPerGroup),
      datasets: [
        {
          label: 'Average stars / CC',
          data: [...Object.values(starsPerGroup), 0],
          backgroundColor: [
            '#E9531D',
            '#90B6BB',
            '#5B6770',
            '#035D67',
            '#1d242b',
          ],
        },
      ],
    },
  };
}
