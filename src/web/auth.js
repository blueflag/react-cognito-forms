/* @flow */
import Auth from '../auth';

var STORAGE_KEY = 'react-cognito-forms';

const auth = new Auth({
    async storeToken(token: string): Promise {
        return localStorage.setItem(STORAGE_KEY, token);
    },
    async retrieveToken(): Promise<string> {
        return localStorage.getItem(STORAGE_KEY);
    }
});

export default auth;

