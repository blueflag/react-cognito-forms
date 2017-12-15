/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';
import Label from 'stampy/lib/component/field/Label';
import Messages from './Messages';
import {UsernamePropTypes, UsernameDefaultProps} from './Props';
export default function ForgotPasswordRequestForm(props: Object): React.Element {
    const {
        errors,
        loginPath,
        onChange,
        onRequest,
        username,
        usernameProps
    } = props;

    return <div>
        <form className="ReactCognitoForm" onSubmit={onRequest} method="post">
            <Label spruceName="ReactCognitoFormLabel">{usernameProps.label}</Label>
            <Input
                spruceName="ReactCognitoFormInput"
                modifier="text"
                value={username}
                onChange={onChange('username')}
                inputProps={{autoComplete: 'username'}}
                {...usernameProps}
            />
            <Button spruceName="ReactCognitoFormButton" type="submit">Reset Password</Button>
        </form>
        <Messages errors={errors} />
        <div>
            {loginPath && <a className="ReactCognitoFormLink ReactCognitoFormLink-login" href={loginPath}>Back to login</a>}
        </div>
    </div>;
}

ForgotPasswordRequestForm.propTypes = {
    errors: PropTypes.array,
    loginPath: PropTypes.string,
    onChange: PropTypes.func,
    onRequest: PropTypes.func,
    username: PropTypes.string,
    usernameProps: UsernamePropTypes
};

ForgotPasswordRequestForm.defaultProps = {
    usernameProps: UsernameDefaultProps
};
