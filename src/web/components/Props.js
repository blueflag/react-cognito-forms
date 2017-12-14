/* @flow */
import PropTypes from 'prop-types';

export const UsernamePropTypes = PropTypes.shape({
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string
});

export const UsernameDefaultProps = {
    label: "Email",
    type: "email",
    name: "email",
    placeholder: "Email"
};
