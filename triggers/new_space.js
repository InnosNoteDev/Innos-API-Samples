module.exports = {
  key: 'space',
  noun: 'Space',
  // `display` controls the presentation in the Zapier Editor
  display: {
    label: 'New Space',
    description: 'Triggers when a new space is added.',
    hidden: true,
  },
  operation: {
    perform: async (z, bundle) => {
      const spaces = await z.request({
        url: 'https://innos.io/openapi/v1/spaces',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${bundle.authData.innos_token}`,
        },
        params: {
          page_size: 100,
        },
      });
      return spaces.json.results;
    },
  },
}