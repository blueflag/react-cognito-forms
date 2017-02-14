/* @flow */
import React from 'react';
import Messages from './Messages';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';

export default class VerificationForm extends React.Component {
    static propTypes = {
        errors: React.PropTypes.array,
        onChange: React.PropTypes.func,
        onVerifyResend: React.PropTypes.func,
        onVerify: React.PropTypes.func,
        verificationCodeSent: React.PropTypes.bool
    };

    render(): React.Element {
        const {onChange, onVerify, onVerifyResend, verificationCodeSent, errors} = this.props;
        return <div>
            <form className="ReactCognitoForm" onSubmit={onVerify} method="post">
                <label>Verification Code</label>
                <Input placeholder="Verification Code" onChange={onChange('verification')} />
                <Button type="submit">Confirm</Button>
            </form>
            <a className="ReactCognitoLink ReactCognitoLink-resendVerification" onClick={onVerifyResend}>Resend verification code</a>
            {verificationCodeSent && <div>Verification code has been sent!</div>}
            <Messages errors={errors} />
        </div>;
    }
}
