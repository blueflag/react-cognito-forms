'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.getJwtToken = getJwtToken;
exports.updateJwtToken = updateJwtToken;
exports.signIn = signIn;
exports.signOut = signOut;
exports.signUp = signUp;
exports.confirmRegistration = confirmRegistration;
exports.resendConfirmationCode = resendConfirmationCode;
exports.subscribeTokenChange = subscribeTokenChange;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Docs: http://docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html

var _process$env = process.env,
    AWS_REGION = _process$env.AWS_REGION,
    AWS_IDENTITY_POOL_ID = _process$env.AWS_IDENTITY_POOL_ID,
    AWS_USER_POOL_ID = _process$env.AWS_USER_POOL_ID,
    AWS_USER_POOL_ARN = _process$env.AWS_USER_POOL_ARN,
    AWS_USER_POOL_CLIENT_ID = _process$env.AWS_USER_POOL_CLIENT_ID;


AWS.config.region = AWS_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: AWS_IDENTITY_POOL_ID });
AWSCognito.config.region = AWS_REGION;
AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: AWS_IDENTITY_POOL_ID });

// Need to provide placeholder keys unless unauthorised user access is enabled for user pool
AWSCognito.config.update({ accessKeyId: 'anything', secretAccessKey: 'anything' });

var poolData = {
    UserPoolId: AWS_USER_POOL_ID,
    ClientId: AWS_USER_POOL_CLIENT_ID
};

var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

// Retrieve the current user from local storage
var cognitoUser = userPool.getCurrentUser();
var jwtToken = null;
var tokenChangeSubscriptions = [];

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
function getJwtToken() {
    return jwtToken;
}

/*
 *  Update token from session
 */
function updateJwtToken() {
    if (!cognitoUser) {
        jwtToken = null;
        onTokenChange();
    } else {
        // Check if the user has a valid session
        cognitoUser.getSession(function (err, session) {
            jwtToken = !err && session.isValid() ? session.getAccessToken().getJwtToken() : null;

            onTokenChange();
        });
    }
}

/*
 *  Authenticate a User
 */
function signIn(username, password) {
    return new _promise2.default(function (resolve, reject) {
        var authenticationData = {
            Username: username,
            Password: password
        };

        var userData = {
            Username: username,
            Pool: userPool
        };

        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        var user = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        user.authenticateUser(authenticationDetails, {
            onSuccess: function onSuccess(session) {
                var token = session.getAccessToken().getJwtToken();

                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: AWS_IDENTITY_POOL_ID,
                    Logins: (0, _defineProperty3.default)({}, AWS_USER_POOL_ARN, token)
                });

                cognitoUser = user;
                updateJwtToken();

                return resolve(token);
            },
            onFailure: function onFailure(err) {
                return reject(err);
            },
            mfaRequired: function mfaRequired(codeDeliveryDetails) {
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
function signOut() {
    if (cognitoUser) {
        cognitoUser.signOut();
        cognitoUser = null;

        updateJwtToken();
    }
}

/*
 *  Register a User with the Application
 */
function signUp(username, password, attributes) {
    return new _promise2.default(function (resolve, reject) {
        // Build cognito attributes list
        var attributeList = (0, _keys2.default)(attributes).map(function (k) {
            var payload = { Name: k, Value: attributes[k] };
            return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(payload);
        });

        userPool.signUp(username, password, attributeList, null, function (err, result) {
            if (err) {
                return reject(err);
            }

            return resolve(result);

            // const cognitoUser = result.user;
            // console.log('user name is ' + cognitoUser.getUsername());
        });
    });
}

/*
 *  Confirm a Registered, Unauthenticated User
 */
function confirmRegistration(username, verificationCode) {
    return new _promise2.default(function (resolve, reject) {
        var userData = {
            Username: username,
            Pool: userPool
        };

        var user = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        user.confirmRegistration(verificationCode, true, function (err, result) {
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
function resendConfirmationCode(username) {
    return new _promise2.default(function (resolve, reject) {
        var userData = {
            Username: username,
            Pool: userPool
        };

        var user = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        user.resendConfirmationCode(function (err, result) {
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
function subscribeTokenChange(cb) {
    if (cb) {
        tokenChangeSubscriptions.push(cb);
    }
}

/*
 *  Notify all subscribers of token change
 */
function onTokenChange() {
    var token = getJwtToken();

    tokenChangeSubscriptions.forEach(function (cb) {
        return cb(token);
    });
}