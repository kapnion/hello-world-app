import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Box, Text, Link } from '@forge/react';
import { invoke } from '@forge/bridge';

const getPartyMessage = (pr) => {
  const themes = [
    "🎉 Congratulations! You’ve just unlocked the PR Wizard badge! 🧙‍♂️✨ Your code is now officially party-ready!",
    "🥳 You did it! This PR is feature-packed and ready to rock the world! 🎸💥",
    "🦸‍♂️ This PR is a game-changer! You've just saved the day with heroic code!",
    "🚀 This PR is out of this world! Great job, Space Explorer! 🌌",
    "⏳ Time Traveler Alert! This PR is ahead of its time! 🕰️"
  ];
  return themes[Math.floor(Math.random() * themes.length)];
};

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    invoke('getPullRequests')
      .then((res) => {
        console.log("res", res); // Inspect the data structure
        setData(res);
      })
      .catch((err) => {
        console.error('Error fetching pull requests:', err);
        setError(err);
      });
  }, []);

  if (error) {
    console.error('Error fetching pull requests:', error);
    return <Text>Error loading data</Text>;
  }

  return (
    <>
      <Text>Hello world!</Text>
      {data ? (
        <Box>
          {data.values.map((pr, index) => (
            <Box key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <Text style={{ fontWeight: 'bold' }}>Title: {pr.title}</Text>
              <Text>Author: {pr.author.display_name}</Text>
              <Text>Status: {pr.state}</Text>
              <Text>Created At: {pr.created_on}</Text>
              <Text>Source Branch: {pr.source.branch.name}</Text>
              <Text>Destination Branch: {pr.destination.branch.name}</Text>
              <Text>Repository: {pr.destination.repository.full_name}</Text>
              <Link href={pr.links.html.href} target="_blank" rel="noopener noreferrer">
                View Pull Request
              </Link>
              <Box style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                <Text>{getPartyMessage(pr)}</Text>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Text>Loading...</Text>
      )}
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
