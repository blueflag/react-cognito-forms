/* @flow */

import React from 'react';
import {signUp} from '../aws';
import Errors from './Errors';
import Input from 'stampy/lib/input/input/Input';
import Button from 'stampy/lib/component/button/Button';

export default class SignUpForm extends React.Component {
    static propTypes = {
        fields: React.PropTypes.arrayOf(React.PropTypes.object),
        usernameKey: React.PropTypes.string,
        passwordKey: React.PropTypes.string,
        passwordConfirmKey: React.PropTypes.string
    };

    static defaultProps = {
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
    onChange(key: string): Function {
        return (newValue: Object) => {
            this.setState({
                signup: {
                    [key]: newValue
                }
            });
        }
    }

    getValues(): Object {
        const {refs} = this;

        return this.props.fields
            .filter((ff: Object): bool => {
                if (ff.required) {
                    return true;
                }

                // Ignore fields that are empty and not required
                return !!refs[ff.name].value;
            })
            .map((ff: Object): Object => ({ [ff.name]: refs[ff.name].value }))
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
        return this.props.renderForm({
            view: 'signup',
            children: this.state.newUser
                ? this.renderCompleted()
                : this.renderForm()

        });
    }
    renderForm() {
        return <div>
            <form onSubmit={this.onSubmit}>
                {this.renderFields()}
                {this.renderSubmitButton()}
            </form>
            <Errors errors={this.state.errors} />
        </div>;
    }
    renderFields() {
        const {fields} = this.props;

        return fields.map((field: Object) => {
            const {name, type, title, placeholder, ...rest} = field;
            return <div key={name} className="marginRow2">
                <label>{title}</label>
                <Input
                    name={name}
                    type={type}
                    onChange={this.onChange(name)}
                    placeholder={placeholder}
                    {...rest}
                />
            </div>
        });
    }
    renderSubmitButton() {
        return this.state.isSaving
            ? null
            : <Button className="w100" type="submit">Sign Up</Button>;
    }
    renderCompleted() {
        return <h1>User created successfully. User can now login.</h1>;
    }
}
