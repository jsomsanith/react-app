/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import uuid from 'uuid';
import { SAGA_START, SAGA_STOP } from '../constants';

export default function useSaga(dispatch, saga) {
	useEffect(() => {
		const id = uuid.v4();
		dispatch({ type: SAGA_START, id, saga });

		return () => dispatch({ type: SAGA_STOP, id });
	}, []);
}
