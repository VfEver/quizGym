angular.module('controllersModule', [])
.controller('WelcomeController', ['$scope', '$location', function($scope, $location) {
	$scope.startTarining = function() {
		window.open('/quizGym/#/userlogin', '_self');
	};
}])
.controller('NavLinkController', ['$scope', '$location', function($scope, $location) {
	$scope.toHome = function() {
		console.log(window.location.href);
		if (window.location.href === 'http://localhost:8080/quizGym/#/doquiz' || window.location.href === 'http://localhost:8080/quizGym/#/createquiz') {
			if (window.location.href === 'http://localhost:8080/quizGym/#/doquiz') {
				if (sessionStorage.getItem('disable') === 'true') {
					$location.path('/quizmain');
					return;
				}
			}
			if (confirm('Leaving the page will cause the data to be lost, still leaving?')) {
				$location.path('/quizmain');
			} else {
				return;
			}
		} else {
			$location.path('/quizmain');
		}	
	};
}])
.controller('NavUserController', ['$scope', '$location', function($scope, $location) {
	$scope.loginfn = function() {
		$location.path('/userlogin');
	};

	$scope.signupfn = function() {
		$location.path('/usersignup');
	};
}])
.controller('LoginController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {

	$scope.loginCheck = function() {
		$.ajax({
			url: '/quizGym/rest/userrest/loginSuccess',
			data: {
				username: $scope.loginUserName,
				password: $scope.loginUserPassword
			},
			type: 'POST',
			contentType: 'text/plain'
		})
		.then(function(data) {
			console.log(typeof data);
			if (data !== -1) {
			
//				$rootScope.userLoginedName = data.username;
//				$rootScope.userLoginedId = data.userid;
//				$rootScope.userLoginedType = data.usertype;
//				$rootScope.userLoginedIcon = data.usericonurl;
				var userLoginedObj = {
						username: data.username,
						userid: data.userid,
						usertype: data.usertype,
						usericon: data.usericonurl
				};
				sessionStorage.setItem('user', JSON.stringify(userLoginedObj));
				window.open('/quizGym/#/quizmain', '_self');
			} else {
				alert('Your password or username made some mistakes, please re-login after check it');
			}
		});
	};
}])
.controller('SignupController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {
	$scope.signupSuccess = function() {
		window.open('/quizGym/#/quizmain', '_self');
		$('body').removeClass('modal-open');
	};
	$scope.usernameInvalidate = false;
	$('.username-sign').on('blur', function() {
		if ($scope.signupUserName === undefined || $scope.signupUserName.trim() === '') {
			return;
		}
		if ($scope.signupUserName.trim().length < 3 || $scope.signupUserName.trim().length > 50) {
			$scope.$apply(function() {
				$scope.usernameInvalidate = true;
			});
		} else {
			console.log('length gou le');
			$scope.$apply(function() {
				$scope.usernameInvalidate = false;
			});
		}
		$.ajax({
			url: '/quizGym/rest/userrest/judgeone',
			data: {
				username: $scope.signupUserName
			}
		})
		.then(function(res) {
			if (res === '200') {
				$scope.$apply(function() {
					$scope.userNameUsed = false;
				})
			} else {
				$scope.$apply(function() {
					$scope.userNameUsed = true;
				})
			}
		});
	});

	$('.password-sign').on('blur', function() {
		if ($scope.signupUserPassword.trim().length < 6 || $scope.signupUserPassword.trim().length > 50) {
			$scope.$apply(function() {
				$scope.passwordInvalidate = true;
			});
		} else {
			console.log('length gou le');
			$scope.$apply(function() {
				$scope.passwordInvalidate = false;
			});
		}
	});
	
	$('.email-sign').on('blur', function() {
		if ($scope.signupUserEmail === undefined || $scope.signupUserEmail.trim() === '') {
			return;
		}
		var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if (!reg.test($scope.signupUserEmail.trim())) {
			console.log('error');
			$scope.$apply(function() {
				$scope.emailInvalidate = true;
			});
			return;
		} else {
			$.ajax({
				url: '/quizGym/rest/userrest/judgeone',
				data: {
					useremail: $scope.signupUserEmail
				}
			})
			.then(function(res) {
				if (res === '200') {
					$scope.$apply(function() {
						$scope.emailInvalidate = false;
					})
				} else {
					$scope.$apply(function() {
						$scope.emailInvalidate = true;
					})
				}
			});
		}
		
	});
	$scope.signupCheck = function() {
		if ( ($scope.signupUserName === undefined || $scope.signupUserName.trim() === '') || 
			 ($scope.signupUserPassword === undefined || $scope.signupUserPassword.trim() === '') ||
			 ($scope.signupUserEmail === undefined || $scope.signupUserEmail.trim() === '') ||
			 ($scope.signupUserConfirm === undefined || $scope.signupUserConfirm.trim() === '')
		) {
			alert('please fill all the blank');
			return;
		}
		
		if ($scope.signupUserPassword === $scope.signupUserConfirm) {
			$.ajax({
				url: '/quizGym/rest/userrest/signup',
				data: {
					username: $scope.signupUserName,
					password: $scope.signupUserPassword,
					email: $scope.signupUserEmail
				},
				type: 'GET'
			})
			.then(function(res) {
				
				if (res !== '-1') {
//					$rootScope.userLoginedName = res.username;
//					$rootScope.userLoginedId = res.userid;
//					$rootScope.userLoginedType = res.usertype;
					var data = JSON.parse(res);
					var userLoginedObj = {
							username: data.username,
							userid: data.userid,
							usertype: data.usertype,
							usericon: data.usericonurl
					};
					sessionStorage.setItem('user', JSON.stringify(userLoginedObj));
					window.open('/quizGym/#/quizmain', '_self');
					$('body').removeClass('modal-open');
					$scope.signupSuccess();
				} else {
					alert('Somthing worng with the DataBash, please re-signup');
				}
			});
		} else {
			alert('Password is not equal to the confirm one');
		}
	};
}])
.controller('QuizController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {
	//$rootScope.sessionCheck();
	$rootScope.sessionChecker();


	$scope.showQuizFn = $rootScope.showQuizFn;
	$scope.getRandomQuizFn = function() {
		$('#randomQuizModal').modal('hide');
		var number = Math.floor(Math.random() * 5 + 1);
		var quizScopes = ['photography', 'music', 'film', 'science', 'sports'];
		$scope.scopeType = quizScopes[number - 1];
		var quizNumber = $('input[type="radio"]:checked').val();
		setTimeout(function() {
			$.ajax({
				url: '/quizGym/rest/questionrest/randFindQuestion',
				data: {
					scopeType: $scope.scopeType,
					quizNumber: quizNumber
				}
			})
			.then(function(data) {
				$scope.quizData = data;
				//sessionStorage.setItem('quizData', JSON.stringify($scope.quizData));
				
				var quizObj = {
						quizData: data,
						isRandom: true	
				};
				sessionStorage.setItem('quizData', JSON.stringify(quizObj));
				window.open('/quizGym/#/doquiz', '_self');
				$('body').removeClass('modal-open');
				//$scope.showQuizFn(true, $scope);
			});
		}, 300)
	};
	$scope.getRandom = function() {
		$('#randomQuizModal').modal();
	};

	$scope.getQuiz = function(quizname) {
		$scope.quizName = quizname;

		$.ajax({
			method: 'GET',
			url: '/quizGym/rest/groupquestionrest/findgrouplist',
			data: {
				scopeType: $scope.quizName
			}
		})
		.then(function(data) {

			$scope.listData = data;
//			$rootScope.quizList = $scope.listData;
//			$rootScope.quizScopeSelected = $scope.quizName;
			sessionStorage.setItem('quizList', JSON.stringify($scope.listData));
			sessionStorage.setItem('quizScopeSelected', $scope.quizName);
			window.open('/quizGym/#/quizlistview', '_self');
			$('body').removeClass('modal-open');
		});
	};
}])
.controller('CreateQuizController', ['$scope', '$rootScope', function($scope, $rootScope) {
	$rootScope.sessionChecker();

	$scope.quizNumber = 1;
	$scope.isNumberEnough = true;
	$scope.currentIndex = 0;

	//test
//	$scope.listName = $rootScope.createQuizName;
//	$scope.scopeType = $rootScope.quizScopeSelected;
//	$scope.createrName = $rootScope.userLoginedName;
	var userObj = $rootScope.getUserInSession();
	$scope.createrName = userObj.username;
	$scope.listName = sessionStorage.getItem('createQuizName');
	$scope.scopeType = sessionStorage.getItem('quizScopeSelected');
	$scope.buttonDisabled = false;
	$scope.$watch('quizNumber', function(newValue, oldValue) {	//监听一个变量
		if (newValue >= 5) {
			$scope.isNumberEnough = false;
		}
	});
	var questionModel = {
		'question': '',
		'options': ['', '', '', ''],
		'correctAnswer': '',
		'reason': ''
	};

	$scope.showQuestion = function(index) {
		$scope.currentIndex = index;
	};

	$scope.quiz = [questionModel];
	
	if (sessionStorage.getItem('modify') != 'null') {
		$scope.quiz = [];
		$scope.scopeType = sessionStorage.getItem('modifyScope');
		var modifyQuizData = JSON.parse(sessionStorage.getItem('modify'));
		$scope.buttonDisabled = true;
		modifyQuizData.forEach(function(item, index) {
			var temp = item.answer.slice(0);
			temp.forEach(function(item, index) {
				temp[index] = item.slice(2);
			})
			$scope.quiz.push(
				{
					'question': item.question,
					'options': temp,
					'correctAnswer': item.result,
					'reason': item.reason,
					'questionId': item.questionId
				}
			);
			$scope.quizNumber++;
		});
		
	}
	
	$scope.deleteCurrentQuestion = function() {
		if (confirm('Be sure to delete the current question?')) {
			$scope.quiz.splice($scope.currentIndex, 1);
			if ($scope.quiz.length === 0) {
				$scope.quiz.push({
					'question': '',
					'options': ['', '', '', ''],
					'correctAnswer': '',
					'reason': ''
				});
				$scope.currentIndex = 0;
			} else {
				if ($scope.currentIndex === 0) {
					$scope.currentIndex = 0;
				} else {
					
					$scope.currentIndex = $scope.currentIndex - 1;
				}
			}

			
		}
	};

	$scope.addNewQuestion = function() {
		$scope.quizNumber++;
		$scope.quiz.push({
			"question": "",
			"options": ["", "", "", ""],
			"correctAnswer": "",
			"reason": ""
		});
		$scope.currentIndex = $scope.quiz.length - 1;
	};
	
	$scope.submitFn = function() {
		$scope.quizInvalidate = false;
		$scope.quiz.forEach(function(item, index) {
			if ((!item.question === undefined || item.question.trim() === '') ||
				(!item.correctAnswer === undefined || item.correctAnswer.trim() === '') ||
				(!item.reason === undefined || item.reason.trim() === '')
				) {
				$scope.quizInvalidate = true;
			}
			item.options.forEach(function(item) {
				if (!item === undefined || item.trim() === '') {
					$scope.quizInvalidate = true;
				}
			});
		});
		if ($scope.quizInvalidate) {
			alert('Your must fill all the blank in the quiz');
			return;
		}

		if (!$scope.createrName) {
			$scope.createrName = 'bobo';
		}
		if (sessionStorage.getItem('modifyId') != 'null') {
			submitId = sessionStorage.getItem('modifyId');
		} else {
			submitId = '';
		}
		var quizObj = {
			"listName": $scope.listName,
			"scopeType": $scope.scopeType,
			"createrName": $scope.createrName,
			"questions": $scope.quiz,
			"id": submitId
		};
			
		var jsonObj = JSON.stringify(quizObj);
		$.ajax({
			url: '/quizGym/rest/groupquestionrest/saveall',
			dateType: 'json',
			//data: quizObj,
			data: jsonObj,
			type: 'POST',
			contentType: 'application/json'
		})
		.then(function(res) {
			if (res === '200') {
				alert('submit success!');
				$.ajax({
					url: '/quizGym/rest/groupquestionrest/findgrouplist',
					data: {
						scopeType: $scope.scopeType
					}
				})
				.then(function(res) {
					$rootScope.$broadcast('updateList', {
						listData: res
					});
					$rootScope.quizList = res;
					sessionStorage.setItem('quizList', JSON.stringify(res));
					window.open('/quizGym/#/quizlistview', '_self');
					$('body').removeClass('modal-open');
				});
			} else {
				alert('some errors happened, please try again');
			}
		})
	};
}])
.controller('QuizListController', ['$scope', '$rootScope', function($scope, $rootScope) {
	$rootScope.sessionChecker();

	
//	$scope.quizListData = $rootScope.quizList;
//	$scope.scopeType = $rootScope.quizScopeSelected;
//	$scope.userType = $rootScope.userLoginedType;
//	$scope.userId = $rootScope.userLoginedId;
//	$scope.userName = $rootScope.userLoginedName;
	
	$scope.quizListData = JSON.parse(sessionStorage.getItem('quizList'));
	$scope.scopeType = sessionStorage.getItem('quizScopeSelected');
	var timer = null;
	timer = setInterval(function() {
		if (window.location.href !== 'http://localhost:8080/quizGym/#/quizlistview') {
			clearInterval(timer);
			return;
		} else {
			$.ajax({
				url: '/quizGym/rest/groupquestionrest/findgrouplist',
				data: {
					scopeType: $scope.scopeType
				}
			})
			.then(function(data) {
				var res = data;
//				var secIndex = res.lastIndexOf(',');
//				var firIndex = $scope.quizListData.lastIndexOf('}');
				//console.log($scope.quizListData);
				$scope.quizListData.forEach(function(item, index) {
					delete ($scope.quizListData[index].$$hashKey);
				});
				
				//console.log($scope.quizListData);
				
				
//				
				console.log(JSON.stringify($scope.quizListData));
				console.log(JSON.stringify(res));
//				console.log(JSON.stringify($scope.quizListData).slice(0, firIndex - 1));
//				console.log(JSON.stringify(res).slice(0, secIndex - 1));
				if (JSON.stringify($scope.quizListData) == JSON.stringify(res)) {
					console.log('xiangtong')
					return;
				} else {
					$scope.$apply(function() {
						$scope.quizListData = res;
					});					
				}
			});
		}
		
	}, 500);
	
	var userObj = $rootScope.getUserInSession();
	$scope.userName = userObj.username;
	$scope.userId = userObj.userid;
	$scope.userType = userObj.usertype;
	
	
	$scope.$on('updateList', function(ev, data) {
		$scope.$apply(function() {
			$scope.quizListData = data.listData;
		});
	});

	$scope.applyForPro = function() {
		if(confirm('Apply for PRO needs your score above 100, then you have the right to create quiz, still apply?')) {
			//
			$.ajax({
				url: '/quizGym/rest/userrest/applyprouser',
				data: {
					userId: $scope.userId,
					userName: $scope.userName
					//content: 'apply for pro'
				}
			})
			.then(function(res) {
				if (res === '0') {
					alert('Your score is not enough, don\'t be frustrated, you can still apply for PRO after spareing more effort'); 
				} else if (res === '200') {
					alert('Success, now you are our PRO user!');
					//$rootScope.userLoginedType = 'PRO';
					var userObj = JSON.parse(sessionStorage.getItem('user'));
					userObj.usertype = 'PRO';
					sessionStorage.setItem('user', JSON.stringify(userObj));
					$scope.$apply(function() {
						$scope.userType = 'PRO';
					})
				} else {
					alert('some errors happened, please retry');
				}
			});
		}
	};


	$scope.jumpToQuizFn = function(quizId, quizName, quizScope) {
		$.ajax({
			url: '/quizGym/rest/groupquestionrest/findquestions',
			data: {
				questionId: quizId
			}
		})
		.then(function(data) {
			$scope.quizData = data;
			$scope.quizId = quizId;
			
			var quizObj = {
					quizData: data,
					quizId: quizId,
					isRandom: false	
			}
			sessionStorage.setItem('quizData', JSON.stringify(quizObj));
			
			//sessionStorage.setItem('quizId', quizId);
			window.open('/quizGym/#/doquiz', '_self');
			$('body').removeClass('modal-open');

			//$scope.showQuizFn(false, $scope);
		});
	};

	$scope.getRandomQuizFn = function() {
		$('#randomQuizModal').modal('hide');
		var quizNumber = $('input[type="radio"]:checked').val();
		setTimeout(function() {
			$.ajax({
				url: '/quizGym/rest/questionrest/randFindQuestion',
				data: {
					scopeType: $scope.scopeType,
					quizNumber: quizNumber
				}
			})
			.then(function(data) {
				$scope.quizData = data;
				//sessionStorage.setItem('quizData', JSON.stringify($scope.quizData));
				
				var quizObj = {
						quizData: data,
						//quizId: quizId,
						isRandom: true	
				};
				sessionStorage.setItem('quizData', JSON.stringify(quizObj));
				window.open('/quizGym/#/doquiz', '_self');
				$('body').removeClass('modal-open');
				//$scope.showQuizFn(true, $scope);
			});
		}, 300)
	};
	$scope.getRandom = function() {
		$('#randomQuizModal').modal();
	};


	$scope.createQuiz = function() {
		sessionStorage.setItem('modify', null);
		sessionStorage.setItem('modifyId', null);
		$('#createQuizOption').modal();
		//window.open('/#/createquiz', '_self');
	};

	$scope.createQuizFn = function() {
		if ($scope.nameOfQuiz.trim().length === 0) {
			alert('please input the name');
		} else {
			$('#createQuizOption').modal('hide');
			//$rootScope.createQuizName = $scope.nameOfQuiz;
			sessionStorage.setItem('createQuizName', $scope.nameOfQuiz);
			setTimeout(function() {
				window.open('/quizGym/#/createquiz', '_self');
				$('body').removeClass('modal-open');
			}, 200);
			
		}
	};
	$scope.showQuizFn = $rootScope.showQuizFn;
}])
.controller('SearchBoxController', ['$scope', '$rootScope', function($scope, $rootScope){
	
	var userObj = $rootScope.getUserInSession();
	
	$scope.userName = userObj.username;
	$scope.userIconUrl = userObj.usericon;
	
	
	$scope.toUserCenterFn = function() {
		if (window.location.href === 'http://localhost:8080/quizGym/#/doquiz' || window.location.href === 'http://localhost:8080/quizGym/#/createquiz') {
			if (window.location.href === 'http://localhost:8080/quizGym/#/doquiz') {
				if (sessionStorage.getItem('disable') === 'true') {
					window.open('/quizGym/#/usercenter', '_self');
					return;
				}
			}
			if (confirm('Leaving the page will cause the data to be lost, still leaving?')) {
				window.open('/quizGym/#/usercenter', '_self');
			} else {
				return;
			}
		} else {
			window.open('/quizGym/#/usercenter', '_self');
		}
	};
	
	$scope.logOutFn = function() {
		if (window.location.href === 'http://localhost:8080/quizGym/#/doquiz' || window.location.href === 'http://localhost:8080/quizGym/#/createquiz') {
				if (window.location.href === 'http://localhost:8080/quizGym/#/doquiz') {
					if (sessionStorage.getItem('disable') === 'false') {
						if (confirm('Leaving the page will cause the data to be lost, still leaving?')) {
							
						} else {
							return;
						}
					}
				} else {
					if (confirm('Leaving the page will cause the data to be lost, still leaving?')) {
						
					} else {
						return;
					}
				}
				
			
			
		}
		$.ajax({
			url: '/quizGym/rest/userrest/logout',
			data: {
				userId: userObj.userid
			}
		}).
		then(function(res) {
			if (res === '200') {
//				$rootScope.userLoginedName = null;
//				$rootScope.userLoginedId = null;
//				$rootScope.userLoginedType = null;
				
				sessionStorage.setItem('user', null);

				window.open('/quizGym/#/userlogin', '_self');
				$('body').removeClass('modal-open');
			} else {
				alert('some errors happened, please try again')
			}
		});
		
	};
	$scope.submitBugFn = function() {
		$('#submitBugModal').modal();
	};
	$scope.keyDownGetSearch = function($event) {
		if ($event.keyCode === 13) {
			$scope.getSearchFn();
		}
	};

	$scope.submitBug = function() {
		if ($scope.bugToSubmit === undefined || $scope.bugToSubmit.trim() === '') {
			alert('please input your reflection before submit');
		} else {

			$.ajax({
				method: 'POST',
				data: JSON.stringify({
					userName: $rootScope.getUserInSession().username,
					content: $scope.bugToSubmit
				}),
				contentType: 'application/json',
				url: '/quizGym/rest/userrest/submitbugs'
			})
			.then(function(res) {
				if (res === '200') {
					alert('We have received your reflection, thank you very much!');
					$('#submitBugModal').modal('hide');
				} else {
					alert('There are some errors happened, please try again');
				}
			});
		}
	};
	$scope.keyDownGetSearch = function($event) {
		if ($event.keyCode === 13) {
			$scope.getSearchFn();
		}
	};
	$scope.getSearchFn = function() {
		if (window.location.href === 'http://localhost:8080/quizGym/#/doquiz' || window.location.href === 'http://localhost:8080/quizGym/#/createquiz') {
			if (confirm('Leaving the page will cause the data to be lost, still leaving?')) {

			} else {
				return;
			}
		}
		
		if ($scope.keyOfSearch === undefined || $scope.keyOfSearch.trim() === '') {
			alert('please input keyword of searching')
;		} else {
			$.ajax({
				url: '/quizGym/rest/groupquestionrest/findKeyList',
				data: {
					key: $scope.keyOfSearch
				}
			})
			.then(function(data) {
				sessionStorage.setItem('searchKey', $scope.keyOfSearch);
				sessionStorage.setItem('searchResult', JSON.stringify(data));
				
				$rootScope.$broadcast('getSearch', {
					searchkey: $scope.keyOfSearch,
					searchResult: data
				});
				window.open('/quizGym/#/searchlist', '_self');
				$('body').removeClass('modal-open');
			});
		}
	};

	var timer = null;
	$('.user-name').on('mouseenter', function() {
		clearTimeout(timer);
		$('.drop-down-menu').slideDown(300);
	});

	$('.user-name').on('mouseleave', function() {
		timer = setTimeout(function() {
			$('.drop-down-menu').slideUp(300);
		}, 300);
	});
	$('.drop-down-menu').on('mouseenter', function() {
		clearTimeout(timer);
	});
	$('.drop-down-menu').on('mouseleave', function() {
		timer = setTimeout(function() {
			$('.drop-down-menu').slideUp(300);
		}, 300);
	});
}])
.controller('SearchResultController', ['$scope', '$rootScope', function($scope, $rootScope) {
	$rootScope.sessionChecker();


//	$scope.searchResultList = $rootScope.searchResult;
//	$scope.searchResultKey = $rootScope.searchKey;
	
	$scope.searchResultList = JSON.parse(sessionStorage.getItem('searchResult'));
	$scope.searchResultKey = sessionStorage.getItem('searchKey');

	$scope.$on('getSearch', function(ev, data) {
		$scope.$apply(function() {
			$scope.searchResultKey = data.searchkey;
			$scope.searchResultList = data.searchResult;
			$scope.scopeType = data.searchResult[0].scopeType;
		});
	});

	$scope.backFn = function() {
		history.go(-1);
	};

	$scope.jumpToQuizFn = function(id, quizName, quizScope) {
		$.ajax({
			url: '/quizGym/rest/groupquestionrest/findquestions',
			data: {
				questionId: id
			}
		})
		.then(function(data) {
			$scope.quizData = data;
			var quizObj = {
					quizData: data,
					quizId: id,
					isRandom: false	
			};
			sessionStorage.setItem('quizData', JSON.stringify(quizObj));
			window.open('/quizGym/#/doquiz', '_self');
			$('body').removeClass('modal-open');

			//$scope.showQuizFn(false, $scope);
		});
	};

	$scope.showQuizFn = $rootScope.showQuizFn;
}])
.controller('UserCenterController', ['$scope', 'GetQuizDataList', 'GetQuestionDataList', 'GetMailDataList', 'GetMailDataList', '$rootScope', 'GetUserInfo', function($scope, GetQuizDataList, GetQuestionDataList, GetMailDataList, GetMailDataList, $rootScope, GetUserInfo) {
	$rootScope.sessionChecker();

	GetQuizDataList.get().then(function(data) {
		$scope.quizData = data.data;
	});
	GetQuestionDataList.get().then(function(data) {
		
		$scope.questionData = data.data;
	});
	GetMailDataList.get().then(function(data) {
		$scope.mailData = data.data;
	});
	
	
	var timer = null;
	timer = setInterval(function() {
		if (window.location.href !== 'http://localhost:8080/quizGym/#/usercenter') {
			clearInterval(timer);
			return;
		}
		
		GetQuizDataList.get().then(function(data) {
				$scope.quizData = data.data;				
		});
		GetQuestionDataList.get().then(function(data) {
				$scope.questionData = data.data;
		});
		GetMailDataList.get().then(function(data) {
				$scope.mailData = data.data;
		});
	}, 500);
	
	var userObj = $rootScope.getUserInSession();
	$scope.userType = userObj.usertype;
	$scope.userId = userObj.userid;

	$scope.rejectFn = function(id, event) {
		$('#listInfoModal').modal('hide');
		$('#passedListInfoModal').modal('hide');
		$('#rejectModal').modal();
		$scope.rejectSubmit = function() {
			
			if ($scope.rejectReason === undefined || $scope.rejectReason.trim() === '') {
				alert('please input the reason');
			} else {
				$.ajax({
					url: '/quizGym/rest/groupquestionrest/passinfo',
					data: {
						id: id,
						state: -1,
						reason: $scope.rejectReason
					}
				})
				.then(function(res) {
					$scope.$apply(function() {
						$scope.rejectReason = '';
						$scope.quizData = res.quizData;
						$scope.questionData = res.passedQuizData;
						$('#listInfoModal').modal('hide');
						$('#rejectModal').modal('hide');
					});
				});
				
			}
		};

		event.stopPropagation();
	};

	$scope.rerejectFn = function(id, event) {
		//$scope.passedQuizId = id;
		$('#passedListInfoModal').modal();
		$scope.rejectSubmit = function() {
			if ($scope.rejectReason === undefined || $scope.rejectReason.trim() === '') {
				alert('please input the reason');
			} else {
				
			}
			
			$.ajax({
				url: '/quizGym/rest/groupquestionrest/passinfo',
				data: {
					id: id,
					state: -1,
					reason: $scope.rejectReason
				}
			})
			.then(function(res) {
				$scope.$apply(function() {
					$scope.rejectReason = '';
					$scope.quizData = res.quizData;
					$scope.questionData = res.passedQuizData;
					$('#passedListInfoModal').modal('hide');
					$('#rejectModal').modal('hide');
				});
			});
		};

		event.stopPropagation();
	};
	
	$scope.passFn = function(id, event) {
		$.ajax({
			url: '/quizGym/rest/groupquestionrest/passinfo',
			data: {
				id: id,
				state: 1
			}
		})
		.then(function(res) {
			$scope.$apply(function() {
				$scope.quizData = res.quizData;
				$scope.questionData = res.passedQuizData;
			});
			$('.modal').modal('hide');
		});

		event.stopPropagation();
	};
	
	var timerUser = null;
	timerUser = setInterval(function() {
		if (window.location.href !== 'http://localhost:8080/quizGym/#/usercenter') {
			clearInterval(timerUser);
			return;
		}
		$.ajax({
			url: '/quizGym/rest/userrest/finduserinfo',
			data: {
				userId: $scope.userId
			}
		})
		.then(function(res) {
//			console.log($scope.userData);
//			console.log(JSON.stringify(res));
			
			$scope.userData.quizRecord.forEach(function(item, index) {
				delete ($scope.userData.quizRecord[index].$$hashKey);
			});
			$scope.userData.userQuiz.forEach(function(item, index) {
				delete ($scope.userData.userQuiz[index].$$hashKey);
			});
			if (JSON.stringify($scope.userData) === JSON.stringify(res)) {
				console.log('xiangtong');
				return;
			} else {
				$scope.$apply(function() {
					$scope.userData = res;
				});
			}	
			
		})
	}, 500);
	
	
	//Photography, music , sports, film, scicence
	GetUserInfo.get($scope.userId).then(function(data) {
		$scope.userData = data.data;

		$scope.userData = data.data;
		if ($scope.userType === 'PRO' || $scope.userType === 'ADMIN') {
			$scope.createQuizCurrentIndex = 0;
			$scope.createQuizNum =  Math.ceil($scope.userData.userQuiz.length / 3);
			$scope.quizButtonArr = [];
			for (i = 0; i < $scope.createQuizNum; i++) {
					$scope.quizButtonArr.push(i + 1);
				}
			$scope.jumpToQuizFn = function(index) {
				$scope.createQuizCurrentIndex = index;
			};
		}
		$('.user-icon-box').css({
			'background': 'url("' + $scope.userData.userIconUrl + '") no-repeat center',
			'background-size': '250px'
			});
			
		$('#containerPie').highcharts({
		    chart: {
		        plotBackgroundColor: null,
		        plotBorderWidth: null,
		        plotShadow: false
		    },
		    title: {
		        text: 'History of filed that user selected:'
		    },
		    tooltip: {
		        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		    },
		    credits: {
		    	enabled: false
			},
		    plotOptions: {
		        pie: {
		            allowPointSelect: true,
		            cursor: 'pointer',
		            dataLabels: {
		                enabled: false
		            },
		            showInLegend: true
		        }
		    },
		    series: [{
		        type: 'pie',
		        name: '',
		        data: [
		            ['Music', $scope.userData.filedRate[1]],
		            ['Sports', $scope.userData.filedRate[2]],
		            ['Film', $scope.userData.filedRate[3]],
		            ['Science', $scope.userData.filedRate[4]],
		            {
		                name: 'Photography',
		                y: $scope.userData.filedRate[0],
		                sliced: true,
		                selected: true
		            },
		        ]
		    }]
		});


		var quizNumber = $scope.userData.accuracy.length;
		var accuracyArr = [];
		for (var i = 0; i < quizNumber; i++) {
			accuracyArr.unshift(i + '');
		}
		
		$scope.pageNumber = Math.ceil($scope.userData.quizRecord.length / 9);
		$scope.buttonArr = [];
		for (i = 0; i < $scope.pageNumber; i++) {
			$scope.buttonArr.push(i + 1);
		}
		$scope.jumpToFn = function(index) {
			$scope.currentIndex = index;
		};
		$scope.currentIndex = 0;

		$('#containerNormal').highcharts({
			chart: {
				type:'spline'
			},
			credits: {
		    	enabled: false
			},
		    title: {
		        text: 'Accuracy of the recently quizes',
		        x: -20 //center
		    },
		    xAxis: {
		        // categories: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']
		        categories: accuracyArr
		    },
		    yAxis: {
		        title: {
		            text: 'Accuracy (%)'
		        },
		        tickInterval: 10,
		        max: 100
		        // categories: ['0', '20', '40', '60', '80', '100'],
		    },
		    tooltip: {
		        valueSuffix: '%'
		    },
		    legend: {
		        layout: 'vertical',
		        align: 'right',
		        verticalAlign: 'middle',
		        borderWidth: 0
		    },
		    series: [{
		        name: 'Accuracy',
		        data: $scope.userData.accuracy
		    }],
		    colors: [
				'red'
			]
		});
	});


	$('.inner-wrap').on('click', function() {
		$('#choose-user-icon').trigger('click')
	});

	$('#choose-user-icon').on('change', function() {
			var files = this.files[0];
			var fr = new FileReader();
			
			
			fr.onload = function(ev) {
				var jsonObj = JSON.stringify({
					image: ev.target.result,
					userId: $scope.userId
				});
				$.ajax({
					method: 'POST',
					url: '/quizGym/rest/userrest/saveuserImage',
					data: jsonObj,
					contentType: 'application/json'
				})
				//{
				//	state: 200,
				//	url: ''
				//}
				.then(function(res) {
					if (res.length > 0) {
						alert('update success!');
//						$scope.$apply(function() {
							
							$scope.userData.userIconUrl = res;
							var userObj = $rootScope.getUserInSession();
							userObj.usericon = res;
							sessionStorage.setItem('user', JSON.stringify(userObj));
							
							$('.user-icon-box').css({
								'background': 'url("' + $scope.userData.userIconUrl + '") no-repeat center',
								'background-size': '250px'
							});
							$('.user-name').css({
								'background': 'url("' + $scope.userData.userIconUrl + '") no-repeat center',
								'background-size': '70px'
							});
//						});

					} else {
						alert('errors happened, please try again');
					}
				});
			};
			fr.readAsDataURL(files);
		});

		$('.nav-tabs li').on('click', function() {
		// $('.nav-tabs li').each(function(index, item) {
		// 	$(item).removeClass('active')
		// });
		

		$('.nav-tabs li').removeClass('active');
		$(this).addClass('active');

		$('.center-part').removeClass('user-part-show');
		$('.center-part').eq($(this).index()).addClass('user-part-show');
		
	});


		$scope.getListInfoFn = function(id) {
			$scope.getListInfoId = id;
			$.ajax({
				url: '/quizGym/rest/groupquestionrest/findquestions',
				data: {
					questionId: id
				}
			})
			.then(function(res) {
				// 要用的
				var listData = res;
				//test
				$scope.$apply(function() {
					$scope.listData = listData;
				});
				$('#listInfoModal').modal();

			});
		};

		$scope.callRerejectModal = function(id, $index) {
			$.ajax({
				url: '/quizGym/rest/groupquestionrest/findquestions',
				data: {
					questionId: id
				}
			})
			.then(function(res) {
				$scope.passedQuizId = id;
				$scope.$apply(function() {
					//$scope.passedQuizData = JSON.parse(res);
					$scope.passedQuizData = res;
					
				});
				$('#passedListInfoModal').modal();
			});


		};
		
		$scope.modifyFn = function(id, name, scope) {
			$.ajax({
				url: '/quizGym/rest/groupquestionrest/findquestions',
				data: {
					questionId: id
				}
			})
			.then(function(res) {
				//var quizData = JSON.parse(res);
				sessionStorage.setItem('modify',JSON.stringify(res));
				sessionStorage.setItem('modifyId', id);
				sessionStorage.setItem('createQuizName', name);
				sessionStorage.setItem('modifyScope', scope);
				window.open('/quizGym/#/createquiz', '_self');
			});
		};
		// $scope.rerejectFn = function(id) {
			// $.ajax({
			// 	url: '',
			// 	data: {
			// 		id: id
			// 	}
			// })
			// .then(function(res) {
			// 	if (res) {
			// 		$scope.$apply(function() {
			// 			$scope.quizData = res.quizData;
			// 			$scope.questionData = res.questionData;
			// 		});
			// 	}
			// });

		// };
		$scope.currentScopeIndex = 0;
		$scope.scopeFilter = {
				scope: ''
		};
		$scope.filterFn = function(scope, index) {
			$scope.scopeFilter = {
					scope: scope
			};
			$scope.currentScopeIndex = index;
		}


}])
.controller('FooterControler', ['$scope', '$rootScope', function($scope, $rootScope) {
	//$rootScope.sessionChecker();

	$scope.showDonateModal = function() {
		$('#donateModal').modal();
	};
	
	var timer;
	$('.hover-check').on('mouseenter', function() {
		clearTimeout(timer);
		$('.footer').css('bottom', '0');
	});
	$('.footer').on('mouseenter', function() {
		clearTimeout(timer);
	});
	$('.footer').on('mouseleave', function() {
		timer = setTimeout(function() {
			$('.footer').css('bottom', '-145px');
		}, 300);
	});
}])
.controller('QuizDetailController', ['$scope', '$rootScope', function($scope, $rootScope) {
	$rootScope.sessionChecker();
//	var test = [{"_id":"1","index":"1","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"A"},{"index":"2","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"3","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"4","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"5","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"6","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"7","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"8","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"9","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"_id":"1","index":"1","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"2","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"3","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"4","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"5","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"6","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"7","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"8","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"9","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"_id":"1","index":"1","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"2","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"3","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"4","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"5","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"6","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"7","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"8","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"9","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"}];
//	$scope.checkDetailData = $rootScope.checkDetailData;
	
	$scope.checkDetailData = JSON.parse(sessionStorage.getItem('checkDetailData'));
//	$scope.checkDetailData = test;
	$scope.currentIndex = 0;
	$scope.userName = JSON.parse(sessionStorage.getItem('user')).username;
	$scope.jumpToFn = function(index) {
		if (index !== $scope.currentIndex) {
			// $scope.$apply(function() {
				$scope.commentData = [];
			// });
		}
		$scope.currentIndex = index;
	};
	$scope.submitCommentFn = function() {
		if (!$scope.userComment || $scope.userComment.trim() === '') {
			alert('You must input something to submit');
		} else {
			$.ajax({
				method: 'POST',
				data: JSON.stringify({
					userName: $scope.userName,
					questionId: $scope.checkDetailData[$scope.currentIndex].questionId,
					content: $scope.userComment
				}),
				contentType: 'application/json',
				url: '/quizGym/rest/questionrest/savecomment'
			})
			.then(function(resStr) {
				var jsonRes = JSON.parse(resStr);	
				//$scope.commentData = jsonRes.commentData;
				if (jsonRes.state === '200') {
				
					alert('submit success');
					$scope.$apply(function() {
						$scope.commentData = jsonRes.commentData;
					});
					$scope.$apply(function() {
						$scope.userComment = '';
					});			
				}
			});
		}	
	};

	$scope.getCommentFn = function() {
		$.ajax({
			url: '/quizGym/rest/questionrest/findcomments',
			data: {
				questionId: $scope.checkDetailData[$scope.currentIndex].questionId
			}
		})
		.then(function(res) {
			$scope.$apply(function() {
				$scope.commentData = res;
			});
		});
	}
}])
.controller('DoQuizController', ['$scope', '$rootScope', function($scope, $rootScope) {
	var quizObj = JSON.parse(sessionStorage.getItem('quizData'));
	var userObj = JSON.parse(sessionStorage.getItem('user'));
	var scopeType = sessionStorage.getItem('quizScopeSelected');
	$rootScope.showQuizFn(quizObj.isRandom, scopeType, userObj, quizObj);
	
}])


			// 			{
			// 	"index": "3",
			// 	"question": "333使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?",
			// 	"answer": ["A、333蓝色", "B、333黄色", "C、333高感光度时偏蓝，低感光度时偏黄", "D、333阿达阿啊"],
			// 	"result": "B",
			// 	"reason": "333啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
			// },