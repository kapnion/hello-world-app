import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, View } from '@forge/react';
import { invoke } from '@forge/bridge';
const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    invoke('getPullRequests')
      .then((res) => {
        console.log("res", res);
        setData(res);
      })
      .catch(setError);
  }, []);

  if (error) {
    console.error('Error fetching pull requests:', error);
    return <Text>Error loading data</Text>;
  }

  return (
    <>
      <Text>Hello world!</Text>
      {data ? (
        <Text>{JSON.stringify(data, null, 2)}</Text>
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
