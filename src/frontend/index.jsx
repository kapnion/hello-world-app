import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Box, Text, Link, Button, User, Textfield, Label, RequiredAsterisk } from '@forge/react';
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
  const [reaction, setReaction] = useState('');
  const [reactions, setReactions] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    invoke('getCurrentUser')
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((err) => {
        console.error('Error fetching current user:', err);
      });

    invoke('getPullRequests')
      .then((res) => {
        console.log("res", res); // Inspect the data structure
        setData(res);
      })
      .catch((err) => {
        console.error('Error fetching pull requests:', err);
        setError(err);
      });

    invoke('getReactions')
      .then((res) => {
        console.log("fetched reactions", res); // Log fetched reactions
        setReactions(res);
      })
      .catch((err) => {
        console.error('Error fetching reactions:', err);
      });
  }, []);

  const handleReactionSubmit = async (prId) => {
    const newReactions = { ...reactions, [prId]: { user: currentUser, reaction } };
    setReactions(newReactions);
    await invoke('saveReaction', { prId, reaction, user: currentUser });
    setReaction('');
  };

  if (error) {
    console.error('Error fetching pull requests:', error);
    return <Text>Error loading data</Text>;
  }

  return (
    <>
      <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Hello world!</Text>
      {data ? (
        <Box style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
          {data.values.map((pr, index) => (
            <Box key={index} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>Title: {pr.title}</Text>
              <User accountId={pr.author.account_id} style={{ marginBottom: '5px' }} /> {/* Use User component */}
              <Text>Status: {pr.state}</Text>
              <Text>Created At: {new Date(pr.created_on).toLocaleString()}</Text>
              <Text>Source Branch: {pr.source.branch.name}</Text>
              <Text>Destination Branch: {pr.destination.branch.name}</Text>
              <Text>Repository: {pr.destination.repository.full_name}</Text>
              <Link href={pr.links.html.href} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none', marginTop: '10px', display: 'block' }}>
                View Pull Request
              </Link>
              <Box style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e6f7ff', borderRadius: '5px' }}>
                <Text>{getPartyMessage(pr)}</Text>
                {getAchievement(pr) && <Text style={{ marginTop: '5px', fontStyle: 'italic' }}>{getAchievement(pr)}</Text>}
                {getMilestone(pr) && <Text style={{ marginTop: '5px', fontStyle: 'italic' }}>{getMilestone(pr)}</Text>}
                <Button onClick={() => alert('🎉 Let’s merge this PR with a celebration dance! 💃')} style={{ marginTop: '10px', backgroundColor: '#28a745', color: '#fff' }}>
                  🎉 React
                </Button>
                <Label labelFor="textfield">
                  Add a reaction
                  <RequiredAsterisk />
                </Label>
                <Textfield
                  appearance="standard"
                  placeholder="Add your reaction"
                  value={reaction}
                  onChange={(e) => setReaction(e.target.value)}
                  style={{ marginTop: '10px' }}
                />
                <Button onClick={() => handleReactionSubmit(pr.id)} style={{ marginTop: '10px', backgroundColor: '#007bff', color: '#fff' }}>
                  Submit Reaction
                </Button>
                {Object.keys(reactions).length > 0 && reactions[pr.id] && (
                  <Text style={{ marginTop: '10px', fontStyle: 'italic' }}>
                    Reaction: {reactions[pr.id].reaction} by {reactions[pr.id].user.displayName}
                  </Text>
                )}
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
