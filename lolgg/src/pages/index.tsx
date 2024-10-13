import { useState } from 'react';
import React from 'react';
import { useRouter } from 'next/router';

import Header from '../components/header';

export default function Home() {
  const [gameName, setGameName] = useState<string>('');
  const [tagLine, setTagLine] = useState<string>('');
  const [region, setRegion] = useState<string>('Europe');
  const router = useRouter();

  const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    router.push(`/summoners/${region}/${gameName}-${tagLine}`);    
  };

  return (
    <>
      <Header />
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-32">
        <div className="hidden  sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10">
            League of Legends Stats Viewer
          </div>
        </div>
        <div className="text-center my-8">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            lol.gg
          </h1>
        </div>
        <form className='py-1 flex flex-row rounded-full bg-gray-300 items-center justify-between'>
            <div className='px-8 flex flex-col items-start w-1/4'>
              <small>region:</small>
              <div className="max-w-sm">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)} 
                  id="countries"
                  className="bg-gray-300 border border-gray-300 text-sm rounded-lg block w-full py-2">
                  <option value="America">America</option>
                  <option value="Asia">Asia</option>
                  <option value="Europe">Europe</option>
                </select>
              </div>
            </div>
            <div className='px-5 flex flex-col items-start w-3/4'>
              <small>search:</small>
              <div>
                <input 
                  type="search" 
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="p-2.5 z-20 w-3/6 text-sm bg-gray-300 border-s-2 border border-gray-300 focus:ring-blue-500" placeholder="Game name" required 
                  />
                <input 
                  type="search" 
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value)}
                  className="p-2.5 z-20 w-2/6 text-sm bg-gray-300 border-s-2 border border-gray-300 focus:ring-blue-500 " placeholder="#tag" required />
                <button className='w-1/6' onClick={handleSearch}>Search</button>
              </div>
            </div>
          </form>
      </div>

      
      <div
        style={{
          clipPath:
            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
      />

    </>
  );
}
