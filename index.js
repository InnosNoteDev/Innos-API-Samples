const authentication = require('./authentication');
const pageUpdateTrigger = require('./triggers/page_update.js');
const newBranchTrigger = require('./triggers/new_branch.js');
const newSpaceTrigger = require('./triggers/new_space.js');
const newRepoTrigger = require('./triggers/new_repo.js');
const syncToGithubAction = require('./creates/sync_to_github.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  triggers: {
    [newBranchTrigger.key]: newBranchTrigger,
    [newRepoTrigger.key]: newRepoTrigger,
    [newSpaceTrigger.key]: newSpaceTrigger,
    [pageUpdateTrigger.key]: pageUpdateTrigger,
  },
  searches: {},
  creates: {
    [syncToGithubAction.key]: syncToGithubAction,
  }
};
