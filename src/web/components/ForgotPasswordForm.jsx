/* @flow */

import React from 'react';
import BaseForgotPasswordForm from '../../BaseForgotPasswordForm';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';
import Label from 'stampy/lib/component/field/Label';
import Messages from './Messages';
import auth from '../auth';

var LoadingComponent = () => <div>Loading...</div>;

function RequestComponent(props: Object): React.Element {
    const {onChange, onRequest, errors, username} = props;

    return <div>
        <form className="ReactCognitoForm" onSubmit={onRequest} method="post">
            <Label spruceName="ReactCognitoFormLabel">Email</Label>
            <Input spruceName="ReactCognitoFormInput" modifier="text" type="email" name="email" placeholder="Email" value={username} onChange={onChange('username')}/>
            <Button spruceName="ReactCognitoFormButton" type="submit">Reset Password</Button>
        </form>
        <Messages errors={errors} />
    </div>;
}

function ConfirmComponent(props: Object): React.Element {
    const {
        onChange,
        onConfirm,
        errors,
        confirmationCode,
        password
    } = props;

    return <div>
        <form autoComplete="off" className="ReactCognitoForm" onSubmit={onConfirm} method="post">
            <Label spruceName="ReactCognitoFormLabel">Verification Code</Label>
            <Input
                spruceName="ReactCognitoFormInput"
                modifier="text"
                type="text"
                name="confirmationCode"
                placeholder="e.g. 12345678"
                value={confirmationCode}
                onChange={onChange('confirmationCode')}
                inputProps={{autocomplete: "off"}}
            />
            <Label spruceName="ReactCognitoFormLabel">New Password</Label>
            <Input
                spruceName="ReactCognitoFormInput"
                modifier="text"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={onChange('password')}
                inputProps={{autocomplete: "off"}}
            />
            <Button spruceName="ReactCognitoFormButton" type="submit">Change Password</Button>
        </form>
        <Messages errors={errors} />
    </div>;
}

export default class LoginFormWrapper extends React.Component {
    render(): React.Element {
        return <BaseForgotPasswordForm
            auth={auth}
            RequestComponent={RequestComponent}
            ConfirmComponent={ConfirmComponent}
            LoadingComponent={LoadingComponent}
            {...this.props}
        />;
    }
}
