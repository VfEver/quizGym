angular.module('quizGym', ['ui.router', 'controllers'])
.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
})
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/index');

	$stateProvider
		.state('main', {
			url: '/main',
			templateUrl: '/quizGym/questionHtml/mainPage.html'
		})
		.state('addItem', {
			url: '/addQuestion',
			templateUrl: '/quizGym/questionHtml/addPage.html'
		})
		.state('put', {
			url: '/putitem',
			templateUrl: '/quizGym/questionHtml/putPage.html'
		});

}]);