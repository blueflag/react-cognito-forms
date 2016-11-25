/* @flow */

import React from 'react';
import { browserHistory } from 'react-router';

import {signOut} from '../aws';

export default class Logout extends React.Component {
    componentDidMount() {
        signOut();

        // Send user to homepage
        browserHistory.push('/');
    }
    render() {
        return (
            <div>
                Logging out...
            </div>
        );
    }
}
