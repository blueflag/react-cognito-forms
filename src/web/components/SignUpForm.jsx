/* @flow */
import React from 'react';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';

import BaseSignUpForm from '../../BaseSignUpForm';
import auth from '../auth';
import Messages from './Messages';
import VerificationForm from './VerificationForm';

function RenderField(props: Object): React.Element<any> {
    const {
        name,
        type,
        placeholder,
        onChange,
        ...rest
    } = props;
    return <Input
        name={name}
        type={type}
        spruceName="ReactCognitoFormInput"
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
    />;
}

function SignUpComponent(props: Object): React.Element {
    const {
        isSaving,
        onSubmit,
        onChange,
        errors,
        fields
    } = props;

    const fieldItems = fields
        .map((field: Object) => {
            const {
                name,
                title,
                component: Component = RenderField
            } = field;
            return <div key={name} className="ReactCognitoField">
                <label>{title}</label>
                <Component
                    {...field}
                    onChange={onChange(name)}
                />
            </div>
        });

    return <div>
        <form onSubmit={onSubmit} method="post">
            {fieldItems}
            {isSaving ? null : <Button spruceName="ReactCognitoFormButton" type="submit">Sign Up</Button>}
        </form>
        <Messages errors={errors} />
    </div>;
}

SignUpComponent.propTypes = {
    errors: React.PropTypes.array,
    fields: React.PropTypes.array,
    isSaving: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    onSubmit: React.PropTypes.func
}

export default function SignUpFormWrapper(props: Object): React.Element {
    return <BaseSignUpForm
        {...props}
        auth={auth}
        VerificationComponent={VerificationForm}
        SignUpComponent={SignUpComponent}
    />;
}
