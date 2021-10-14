const getConnectionLabel = (z, bundle) => {
  return bundle.inputData.innos.name + "|" + bundle.inputData.login;
};

const testFunction = async (z, bundle) => {
  const innos = await z.request({
    url: 'https://innos.io/openapi/v1/users/me',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${bundle.authData.innos_token}`,
    }
  });
  if (innos.status !== 200) {
    throw new Error('Invalid Innos Token')
  }

  const github = await z.request({
    url: 'https://api.github.com/user',
    method: 'GET',
    headers: {
      Authorization: `token ${bundle.authData.github_token}`,
    }
  });
  if (github.status !== 200) {
    throw new Error('Invalid Github Token')
  }

  github.json.innos = innos.json

  return github
}

module.exports = {
  type: 'custom',
  test: testFunction,
  connectionLabel: getConnectionLabel,
  fields: [
    {
      computed: false,
      key: 'innos_token',
      type: 'string',
      required: true,
      helpText: 'Go to the [Innos](https://innos.io) Personal Developer page to find your API Key.',
    },
    {
      computed: false,
      key: 'github_token',
      type: 'string',
      required: true,
      helpText: 'Go to the [Github Settings](https://github.com/settings/tokens) page to find your Personal access tokens.',
    },
  ],
  customConfig: {},
};