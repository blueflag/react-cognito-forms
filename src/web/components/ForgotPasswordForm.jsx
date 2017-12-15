/* @flow */

import React from 'react';
import BaseForgotPasswordForm from '../../BaseForgotPasswordForm';
import ForgotPasswordRequestForm from './ForgotPasswordRequestForm';
import ForgotPasswordConfirmForm from './ForgotPasswordConfirmForm';
import auth from '../auth';

var LoadingComponent = () => <div>Loading...</div>;

export default class LoginFormWrapper extends React.Component {
    render(): React.Element {
        return <BaseForgotPasswordForm
            auth={auth}
            RequestComponent={ForgotPasswordRequestForm}
            ConfirmComponent={ForgotPasswordConfirmForm}
            LoadingComponent={LoadingComponent}
            {...this.props}
        />;
    }
}
