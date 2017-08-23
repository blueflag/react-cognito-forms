/* @flow */
import Auth from '../auth';

var STORAGE_KEY = 'react-cognito-forms';

function testJSON(tokenString: string): ?string {
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
        localStorage.setItem(STORAGE_KEY, testJSON(token));
        return token;
    },
    async retrieveToken(): Promise<string> {
        return testJSON(localStorage.getItem(STORAGE_KEY));
    }
});



// Testing Shims

// function delay(data) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => resolve({body: data}), 500);
//     });
// }
//
// function delayError(data) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => reject({body: data}), 500);
//     });
// }
// auth.signUp = () => delay();
// auth.signUpConfirm = () => delay();
// auth.signUpConfirmResend = () => delay({
//     verificationValue: 'emailssfsfsf'
// });
// auth.forgotPasswordRequest = () => delay();
// auth.forgotPasswordConfirm = () => delay();

export default auth;

