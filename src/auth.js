// /* @flow */
import superagent from 'superagent';

export default class Authorization {
    constructor(props: Object = {}) {
        async function defaultStoreToken(token: string): Promise<string> {
            return token;
        }

        async function defaultRetrieveToken(): Promise<string> {
            return JSON.stringify(this.tokenStore);
        }

        this.storeToken = props.storeToken || defaultStoreToken;
        this.retrieveToken = props.retrieveToken || defaultRetrieveToken;
        this.cognitoGatewayHost;
        this.tokenStore = {};

        this.retrieveToken()
            .then(data => {
                const {accessToken, idToken, refreshToken} = JSON.parse(data || '{}')
                this.tokenStore = {
                    accessToken,
                    idToken,
                    refreshToken
                };
            });

        this.tokenChangeSubscriptions = {
            accessToken: [],
            idToken: [],
            refreshToken: []
        }


    }
    setCognitoGatewayHost(host: string) {
        this.cognitoGatewayHost = host;
    }
    post(url: string, query: Object): Promise {
        return this.getToken()
            .then(token => {
                return new Promise((resolve, reject) => {
                    superagent
                        .post(`${this.cognitoGatewayHost}${url}`)
                        .set('Authorization', `Bearer ${token}`)
                        .send(query)
                        .end((err, response) => {
                            if(!response) {
                                reject(err);
                            } else if (response.ok) {
                                resolve(JSON.parse(response.text), response);
                            } else {
                                reject(response);
                            }
                        });
                });
            });
    }

    setToken(key: string, token: string) {
        this.tokenStore[key] = token;
        try {
            Promise
                .resolve()
                .then(() => {
                    return this.storeToken(JSON.stringify(this.tokenStore));
                })
                .then(() => {
                    this.onTokenChange(key, token);
                })
        } catch(e) {
            console.warn(e);
        }
    }

    getToken(key: string = 'accessToken'): Promise {
        return Promise
            .resolve()
            .then(() => this.retrieveToken() || "{}")
            .then(data => JSON.parse(data)[key]);
    }

    /*
     *  Update token from session
     */
    refreshToken(token: string): Promise {
        const refreshToken = token || this.tokenStore.refreshToken;
        if(refreshToken) {
            return this.post('/refreshToken', {refreshToken})
                .then(({accessToken, idToken}) => {
                    this.setToken('idToken', idToken);
                    this.setToken('accessToken', accessToken);
                    return accessToken;
                });
        }
    }

    /*
     *  Authenticate a User
     */
    signIn(username: string, password: string): Promise {
        return this.post('/signIn', {username, password})
            .then(({accessToken, idToken, refreshToken}) => {
                this.setToken('idToken', idToken);
                this.setToken('refreshToken', refreshToken);
                this.setToken('accessToken', accessToken);
                return accessToken;
            });
    }


    /*
     *  Sign Out
     */
    signOut() {
        this.setToken('idToken', null);
        this.setToken('accessToken', null);
        this.setToken('refreshToken', null);
    }

    signOutGlobal(): Promise {
        return this.post('/signOutGlobal')
            .then(() => {
                this.signOut();
            });

    }


    /*
     *  Register a User with the Application
     */
    signUp(username: string, password: string, attributes: Object): Promise {
        return this.post('/signUp', {username, password, attributes})
            .then(({accessToken, idToken, refreshToken}) => {
                this.setToken('accessToken', accessToken);
                this.setToken('idToken', idToken);
                this.setToken('refreshToken', refreshToken);
                return accessToken;
            });
    }

    /*
     *  Confirm a Registered, Unauthenticated User
     */
    signUpConfirm(username: string, verificationCode: string): Promise {
        return this.post('/signUpConfirm', {username, verificationCode});
    }

    /*
     *  Resends a confirmation code via SMS that confirms the registration for an unauthenticated user
     */
    signUpConfirmResend(username: string): Promise {
        return this.post('/signUpConfirmResend', {username});
    }

    /*
     *  Subscribe to any token changes
     */
    subscribeTokenChange(cb: Function, key: string = 'accessToken') {
        if (cb) {
            this.tokenChangeSubscriptions[key].push(cb);
        }
    }

    /*
     *  Notify all subscribers of token change
     */
    onTokenChange(key: string, token: string) {
        this.tokenChangeSubscriptions[key].forEach((cb: Function) => cb(token));
    }
}

