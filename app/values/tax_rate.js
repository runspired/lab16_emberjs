import failFast from "../util/fail_fast";
import Dollars  from "./dollars";

var TaxRate = function TaxRate(rateAsPercentage) {
	failFast.unlessNumber(rateAsPercentage, "rateAsPercentage");
	failFast.unlessTrue(rateAsPercentage >= 0, "growth rate must be positive; was " + rateAsPercentage);

	this._rate = rateAsPercentage;
};

TaxRate.prototype.simpleTaxFor = function simpleTaxFor(dollars) {
	failFast.unlessObject(dollars, Dollars, "dollars");

	return dollars.percentage(this._rate);
};

TaxRate.prototype.compoundTaxFor = function compoundTaxFor(dollars) {
	failFast.unlessObject(dollars, Dollars, "dollars");

	var compoundRate = (100 / (100 - this._rate)) - 1;
	return dollars.percentage(compoundRate * 100);
};

TaxRate.prototype.toString = function toString() {
	return this._rate + "%";
};

export default TaxRate;