import { useState } from 'react';
import React from 'react';

import { Match } from '../types';
import Header from '../components/header';

interface SummonerData {
  id: string;
  accountId: string;
  name: string;
  summonerLevel: number;
  puuid: string;
}

export default function Home() {
  const [gameName, setGameName] = useState<string>('');
  const [tagLine, setTagLine] = useState<string>('');
  const [puuid, setPuuid] = useState<string>('');
  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);
  const [matchDetails, setMatchDetails] = useState<Match[]>([]); // Store match details here

  const handleSearch = async () => {
    try {
      // Fetch PUUID by Riot ID (gameName + tagLine)
      const accountResponse = await fetch(`/api/account?gameName=${gameName}&tagLine=${tagLine}`);
      const accountData = await accountResponse.json();
      setPuuid(accountData.puuid);
      const puuid = accountData.puuid;

      // Fetch Summoner Data using PUUID
      const summonerResponse = await fetch(`/api/summoner?puuid=${puuid}`);
      const summonerData: SummonerData = await summonerResponse.json();
      setSummonerData(summonerData);

      // Fetch Match IDs using the PUUID
      const matchIdsResponse = await fetch(`/api/matches?puuid=${puuid}`);
      const matchIds: string[] = await matchIdsResponse.json();

      // Fetch details for each match
      const matchDetailsPromises = matchIds.slice(0, matchIds.length).map(async (matchId) => {
        const matchResponse = await fetch(`/api/match?matchId=${matchId}`);
        return await matchResponse.json();
      });

      const matches = await Promise.all(matchDetailsPromises);
      setMatchDetails(matches);
      console.log('matches', matches);
    } catch (error) {
      console.error('Failed to fetch Riot ID, summoner data, or match history', error);
    }
  };

  return (
    <div>
      <Header />

      <h1></h1>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-32">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10">
          League of Legends Stats Viewer
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            lol.gg
          </h1>
          <div>
            <label htmlFor="region">region:</label>
            <select name="region" id="region">
              <option value="America">America</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
            </select>
          </div>
          <div>
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Enter Game Name (e.g., RiotPlayer)"
          />
          <input
            type="text"
            value={tagLine}
            onChange={(e) => setTagLine(e.target.value)}
            placeholder="Enter Tag Line (e.g., 1234)"
          />
          <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

      {/* Display Summoner Data */}
      {summonerData && (
        <div>
          <h2>Summoner Name: {summonerData.name}</h2>
          <p>Level: {summonerData.summonerLevel}</p>
        </div>
      )}

      {/* Display Match History */}
      {matchDetails.length > 0 ? (
        <div>
          <h2>Match History:</h2>
          <ul>
            {matchDetails.map((match) => (
              <li key={match.metadata.matchId}>
                <p>Game ID: {match.metadata.matchId}</p>
                <p>Champion Played: {findChampionPlayed(match.info.participants, puuid)}</p>
                <p>Queue: {match.info.gameMode}</p>
                <p>Season: {match.info.gameVersion}</p>
                <p>Date Played: </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p></p>
      )}
      <div
        style={{
          clipPath:
            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
      />

    </div>
  );
}

const findChampionPlayed = (participants, puuid) => {
  const participant = participants.find((p) => p.puuid === puuid);
  return participant.championName;
}
