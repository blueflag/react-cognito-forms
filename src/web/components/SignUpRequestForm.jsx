/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import Input from 'stampy/lib/input/input/Input';
import Label from 'stampy/lib/component/field/Label';
import Button from 'stampy/lib/component/button/Button';

import Messages from './Messages';

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

export default function SignUpRequestForm(props: Object): React.Element {
    const {
        errors,
        fields,
        isSaving,
        loginPath,
        onChange,
        onSubmit
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
                    {hint &&
                        <Label spruceName="ReactCognitoFormLabel" modifier="sizeMilli">{hint}</Label>
                    }
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
        <div>
            {loginPath && <a className="ReactCognitoFormLink ReactCognitoFormLink-login" href={loginPath}>Already have an account?</a>}
        </div>
    </div>;
}

SignUpRequestForm.propTypes = {
    errors: PropTypes.array,
    fields: PropTypes.array,
    isSaving: PropTypes.bool,
    loginPath: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func
}
