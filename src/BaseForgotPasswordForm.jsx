/* @flow */

import React from 'react';
import PropTypes from 'prop-types';

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
        this.props.auth
            .forgotPasswordRequest(username)
            .then(() => {
                this.props.onChange('confirm')(true);
            })
            .catch(this.props.errorHandler);
    }
    onConfirm(ee: Event) {
        const {username, confirmationCode, password} = this.props;
        ee.preventDefault();
        this.props.auth
            .forgotPasswordConfirm(username, confirmationCode, password)
            .then(() => {
                window.location = '/?passwordReset=true';
            })
            .catch(this.props.errorHandler);
    }
    render(): React.Element<any> {
        const {RequestComponent, ConfirmComponent, onChange, confirm, renderForm} = this.props;
        const {onRequest, onConfirm} = this;
        const componentProps = {
            ...this.props,
            onChange,
            onRequest,
            onConfirm
        }

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
}

const withBaseForm = BaseFormHock();
export default withBaseForm(BaseSignUpForm);
