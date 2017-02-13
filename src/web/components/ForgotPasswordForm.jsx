/* @flow */

import React from 'react';
import BaseForgotPasswordForm from '../../BaseForgotPasswordForm';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';
import Label from 'stampy/lib/component/field/Label';
import Errors from './Errors';
import auth from '../auth';

function RequestComponent(props: Object): React.Element {
    const {onChange, onRequest, errors} = props;

    return <div>
        <form className="ReactCognitoForm" onSubmit={onRequest} method="post">
            <Label spruceName="ReactCognitoFormLabel">Email</Label>
            <Input spruceName="ReactCognitoFormInput" modifier="text" type="email" name="email" placeholder="Email" onChange={onChange('username')}/>
            <Button spruceName="ReactCognitoFormButton" type="submit">Reset Password</Button>
        </form>
        <Errors errors={errors} />
    </div>;
}

function ConfirmComponent(props: Object): React.Element {
    const {onChange, onConfirm, errors} = props;

    return <div>
        <form className="ReactCognitoForm" onSubmit={onConfirm} method="post">
            <Label spruceName="ReactCognitoFormLabel">Verification Code</Label>
            <Input spruceName="ReactCognitoFormInput" modifier="text" type="text" name="confirmationCode" placeholder="e.g. 12345678" onChange={onChange('confirmationCode')}/>
            <Label spruceName="ReactCognitoFormLabel">New Password</Label>
            <Input spruceName="ReactCognitoFormInput" modifier="text" type="password" name="password" placeholder="Password" onChange={onChange('password')}/>
            <Button spruceName="ReactCognitoFormButton" type="submit">Change Password</Button>
        </form>
        <Errors errors={errors} />
    </div>;
}

export default class LoginFormWrapper extends React.Component {
    render(): React.Element {
        return <BaseForgotPasswordForm
            auth={auth}
            RequestComponent={RequestComponent}
            ConfirmComponent={ConfirmComponent}
            {...this.props}
        />;
    }
}
