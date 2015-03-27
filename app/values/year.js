import failFast from "../util/fail_fast";

var Year = function Year(year) {
	failFast.unlessNumber(year);

	this._year = year;
};

Year.prototype.nextYear = function nextYear() {
	return new Year(this._year + 1);
};

Year.prototype.numberOfYearsInclusive = function numberOfYearsInclusive(endingYear) {
	failFast.unlessObject(endingYear, Year);

	return endingYear._year - this._year + 1;
};

Year.prototype.toString = function toString() {
	return this._year + "";
};

Year.prototype.renderTo = function renderTo(target) {
	target.render({
		text: this.toString(),
		negative: false,
		invalid: false
	});
};

export default Year;