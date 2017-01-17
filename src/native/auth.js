/* @flow */
import Auth from '../auth';
import {AsyncStorage} from 'react-native';

var STORAGE_KEY = 'react-cognito-forms';

export default new Auth({
    async storeToken(token: string): Promise {
        try {
            return await AsyncStorage.setItem(STORAGE_KEY, token);
        } catch (error) {

        }
    },
    async retrieveToken(): string {
        try {
            return await AsyncStorage.getItem(STORAGE_KEY) || '{}';
        } catch (error) {
            console.log('error', error);
            // Error retrieving data
        }
    }
});
