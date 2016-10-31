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
					templateUrl: 'tpls/nav-unlogin-tpl.html'
				},
				'main': {
					templateUrl: 'tpls/welcome-main-tpl.html'
				}
			}
		})
		.state('login', {
			url: '/userlogin',
			views: {
				'main': {
					templateUrl: 'tpls/login-main-tpl.html'
				},
				'navinfo': {
					templateUrl: 'tpls/nav-unlogin-tpl.html'
				},
				'footer': {
					templateUrl: 'tpls/footer-tpl.html'
				}
			}
		})
		.state('signup', {
			url: '/usersignup',
			views: {
				'main': {
					templateUrl: 'tpls/sign-up-main-tpl.html'
				},
				'navinfo': {
					templateUrl: 'tpls/nav-unlogin-tpl.html'
				},
				'footer': {
					templateUrl: 'tpls/footer-tpl.html'
				}	
			}
		})
		.state('quizmain', {
			url: '/quizmain',
			views: {
				'main': {
					templateUrl: 'tpls/quiz-main-tpl.html'
				},
				'navinfo': {
					templateUrl: 'tpls/nav-login-tpl.html'
				},
				'footer': {
					templateUrl: 'tpls/footer-tpl.html'
				}
			}
		})
		.state('doquiz', {
			url: '/doquiz',
			views: {
				'main': {
					templateUrl: 'tpls/do-quiz-main-tpl.html'
				},
				'navinfo': {
					templateUrl: 'tpls/nav-login-tpl.html'
				},
				'footer': {
					templateUrl: 'tpls/footer-tpl.html'
				}
			}
		})
		.state('createquiz', {
			url: '/createquiz',
			views: {
				'main': {
					templateUrl: 'tpls/create-quiz-main-tpl.html'
				},
				'navinfo': {
					templateUrl: 'tpls/nav-login-tpl.html'
				},
				'footer': {
					templateUrl: 'tpls/footer-tpl.html'
				}
			}
		})
		.state('quizlistview', {
			url: '/quizlistview',
			views: {
				'main': {
					templateUrl: 'tpls/quiz-list-view-main-tpl.html'
				},
				'navinfo': {
					templateUrl: 'tpls/nav-login-tpl.html'
				},
				'footer': {
					templateUrl: 'tpls/footer-tpl.html'
				}
			}
		})
		.state('searchlist', {
			url: '/searchlist',
			views: {
				'main': {
					templateUrl: 'tpls/quiz-list-search-main-tpl.html'
				},
				'navinfo': {
					templateUrl: 'tpls/nav-login-tpl.html'
				},
				'footer': {
					templateUrl: 'tpls/footer-tpl.html'
				}
			}
		})
}]);
