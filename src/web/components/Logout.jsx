/* @flow */

import React from 'react';
import auth from '../auth';

export default class Logout extends React.Component {
    componentWillMount() {
        auth
            .signOut()
            .then((data) => {
                window.location = '/';
            })
            .catch(e => console.warn(e));
    }
    render() {
        return <div>Logging out...</div>;
    }
}
