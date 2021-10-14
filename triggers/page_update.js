const perform = (z, bundle) => {
  const options = {
    url: 'https://innos.io/openapi/v1/zapier/updated_pages',
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.innos_token}`,
    },
    params: {
      space_id: bundle.inputData.space_id,
    },
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    const arr = results;

    // You can do any parsing you need for results here before returning them
    arr.forEach(function (item) {
      item.original_id = item.id;
      item.id = item.id + '-' + item.last_edit_time;
    });

    return arr;
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'space_id',
        label: 'SpaceID',
        required: true,
        dynamic: 'space.id.title',
      },
    ],
    canPaginate: false,
    outputFields: [
      {
        key: 'original_id',
        label: 'PageID',
        type: 'string'
      },
    ],
    sample: {
      id: '9b184272-2dda-3051-4e86-668f5397a406-1631708075',
      original_id: '9b184272-2dda-3051-4e86-668f5397a406',
    },
  },
  key: 'page_update',
  noun: 'Page',
  display: {
    label: 'Page Update',
    description:
      'Triggers when a page is created or updated in specified space.',
    hidden: false,
    important: true,
  },
};
