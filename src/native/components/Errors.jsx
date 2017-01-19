/* @flow */
import React from 'react';
import {Text} from 'react-native';

export default function Errors(props: Object): React.Element {
    const {errors} = props;

    if (errors.length === 0) {
        return null;
    }

    return <Text>
        {errors.map((msg: string, ii: number) => <Text key={ii}>{msg}</Text>)}
    </Text>
}
