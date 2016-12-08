const ActiveDirectory = require('activedirectory');
const dotenv = require('dotenv');

dotenv.config();

const config = {
  url: process.env.LDAP_URL,
  baseDN: process.env.LDAP_BASE_DN,
  username: process.env.LDAP_USERNAME,
  password: process.env.LDAP_PASSWORD,
};
const ad = new ActiveDirectory(config);

function displayAuth(auth, err) {
  if (auth) {
    console.log('Authenticated!');
  } else {
    if ((err + '').indexOf('InvalidCredentialsError') > -1) {
      console.log('Invalid credentials');
    } else {
      console.log('Auth failed', err);
    }
  }
}

ad.authenticate(process.argv[2], process.argv[3], (err, auth) => {
  if (err) {
    displayAuth(false, err);
    return;
  }

  displayAuth(auth);
});
