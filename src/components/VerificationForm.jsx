/* @flow */

import React from 'react';
import {confirmRegistration, resendConfirmationCode} from '../aws';
import Errors from './Errors';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';

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

        this.onChange = this.onChange.bind(this);
        this.onVerify = this.onVerify.bind(this);
        this.onResendVerificationCode = this.onResendVerificationCode.bind(this);
    }
    onChange(key: string): Function {
        return (newValue: Object) => {
            this.setState({[key]: newValue});
        }
    }
    onVerify(e: Event) {
        e.preventDefault();

        confirmRegistration(this.props.username, this.state.verification)
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
        return <div>
            <form onSubmit={this.onVerify}>
                <label>Verification Code</label>
                <Input placeholder="Verification Code" onChange={this.onChange('verification')} />
                <Button className="w100" type="submit">Confirm</Button>
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
        </div>;
    }
}
