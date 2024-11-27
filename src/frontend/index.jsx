import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Box, Text, Link, Button, User } from '@forge/react'; // Import User
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

const getAchievement = (pr) => {
  if (pr.state === 'MERGED') {
    return "Merge Unicorn: For a PR that's perfectly merged with no conflicts.";
  }
  if (pr.title.toLowerCase().includes('fix')) {
    return "Bug Fixing Ninja: For a PR that resolves multiple bugs.";
  }
  if (pr.title.toLowerCase().includes('refactor')) {
    return "Code Refactor Master: For a PR that refactors a large chunk of code.";
  }
  return null;
};

const getMilestone = (pr) => {
  if (pr.state === 'OPEN') {
    return "Code Review Party! 🎉";
  }
  if (pr.state === 'MERGED') {
    return "The Big Merge! 🎊";
  }
  return null;
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
              <User accountId={pr.author.account_id} /> {/* Use User component */}
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
                {getAchievement(pr) && <Text style={{ marginTop: '5px', fontStyle: 'italic' }}>{getAchievement(pr)}</Text>}
                {getMilestone(pr) && <Text style={{ marginTop: '5px', fontStyle: 'italic' }}>{getMilestone(pr)}</Text>}
                <Button onClick={() => alert('🎉 Let’s merge this PR with a celebration dance! 💃')} >
                🎉 React"</Button>
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
