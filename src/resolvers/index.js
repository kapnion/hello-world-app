import Resolver from '@forge/resolver';
import api, { route, storage } from '@forge/api'; // Import storage

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

resolver.define('getReactions', async () => {
  try {
    const response = await storage.query().getMany();
    const reactions = response.results.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    console.log('Received reactions:', reactions); // Log received reactions
    return reactions.length ? reactions : {}; // Return empty object if no reactions
  } catch (error) {
    console.error('Error fetching reactions:', error);
    throw error;
  }
});

resolver.define('saveReaction', async ({ payload }) => {
  const { prId, reaction } = payload;
  try {
    await storage.set(prId, reaction);
    return { success: true };
  } catch (error) {
    console.error('Error saving reaction:', error);
    throw error;
  }
});

resolver.define('getCurrentUser', async () => {
  try {
    const response = await api.asApp().requestBitbucket(route`/2.0/user`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('Successfully fetched current user:', data);
    return data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
});

export const handler = resolver.getDefinitions();
