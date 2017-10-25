import React from 'react';
import Slider from 'react-slick'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import './style.css';

class Home extends React.Component {
	render() {
		return <div className='home'>
			<Slider
				className='home__slider'
				dots={true}
				afterChange={(i) => this.props.dispatch({ type: 'SELECT_CURRENCY', value: i })}
				initialSlide={this.props.selectedCurrency}
				infinite={false}
				centerMode={true}>
				{this.props.currencies.map(c =>
					<div key={c.name}>
						<h1>{c.name}</h1>
						<div>{c.amount.toFixed(2)}</div>
					</div>
				)}
			</Slider>
			<button onClick={() => this.props.dispatch(push('/exchange'))}>Exchange</button>
		</div>;
	}
};

export default connect(state => state.app)(Home)
