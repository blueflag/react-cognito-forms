/* @flow */

import React from 'react';

import {confirmRegistration, resendConfirmationCode} from '../aws';

import Errors from './Errors';

export default class VerificationForm extends React.Component {
    static propTypes = {
        username: React.PropTypes.string.isRequired,
        onVerified: React.PropTypes.func.isRequired
    };

    state: Object;
    onVerify: (e: Event) => void;
    onResendVerificationCode: (e: Event) => void;

    constructor(props: Object) {
        super(props);

        this.state = {
            errors: []
        };

        this.onVerify = this.onVerify.bind(this);
        this.onResendVerificationCode = this.onResendVerificationCode.bind(this);
    }
    onVerify(e: Event) {
        e.preventDefault();

        const verification = this.refs.verification.value;

        confirmRegistration(this.props.username, verification)
            .then(() => {
                this.props.onVerified();
            })
            .catch((err: Error) => {
                this.setState({errors: [err.message]});
            })
    }
    onResendVerificationCode(e: Event) {
        e.preventDefault();

        resendConfirmationCode(this.props.username)
            .then(() => {
                this.setState({verificationCodeSent: true});
            })
            .catch((err: Error) => {
                this.setState({errors: [err.message]});
            });
    }
    render() {
        return <div className="Login">
            <div className="Login_wrapper">
                <div className="Login_form">
                    <form onSubmit={this.onVerify}>
                        <input className="Input Input-text" type="text" name="verification" ref="verification" placeholder="Verification Code" />
                        <button className="Button w100" type="submit">Confirm</button>
                    </form>

                    <small className="t-muted block margin-row">
                        <a href="" onClick={this.onResendVerificationCode}>Resend verification code</a>
                    </small>

                    {
                        this.state.verificationCodeSent
                            ? <div>Verification code has been sent!</div>
                            : null
                    }

                    <Errors errors={this.state.errors} />
                </div>
            </div>
        </div>;
    }
}
