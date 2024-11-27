import Resolver from '@forge/resolver';
import api from '@forge/api';

const resolver = new Resolver();

resolver.define('getPullRequests', async (req) => {
  const response = await api.asApp().requestBitbucket('/2.0/repositories/{workspace}/{repo_slug}/pullrequests', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data.values;
});

export const handler = resolver.getDefinitions();
