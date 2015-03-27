
import UserConfiguration from "../../persistence/user_configuration";
import StockMarketYear from "../../domain/stock_market_year";
import StockMarketProjection from "../../domain/stock_market_projection";

export default Ember.Controller.extend({

	init: function() {
		this._super();

		var self = this;
		this.get("configuration").onChange(function() {
			self.notifyPropertyChange("projection");
		});
	},

	configuration: new UserConfiguration(),

	_projection: [],
	projection: function() {
		
		var newProjection = projectionFor(this.get("configuration"));
		var projectionArray = this.get('_projection');
		var current, replacement, i;
		
		Ember.Logger.debug('projections',projectionArray, newProjection);

		for ( i = 0; i < (newProjection.numberOfYears()); i++) {
			current = projectionArray.objectAt(i);
			if (!current) {
				current = {};
				projectionArray.insertAt(i, current);
			}
			updateProjectionRow(current, newProjection.getYearOffset(i));
	    }

	    return projectionArray;

	}.property("configuration").readOnly()
});

function updateProjectionRow(obj, data) {
	Ember.set(obj, 'year', data.year());
	Ember.set(obj, 'startingBalance', data.startingBalance());
	Ember.set(obj, 'costBasis', data.startingCostBasis());
	Ember.set(obj, 'sellOrders',data.totalSellOrders().flipSign());
	Ember.set(obj, 'taxes', data.capitalGainsTaxIncurred());
	Ember.set(obj, 'growth', data.growth());
	Ember.set(obj, 'endingBalance', data.endingBalance());
}

function projectionFor(config) {
	var firstYear = new StockMarketYear(
		UserConfiguration.STARTING_YEAR,
		config.getStartingBalance(),
		config.getStartingCostBasis(),
		UserConfiguration.INTEREST_RATE,
		UserConfiguration.CAPITAL_GAINS_TAX_RATE
	);
	return new StockMarketProjection(
		firstYear,
		UserConfiguration.ENDING_YEAR,
		config.getYearlySpending()
	);
}