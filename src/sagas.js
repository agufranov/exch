import { call, select, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as R from 'ramda';
import { push } from 'react-router-redux'

function* updateInputTo(action) {
	const {currentRelation, exchangeFrom} = yield select(state => R.pick(['currentRelation', 'exchangeFrom'])(state.app));
	// Logging to console, to see whether polling is working or not
	console.log('POLLING', currentRelation);
	yield put({ type: 'INPUT_TO', amount: exchangeFrom });
}

function* updateRate(action) {
	const {currencies, selectedCurrency, selectedCurrency2, exchangeFrom} = yield select(state => R.pick(['currencies', 'selectedCurrency', 'selectedCurrency2', 'exchangeFrom'])(state.app));
	const [currencyA, currencyB] = [selectedCurrency, selectedCurrency2].map(i => currencies[i]);
	const relation = currencyB.toUsd / currencyA.toUsd;
	yield put({ type: 'UPDATE_CURRENT_RELATION', value: relation });
}

let isPolling;

function* startPolling() {
	isPolling = true;
	yield put({
		type: 'UPDATE_RELATIONS',
		rates: {
			EUR: 1.4 + Math.random() * 0.2,
			GBP: 1.2 + Math.random() * 0.2
		}
	});
	yield delay(1000);
	if (isPolling) {
		yield put({ type: 'START_POLLING' });
	}
}

function* stopPolling() {
	isPolling = false;
}

function* exchange() {
	const appState = yield select(state => state.app);
	if (appState.selectedCurrency === appState.selectedCurrency2) {
		return yield put({ type: 'ERROR', message: 'Error: can\'t exchange the same currency' });
	}
	if (appState.exchangeTo <= 0) {
		return yield put({ type: 'ERROR', message: 'Error: amount should be positive' });
	}
	const myAmount = appState.currencies[appState.selectedCurrency].amount;
	if (myAmount < appState.exchangeFrom) {
		return yield put({ type: 'ERROR', message: 'Error: insufficient funds' });
	}
	yield put({ type: 'EXCHANGE' });
	yield put(push('/'));
}

function* error(action) {
	alert(action.message);
}

function* mySaga() {
	yield [
		takeLatest('INPUT_FROM', updateInputTo),
		takeLatest('SELECT_CURRENCY', updateInputTo),
		takeLatest('UPDATE_CURRENT_RELATION', updateInputTo),
		takeLatest('UPDATE_RELATIONS', updateRate),
		takeLatest('START_POLLING', startPolling),
		takeLatest('STOP_POLLING', stopPolling),
		takeLatest('EXCHANGE_CHECK', exchange),
		takeLatest('ERROR', error)
	]
}

export default mySaga;
