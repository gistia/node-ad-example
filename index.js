const program = require('commander');
const ActiveDirectory = require('activedirectory');
const dotenv = require('dotenv');
const safeEval = require('gistia-safe-eval');

dotenv.config();

const config = {
  url: process.env.LDAP_URL,
  baseDN: process.env.LDAP_BASE_DN,
  username: process.env.LDAP_USERNAME,
  password: process.env.LDAP_PASSWORD,
  userFormatter: process.env.LDAP_BIND_TRANSFORM
    && ((user) => safeEval(process.env.LDAP_BIND_TRANSFORM, { user })),
};
const ad = new ActiveDirectory(config);

program
  .version('0.1.0')
  .description('Gistia Way CLI');

program
  .command('auth <username> <password>')
  .alias('a')
  .description('authenticate user')
  .action((user, password) => {
    ad.authenticate(user, password, (err, auth) => {
      if (err) {
        return console.log('Auth failed', err);
      }

      console.log('Authenticated');
    });
  });

program
  .command('groups <username>')
  .alias('g')
  .description('list groups for user')
  .action(user => {
    ad.getGroupMembershipForUser(user, (err, groups) => {
      if (err) { return console.log(err); }
      if (!groups || !groups.length) { return console.log('No groups'); }

      console.log(groups);
    })
  })

program.parse(process.argv);
