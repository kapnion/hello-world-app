import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Box, Text, Link } from '@forge/react'; // Import Link
import { invoke } from '@forge/bridge';
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
            <Box key={index} style={{ marginBottom: '10px' }}>
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
