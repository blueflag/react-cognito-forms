/* @flow */

import React from 'react';

export default function Errors(props: Object) {
    const {errors} = props;

    if (errors.length === 0) {
        return null;
    }

    return <ul className="margin-row">
        {errors.map((msg: string, i: number) => <li className="Message Message-fail" key={i}>{msg}</li>)}
    </ul>
}
