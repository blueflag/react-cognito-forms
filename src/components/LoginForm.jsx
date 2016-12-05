/* @flow */

import React, {PropTypes} from 'react';
import {signIn, getJwtToken, subscribeTokenChange, updateJwtToken} from '../aws';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';

import VerificationForm from './VerificationForm';
import Errors from './Errors';
import Login from './Login';

export default class LoginForm extends React.Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        exclude: PropTypes.arrayOf(PropTypes.string).isRequired,
        onTokenChange: PropTypes.func,
        loader: PropTypes.func,
        signUpPath: PropTypes.string,
        forgotPasswordPath: PropTypes.string
    };

    static defaultProps = {
        renderForm: props => props.children
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
        this.onChange = this.onChange.bind(this);
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
    onChange(key: string): Function {
        return (newValue: Object) => {
            this.setState({[key]: newValue});
        }
    }
    onLogin(e: Event) {
        e.preventDefault();

        const {username, password} = this.state;

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

        if (!exclude) {
            return false;
        }

        const shouldExcldue = exclude.find((path: string): bool => {
            return pathname.startsWith(path);
        });

        return !!shouldExcldue;
    }
    render(): React.Element {
        const {token, verify, username, loading} = this.state;
        const {renderForm} = this.props;

        // User has yet to be verified
        if (verify === true) {
            return renderForm({
                view: 'verification',
                children: <VerificationForm username={username} onVerified={this.onVerified} />
            });
        }
        // Only allow authenticated users
        if (!token && !this.shouldExcludePath()) {
            if(!loading) {
                return renderForm({
                    view: 'login',
                    children: this.renderForm()
                });

            } else {
                return renderForm({
                    view: 'loading',
                    children: <div>Loading...</div>
                });
            }
        }

        return <div>{this.props.children}</div>;
    }
    renderForm(): React.Element {
        const {forgotPasswordPath, signUpPath} = this.props;

        return <div>
            <form onSubmit={this.onLogin}>
                <label>Email</label>
                <Input type="email" name="email" placeholder="Email" onChange={this.onChange('username')}/>
                <label>Password</label>
                <Input type="password" name="password" placeholder="Password" onChange={this.onChange('password')}/>
                <Button className="w100" type="submit">Sign In</Button>
            </form>

            <small className="t-muted block margin-row">
                {signUpPath ? <a href={signUpPath} className="float-right">Create an account</a> : null}
                {forgotPasswordPath ? <a href={forgotPasswordPath}>Forgot your password?</a> : null}
            </small>

            <Errors errors={this.state.errors} />
        </div>;
    }
}
