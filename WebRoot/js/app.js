angular.module('lApp', ['ui.router', 'controllersModule'])
.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
})
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/index');
	$stateProvider
		.state('index', {
			url: '/index',
			views: {
				'navinfo': {
					templateUrl: '/quizGym/tpls/nav-unlogin-tpl.html'
				},
				'main': {
					templateUrl: '/quizGym/tpls/welcome-main-tpl.html'
				}
			}
		})
		.state('login', {
			url: '/userlogin',
			views: {
				'main': {
					templateUrl: '/quizGym/tpls/login-main-tpl.html'
				},
				'navinfo': {
					templateUrl: '/quizGym/tpls/nav-unlogin-tpl.html'
				},
				'footer': {
					templateUrl: '/quizGym/tpls/footer-tpl.html'
				}
			}
		})
		.state('signup', {
			url: '/usersignup',
			views: {
				'main': {
					templateUrl: '/quizGym/tpls/sign-up-main-tpl.html'
				},
				'navinfo': {
					templateUrl: '/quizGym/tpls/nav-unlogin-tpl.html'
				},
				'footer': {
					templateUrl: '/quizGym/tpls/footer-tpl.html'
				}	
			}
		})
		.state('quizmain', {
			url: '/quizmain',
			views: {
				'main': {
					templateUrl: '/quizGym/tpls/quiz-main-tpl.html'
				},
				'navinfo': {
					templateUrl: '/quizGym/tpls/nav-login-tpl.html'
				},
				'footer': {
					templateUrl: '/quizGym/tpls/footer-tpl.html'
				}
			}
		})
		.state('doquiz', {
			url: '/doquiz',
			views: {
				'main': {
					templateUrl: '/quizGym/tpls/do-quiz-main-tpl.html'
				},
				'navinfo': {
					templateUrl: '/quizGym/tpls/nav-login-tpl.html'
				},
				'footer': {
					templateUrl: '/quizGym/tpls/footer-tpl.html'
				}
			}
		});
}]);
