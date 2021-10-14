module.exports = {
  key: 'branch',
  noun: 'Branch',
  // `display` controls the presentation in the Zapier Editor
  display: {
    label: 'New Branch',
    description: 'Triggers when a new branch is added.',
    hidden: true,
  },
  operation: {
    perform: async (z, bundle) => {
      if (!bundle.inputData.repo || bundle.inputData.repo === "") {
        return [];
      }

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

      const branchesRet = await z.request({
        url: `https://api.github.com/repos/${owner}/${bundle.inputData.repo}/branches`,
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${bundle.authData.github_token}`
        },
        params: {
          per_page: 100
        }
      });
      const branches = branchesRet.json;
      branches.forEach(function (item) {
        item.id = item.name;
      });
      return branches;
    },
  },
}