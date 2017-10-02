/* @flow */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BaseFormHock from './BaseFormHock';
import {FetchingState, SuccessState, ErrorState} from './RequestState';

class BaseLoginForm extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        exclude: PropTypes.arrayOf(PropTypes.string),
        onTokenChange: PropTypes.func,
        forceLogin: PropTypes.bool,
        signUpPath: PropTypes.string,
        forgotPasswordPath: PropTypes.string,
        LoginComponent: PropTypes.func.isRequired,
        VerificationComponent: PropTypes.func.isRequired,
        LoadingComponent: PropTypes.func.isRequired,
        WrappingComponent: PropTypes.func.isRequired,

        onLogin: PropTypes.func
    };

    static defaultProps = {
        renderForm: props => props.children,
        onLogin: () => {},
        forceLogin: false
    };

    onLogin: (e: Event) => void;
    onTokenChange: () => void;
    onVerified: () => void;

    constructor(props: Object) {
        super(props);
        this.onLogin = this.onLogin.bind(this);
        this.onTokenChange = this.onTokenChange.bind(this);
    }
    componentDidMount() {
        const {auth, onChange} = this.props;
        auth.subscribeTokenChange(this.onTokenChange);

        onChange('requestState')(FetchingState());
        auth
            .getToken()
            .then((token) => {
                this.onTokenChange(token);
                return auth.refreshToken();
            })
            .then(
                () => {
                    onChange({
                        isTokenValid: true,
                        requestState: SuccessState()
                    });
                },
                () => onChange('requestState')(ErrorState())
            );
    }
    onLogin(event: Event) {
        const {
            auth,
            errorHandler,
            onChange,
            onLogin,
            password,
            username
        } = this.props;

        event.preventDefault();
        onChange({
            username,
            requestState: FetchingState()
        })

        auth
            .signIn(username, password)
            .then((token: string) => {
                this.onTokenChange(token);
                onChange({
                    requestState: SuccessState(),
                    isTokenValid: true
                });
                onLogin();
            })
            .catch(errorHandler);
    }
    onTokenChange(token: string) {
        const {onChange, onTokenChange} = this.props;
        onChange('token')(token);

        if(onTokenChange) {
            onTokenChange(token);
        }
    }
    shouldExcludePath(): bool {
        const {location: {pathname}, exclude} = this.props;

        if(!exclude) {
            return false;
        }

        const shouldExclude = exclude.find((path: string): bool => {
            return pathname.startsWith(path);
        });

        return !!shouldExclude;
    }
    render(): React.Element {
        const {
            children,
            forceLogin,
            isTokenValid,
            LoadingComponent,
            LoginComponent,
            renderForm,
            requestState,
            token,
            VerificationComponent,
            verify,
            WrappingComponent
        } = this.props;

        const componentProps = {
            ...this.props,
            onLogin: this.onLogin,
            onTokenChange: this.onTokenChange,
            onVerify: this.props.onVerify('/?userConfirmed=true'),
            shouldExcludePath: this.shouldExcludePath
        };

        const renderPage = () => {
            // User has yet to be verified
            if (verify === true) {
                return renderForm({
                    view: 'verification',
                    children: <VerificationComponent {...componentProps} />
                });
            }

            return renderForm({
                view: 'login',
                children: <LoginComponent {...componentProps} />
            });
        }

        // Only allow authenticated users
        if(!isTokenValid && !this.shouldExcludePath() || forceLogin) {
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

        return <WrappingComponent>{children}</WrappingComponent>;
    }
}


const withBaseForm = BaseFormHock();
export default withBaseForm(BaseLoginForm);
