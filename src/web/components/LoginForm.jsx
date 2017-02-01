/* @flow */

import React from 'react';
import BaseLoginForm from '../../BaseLoginForm';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';
import Label from 'stampy/lib/component/field/Label';

import VerificationForm from './VerificationForm';
import Errors from './Errors';
import auth from '../auth';

var LoadingComponent = () => <div>Loading...</div>;
var WrappingComponent = (props) => <div>{props.children}</div>;

function LoginComponent(props: Object): React.Element {

    const {forgotPasswordPath, signUpPath, onChange, onLogin, errors} = props;

    return <div>
        <form className="ReactCognitoForm" onSubmit={onLogin}>
            <Label>Email</Label>
            <Input modifier="text" type="email" name="email" placeholder="Email" onChange={onChange('username')}/>
            <Label>Password</Label>
            <Input modifier="text" type="password" name="password" placeholder="Password" onChange={onChange('password')}/>
            <Button type="submit">Sign In</Button>
        </form>

        <div>
            {signUpPath ? <a className="ReactCognitoLink ReactCognitoLink-signup" href={signUpPath}>Create an account</a> : null}
            {forgotPasswordPath ? <a className="ReactCognitoLink ReactCognitoLink-forgotPassword" href={forgotPasswordPath}>Forgot your password?</a> : null}
        </div>

        <Errors errors={errors} />
    </div>;
}

export default class LoginFormWrapper extends React.Component {
    render(): React.Element {
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
