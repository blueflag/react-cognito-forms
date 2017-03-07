/* @flow */
import React from 'react';
import Messages from './Messages';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';
import Label from 'stampy/lib/component/field/Label';

export default class VerificationForm extends React.Component {
    static propTypes = {
        errors: React.PropTypes.array,
        onChange: React.PropTypes.func,
        onVerifyResend: React.PropTypes.func,
        onVerify: React.PropTypes.func,
        verificationCodeSent: React.PropTypes.bool
    };

    render(): React.Element {
        const {onChange, onVerify, onVerifyResend, verificationCodeSent, errors, verification} = this.props;
        return <div>
            <form className="ReactCognitoForm" onSubmit={onVerify} method="post">
                <Label spruceName="ReactCognitoFormLabel">Verification Code</Label>
                <Input spruceName="ReactCognitoFormInput" placeholder="Verification Code" value={verification} onChange={onChange('verification')} />
                <Button spruceName="ReactCognitoFormButton" type="submit">Confirm</Button>
            </form>
            <a className="ReactCognitoFormLink ReactCognitoFormLink-resendVerification" onClick={onVerifyResend}>Resend verification code</a>
            {verificationCodeSent && <div>Verification code has been sent!</div>}
            <Messages errors={errors} />
        </div>;
    }
}
