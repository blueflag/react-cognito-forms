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
                    ...this.state.signup,
                    [key]: newValue
                }
            });
        }
    }

    getValues(): Object {
        const {signup} = this.state;

        return this.props.fields
            .filter((ff: Object): boolean => {
                if (ff.required) {
                    return true;
                }

                // Ignore fields that are empty and not required
                return !!signup[ff.name];
            })
            .reduce((reduction: Object, field: Object): Object => {
                reduction[field.name] = signup[field.name];
                return reduction;
            }, {});
    }
    onSubmit(e: Event) {
        e.preventDefault();

        const attributes = this.getValues();
        console.log(attributes);
        const isValid = this.onValidate(attributes);

        if (isValid) {
            const username = attributes[this.props.usernameKey];
            const password = attributes[this.props.passwordKey];

            // Exclude password from attributes
            delete attributes[this.props.passwordKey];
            delete attributes[this.props.passwordConfirmKey];

            signUp(username, password, attributes)
                .then(() => {
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
    onValidate(attributes: Object): boolean {
        const validationErrors = [];

        // Passwords must match
        if (attributes[this.props.passwordKey] !== attributes[this.props.passwordConfirmKey]) {
            validationErrors.push('Passwords do not match');
        }

        if (validationErrors.length > 0) {
            this.setState({errors: this.state.errors.concat(validationErrors)});
            return false;
        }

        return true;
    }
    render(): React.Element<any> {
        if(this.state.newUser) {
            return this.props.renderForm({
                view: 'signupComplete',
                children: <span>
                    <span>User created successfully. </span>
                    <a href="/">Please login.</a>
                </span>
            });
        }

        return this.props.renderForm({
            view: 'signup',
            children: this.renderForm()
        });
    }
    renderForm(): React.Element<any> {
        return <div>
            <form onSubmit={this.onSubmit}>
                {this.renderFields()}
                {this.state.isSaving ? null : <Button type="submit">Sign Up</Button>}
            </form>
            <Errors errors={this.state.errors} />
        </div>;
    }
    renderFields(): React.Element<any> {
        return this.props
            .fields
            .map((field: Object) => {
                const {name, type, title, placeholder, ...rest} = field;
                return <div key={name} className="ReactCognitoField">
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
}
