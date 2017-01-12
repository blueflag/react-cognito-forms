/* @flow */

import React from 'react';
import auth from '../auth';

export default class Logout extends React.Component {
    componentWillMount() {
        auth.signOut();

        // Send user to homepage
        window.location = '/';
    }
    render() {
        return <div>Logging out...</div>;
    }
}
