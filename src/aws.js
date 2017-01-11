// /* @flow */
import superagent from 'superagent';

const {
    COGNITO_GATEWAY_HOST = ''
} = process.env;

const storagePrefix = 'react-cognito-forms';

var initalLocalStorage = localStorage.getItem(storagePrefix) || {};

var tokenStore = {
    accessToken: initalLocalStorage.accessToken,
    idToken: initalLocalStorage.idToken,
    refreshToken: initalLocalStorage.refreshToken
};

var tokenChangeSubscriptions = {
    accessToken: [],
    idToken: [],
    refreshToken: []
}

// signIn //
// signOutGlobal //
// signUp //
// signUpConfirm //
// signUpConfirmResend //
// refreshToken //
// userGet //
// userDelete //

function post(url: string, query: Object): Promise {
    return new Promise((resolve, reject) => {
        superagent
            .post(`${COGNITO_GATEWAY_HOST}${url}`)
            .set('Authorization', `Bearer ${getToken()}`)
            .send(query)
            .end((err, response) => {
                if(!response) {
                    reject(err);
                } else if (response.ok) {
                    resolve(response.body, response);
                } else {
                    reject(response);
                }
            });
    });
}

function setToken(key: string, token: string) {
    tokenStore[key] = token;
    try {
        localStorage.setItem(`${storagePrefix}`, JSON.stringify(tokenStore));
    } catch(e) {
        console.warn(e);
    }
    onTokenChange(key, token);
}

export function getToken(key: string = 'accessToken'): string {
    return JSON.parse(localStorage.getItem(storagePrefix) || "{}")[key];
}

/*
 *  Update token from session
 */
export function refreshToken(token: string): Promise {
    const refreshToken = token || tokenStore.refreshToken;
    if(refreshToken) {
        return post('/refreshToken', {refreshToken})
            .then(({accessToken, idToken}) => {
                setToken('accessToken', accessToken);
                setToken('idToken', idToken);
                return accessToken;
            });
    }
}

/*
 *  Authenticate a User
 */
export function signIn(username: string, password: string): Promise {
    return post('/signIn', {username, password})
        .then(({accessToken, idToken, refreshToken}) => {
            setToken('accessToken', accessToken);
            setToken('idToken', idToken);
            setToken('refreshToken', refreshToken);
            return accessToken;
        });
}


/*
 *  Sign Out
 */
export function signOut() {
    setToken('accessToken', null);
    setToken('idToken', null);
    setToken('refreshToken', null);
}

export function signOutGlobal(): Promise {
    return post('/signOutGlobal')
        .then(() => {
            signOut();
        });

}


/*
 *  Register a User with the Application
 */
export function signUp(username: string, password: string, attributes: Object): Promise {
    return post('/signUp', {username, password, attributes})
        .then(({accessToken, idToken, refreshToken}) => {
            setToken('accessToken', accessToken);
            setToken('idToken', idToken);
            setToken('refreshToken', refreshToken);
            return accessToken;
        });
}

/*
 *  Confirm a Registered, Unauthenticated User
 */
export function signUpConfirm(username: string, verificationCode: string): Promise {
    return post('/signUpConfirm', {username, verificationCode});
}

/*
 *  Resends a confirmation code via SMS that confirms the registration for an unauthenticated user
 */
export function signUpConfirmResend(username: string): Promise {
    return post('/signUpConfirmResend', {username});
}

/*
 *  Subscribe to any token changes
 */
export function subscribeTokenChange(cb: Function, key: string = 'accessToken') {
    if (cb) {
        tokenChangeSubscriptions[key].push(cb);
    }
}

/*
 *  Notify all subscribers of token change
 */
function onTokenChange(key: string, token: string) {
    tokenChangeSubscriptions[key].forEach((cb: Function) => cb(token));
}
