import failFast from "../util/fail_fast";
import Dollars  from "./dollars";

var InvalidDollars = function() {
	this._invalid = "invalid dollars";
};
Dollars.extend(InvalidDollars);

InvalidDollars.prototype.isValid = function isValid() {
	return false;
};

InvalidDollars.prototype.plus =
InvalidDollars.prototype.minus =
InvalidDollars.prototype.subtractToZero =
InvalidDollars.prototype.percentage =
InvalidDollars.prototype.min =
	function binaryArithmetic(operand) {
		failFast.unlessDefined(operand, "operand");
		return new InvalidDollars();
	};

InvalidDollars.prototype.flipSign =
	function unaryArithmetic() {
		return new InvalidDollars();
	};

InvalidDollars.prototype.toString = function toString() {
	return "$???";
};

InvalidDollars.prototype.renderTo = function renderTo(target) {
	target.render({
		text: "$???",
		negative: false,
		invalid: true,
		tooltip: "Invalid dollar amount"
	});
};

export default InvalidDollars;