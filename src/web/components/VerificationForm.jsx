/* @flow */
import React from 'react';
import Errors from './Errors';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';

export default class VerificationForm extends React.Component {
    static propTypes = {
        errors: React.PropTypes.array,
        onChange: React.PropTypes.func,
        onResendVerificationCode: React.PropTypes.func,
        onVerified: React.PropTypes.func.isRequired,
        onVerify: React.PropTypes.func,
        username: React.PropTypes.string.isRequired,
        verificationCodeSent: React.PropTypes.bool
    };

    render(): React.Element {
        const {onChange, onVerify, onResendVerificationCode, verificationCodeSent, errors} = this.props;
        return <div>
            <form className="ReactCognitoForm" onSubmit={onVerify}>
                <label>Verification Code</label>
                <Input placeholder="Verification Code" onChange={onChange('verification')} />
                <Button type="submit">Confirm</Button>
            </form>
            <a className="ReactCognitoLink ReactCognitoLink-resendVerification" onClick={onResendVerificationCode}>Resend verification code</a>
            {verificationCodeSent && <div>Verification code has been sent!</div>}
            <Errors errors={errors} />
        </div>;
    }
}
