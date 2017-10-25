import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import Home from './components/Home';
import Exchange from './components/Exchange';
import reducer from './redux/reducer';
import createHistory from 'history/createBrowserHistory'
import 'regenerator-runtime/runtime'
import createSagaMiddleware from 'redux-saga'
import sagas from './sagas';
import './style.css';

const history = createHistory();
const middleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
	combineReducers({
		app: reducer,
		routing: routerReducer
	}),
	applyMiddleware(middleware),
	applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(sagas);

ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<div>
				<Route exact path='/' component={Home}/>
				<Route path='/exchange' component={Exchange}/>
			</div>
		</ConnectedRouter>
	</Provider>,
	document.getElementById('root')
);
