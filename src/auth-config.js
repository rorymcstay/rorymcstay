let authhost;

const hostname = window && window.location && window.location.hostname;

if(hostname === 'feedmachine.rorymcstay.com') {
  authhost= 'https://10.66.66.2:30002';
} else if(hostname === 'uatfeedmachine') {
  authhost= 'https://10.66.66.2:30002';
} else {
  authhost = 'http://localhost:8080';
}

export const AUTH_URL = authhost;
export const AUTH_ENABLED = true;
export const HOME_URL='feedmachine.rorymcstay.com'
export const OAUTH_ENABLED=false;


