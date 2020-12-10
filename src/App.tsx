import React, { useEffect, useState, ReactElement } from 'react';
import { Input, Card, Dropdown, Item, CardContent } from '@axxes/design-system';
import { Doughnut, HorizontalBar, Line } from 'react-chartjs-2';
import http from './http';
import './App.scss';
import {
  averageScorePerGroup,
  averageStarsPerGroup,
  getPlayersData,
  getPlayerSolveTimes,
  getPlayersPerCCData,
  totalStars,
} from './charts';
import {
  getLastStarAchieved,
  getMaxLevel,
  getPlayerInfo,
  getSortedPlayersByStars,
  isFastestOfDay,
  Member,
} from './players';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

// const d = require('./data.json');

const GRAPHS = [
  {
    name: 'Score',
    value: 'SCORE',
  },
  {
    name: 'Solve Time per player',
    value: 'SOLVE_TIME',
  },
  {
    name: 'Stars / CC',
    value: 'STARS_PER_CC',
  },
  {
    name: 'Players / CC',
    value: 'PLAYERS_PER_CC',
  },
  {
    name: 'Average Stars / CC',
    value: 'AVERAGE_STARS_PER_CC',
  },
  {
    name: 'Average Score / CC',
    value: 'AVERAGE_SCORE_PER_CC',
  },
  {
    name: 'Total Stars Spread',
    value: 'TOTAL_STARS_SPREAD',
  },
];

function Levels({
  member,
  maxLevel,
  otherMembers,
}: {
  member: Member;
  maxLevel: number;
  otherMembers: Member[];
}) {
  const [levels, setLevels] = useState<ReactElement[]>([]);

  useEffect(() => {
    const levels = [];
    for (let i = 0; i < maxLevel; i++) {
      if (member.completion_day_level[`${i + 1}`]) {
        if (member.completion_day_level[`${i + 1}`]['2']) {
          levels.push(
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className={
                isFastestOfDay(
                  Number(
                    member.completion_day_level[`${i + 1}`]['2'].get_star_ts
                  ),
                  `${i + 1}`,
                  otherMembers
                )
                  ? 'fastest'
                  : ''
              }
            />
          );
        } else {
          levels.push(<FontAwesomeIcon icon={faStarHalfAlt} key={i} />);
        }
      } else {
        levels.push(<FontAwesomeIcon icon={faStarEmpty} key={i} />);
      }
    }
    setLevels(levels);
  }, [member, otherMembers, maxLevel]);

  return <div className="levels">{levels.map((level) => level)}</div>;
}

function FormatDate({ date }: { date: Date }) {
  return (
    <span>{`${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}/${
      date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    }/${date.getFullYear()} ${
      date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    }:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    }`}</span>
  );
}

function MemberTime({ members }: { members: Member[] }) {
  const [options] = useState<Item[]>(
    members.map((member) => ({
      name: member.name || `Anonymous #${member.id}`,
      value: member.id,
    }))
  );
  const [selectedMember, selectMember] = useState<Item>(options[0]);
  return (
    <>
      <Dropdown
        title="Player"
        items={options}
        value={selectedMember}
        setValue={selectMember}
      />
      <Line
        data={
          getPlayerSolveTimes(
            members.find((member) => member.id === selectedMember.value)
          )?.chartData
        }
      />
    </>
  );
}

function App() {
  const [url, updateUrl] = useState<string>(
    '/2020/leaderboard/private/view/152724.json'
  );
  const [queryError, setQueryError] = useState<boolean>(false);
  const [data, setdata] = useState<any>();
  const [playerData, setPlayerData] = useState<any>();
  const [averageStarData, setAverageStarData] = useState<any>();
  const [averageScoreData, setAverageScoreData] = useState<any>();
  const [totalStarsData, setTotalStars] = useState<any>();
  const [players, setPlayers] = useState<any>();
  const [playersPerCCData, setPlayersPerCCData] = useState<any>();
  const [maxLevel, setMaxLevel] = useState<number>(0);
  const [graph, setGraph] = useState<Item>(GRAPHS[0]);

  const refresh = () => {
    setQueryError(false);
    http
      .get(`/api${url}`)
      .then(({ data }) => {
        setdata(data);
        setPlayerData(getPlayersData(data));
        setAverageStarData(averageStarsPerGroup(data));
        setAverageScoreData(averageScorePerGroup(data));
        setTotalStars(totalStars(data));
        const players = getSortedPlayersByStars(data);
        setPlayersPerCCData(getPlayersPerCCData(players));
        setPlayers(players);
        setMaxLevel(getMaxLevel(players));
      })
      .catch(() => setQueryError(true));
  };

  return (
    <div className="App">
      <h1>Axxes Advent of Code Dashboard</h1>
      <Card>
        <CardContent>
          <Input
            warning={queryError}
            title="url"
            name="url"
            value={url}
            onChange={({ target }) => updateUrl(target.value)}
            placeholder="/2020/leaderboard/private/view/12345.json"
          />
          <br />
          <button
            disabled={!url}
            onClick={refresh}
            className="axxes-button --color-accent"
          >
            Refresh
          </button>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {!data && <span>No data loaded yet</span>}
          <h1>{data?.event}</h1>
          {data && (
            <Dropdown
              title="Graph"
              items={GRAPHS}
              value={graph}
              setValue={setGraph}
            />
          )}
          {playerData && graph.value === 'STARS_PER_CC' && (
            <div>
              <h3>Total Players: {playerData.totalPlayers}</h3>
              <HorizontalBar data={playerData.chartData} />
            </div>
          )}
          {averageStarData && graph.value === 'AVERAGE_STARS_PER_CC' && (
            <HorizontalBar data={averageStarData.chartData} />
          )}
          {averageScoreData && graph.value === 'AVERAGE_SCORE_PER_CC' && (
            <HorizontalBar data={averageScoreData.chartData} />
          )}
          {totalStarsData && graph.value === 'TOTAL_STARS_SPREAD' && (
            <div>
              <h3>Total Stars: {totalStarsData.totalStars}</h3>
              <Doughnut data={totalStarsData.chartData} />
            </div>
          )}
          {playersPerCCData && graph.value === 'PLAYERS_PER_CC' && (
            <div>
              <h3>Total Players: {playersPerCCData.totalPlayers}</h3>
              <Doughnut data={playersPerCCData.chartData} />
            </div>
          )}
          {players && graph.value === 'SOLVE_TIME' && (
            <MemberTime members={players} />
          )}
          {players && graph.value === 'SCORE' && (
            <div className="players-table">
              <h3>Active Players: {players.length}</h3>
              <div className="legend">
                <FontAwesomeIcon icon={faStar} className="fastest" /> = Fastest
                gold star solution
              </div>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Player</th>
                    <th>CC</th>
                    <th>Stars</th>
                    <th>Levels</th>
                    <th>Score</th>
                    <th>Last Star achieved</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player: Member, index: number) => (
                    <tr key={player.id}>
                      <td>{index + 1}</td>
                      <td>
                        <b>{player.name || `Anonymous #${player.id}`}</b>
                      </td>
                      <td>
                        {getPlayerInfo(players, player.name || player.id).cc}
                      </td>
                      <td>{player.stars}</td>
                      <td>
                        <Levels
                          member={player}
                          maxLevel={maxLevel}
                          otherMembers={players}
                        />
                      </td>
                      <td>{player.local_score}</td>
                      <td>
                        <FormatDate
                          date={new Date(getLastStarAchieved(player) * 1000)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
