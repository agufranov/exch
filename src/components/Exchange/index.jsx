import React from 'react';
import Slider from 'react-slick'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import * as R from 'ramda'
import './style.css'

class Exchange extends React.Component {
	componentDidMount() {
		this.props.dispatch({ type: 'START_POLLING' });
	}

	componentWillUnmount() {
		this.props.dispatch({ type: 'STOP_POLLING' });
	}

	inputExchange(event) {
		this.props.dispatch({ type: 'INPUT_FROM', amount: +event.target.value || 0 });
	}

	render() {
		return <div className={'exchange' + (this.props.exchangeFrom ? ' exchange_has-value' : '')}>
			<div className='exchange__block'>
				<Slider
					className='exchange__slick'
					dots={true}
					afterChange={(i) => this.props.dispatch({ type: 'SELECT_CURRENCY', value: i })}
					initialSlide={this.props.selectedCurrency}
					infinite={false}
					centerMode={false}>
					{this.props.currencies.map(c =>
						<div key={c.name}>
							<h1>{c.name}</h1>
							<div>You have {c.amount.toFixed(2)}</div>
							<div>1 {c.name} = {(1 / this.props.currentRelation).toFixed(2)} {this.props.currencies[this.props.selectedCurrency2].name}</div>
						</div>
					)}
				</Slider>
				<div className='exchange__from-input-group'>
					<span className='exchange__sign'>-</span>
					<input className='exchange__from-input' value={this.props.exchangeFrom} onChange={(event) => this.inputExchange(event)}/>
				</div>
			</div>
			<div className="exchange__block">
				<Slider
					className='exchange__slick'
					dots={true}
					afterChange={(i) => this.props.dispatch({ type: 'SELECT_CURRENCY_2', value: i })}
					initialSlide={this.props.selectedCurrency2}
					infinite={false}
					centerMode={false}>
					{this.props.currencies.map(c =>
						<div key={c.name}>
							<h1>{c.name}</h1>
							<div>You have {c.amount.toFixed(2)}</div>
							<div>1 {c.name} = {this.props.currentRelation.toFixed(2)} {this.props.currencies[this.props.selectedCurrency].name}</div>
						</div>
					)}
				</Slider>
				<div className='exchange__to-value'>
					<span className='exchange__sign'>+</span>
					<div>{this.props.exchangeTo.toFixed(2)}</div>
				</div>
			</div>
			<button onClick={() => this.props.dispatch({ type: 'EXCHANGE_CHECK' })}>Exchange</button>
			<button onClick={() => this.props.dispatch(push('/'))}>Cancel</button>
		</div>
	}
}

export default connect(state => state.app)(Exchange)
