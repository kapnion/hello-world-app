import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Fragment } from '@forge/react';
import { invoke } from '@forge/bridge';
const App = () => {
  const [pullRequests, setPullRequests] = useState(null);
  useEffect(() => {
    invoke('getPullRequests').then(setPullRequests);
  }, []);
  return (
    <Fragment style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Text variant="heading">Pull Requests</Text>
      {pullRequests ? (
        pullRequests.map(pr => (
          <Fragment key={pr.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
            <Text variant="subheading">{pr.title}</Text>
            <Text><strong>Author:</strong> {pr.author.display_name}</Text>
            <Text><strong>Status:</strong> {pr.state}</Text>
            <Text>
              <a href={pr.links.html.href} target="_blank" rel="noopener noreferrer">View on Bitbucket</a>
            </Text>
          </Fragment>
        ))
      ) : (
        <Text>Loading...</Text>
      )}
    </Fragment>
  );
};
ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
