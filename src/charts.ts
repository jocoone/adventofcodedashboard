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

export function averageScorePerGroup({ members }: { members: Member[] }) {
  const scorePerGroup: any = {};
  GROUPS.forEach((group: string) => {
    const scores = Object.values(members)
      .filter((member: Member) => PLAYERS[group].includes(member.name))
      .map((member: Member) => member.local_score);
    scorePerGroup[group] =
      scores.reduce((acc, x) => acc + x, 0) / scores.length;
  });
  return {
    chartData: {
      labels: Object.keys(scorePerGroup),
      datasets: [
        {
          label: 'Average stars / CC',
          data: [...Object.values(scorePerGroup), 0],
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

export function getPlayerSolveTimes(member?: Member) {
  if (member) {
    const arr = new Array(new Date().getDate()).fill(0);
    const scoresDay1 = arr
      .map((_, i) => {
        return member.completion_day_level[i + 1] &&
          member.completion_day_level[i + 1]['1']
          ? member.completion_day_level[i + 1]['1'].get_star_ts
          : 0;
      })
      .map((time) => Number(time) * 1000)
      .map((time, i) =>
        time
          ? time -
            new Date(new Date().getFullYear(), 11, i + 1, 6, 0, 0).getTime()
          : 0
      )
      .map((time) => (time ? Math.round(time / 60 / 60 / 60) + 60 : 0));
    const scoresDay2 = Object.keys(member.completion_day_level)
      .map((_, i) =>
        member.completion_day_level[i + 1] &&
        member.completion_day_level[i + 1]['2']
          ? member.completion_day_level[i + 1]['2'].get_star_ts
          : 0
      )
      .map((time) => Number(time) * 1000)
      .map((time, i) =>
        time
          ? time -
            Number(member.completion_day_level[i + 1]['1'].get_star_ts) * 1000
          : 0
      )
      .map((time) => (time ? Math.round(time / 60 / 60 / 60) + 60 : 0));
    return {
      chartData: {
        labels: [...arr.map((_, i) => `${i + 1}`).map((x) => `${x} Dec`)],
        datasets: [
          {
            label: 'Part 1',
            data: [...scoresDay1],
            backgroundColor: '#E9531D',
            borderColor: 'rgba(91.4%, 32.5%, 11.4%, 0.4)',
            fill: false,
          },
          {
            label: 'Part 2',
            data: [...scoresDay2],
            backgroundColor: '#90B6BB',
            borderColor: 'rgba(56.5%, 71.4%, 73.3%, 0.4)',
            fill: false,
          },
        ],
      },
    };
  }
}
