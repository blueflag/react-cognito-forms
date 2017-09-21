/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import Auth from './auth';
import {ErrorState, FetchingState, SuccessState} from './RequestState';

export default () => (ComposedComponent) => {
    return class BaseFormHock extends React.Component {

        static propTypes = {
            cognitoGatewayHost: PropTypes.string.isRequired,

            /**
             * onError callback, receives an array of error objects,
             * each with at least a message property. The following
             * are examples of the error object shape:
             * e.g.
             *      {message: 'Passwords do not match'}
             *
             * or a gromit error object:
             *      {message: 'User not invited', name: 'UserNotInvited', code: 400}
             */
            onError: PropTypes.func
        }

        static defaultProps = {
            auth: new Auth(),
            renderForm: props => props.children,
            onError: (ee) => ee
        };

        constructor(props: Object) {
            super(props);
            props.auth.setCognitoGatewayHost(props.cognitoGatewayHost);

            this.state = {
                errors: [],
                verificationCodeSent: false,
                requestState: SuccessState(),
                token: null,
                isTokenValid: false,
                loading: false
            };

            this.errorHandler = this.errorHandler.bind(this);
            this.onChange = this.onChange.bind(this);
            this.onVerify = this.onVerify.bind(this);
            this.onVerifyResend = this.onVerifyResend.bind(this);
            this.onChangeRequestState = this.onChange('requestState');
        }
        redirectHandler(url: string = '/'): Function {
            return () => {
                window.location = url
            };
        }
        errorHandler(err: Object): * {
            if(err.body) {
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
                    this.onChangeRequestState(FetchingState());
                    return this.onVerifyResend(new MouseEvent({}));
                }
            }

            this.props.onError([err.body]);

            this.onChangeRequestState(ErrorState([err.body.message]));
        }
        onChange(key: *): Function {
            if(typeof key === 'object') {
                return this.setState(key);
            }
            return (newValue: Object) => {
                this.setState({[key]: newValue});
            }
        }
        onVerify(success: Function): Function {
            return (e: Event) =>  {
                e.preventDefault();

                const successHandler = (typeof success === 'function')
                    ? success
                    : this.redirectHandler(success);

                const {username, verification} = this.state;


                this.onChangeRequestState(FetchingState());
                this.props.auth
                    .signUpConfirm(username, verification)
                    .then(data => {
                        // this.onChangeRequestState(SuccessState());
                        return data;
                    })
                    .then(successHandler)
                    .catch(this.errorHandler);
            }
        }
        onVerifyResend(ee: Event) {
            ee.preventDefault();
            const {username} = this.state;

            this.onChangeRequestState(FetchingState());
            this.props.auth
                .signUpConfirmResend(username)
                .then((data) => {
                    this.setState({
                        requestState: SuccessState(),
                        errors: [],
                        verificationStatus: data,
                        verify: true,
                        verificationCodeSent: true
                    });
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
                errors={
                    this.state.requestState
                        .errorMap(ii => ii)
                        .value([])
                }
                messages={messages}
                errorHandler={this.errorHandler}
                onChange={this.onChange}
                onVerify={this.onVerify}
                onVerifyResend={this.onVerifyResend}
            />;
        }
    }
}
