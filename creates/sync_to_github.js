const perform = async (z, bundle) => {
  const pageRet = await z.request({
    url: 'https://innos.io/openapi/v1/zapier/page_textual',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.innos_token}`,
    },
    params: {
      page_id: bundle.inputData.page_id,
    },
  });
  const page = pageRet.json;

  console.log("page", page)

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

  const refRet = await z.request({
    url: `https://api.github.com/repos/${owner}/${bundle.inputData.repo}/git/ref/heads/${bundle.inputData.ref}`,
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${bundle.authData.github_token}`
    },
    params: {}
  });
  const ref = refRet.json;

  console.log("ref", ref)

  const latestCommitSha = ref.object.sha;

  const commitRet = await z.request({
    url: `https://api.github.com/repos/${owner}/${bundle.inputData.repo}/git/commits/${latestCommitSha}`,
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${bundle.authData.github_token}`
    },
    params: {}
  });
  const commit = commitRet.json;

  console.log("commit", commit)

  const treeSha = commit.tree.sha;

  // const tree = await z.request({
  //   url: 'https://api.github.com/repos/${owner}/{{bundle.inputData.repo}}/git/trees/' + treeSha,
  //   method: 'GET',
  //   headers: {
  //     Accept: 'application/vnd.github.v3+json',
  //     Authorization: `token ${bundle.authData.github_token}`
  //   },
  //   params: {}
  // }).json

  // const blob = await z.request({
  //   url: 'https://api.github.com/repos/${owner}/{{bundle.inputData.repo}}/git/blobs',
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/vnd.github.v3+json',
  //     Authorization: `token ${bundle.authData.github_token}`
  //   },
  //   body: JSON.stringify({
  //     content: page.content
  //   })
  // }).json

  const newTreeContent = [{
    "path": page.title,
    "mode": "100644",
    "type": "blob",
    "content": page.content,
  }];

  const treebody = {
    "tree": newTreeContent,
    "base_tree": treeSha,
  }

  const newTreeRet = await z.request({
    url: `https://api.github.com/repos/${owner}/${bundle.inputData.repo}/git/trees`,
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${bundle.authData.github_token}`
    },
    body: treebody
  });
  const newTree = newTreeRet.json;

  console.log("newTree", newTree)

  const newCommitRet = await z.request({
    url: `https://api.github.com/repos/${owner}/${bundle.inputData.repo}/git/commits`,
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${bundle.authData.github_token}`
    },
    body: {
      "message": `page ${page.title} updated`,
      "tree": newTree.sha,
      "parents": [commit.sha]
    }
  });
  const newCommit = newCommitRet.json;

  console.log("newCommit", newCommit)

  const newRefRet = await z.request({
    url: `https://api.github.com/repos/${owner}/${bundle.inputData.repo}/git/refs/heads/${bundle.inputData.ref}`,
    method: 'PATCH',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${bundle.authData.github_token}`
    },
    body: {
      "sha": newCommit.sha
    }
  });
  const newRef = newRefRet.json;

  console.log("newRef", newRef)

  console.log("sync success!");

  return newRef;
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'page_id',
        label: 'Page ID',
        type: 'string',
        required: true,
      },
      {
        key: 'repo',
        label: 'Github Repo',
        type: 'string',
        required: true,
        dynamic: 'repo.name.name',
        altersDynamicFields: true,
      },
      {
        key: 'ref',
        label: 'Github Branch',
        type: 'string',
        required: true,
        dynamic: 'branch.name.name',
      }
    ],
    outputFields: [
      {
        key: 'node_id',
        label: 'NodeID',
        type: 'string'
      },
    ],
    sample: {
      node_id: 'MDM6UmVmcmVmcy9oZWFkcy9mZWF0dXJlQQ=='
    },
  },
  key: 'sync_to_github',
  noun: 'Page',
  display: {
    label: 'Sync Updated Page to Github',
    description: "Sync updated page to github",
    hidden: false,
    important: true,
  },
};
