/* @flow */
import React from 'react';
import auth from '../auth';

import BaseSignUpForm from '../../BaseSignUpForm';
import VerificationForm from './VerificationForm';
import SignUpRequestForm from './SignUpRequestForm';

var LoadingComponent = () => <div>Loading...</div>;

export default function SignUpFormWrapper(props: Object): React.Element {
    return <BaseSignUpForm
        auth={auth}
        LoadingComponent={LoadingComponent}
        SignUpComponent={SignUpRequestForm}
        VerificationComponent={VerificationForm}
        {...props}
    />;
}
