/* @flow */

// Docs: http://docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html

const {
    AWS_REGION,
    AWS_IDENTITY_POOL_ID,
    AWS_USER_POOL_ID,
    AWS_USER_POOL_ARN,
    AWS_USER_POOL_CLIENT_ID
} = process.env;

AWS.config.region = AWS_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: AWS_IDENTITY_POOL_ID});
AWSCognito.config.region = AWS_REGION;
AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: AWS_IDENTITY_POOL_ID});

// Need to provide placeholder keys unless unauthorised user access is enabled for user pool
AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'});

const poolData = {
    UserPoolId: AWS_USER_POOL_ID,
    ClientId: AWS_USER_POOL_CLIENT_ID
};

const userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

// Retrieve the current user from local storage
let cognitoUser = userPool.getCurrentUser();
let jwtToken = null;
let tokenChangeSubscriptions = [];

/*
 *  Init
 */
function init() {
    updateJwtToken();
}

init();

/*
 *  Get JWT for currently logged in user
 */
export function getJwtToken(): string|null {
    return jwtToken;
}

/*
 *  Update token from session
 */
export function updateJwtToken() {
    if (!cognitoUser) {
        jwtToken = null;
        onTokenChange();
    }
    else {
        // Check if the user has a valid session
        cognitoUser.getSession((err: Error, session: Object): any => {
            jwtToken = !err && session.isValid()
                    ? session.getAccessToken().getJwtToken()
                    : null;

            onTokenChange();
        });
    }
}

/*
 *  Authenticate a User
 */
export function signIn(username: string, password: string): Promise {
    return new Promise((resolve: Function, reject: Function) => {
        const authenticationData = {
            Username : username,
            Password : password
        };

        const userData = {
            Username : username,
            Pool : userPool
        };

        const authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        const user = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        user.authenticateUser(authenticationDetails, {
            onSuccess: (session: Object) => {
                const token = session.getAccessToken().getJwtToken();

                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId : AWS_IDENTITY_POOL_ID,
                    Logins : { [AWS_USER_POOL_ARN]: token }
                });

                cognitoUser = user;
                updateJwtToken();

                return resolve(token);
            },
            onFailure: (err: Error) => {
                return reject(err);
            },
            mfaRequired: (codeDeliveryDetails: Object) => {
                console.debug('mfa::codeDeliveryDetails', codeDeliveryDetails);
                // var verificationCode = prompt('Please input verification code' ,'');
                // cognitoUser.sendMFACode(verificationCode, this);
                return reject(new Error('MFA support has not been implemented yet'));
            }
        });
    });
}


/*
 *  Sign Out
 */
export function signOut() {
    if (cognitoUser) {
        cognitoUser.signOut();
        cognitoUser = null;

        updateJwtToken();
    }
}


/*
 *  Register a User with the Application
 */
export function signUp(username: string, password: string, attributes: Object) {
    return new Promise((resolve: Function, reject: Function) => {
        // Build cognito attributes list
        const attributeList = Object.keys(attributes).map((k: string) => {
            const payload = { Name: k, Value: attributes[k] };
            return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(payload);
        });

        userPool.signUp(username, password, attributeList, null, (err: Error, result: Object) => {
            if (err) { return reject(err); }

            return resolve(result);

            // const cognitoUser = result.user;
            // console.log('user name is ' + cognitoUser.getUsername());
        });
    });
}

/*
 *  Confirm a Registered, Unauthenticated User
 */
export function confirmRegistration(username: string, verificationCode: string): Promise {
    return new Promise((resolve: Function, reject: Function) => {
        const userData = {
            Username : username,
            Pool : userPool
        };

        const user = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        user.confirmRegistration(verificationCode, true, (err, result) => {
            if (err) {
                return reject(err);
            }

            return resolve(result);
        });
    });
}

/*
 *  Resends a confirmation code via SMS that confirms the registration for an unauthenticated user
 */
export function resendConfirmationCode(username: string): Promise {
    return new Promise((resolve: Function, reject: Function) => {
        const userData = {
            Username : username,
            Pool : userPool
        };

        const user = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        user.resendConfirmationCode((err: Error, result: Object) => {
            if (err) {
                return reject(err);
            }

            return resolve(result);
        });
    });
}

/*
 *  Subscribe to any token changes
 */
export function subscribeTokenChange(cb: Function) {
    if (cb) {
        tokenChangeSubscriptions.push(cb);
    }
}

/*
 *  Notify all subscribers of token change
 */
function onTokenChange() {
    const token = getJwtToken();

    tokenChangeSubscriptions.forEach((cb: Function) => cb(token));
}
