angular.module('lApp', ['ui.router', 'controllersModule', 'servicesModule'], function($httpProvider) {
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };
 
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
})
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
		.state('usercenter', {
			url: '/usercenter',
			views: {
				'main': {
					templateUrl: 'tpls/user-center-main-tpl.html'
				},
				'navinfo': {
					templateUrl: 'tpls/nav-login-tpl.html'
				},
				'footer': {
					templateUrl: 'tpls/footer-tpl.html'
				}
			}
		});
}]);
