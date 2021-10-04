/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import BaseLoginForm from '../../BaseLoginForm';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';
import Label from 'stampy/lib/component/field/Label';
import {UsernamePropTypes, UsernameDefaultProps} from './Props';

import VerificationForm from './VerificationForm';
import Messages from './Messages';
import auth from '../auth';

var LoadingComponent = () => <div>Loading...</div>;
var WrappingComponent = (props) => <div>{props.children}</div>;


function LoginComponent(props: Object): React.Element {
    const {
        errors,
        forgotPasswordPath,
        messages,
        onChange,
        onLogin,
        password,
        signUpPath,
        username,
        usernameProps
    } = props;

    const passwordProps = {
        name: "password",
        autoComplete: "password",
        type: "password",
        placeholder: "Password"
    }

    return <div>
        <form className="ReactCognitoForm" onSubmit={onLogin} method="post">
            <Label spruceName="ReactCognitoFormLabel">{usernameProps.label}</Label>
            <Input
                spruceName="ReactCognitoFormInput"
                modifier="text"
                value={username}
                onChange={onChange('username')}
                inputProps={{autoComplete: 'username'}}
                {...usernameProps}
            />
            <Label spruceName="ReactCognitoFormLabel">Password</Label>
            <Input
                spruceName="ReactCognitoFormInput"
                modifier="text"
                value={password}
                onChange={onChange('password')}
                inputProps={{autoComplete: 'password'}}
                {...passwordProps}
            />
            <Button spruceName="ReactCognitoFormButton" type="submit">Sign In</Button>
        </form>
        <Messages errors={errors} messages={messages} />
        <div>
            <a className="ReactCognitoFormLink ReactCognitoFormLink-forgotPassword" href={forgotPasswordPath}>Returning user? Reset password.</a>
            <a className="ReactCognitoFormLink ReactCognitoFormLink-forgotPassword" href="/signup">First time user? Sign up &amp; activate account.</a>
        </div>
    </div>;
}

LoginComponent.propTypes = {
    errors: PropTypes.array,
    forgotPasswordPath: PropTypes.string,
    messages: PropTypes.array,
    onChange: PropTypes.func,
    onLogin: PropTypes.func,
    password: PropTypes.string,
    signUpPath: PropTypes.string,
    username: PropTypes.string,
    usernameProps: UsernamePropTypes
};

LoginComponent.defaultProps = {
    usernameProps: UsernameDefaultProps
};

export default class LoginFormWrapper extends React.Component {
    render(): React.Element<any> {
        return <BaseLoginForm
            {...this.props}
            auth={auth}
            LoginComponent={LoginComponent}
            LoadingComponent={LoadingComponent}
            VerificationComponent={VerificationForm}
            WrappingComponent={WrappingComponent}
        />;
    }
}
