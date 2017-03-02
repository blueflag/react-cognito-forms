/* @flow */

import React from 'react';
import BaseLoginForm from '../../BaseLoginForm';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';
import Label from 'stampy/lib/component/field/Label';

import VerificationForm from './VerificationForm';
import Messages from './Messages';
import auth from '../auth';

var LoadingComponent = () => <div>Loading...</div>;
var WrappingComponent = (props) => <div>{props.children}</div>;

function LoginComponent(props: Object): React.Element {
    const {forgotPasswordPath, signUpPath, onChange, onLogin, errors, messages, username, password} = props;

    return <div>
        <form className="ReactCognitoForm" onSubmit={onLogin} method="post">
            <Label>Email</Label>
            <Input modifier="text" type="email" name="email" placeholder="Email" value={username} onChange={onChange('username')}/>
            <Label>Password</Label>
            <Input modifier="text" type="password" name="password" placeholder="Password" value={password} onChange={onChange('password')}/>
            <Button type="submit">Sign In</Button>
        </form>
        <Messages errors={errors} messages={messages} />

        <div>
            {signUpPath ? <a className="ReactCognitoLink ReactCognitoLink-signup" href={signUpPath}>Create an account</a> : null}
            {forgotPasswordPath ? <a className="ReactCognitoLink ReactCognitoLink-forgotPassword" href={forgotPasswordPath}>Forgot your password?</a> : null}
        </div>

    </div>;
}

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
