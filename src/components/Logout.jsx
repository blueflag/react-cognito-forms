/* @flow */

import React from 'react';
import {signOut} from '../aws';

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
