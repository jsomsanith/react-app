import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import omit from 'lodash.omit';
import uuid from 'uuid';
import { SAGA_START, SAGA_STOP } from './constants';

export default function withSaga(WrappedComponent, saga) {
	class WithSagaWrapper extends React.Component {
		constructor(props) {
			super(props);
			this.id = uuid.v4();

			// this is done at constructor to be performed before children mount.
			// so children can perform dispatch that saga will handle
			props.dispatch({
				type: SAGA_START,
				id: this.id,
				saga,
			});
		}

		componentWillUnmount() {
			this.props.dispatch({
				type: SAGA_STOP,
				id: this.id,
			});
		}

		render() {
			return <WrappedComponent {...omit(this.props, 'dispatch')} />;
		}
	}
	WithSagaWrapper.displayName = `WithSaga(${WrappedComponent.displayName})`;
	WithSagaWrapper.propTypes = { dispatch: PropTypes.func.isRequired };

	return connect()(WithSagaWrapper);
}
