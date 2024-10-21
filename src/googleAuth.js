import { gapi } from 'gapi-script';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

export const initGoogleAPI = () => {
  return gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    });
  });
};

export const signInWithGoogle = () => {
  return gapi.auth2.getAuthInstance().signIn();
};

export const signOutFromGoogle = () => {
  return gapi.auth2.getAuthInstance().signOut();
};

export const isGoogleSignedIn = () => {
  return gapi.auth2.getAuthInstance().isSignedIn.get();
};
