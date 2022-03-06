// Get the environment variables.
require('dotenv').config()

// Configure Cucumber.
const common = [
  'src/features/**/*.feature',
  '--require-module ts-node/register',
  '--require src/step-definitions/**/*.ts',
  '--format @cucumber/pretty-formatter',
  '--publish-quiet',
].join(' ');

module.exports = {
  default: common,
}
