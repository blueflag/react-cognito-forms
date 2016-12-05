/* @flow */

import React from 'react';
import {signOut} from '../aws';
import Login from './Login';

export default class Logout extends React.Component {
    componentWillMount() {
        signOut();

        // Send user to homepage
        window.location = '/';
    }
    render() {
        return <div>Logging out...</div>;
    }
}
