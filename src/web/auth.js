/* @flow */
import Auth from '../auth';

var STORAGE_KEY = 'react-cognito-forms';

function testJSON(tokenString: string) {
    try {
        JSON.parse(tokenString);
        return tokenString;
    } catch(e) {
        localStorage.removeItem(STORAGE_KEY);
        console.warn('Could not parse token string.');
    }
}

const auth = new Auth({
    async storeToken(token: string): Promise {
        return localStorage.setItem(STORAGE_KEY, testJSON(token));
    },
    async retrieveToken(): Promise<string> {
        return testJSON(localStorage.getItem(STORAGE_KEY));
    }
});

export default auth;

