import * as R from 'ramda'

const initial = {
	currencies: [
		{ name: 'USD', order: 0, toUsd: 1, amount: 100 },
		{ name: 'EUR', order: 1, toUsd: 1.4, amount: 200 },
		{ name: 'GBP', order: 2, toUsd: 1.2, amount: 300 }
	],
	selectedCurrency: 0,
	selectedCurrency2: 0,
	exchangeFrom: 0,
	exchangeTo: 0,
	currentRelation: 1
};

const reducer = (state = initial, action) => {
	switch (action.type) {
		case 'SELECT_CURRENCY':
			return R.merge(state, {
				selectedCurrency: action.value
			});
		case 'SELECT_CURRENCY_2':
			return R.merge(state, {
				selectedCurrency2: action.value
			});
		case 'INPUT_FROM':
			return R.merge(state, {
				exchangeFrom: action.amount
			});
		case 'INPUT_TO':
			return R.merge(state, {
				exchangeTo: state.exchangeFrom * state.currentRelation
			});
		case 'UPDATE_RELATIONS':
			return R.merge(state, {
				currencies: R.pipe(
					R.indexBy(R.prop('name')),
					R.mergeDeepLeft(
						R.map(c => ({ toUsd: c }))(action.rates)
					),
					R.values,
					R.sortBy(R.prop('order'))
				)(state.currencies)
			});
		case 'UPDATE_CURRENT_RELATION':
			return R.merge(state, {
				currentRelation: action.value
			});
		case 'EXCHANGE':
			const amountLens = R.lensPath([state.selectedCurrency, 'amount']);
			return R.merge(state, {
				currencies: R.pipe(
					R.over(R.lensPath([state.selectedCurrency, 'amount']), x => x - state.exchangeFrom),
					R.over(R.lensPath([state.selectedCurrency2, 'amount']), x => x + state.exchangeTo),
				)(state.currencies)
			});
		default:
			return state;
	}
	return state;
};

export default reducer;
