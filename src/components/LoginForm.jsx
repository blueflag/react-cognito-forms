/* @flow */

import React from 'react';
import {signIn, getJwtToken, subscribeTokenChange, updateJwtToken} from '../aws';

import VerificationForm from './VerificationForm';
import Errors from './Errors';

export default class LoginForm extends React.Component {
    static propTypes = {
        location: React.PropTypes.object.isRequired,
        exclude: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        onTokenChange: React.PropTypes.func,
        loader: React.PropTypes.func,
        signUpPath: React.PropTypes.string,
        forgotPasswordPath: React.PropTypes.string
    };

    state: Object;
    onLogin: (e: Event) => void;
    onVerified: () => void;
    onTokenChange: () => void;

    constructor(props: Object) {
        super(props);

        this.state = {
            errors: [],
            token: getJwtToken(),
            loading: true
        };

        this.onLogin = this.onLogin.bind(this);
        this.onVerified = this.onVerified.bind(this);
        this.onTokenChange = this.onTokenChange.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }
    componentDidMount() {
        subscribeTokenChange(this.onTokenChange);

        // Force update token after subscription
        updateJwtToken();

        if (this.state.token && this.props.onTokenChange) {
            this.props.onTokenChange(this.state.token);
        }
    }
    onLogin(e: Event) {
        e.preventDefault();
        
        const username = this.username.value;
        const password = this.password.value;

        this.setState({
            username,
            loading: true
        });

        signIn(username, password)
            .then((t: string) => {
                this.onTokenChange(t);
            })
            .catch((err: Error) => {
                this.setState({
                    errors: [err.message],
                    verify: err.message === 'User is not confirmed.',
                    loading: false
                });
            });
    }
    onVerified() {
        this.setState({
            errors: [],
            verify: false
        });
    }
    onTokenChange(token: string) {
        this.setState({
            token: token,
            loading: false
        });

        if (this.props.onTokenChange) {
            this.props.onTokenChange(token);
        }
    }
    shouldExcludePath(): bool {
        const {location: {pathname}, exclude} = this.props;

        if (!exclude) { return false; }

        const shouldExcldue = exclude.find((path: string): bool => {

            return pathname.startsWith(path);
        });

        return !!shouldExcldue;
    }
    render(): React.Element {
        const {token, verify, username, loading} = this.state;
        const {className = ''} = this.props;

        // User has yet to be verified
        if (verify === true) {
            return <VerificationForm username={username} onVerified={this.onVerified} className={className}/>;
        }

        // Only allow authenticated users
        if (!token && !this.shouldExcludePath()) {
            return (
                <div className={`Login ${className}`}>
                    <div className="Login_wrapper">
                        {loading ? this.renderLoading() : this.renderForm()}
                    </div>
                </div>
            );
        }

        return <div className={className}>{this.props.children}</div>;
    }
    renderForm(): React.Element {
        const {forgotPasswordPath, signUpPath} = this.props;

        return <div className="Login_form">
            {this.props.logo}
            <form onSubmit={this.onLogin}>
                <label>Email</label>
                <input className="Input Input-text" type="email" name="username" ref={ii => this.username = ii} placeholder="Email" />
                <label>Password</label>
                <input className="Input Input-text" type="password" name="password" ref={ii => this.password = ii} placeholder="Password" />
                <button className="Button w100" type="submit">Sign In</button>
            </form>

            <small className="t-muted block margin-row">
                {signUpPath ? <a href={signUpPath} className="float-right">Create an account</a> : null}
                {forgotPasswordPath ? <a href={forgotPasswordPath}>Forgot your password?</a> : null}
            </small>

            <Errors errors={this.state.errors} />
        </div>;
    }
    renderLoading(): React.Element {
        if (this.props.loader) {
            return this.props.loader();
        }

        return <div>Loading...</div>;
    }
}
