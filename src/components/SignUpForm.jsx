/* @flow */

import React from 'react';

import {signUp} from '../aws';

import Errors from './Errors';

export default class SignUpForm extends React.Component {
    static propTypes = {
        fields: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        usernameKey: React.PropTypes.string.isRequired,
        passwordKey: React.PropTypes.string.isRequired,
        passwordConfirmKey: React.PropTypes.string.isRequired
    };

    state: Object;
    getValues: Function;
    onSubmit: (e: Event) => void;;
    onValidate: Function;

    constructor(props: Object) {
        super(props);

        this.state = {
            isSaving: false,
            errors: []
        };

        this.getValues = this.getValues.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onValidate = this.onValidate.bind(this);
    }
    getValues(): Object {
        const {refs} = this;

        return this.props.fields
                .filter((f: Object): bool => {
                    if (f.required) {
                        return true;
                    }

                    // Ignore fields that are empty and not required
                    return !!refs[f.name].value;
                })
                .map((f: Object): Object => ({ [f.name]: refs[f.name].value }))
                .reduce((acc: Object, val: Object): Object => Object.assign(acc, val), {});
    }
    onSubmit(e: Event) {
        e.preventDefault();

        const attributes = this.getValues();
        const isValid = this.onValidate(attributes);

        if (isValid) {
            const username = attributes[this.props.usernameKey];
            const password = attributes[this.props.passwordKey];

            // Exclude password from attributes
            delete attributes[this.props.passwordKey];
            delete attributes[this.props.passwordConfirmKey];

            signUp(username, password, attributes)
                .then((x) => {
                    console.log('Created attributes...', x);
                    this.setState({newUser: true});
                })
                .catch((err: Error) => {
                    this.setState({errors: this.state.errors.concat([err.message])})
                    console.error(err.stack);
                });

            // Clear errors
            this.setState({errors: []});
        }
    }
    onValidate(attributes: Object): bool {
        const validationErrors = [];

        // Passwords must match
        if (attributes[this.props.passwordKey] !== attributes[this.props.passwordConfirmKey]) {
            validationErrors.push('Paswords do not match');
        }

        if (validationErrors.length > 0) {
            this.setState({errors: this.state.errors.concat(validationErrors)});
            return false;
        }

        return true;
    }
    render() {
        return (
            <div className="Login">
                <div className="Login_wrapper">
                    <div className="Login_form">
                        {
                            this.state.newUser
                                ? this.renderCompleted()
                                : this.renderForm()
                        }
                    </div>
                </div>
            </div>
        );
    }
    renderForm() {
        return <div>
            <form onSubmit={this.onSubmit}>
                <h1>Sign Up</h1>
                {this.renderFields()}
                {this.renderSubmitButton()}
            </form>

            <Errors errors={this.state.errors} />
        </div>;
    }
    renderFields() {
        const {fields} = this.props;

        return fields.map((field: Object) => {
            return <div className="marginRow2">
                <label htmlFor="">{field.title}</label>
                <input
                    key={field.name}
                    ref={field.name}
                    type={field.type || 'text'}
                    className="Input Input-text"
                    placeholder={field.placeholder}
                    {...field}
                />
            </div>
        });
    }
    renderSubmitButton() {
        return this.state.isSaving
                ? null
                : <button className="Button w100" type="submit">Sign Up</button>;
    }
    renderCompleted() {
        return (
            <h1>User created successfully. User can now login.</h1>
        );
    }
}
