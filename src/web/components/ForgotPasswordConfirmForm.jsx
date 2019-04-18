/* @flow */

import React from 'react';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';
import Label from 'stampy/lib/component/field/Label';
import Messages from './Messages';

export default function ForgotPasswordConfirmForm(props: Object): React.Element {
    const {
        confirmationCode,
        confirmIntro,
        errors,
        loginPath,
        onChange,
        onConfirm,
        password
    } = props;

    return <div>
        {confirmIntro}
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
                inputProps={{autoComplete: "off"}}
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
                inputProps={{autoComplete: "off"}}
            />
            <Button spruceName="ReactCognitoFormButton" type="submit">Change Password</Button>
        </form>
        <Messages errors={errors} />
        <div>
            {loginPath && <a className="ReactCognitoFormLink ReactCognitoFormLink-login" href={loginPath}>Back to login</a>}
        </div>
    </div>;
}
