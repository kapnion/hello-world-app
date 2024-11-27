import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

resolver.define('getPullRequests', async ({ context }) => {
  const workspaceId = context.workspaceId;
  const repositoryId = context.extension.repository.uuid;

  console.log(`Fetching pull requests for repository ${workspaceId}/${repositoryId}`);

  try {
    const response = await api.asApp().requestBitbucket(route`/2.0/repositories/${workspaceId}/${repositoryId}/pullrequests`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('Successfully fetched pull requests:', data.values);
    return data;
  } catch (error) {
    console.error('Error fetching pull requests:', error);
    throw error;
  }
});

resolver.define('fetchRepository', async ({ context }) => {
  const workspaceId = context.workspaceId;
  const repositoryId = context.extension.repository.uuid;

  console.log(`Fetching repository ${workspaceId}/${repositoryId}`);

  try {
    const response = await api.asApp().requestBitbucket(route`/2.0/repositories/${workspaceId}/${repositoryId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('Successfully fetched repository:', data);
    return data;
  } catch (error) {
    console.error('Error fetching repository:', error);
    throw error;
  }
});

export const handler = resolver.getDefinitions();
