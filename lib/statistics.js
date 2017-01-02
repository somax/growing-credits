function Statistics(db) {
    this.db = db;
    this._ = db._
}

Statistics.prototype.sum = function() {
	return this.db.get('credits')
        .sumBy('score')
        .value()
}
Statistics.prototype.sumRange = function(_timestampStart, _timestampEnd) {
	if( this._.isString(_timestampStart)){
		_timestampStart = new Date(_timestampStart).getTime();
	}
	if( this._.isString(_timestampEnd)){
		_timestampEnd = new Date(_timestampEnd).getTime();
	}
	return this.db.get('credits')
        .filter((o) => o.createdTime >= _timestampStart &&  o.createdTime < _timestampEnd)
        .sumBy('score')
        .value()
}
Statistics.prototype.daily = function(_year, _month, _day) {
    var _timestampStart = new Date(_year, _month, _day).getTime();
    var _timestampEnd = new Date(_year, _month, _day + 1).getTime();
    return this.sumRange(_timestampStart, _timestampEnd);
}

Statistics.prototype.monthly = function (_year, _month) {
    var _timestampStart = new Date(_year, _month, 0).getTime();
    var _timestampEnd = new Date(_year, _month + 1, 0).getTime();
    return this.sumRange(_timestampStart, _timestampEnd);
}

Statistics.prototype.yearly = function (_year) {
    var _timestampStart = new Date(_year, 0 , 0).getTime();
    var _timestampEnd = new Date(_year + 1, 0 , 0).getTime();
    return this.sumRange(_timestampStart, _timestampEnd);
}

module.exports = Statistics;
