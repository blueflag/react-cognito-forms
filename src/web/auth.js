/* @flow */
import Auth from '../auth';

var STORAGE_KEY = 'react-cognito-forms';

const auth = new Auth({
    storeToken: (token) => localStorage.setItem(STORAGE_KEY, token),
    retrieveToken: () => localStorage.getItem(STORAGE_KEY)
});

export default auth;

