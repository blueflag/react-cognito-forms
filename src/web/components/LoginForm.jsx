/* @flow */

import React, {PropTypes} from 'react';
import BaseLoginForm from '../../BaseLoginForm';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';

import VerificationForm from './VerificationForm';
import Errors from './Errors';

class LoginForm extends React.Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        exclude: PropTypes.arrayOf(PropTypes.string).isRequired,
        onTokenChange: PropTypes.func,
        loader: PropTypes.func,
        signUpPath: PropTypes.string,
        forgotPasswordPath: PropTypes.string,
        loginComponent: PropTypes.func,
        verificationComponent: PropTypes.func,
        loadingComponent: PropTypes.func
    };

    render(): React.Element {
        const {forgotPasswordPath, signUpPath, onChange, onLogin, errors} = this.props;

        return <div>
            <form className="ReactCognitoForm" onSubmit={onLogin}>
                <label>Email</label>
                <Input type="email" name="email" placeholder="Email" onChange={onChange('username')}/>
                <label>Password</label>
                <Input type="password" name="password" placeholder="Password" onChange={onChange('password')}/>
                <Button type="submit">Sign In</Button>
            </form>

            <div>
                {signUpPath ? <a className="ReactCognitoLink ReactCognitoLink-signup" href={signUpPath}>Create an account</a> : null}
                {forgotPasswordPath ? <a className="ReactCognitoLink ReactCognitoLink-forgotPassword" href={forgotPasswordPath}>Forgot your password?</a> : null}
            </div>

            <Errors errors={errors} />
        </div>;
    }
}

export default class LoginFormWrapper extends React.Component {
    render(): React.Element {
        return <BaseLoginForm
            {...this.props}
            LoginComponent={LoginForm}
            VerificationComponent={VerificationForm}
        />;
    }
}
