angular.module('app', [])

.service('Credits', Credits)
.service('Terms', Terms)
.service('Who', Who)
.controller('MainCtrl', MainCtrl)

function Credits($http) {
	return {
		getAll: function(param){
			return $http.get('/api/credits?_sort=createdAt&_order=DESC',{param:param});
		},
		getBalance: function () {
			return $http.get('/api/balance')
		},
		add: function (_newCredit) {
			_newCredit.time = new Date();
			return $http.post('/api/credits',_newCredit)
		}
	}
}

function Terms($http) {
	return {
		get: function () {
			return $http.get('/api/terms');
		}
	}
}
function Who($http) {
	return {
		get: function (param) {
			return $http.get('/api/who');
		}
	}
}

function MainCtrl(Credits,Terms,Who) {
	var mc = this;

	mc.newCredit = {
		// score:100,
		// description:"demo",
		// who:"baba"
	}

	// Credits.getBalance()
	// .then(function(_balance){
	// 	mc.balance = _balance.data
	// });

	Terms.get().then(function (_terms) {
			mc.terms = _terms.data;
	})

	Who.get().then(function (_who) {
		mc.who = _who.data;
	})

	mc.onTermChange = function (_term) {
		mc.newCredit.description = _term.description;
		mc.newCredit.score = +_term.score;
	}

	mc.getCredits = function(){
		Credits.getAll().then(function(_credits) {
			mc.credits = _credits.data;
			mc.balance = getBalance(_credits.data);
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
		if(!_newCredit.who){
			alert('『记录人』是谁？');
			return false;
		}
		Credits.add(_newCredit).then(function() {
			// mc.credits.push(angular.copy(_newCredit));
			mc.getCredits();
		});
	}

	function getBalance(_credits) {
		var _totalScore = 0;
		for (var i = 0; i < _credits.length; i++) {
			_totalScore += +_credits[i].score || 0
		}
		return _totalScore;
	}

	mc.getCredits();
}