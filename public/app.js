angular.module('app', [])

.service('Credits', Credits)
.service('Terms', Terms)
.service('Scores', Scores)
.service('Scorers', Scorers)
.controller('MainCtrl', MainCtrl)

function Credits($http) {
	return {
		getAll: function(_param){

			// return $http.get('/api/credits?_sort=createdAt&_order=DESC',{param:param});
			return $http.get('/api/credits?_sort=createdAt&_order=DESC&_limit=30&' + _param);
		},
		getDaily: function(_param) {
			var _date = _param ? new Date(_param) : new Date();
			var _year = _date.getFullYear();
			var _month = _date.getMonth();
			var _day = _date.getDate();
			return this.getAll('createdTime_gte=' + new Date(_year,_month,_day).getTime());
		},
		getMonthly: function(_param) {
			var _date = _param ? new Date(_param) : new Date();
			var _year = _date.getFullYear();
			var _month = _date.getMonth();
			var _day = _date.getDate();
			return this.getAll('createdTime_gte=' + new Date(_year,_month,1).getTime());
		},
		getLastWeek: function() {
			var _date = new Date();
			var _year = _date.getFullYear();
			var _month = _date.getMonth();
			var _day = _date.getDate() - 7;
			return this.getAll('createdTime_gte=' + new Date(_year,_month,_day).getTime());
		},
		add: function (_newCredit) {
			_newCredit.time = new Date();
			return $http.post('/api/credits',_newCredit)
		}
	}
}

// 积分规则
function Terms($http) {
	return {
		get: function () {
			return $http.get('/api/terms');
		}
	}
}

// 记分人
function Scorers($http) {
	return {
		get: function () {
			return $http.get('/api/scorers');
		}
	}
}

// 积分
function Scores($http) {
	return {
		get: function () {
			return $http.get('/api/scores');
		}
	}
}

function MainCtrl(Credits, Terms, Scores, Scorers) {
	var mc = this;

	mc.newCredit = {
		// score:100,
		// description:"demo",
		// Scorers:"baba"
	}

	// Credits.getScores()
	// .then(function(_balance){
	// 	mc.balance = _balance.data
	// });

	Terms.get().then(function (_terms) {
			mc.terms = _terms.data;
	})

	Scorers.get().then(function (_response) {
		mc.scorers = _response.data;
	})

	mc.onTermChange = function (_term) {
		if(!_term){
			_term = {description:'',score:0};
		}
		mc.newCredit.description = _term.description;
		mc.newCredit.score = +_term.score;
	}

	mc.getCredits = function(){
		// Credits.getAll().then(function(_credits) {
		// Credits.getDaily().then(function(_credits) {
		Credits.getLastWeek().then(function(_credits) {
			mc.credits = _credits.data;
		});
		Scores.get().then(function(_response) {
			mc.scores = _response.data;
		});
	}

	mc.addCredit = function (_newCredit) {
		if(!_newCredit.score){
			alert('没写分数呢！');
			return false;
		}
		if(!_newCredit.description){
			alert('写下『描述』，记录下什么情况下加分（扣分）的？');
			return false;
		}
		if(!_newCredit.scorer){
			alert('『记录人』是谁？');
			return false;
		}
		Credits.add(_newCredit).then(function() {
			// mc.credits.push(angular.copy(_newCredit));
			mc.getCredits();
		});
	}


	mc.getCredits();
}