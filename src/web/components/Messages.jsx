/* @flow */

import React from 'react';

export default function Messages(props: Object): React.Element<any> {
    const {errors = [], messages = []} = props;

    if (errors.length === 0 && messages.length === 0) {
        return null;
    }

    return <ul className="ReactCognitoFormMessage">
        {errors.map((msg: string, i: number) => <li className="ReactCognitoFormMessage_item ReactCognitoFormMessage_item-fail" key={i}>{msg}</li>)}
        {errors.length === 0 && messages.map((msg: string, i: number) => <li className="ReactCognitoFormMessage_item ReactCognitoFormMessage_item-info" key={i}>{msg}</li>)}
    </ul>
}
