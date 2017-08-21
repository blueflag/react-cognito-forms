/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import Auth from './auth';

export default () => (ComposedComponent) => {
    return class BaseFormHock extends React.Component {

        static propTypes = {
            cognitoGatewayHost: PropTypes.string.isRequired
        }

        static defaultProps = {
            auth: new Auth(),
            renderForm: props => props.children
        };

        constructor(props: Object) {
            super(props);
            props.auth.setCognitoGatewayHost(props.cognitoGatewayHost);

            this.state = {
                errors: [],
                verificationCodeSent: false,
                token: null,
                loading: false
            };

            this.errorHandler = this.errorHandler.bind(this);
            this.onChange = this.onChange.bind(this);
            this.onVerify = this.onVerify.bind(this);
            this.onVerifyResend = this.onVerifyResend.bind(this);
        }
        redirectHandler(url: string = '/'): Function {
            return () => {
                window.location = url
            };
        }
        errorHandler(err: Object) {
            if(err.body) {
                this.setState({
                    errors: [err.body.message],
                    loading: false
                });

                const userNotConfirmedException = 'UserNotConfirmedException';
                if(
                    // if cognito-gateway is using v0.5.0 or higher, it is using gromit.
                    // look at contents of name for the user not confirmed exception
                    err.body.name === userNotConfirmedException

                    // @deprecated
                    // if cognito-gateway is before v0.5.0, gromit is not used
                    // so look at body.code for error message.
                    // remove this check once all cognito-gateways are using cognito-gateway v0.5.0 or higher.
                    || err.body.code === userNotConfirmedException
                ) {
                    this.setState({
                        verify: true
                    })
                }
            }
        }
        onChange(key: string): Function {
            return (newValue: Object) => {
                this.setState({[key]: newValue});
            }
        }
        onVerify(success: Function): Function {
            return (e: Event) =>  {
                e.preventDefault();
                const successHandler = (typeof success === 'function') ? success : this.redirectHandler(success);
                const {username, verification} = this.state;
                this.props.auth.signUpConfirm(username, verification)
                    .then(successHandler)
                    .catch(this.errorHandler);
            }
        }
        onVerifyResend(ee: Event) {
            ee.preventDefault();
            const {username} = this.state;

            this.props.auth.signUpConfirmResend(username)
                .then(() => {
                    this.setState({verificationCodeSent: true});
                })
                .catch(this.errorHandler);
        }
        render(): React.Element<any> {
            const messages = [];
            if(window.location.search.indexOf('passwordReset=true') !== -1) {
                messages.push('Password successfully reset. Please login.');
            }

            if(window.location.search.indexOf('userConfirmed=true') !== -1) {
                messages.push('Account successfully confirmed. Please login.');
            }

            return <ComposedComponent
                {...this.props}
                {...this.state}
                messages={messages}
                errorHandler={this.errorHandler}
                onChange={this.onChange}
                onVerify={this.onVerify}
                onVerifyResend={this.onVerifyResend}
            />;
        }
    }
}
