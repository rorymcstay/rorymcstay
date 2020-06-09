var authurl


const hostname = window && window.location && window.location.hostname;

// TODO here need to add logic for https or not
if (hostname === 'localhost')
{
    authurl = `http://${hostname}:3000`;
}
else if  ( hostname === '192.168.1.64')
{
    authurl = `https://${hostname}:443`; // assuming it is not a local dev server
}
else if (hostname === 'devfeedmachine.local')
{
    authurl = `https://${hostname}`;
}
if (hostname === 'feedmachine.rorymcstay.com')
{
    authurl = `https://${hostname}`;
}
if (hostname === `uatfeedmachine`)
{
    authurl = `https://${hostname}:30000`;
}

export const AUTH_URL = authurl;

export const AUTH_ENABLED = true;
export const HOME_URL='feedmachine.rorymcstay.com'
export const OAUTH_ENABLED=false;

