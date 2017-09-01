/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import Text from 'stampy/lib/component/text/Text';
import Input from 'stampy/lib/input/input/Input';
import Label from 'stampy/lib/component/field/Label';
import Button from 'stampy/lib/component/button/Button';

import BaseSignUpForm from '../../BaseSignUpForm';
import auth from '../auth';
import Messages from './Messages';
import VerificationForm from './VerificationForm';

var LoadingComponent = () => <div>Loading...</div>;

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
                hint,
                component: Component = RenderField
            } = field;
            return <div key={name} className="ReactCognitoField">
                <Label spruceName="ReactCognitoFormLabel">
                    {title}
                    {hint && <Text modifier="smaller muted block thin">{hint}</Text>}
                </Label>
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
    errors: PropTypes.array,
    fields: PropTypes.array,
    isSaving: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func
}

export default function SignUpFormWrapper(props: Object): React.Element {
    return <BaseSignUpForm
        {...props}
        auth={auth}
        LoadingComponent={LoadingComponent}
        VerificationComponent={VerificationForm}
        SignUpComponent={SignUpComponent}
    />;
}
