/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import {FetchingState, SuccessState} from './RequestState';
import BaseFormHock from './BaseFormHock';

class BaseSignUpForm extends React.Component {
    static propTypes = {
        RequestComponent: PropTypes.func,
        ConfirmComponent: PropTypes.func
    };

    static defaultProps = {
        renderForm: props => props.children,
        confirm: false,
        isSaving: false
    };

    state: Object;
    constructor(props: Object) {
        super(props);
        this.onConfirm = this.onConfirm.bind(this);
        this.onRequest = this.onRequest.bind(this);
    }
    onRequest(ee: Event) {
        const {username} = this.props;
        ee.preventDefault();
        this.props.onChange('requestState')(FetchingState());
        this.props.auth
            .forgotPasswordRequest(username)
            .then(() => {
                this.props.onChange('requestState')(SuccessState());
                this.props.onChange('confirm')(true);
            })
            .catch(this.props.errorHandler);
    }
    onConfirm(ee: Event) {
        const {username, confirmationCode, password} = this.props;
        ee.preventDefault();
        this.props.onChange('requestState')(FetchingState());
        this.props.auth
            .forgotPasswordConfirm(username, confirmationCode, password)
            .then(() => {
                window.location = '/?passwordReset=true';
            })
            .catch(this.props.errorHandler);
    }
    render(): React.Element<any> {
        const {
            confirm,
            ConfirmComponent,
            LoadingComponent,
            onChange,
            renderForm,
            RequestComponent,
            requestState
        } = this.props;

        const {onRequest, onConfirm} = this;
        const componentProps = {
            ...this.props,
            onChange,
            onRequest,
            onConfirm
        }

        const renderPage = () => {
            if(confirm) {
                return renderForm({
                    view: 'forgotPasswordConfirm',
                    children: <ConfirmComponent {...componentProps} />
                });
            }

            return renderForm({
                view: 'forgotPasswordRequest',
                children: <RequestComponent {...componentProps} />
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
