module.exports = {
  key: 'repo',
  noun: 'Repo',
  // `display` controls the presentation in the Zapier Editor
  display: {
    label: 'New Repo',
    description: 'Triggers when a new repo is added.',
    hidden: true,
  },
  operation: {
    perform: async (z, bundle) => {
      const meRet = await z.request({
        url: `https://api.github.com/user`,
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${bundle.authData.github_token}`
        },
        params: {}
      });
      const me = meRet.json;
      const owner = me.login;

      const reposRet = await z.request({
        url: `https://api.github.com/search/repositories?q=user:${owner}&per_page=100`,
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${bundle.authData.github_token}`
        },
        params: {}
      });
      const repos = reposRet.json.items;
      return repos;
    },
  },
}