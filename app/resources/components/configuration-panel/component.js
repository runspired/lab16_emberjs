import Ember from "ember";

export default Ember.Component.extend({
	startingBalance: function(key, newValue, previousValue) {
		if (arguments.length > 1) config(this).setStartingBalance(newValue);

		return config(this).getStartingBalance();
	}.property("value"),

	startingCostBasis: function(key, newValue, previousValue) {
		if (arguments.length > 1) config(this).setStartingCostBasis(newValue);

		return config(this).getStartingCostBasis();
	}.property("value"),

	yearlySpending: function(key, newValue, previousValue) {
		if (arguments.length > 1) config(this).setYearlySpending(newValue);

		return config(this).getYearlySpending();
	}.property("value")
});

function config(self) {
	return self.get("value");
}
