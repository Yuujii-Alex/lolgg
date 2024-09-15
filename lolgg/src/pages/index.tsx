import { GetServerSideProps } from 'next';
import React from 'react';

interface Props {
  message: string;
}

export default function Home({ message }: Props) {
  return (
    <main>
      <h1>lol.gg</h1>
      <p>{message}</p>
    </main>
  );
}

// Fetch data from the custom server route on each request
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Make sure the URL matches where your custom server is running
    const res = await fetch('http://localhost:3001/custom');
    const data = await res.json();
    console.log('Data fetched:', data);
    return {
      props: {
        message: data.message,
      },
    };
  } catch (error) {
    console.error('Error fetching dataaaa:', error);
    return {
      props: {
        message: 'Error fetching dataaaa',
      },
    };
  }
};
