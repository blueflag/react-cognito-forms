/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import BaseFormHock from './BaseFormHock';
import {FetchingState, SuccessState, ErrorState} from './RequestState';

class BaseSignUpForm extends React.Component {
    static propTypes = {
        beforeValidation: PropTypes.func,
        afterValidation: PropTypes.func,
        onValidate: PropTypes.func,
        fields: PropTypes.arrayOf(PropTypes.object),
        usernameKey: PropTypes.string,
        passwordKey: PropTypes.string,
        passwordConfirmKey: PropTypes.string,
        SignUpComponent: PropTypes.func.isRequired,
        VerificationComponent: PropTypes.func.isRequired,
        onSignUp: PropTypes.func
    };

    static defaultProps = {
        beforeValidation: fields => fields,
        afterValidation: fields => fields,
        onValidate: () => [],
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
                required: true,
                inputProps: {
                    autoComplete: 'username'
                }
            },
            {
                name: 'password',
                title: 'Password',
                type: 'password',
                required: true,
                inputProps: {
                    autoComplete: 'password'
                }
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
        passwordConfirmKey: 'passwordConfirm',
        onSignUp: () => {}
    };

    getValues: Function;
    onSubmit: (e: Event) => void;
    onValidate: Function;
    constructor(props: Object) {
        super(props);
        this.getValues = this.getValues.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onValidate = this.onValidate.bind(this);
    }
    getDefaultValue(value: any, defaultValue: any): any {
        return (value === undefined || value === null) ? defaultValue : value;
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
                reduction[field.name] = this.getDefaultValue(this.props[field.name], field.defaultValue);
                return reduction;
            }, {});
    }
    onSubmit(e: Event) {
        e.preventDefault();
        const onChangeRequestState = this.props.onChange('requestState');
        onChangeRequestState(ErrorState([]));

        let attributes = this.props.beforeValidation(this.getValues());
        const isValid = this.onValidate(attributes);

        if (isValid) {
            attributes = this.props.afterValidation(attributes);
            const username = attributes[this.props.usernameKey];
            const password = attributes[this.props.passwordKey];

            // Exclude username and password from attributes
            delete attributes[this.props.passwordKey];
            delete attributes[this.props.passwordConfirmKey];
            delete attributes[this.props.usernameKey];

            onChangeRequestState(FetchingState());
            this.props.auth.signUp(username, password, attributes)
                .then((data) => {
                    const {verificationAttribute, verificationMedium, verificationValue} = data;

                    if(data.user) {
                        this.props.onChange('username')(data.user.username);
                    }

                    onChangeRequestState(SuccessState());
                    this.props.onChange({
                        verify: true,
                        verificationStatus: {
                            verificationAttribute,
                            verificationMedium,
                            verificationValue
                        }
                    });
                })
                .then(this.props.onSignUp)
                .catch(this.props.errorHandler);
        }
    }
    onValidate(attributes: Object): boolean {
        let validationErrors = [];

        // Passwords must match
        if (attributes[this.props.passwordKey] !== attributes[this.props.passwordConfirmKey]) {
            validationErrors.push('Passwords do not match');
        }

        validationErrors = validationErrors.concat(this.props.onValidate(attributes));

        this.props.onError(validationErrors.map(message => ({message})));

        if (validationErrors.length > 0) {
            this.props.errors
            let errors = this.props.errors.concat(validationErrors);
            let errorSet = Object.keys(errors.reduce((rr,ii) => {
                rr[ii] = ii;
                return rr;
            }, {}));
            this.props.onChange('requestState')(ErrorState(errorSet));
            return false;
        }

        return true;
    }
    render(): React.Element<any> {
        const {
            LoadingComponent,
            onChange,
            renderForm,
            requestState,
            SignUpComponent,
            VerificationComponent,
            verify
        } = this.props;

        const componentProps = {
            ...this.props,
            fields: this.props.fields.map(ii => {
                ii.value = this.getDefaultValue(this.props[ii.name], ii.defaultValue);
                return ii;
            }),
            onVerify: this.props.onVerify('/?userConfirmed=true'),
            onChange,
            onSubmit: this.onSubmit
        }

        const renderPage = () => {
            // User has yet to be verified
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

        return requestState
                .fetchingMap(() => {
                    return renderForm({
                        view: 'loading',
                        children: <LoadingComponent {...componentProps} />
                    });
                })
                .successMap(renderPage)
                .errorMap(renderPage)
                .value(null);

    }
}

const withBaseForm = BaseFormHock();
export default withBaseForm(BaseSignUpForm);
