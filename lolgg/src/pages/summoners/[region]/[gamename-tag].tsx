import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import React from 'react';
import Image from 'next/image';
import Header from '../../../components/header';
import { League, Match, SummonerData } from '../../../types';


const SummonerPage = () => {
  const router = useRouter();
  const { region, 'gamename-tag': gameNameTag } = router.query as {
    region?: string;
    'gamename-tag'?: string;
  };

  const [regionState, setRegionState] = useState<string | undefined>('');
  const [gameName, setGameName] = useState<string | undefined>('');
  const [tag, setTag] = useState<string | undefined>('');
  const [puuid, setPuuid] = useState<string | undefined>(undefined);
  const [summonerData, setSummonerData] = useState<SummonerData | undefined>(undefined);
  const [matchDetails, setMatchDetails] = useState<Match[]>([]);
  const [league, setLeague] = useState<League[] | undefined>(undefined);

  // First useEffect: fetch account data and set puuid (works)
  useEffect(() => {
    async function fetchAccountData() {
      if (router.isReady && region && gameNameTag) {
        setRegionState(region);

        const [name, tag] = gameNameTag.split('-');
        setGameName(name);
        setTag(tag);

        // Fetch the account data for PUUID (works)
        const accountResponse = await fetch(`/api/account?gameName=${name}&tagLine=${tag}`);
        const accountData = await accountResponse.json();
        setPuuid(accountData.puuid);
      }
    }
    fetchAccountData();
  }, [router.isReady, region, gameNameTag]);

  // Second useEffect: fetch summoner data when puuid is set (works)
  useEffect(() => {
    async function fetchSummonerData() {
      if (puuid) {
        const summonerResponse = await fetch(`/api/summoner?puuid=${puuid}`);
        const summonerData: SummonerData = await summonerResponse.json();
        setSummonerData(summonerData);
      }
    }
    fetchSummonerData();
  }, [puuid]);

  // Third useEffect: fetch match IDs and match details when puuid is set (works)
  useEffect(() => {
    async function fetchMatchDetails() {
      if (puuid) {
        // Fetch Match IDs using the PUUID (works)
        const matchIdsResponse = await fetch(`/api/matches?puuid=${puuid}`);
        const matchIds: string[] = await matchIdsResponse.json();

        // Fetch details for each match (works)
        const matchDetailsPromises = matchIds.map(async (matchId) => {
          const matchResponse = await fetch(`/api/match?matchId=${matchId}`);
          return await matchResponse.json();
        });
        const matches = await Promise.all(matchDetailsPromises);
        setMatchDetails(matches);
      }
    }
    fetchMatchDetails();
  }, [puuid]);

  useEffect(() => {
    async function fetchCurrentLeague() {
      if (summonerData?.id) {
        const leagueResponse = await fetch(`/api/currentLeague?summonerId=${summonerData?.id}`);
        const league: League[] = await leagueResponse.json();
        setLeague(league);
        console.log(league);
      }
    }
    fetchCurrentLeague();
  }, [summonerData?.id]);


  return (
    <>
      <Header />
      <div className='container mx-auto'>
        <div className='mx-auto flex'>
          <div>
            {summonerData && (
              <Image
                src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/${summonerData.profileIconId}.png`}
                alt=""
                width={100}
                height={100}
                className='rounded-full'
              />
            )}
          </div>
          <div>
            <p>{gameName}#{tag}</p>
            <p>{regionState || 'Loading...'}</p>
            <p>Level: {summonerData?.summonerLevel || 'Loading'}</p>
          </div>

        </div>
      </div>
      <div className='container mx-auto flex my-10'>
        <div className='w-1/4'>
          {/* Display League Data */}
          {league ? (
            <div>
              <h2>Current League:</h2>
              <p>Tier: {league[0].tier}</p>
              <p>Rank: {league[0].rank}</p>
              <p>LP: {league[0].leaguePoints}</p>
              <p>Wins: {league[0].wins}</p>
              <p>Losses: {league[0].losses}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className='w-3/4'>
          {/* Display Match History */}
          {matchDetails.length > 0 ? (
            <div>
              <h2>Match History:</h2>
              <ul className='max-h-fit'>
                {matchDetails.map((match) => (
                  <li key={match.metadata.matchId}>
                    <p>Champion Played: {findChampionPlayed(match.info.participants, puuid)}</p>
                    <p>Queue: {getMatchType(match.info.queueId)}</p>
                    <p>Season: {match.info.gameVersion.slice(0, 5)}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>

      </div>

    </>
  );
}

const findChampionPlayed = (participants, puuid) => {
  const participant = participants.find((p) => p.puuid === puuid);
  return participant.championName;
}

function getMatchType(queueId: number): string {
  switch (queueId) {
    case 420:
      return "Ranked Solo/Duo";
    case 430:
      return "Normal Blind";
    case 440:
      return "Ranked Flex";
    case 400:
      return "Normal Draft";
    case 450:
      return "ARAM";
    default:
      return "Unknown Match Type";
  }
}

export default SummonerPage;
