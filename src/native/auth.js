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
            console.log('fetching');
            var value = await AsyncStorage.getItem(STORAGE_KEY);
            console.log('value', value);

            return await AsyncStorage.getItem(STORAGE_KEY);
        } catch (error) {
            console.log(error);
          // Error retrieving data
        }
    }
});
