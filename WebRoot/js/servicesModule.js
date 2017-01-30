angular.module('servicesModule', [])
.factory('GetQuizDataList', function($http) {
	var quizData = {};
	var get = function() {

		return $http
				.get('/quizGym/rest/groupquestionrest/findchecklist')
				.then(function(data) {
					quizData = data;
					return quizData;
				});
	};
	return {
		get: get
	};
})
.factory('GetMailDataList', function($http) {
	var applyData = {};
	var get = function() {

		return $http
				.get('/quizGym/rest/userrest/findinfo')
				.then(function(data) {
					applyData = data;
					return applyData;
				});
	};
	return {
		get: get
	};
})
.factory('GetQuestionDataList', function($http) {
	var questionData = {};
	var get = function() {

		return $http
				.get('/quizGym/rest/groupquestionrest/passgroups')
				.then(function(data) {
					questionData = data;
					return questionData;
				})
	};
	return {
		get: get
	};
})
.factory('GetUserInfo', function($http) {
	var userData = {};
	var get = function(userId) {
		return $http({
			method: 'GET',
			url: '/quizGym/rest/userrest/finduserinfo',
			params: {
				userId: userId
			}
		})
		.then(function(data) {
			userData = data;
			return userData
		})
	};
	return {
		get: get
	};
})