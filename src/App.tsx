import React, { useEffect, useState, ReactElement } from 'react';
import { Input, Card, Dropdown, Item, CardContent } from '@axxes/design-system';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import http from './http';
import './App.scss';
import { averageStarsPerGroup, getPlayersData, totalStars } from './charts';
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

const d = require('./data.json');

const GRAPHS = [
  {
    name: 'Score',
    value: 'SCORE',
  },
  {
    name: 'Stars / CC',
    value: 'STARS_PER_CC',
  },
  {
    name: 'Average Stars / CC',
    value: 'AVERAGE_STARS_PER_CC',
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
          levels.push(<FontAwesomeIcon icon={faStarHalfAlt} />);
        }
      } else {
        levels.push(<FontAwesomeIcon icon={faStarEmpty} />);
      }
    }
    setLevels(levels);
  }, [member, maxLevel]);

  return <div className="levels">{levels.map((level) => level)}</div>;
}

function FormatDate({ date }: { date: Date }) {
  return (
    <span>{`${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}/${
      date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
    }/${date.getFullYear()} ${
      date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    }:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    }`}</span>
  );
}

function App() {
  const [url, updateUrl] = useState<string>();
  const [queryError, setQueryError] = useState<boolean>(false);
  const [data, setdata] = useState<any>(d);
  const [playerData, setPlayerData] = useState<any>();
  const [averageData, setAverageData] = useState<any>();
  const [totalStarsData, setTotalStars] = useState<any>();
  const [players, setPlayers] = useState<any>();
  const [maxLevel, setMaxLevel] = useState<number>(0);
  const [graph, setGraph] = useState<Item>(GRAPHS[0]);

  useEffect(() => {
    setPlayerData(getPlayersData(data));
    setAverageData(averageStarsPerGroup(data));
    setTotalStars(totalStars(data));
    const players = getSortedPlayersByStars(data);
    setPlayers(players);
    setMaxLevel(getMaxLevel(players));
  }, [data]);

  const refresh = () => {
    setQueryError(false);
    http
      .get(`/api${url}`)
      .then(({ data }) => {
        setdata(data);
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
          {averageData && graph.value === 'AVERAGE_STARS_PER_CC' && (
            <HorizontalBar data={averageData.chartData} />
          )}
          {totalStarsData && graph.value === 'TOTAL_STARS_SPREAD' && (
            <div>
              <h3>Total Stars: {totalStarsData.totalStars}</h3>
              <Doughnut data={totalStarsData.chartData} />
            </div>
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
                    <th></th>
                    <th>Player</th>
                    <th>CC</th>
                    <th>Stars</th>
                    <th>Levels</th>
                    <th>Last Star achieved</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player: Member, index: number) => (
                    <tr key={player.name}>
                      <td>{index + 1}</td>
                      <td>
                        <b>{player.name}</b>
                      </td>
                      <td>{getPlayerInfo(players, player.name).cc}</td>
                      <td>{player.stars}</td>
                      <td>
                        <Levels
                          member={player}
                          maxLevel={maxLevel}
                          otherMembers={players}
                        />
                      </td>
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
