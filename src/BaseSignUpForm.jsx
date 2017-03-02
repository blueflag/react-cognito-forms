/* @flow */

import React from 'react';
import BaseFormHock from './BaseFormHock';

class BaseSignUpForm extends React.Component {
    static propTypes = {
        beforeValidation: React.PropTypes.func,
        fields: React.PropTypes.arrayOf(React.PropTypes.object),
        usernameKey: React.PropTypes.string,
        passwordKey: React.PropTypes.string,
        passwordConfirmKey: React.PropTypes.string,
        SignUpComponent: React.PropTypes.func.isRequired,
        VerificationComponent: React.PropTypes.func.isRequired
    };

    static defaultProps = {
        beforeValidation: fields => fields,
        renderForm: props => props.children,
        fields: [
            {
                name: 'name',
                title: 'Full Name',
                required: true
            },
            {
                name: 'email',
                title: 'Email',
                type: 'email',
                required: true
            },
            {
                name: 'password',
                title: 'Password',
                type: 'password',
                required: true
            },
            {
                name: 'passwordConfirm',
                title: 'Confirm Password',
                type: 'password',
                required: true
            }
        ],
        usernameKey: 'email',
        passwordKey: 'password',
        passwordConfirmKey: 'passwordConfirm'
    };

    getValues: Function;
    onSubmit: (e: Event) => void;;
    onValidate: Function;
    constructor(props: Object) {
        super(props);
        this.getValues = this.getValues.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onValidate = this.onValidate.bind(this);
    }
    getValues(): Object {
        return this.props.fields
            .filter((ff: Object): boolean => {
                if (ff.required) {
                    return true;
                }
                // Ignore fields that are empty and not required
                return !!this.props[ff.name];
            })
            .reduce((reduction: Object, field: Object): Object => {
                reduction[field.name] = this.props[field.name];
                return reduction;
            }, {});
    }
    onSubmit(e: Event) {
        e.preventDefault();

        const attributes = this.props.beforeValidation(this.getValues());
        const isValid = this.onValidate(attributes);

        if (isValid) {
            const username = attributes[this.props.usernameKey];
            const password = attributes[this.props.passwordKey];

            // Exclude password from attributes
            delete attributes[this.props.passwordKey];
            delete attributes[this.props.passwordConfirmKey];

            this.props.auth.signUp(username, password, attributes)
                .then((data) => {
                    if(data.user) {
                        this.props.onChange('username')(data.user.username);
                    }

                    this.props.onChange('verify')(true);
                })
                .catch(this.props.errorHandler);

            // Clear errors
            this.props.onChange('errors')([]);
        }
    }
    onValidate(attributes: Object): boolean {
        const validationErrors = [];

        // Passwords must match
        if (attributes[this.props.passwordKey] !== attributes[this.props.passwordConfirmKey]) {
            validationErrors.push('Passwords do not match');
        }

        if (validationErrors.length > 0) {
            this.props.onChange('errors')(this.props.errors.concat(validationErrors));
            return false;
        }

        return true;
    }
    render(): React.Element<any> {
        const {SignUpComponent, VerificationComponent, renderForm, onChange, verify} = this.props;
        const {onSubmit} = this;
        const componentProps = {
            ...this.props,
            fields: this.props.fields.map(ii => {
                var stateValue = this.props[ii.name];
                ii.value = (stateValue === undefined || stateValue === null) ? ii.defualtValue : stateValue;
                return ii;
            }),
            onVerify: this.props.onVerify('/?userConfirmed=true'),
            onChange,
            onSubmit
        }

        if (verify) {
            return renderForm({
                view: 'verification',
                children: <VerificationComponent {...componentProps} />
            });
        }

        return renderForm({
            view: 'signup',
            children: <SignUpComponent {...componentProps} />
        });
    }
}

const withBaseForm = BaseFormHock();
export default withBaseForm(BaseSignUpForm);
