angular.module('controllersModule', [])
.controller('WelcomeController', ['$scope', '$location', function($scope, $location) {
	$scope.startTrainning = function() {
		window.open('/quizGym/#/userlogin', '_self');
	};
}])
.controller('NavLinkController', ['$scope', '$location', function($scope, $location) {
	$scope.toHome = function() {
		$location.path('/quizmain');
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
			if (data !== '-1') {
			
				$rootScope.userLoginedName = data.username;
				$rootScope.userLoginedId = data.userid;
				$rootScope.userLoginedType = data.usertype;
				$rootScope.userLoginedIcon = data.usericonurl;
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
	};
	
	$scope.signupCheck = function() {
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
					
					$rootScope.userLoginedName = res.username;
					$rootScope.userLoginedId = res.userid;
					$rootScope.userLoginedType = res.usertype;
					window.open('/quizGym/#/quizmain', '_self');
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
	$scope.showQuizFn = $rootScope.showQuizFn;
	$scope.getRandomQuizFn = function() {
		$('#randomQuizModal').modal('hide');
		var number = Math.floor(Math.random() * 5 + 1);
		var quizScopes = ['photography', 'music', 'film', 'science', 'sports'];
		$scope.scopeType = quizScopes[number - 1];
		var quizNumber = $('input[type="radio"]:checked').val();
		console.log(number);
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
				window.open('/quizGym/#/doquiz', '_self');
				$scope.showQuizFn(true, $scope);
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
			$rootScope.quizList = $scope.listData;
			$rootScope.quizScopeSelected = $scope.quizName;
			window.open('/quizGym/#/quizlistview', '_self');
		});
	};
}])
.controller('CreateQuizController', ['$scope', '$rootScope', function($scope, $rootScope) {
	$scope.quizNumber = 1;
	$scope.isNumberEnough = true;
	$scope.currentIndex = 0;

	//test
	$scope.listName = $rootScope.createQuizName;
	$scope.scopeType = $rootScope.quizScopeSelected;
	$scope.createrName = $rootScope.userLoginedName;
	
	console.log($scope.createrName)
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
	
	$scope.deleteCurrentQuestion = function() {
		if (confirm('Be sure to delete the current question?')) {
			$scope.quiz.splice($scope.currentIndex, 1);
			$scope.currentIndex = $scope.currentIndex - 1;
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
		
		////console.log($scope.quiz);
		if (!$scope.createrName) {
			$scope.createrName = 'bobo';
		}
		var quizObj = {
			"listName": $scope.listName,
			"scopeType": $scope.scopeType,
			"createrName": $scope.createrName,
			"questions": $scope.quiz,
		};
			
		var jsonObj = JSON.stringify(quizObj);
		console.log(jsonObj)
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
					window.open('/quizGym/#/quizlistview', '_self');
				});
			} else {
				alert('some errors happened, please try again');
			}
		})
	};
}])
.controller('QuizListController', ['$scope', '$rootScope', function($scope, $rootScope) {
	$scope.quizListData = $rootScope.quizList;
	$scope.scopeType = $rootScope.quizScopeSelected;
	$scope.userType = $rootScope.userLoginedType;
	$scope.userId = $rootScope.userLoginedId;
	$scope.userName = $rootScope.userLoginedName;
	$scope.$on('updateList', function(ev, data) {
		////console.log('update');
		$scope.$apply(function() {
			$scope.quizListData = data.listData;
		});
	});

	$scope.applyForPro = function() {
		if(confirm('Apply for PRO needs your score above 100, then you have the rigth to create quiz, still apply?')) {
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
				console.log(res);
				if (res === '0') {
					alert('Your score is not enough, don\'t be frustrat, you can still apply for PRO after spareing more effort'); 
				} else if (res === '200') {
					alert('Success, now you are our PRO user!');
					$rootScope.userLoginedType = 'PRO';
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
			
			////console.log(data)
			window.open('/quizGym/#/doquiz', '_self');

			$scope.showQuizFn(false, $scope);
		});
	};

	$scope.getRandomQuizFn = function() {
		$('#randomQuizModal').modal('hide');
//		var number = Math.floor(Math.random() * 5 + 1);
//		var quizScopes = ['photography', 'music', 'film', 'science', 'sports'];
//		$scope.scopeType = quizScopes[number];
		var quizNumber = $('input[type="radio"]:checked').val();
		////console.log(quizNumber);
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
				window.open('/quizGym/#/doquiz', '_self');
				$scope.showQuizFn(true, $scope);
			});
		}, 300)
	};
	$scope.getRandom = function() {
		$('#randomQuizModal').modal();
	};


	$scope.createQuiz = function() {
		$('#createQuizOption').modal();
		//window.open('/#/createquiz', '_self');
	};

	$scope.createQuizFn = function() {
		////console.log('create');
		if ($scope.nameOfQuiz.trim().length === 0) {
			alert('please input the name');
		} else {
			$('#createQuizOption').modal('hide');
			$rootScope.createQuizName = $scope.nameOfQuiz;
			setTimeout(function() {
				window.open('/quizGym/#/createquiz', '_self');
			}, 200);
			
		}
	};
	$scope.randomQuizFn = function() {
		
		
//		$.ajax({
//			url: '/quizGym/rest/questionrest/randFindQuestion',
//			data: {
//				scopeType: $scope.scopeType
//			},
//			type: 'GET'
//		}).then(function(data) {
//			$scope.quizData = data;
//			////console.log($scope.quizData);
//			//`$location.path('/doquiz');
//			//window.open('/quizGym/#/doquiz', '_self');
//
//			window.open('/quizGym/#/doquiz', '_self');
//			//先写不规范的给老师看看 之后改成正规Angular, 之后用PROMISE $Q 完成
//			$scope.showQuizFn(true);
//		});

	};

	// $scope.showQuizFn = function(isRandom) {
	// 	setTimeout(function() {
	// 			//alert('asd');
	// 			$('#selectedType').html($scope.scopeType);
	// 			var quizGeted = [];
	// 			var index = 0;
	// 			var indexMax = 0;
	// 			var userAnswer;
	// 			var userDidNumber = 0;
	// 			var $arrRadios;
	// 			var result = [];
	// 			var isDisabled = false;
	// 			(function() {
	// 				quizGeted = $scope.quizData;		
	// 				index = 0;
	// 				indexMax = quizGeted.length - 1;
	// 				userDidNumber = 0;
	// 				quizNumber = indexMax + 1;
	// 				userAnswer = new Array(quizNumber);
	// 				for(var i = 0; i < quizNumber; i++) {
	// 					result.push(quizGeted[i].result);
	// 				}
	// 				insertQuiz(0);
	// 				quizView();
	// 			})();
	// 			function insertQuiz(index) {
	// 				var questionNumber = quizGeted[index];
	// 				////console.log(questionNumber)
	// 				$('.num').html('NO.' + (index + 1) + ' :');
	// 				var firstChar = questionNumber.question.substring(0, 1);
	// 				var quizHtml = '<div class="question">'
	// 							 + '<p><h3>&nbsp;&nbsp;&nbsp;&nbsp;' + firstChar + '&nbsp;</h3>' + questionNumber.question.substring(1) + '</p></div>'
	// 							 + '<div class="choose-answer" id="answers">'
	// 							 + '<label for="A">'
	// 							 + '<input type="radio" id="A" name="answer" value="A"/>'
	// 							 + '<p>' + questionNumber.answer[0] + '</p>'
	// 							 + '</label>'
	// 							 + '<label for="B">'
	// 							 + '<input type="radio" id="B" name="answer" value="B"/>'
	// 							 + '<p>' + questionNumber.answer[1] + '</p>'
	// 							 + '</label>'
	// 							 + '<label for="C">'
	// 							 + '<input type="radio" id="C" name="answer" value="C"/>'
	// 							 + '<p>' + questionNumber.answer[2] + '</p>'
	// 							 + '</label>'
	// 							 + '<label for="D">'
	// 							 + '<input type="radio" id="D" name="answer" value="D"/>'
	// 							 + '<p>' + questionNumber.answer[3] + '</p>'
	// 							 + '</label>'
	// 							 + '</div>';
	// 				$('.question-info').html(quizHtml);
	// 				$('.question').css('display', 'none').fadeIn(600);
	// 				$('#answers').css('display', 'none').slideDown(600);

	// 				var oInfo = $('.acomplish-info .acomplished');
	// 				var oBar = $('.acomplish-info .progress .progress-bar');
	// 				if(index === 0 && !userAnswer[0] && !userAnswer[1] && !userAnswer[2] && !userAnswer[3]) {
	// 					oInfo.html('acomplished 0&nbsp;&nbsp;');
	// 					oBar.html('0/' + (indexMax + 1));
	// 					oBar.css('width', '0');

	// 				}
	// 				var $arrRadios = $('input[type="radio"]');
	// 				$arrRadios.each(function(i, ele) {
	// 					$(ele).change(function() {
	// 						userAnswer[index] = $('input[type="radio"]:checked').val();
	// 						for(var i = 0, len = userAnswer.length, didNumber = 0; i < len; i++) {
	// 							if(userAnswer[i]) {
	// 								didNumber ++;
	// 							}
	// 						}
	// 						userDidNumber = didNumber;
	// 						oInfo.html('acomplished ' + userDidNumber + '&nbsp;&nbsp;');
	// 						oBar.html(userDidNumber + '/' + (indexMax + 1));
	// 						oBar.css('width', (userDidNumber / quizNumber) * 100 + '%');
	// 					});
	// 				});
	// 			}

	// 			function quizView() {
	// 				$('#pre').attr('disabled', true);
	// 				$('#next').on('click',function() {
	// 					if(index < indexMax) {
	// 						insertQuiz(++index);
	// 						if(isDisabled) {
	// 							$('input[type="radio"]').prop('disabled', true);
	// 						}
	// 						if(userAnswer[index]) {
	// 							$('input[value="' + userAnswer[index] + '"]').prop('checked', true);
	// 						}
	// 						$('#pre').attr('disabled', false);
	// 						if(index == indexMax) {
	// 							$(this).attr('disabled', true);
	// 						}
	// 					}
	// 				});
	// 				$('#pre').on('click', function() 	{
	// 					if(index > 0) {
	// 						insertQuiz(--index);
	// 						if(isDisabled) {
	// 							$('input[type="radio"]').prop('disabled', true);
	// 						}
	// 						if(userAnswer[index]) {
	// 							$('input[value="' + userAnswer[index] + '"]').prop('checked', true);
	// 						}
	// 						$('#next').attr('disabled', false);
	// 						if(index === 0) {
	// 							$(this).attr('disabled', true);
	// 						}
	// 					}
	// 				});
					
	// 				$('#submit').on('click', function() {
	// 					var flag = true;
	// 					for(var i = 0, len = userAnswer.length; i < len; i++) {
	// 						if(!userAnswer[i]) {
	// 							flag = false;
	// 						}
	// 					}
	// 					if(!flag) {
	// 						if(!confirm('There still exist unanswered question(s), still submit ?')) {
	// 							return;
	// 						}
	// 					}
	// 					callModal();
	// 					isDisabled = true;
	// 					$('input[type="radio"]').prop('disabled', true);
	// 					$(this).prop('disabled', true);

	// 					var checkBtn = $('<button class="btn btn-info" id="checkAnswerBtn">Check errors</button>').on('click', function() {
	// 						callModal();
	// 					});
	// 					$('.buttons').append(checkBtn);
	// 				});
	// 			}

	// 			function recordAnswer() {
	// 				userAnswer[index] = $('input:checked').val();
	// 			}
				
	// 			function callModal() {
	// 				var quizResult = '';
	// 				var number = 0;
	// 				var wrongAnswer = [];
	// 				for(var i = 0; i < quizNumber; i++) {
	// 					if(!userAnswer[i]) {
	// 						userAnswer[i] = 'blank';
	// 					}
	// 					quizResult += userAnswer[i] + ' ';
	// 					if(userAnswer[i] == result[i]) {
	// 						number++;
	// 					} else {
	// 						wrongAnswer.push({
	// 							id: quizGeted[i].questionId,
	// 							index: i,
	// 							content: quizGeted[i].question,
	// 							quizAnswers: quizGeted[i].answer,
	// 							userGived: userAnswer[i],
	// 							correctAnswer: result[i]
	// 						});
	// 					}
	// 				}

	// 				if (isRandom) {
	// 					var questionResult = [];
	// 					console.log(quizGeted)
	// 					quizGeted.forEach(function(item, index) {
	// 						var flag = false;
	// 						for (var i = 0; i < wrongAnswer.length; i++) {
	// 							if (item.questionId === wrongAnswer[i].id) {
	// 								questionResult.push({
	// 									"questionId": item.questionId,
	// 									"result": 0
	// 								});
	// 								flag = true;
	// 								break;
	// 							}
	// 						}
	// 						if (!flag) {
	// 							questionResult.push({
	// 								"questionId": item.questionId,
	// 								"result": 1
	// 							});								
	// 						}
	// 					});
	// 					var jsonObj = {
	// 							"user_id": $rootScope.userLoginedId,
	// 							"questionInfo": questionResult
	// 						};
	// 					$.ajax({
	// 						url: '/quizGym/rest/userrest/savedonequestion',
	// 						method: 'POST',
	// 						contentType: 'application/json',
	// 						dataType: 'json',
	// 						data: JSON.stringify(jsonObj)
	// 					});
	// 				} else {
	// 					$.ajax({
	// 						url:  '/quizGym/rest/userrest/savedonelist',
	// 						contentType: 'application/json',
	// 						dataType: 'json',
	// 						data: {
	// 							"quiz_id": $scope.quizId,
	// 							"user_id": 1,
	// 							"worng_num": quizNumber - number,
	// 							"correct_num": number
	// 						}
	// 					});
	// 				}

	// 				if(wrongAnswer.length === 0) {
	// 					var allCorrectModal = '<h1 style="color: green">All correct！GoodJob!</h1>';
	// 					$('.modal-body').html('').html(allCorrectModal);
	// 				} else {
	// 					var oModalResult = $('.modal-body .modal-result-info');
	// 					var oModalFooterPre = $('.modal-footer .btn-toolbar');
	// 					oModalFooterPre.html('');
	// 					var  getCorrectAnswer = function(resultIndex) {
	// 						$('.modal-body p').eq(0).html('You got <strong style="color:green">' + number + '</strong> correct answers, failed ' + '<strong style="color:red">' + (quizNumber - number) + '</strong> questions');
							

	// 						oModalResult.find('.result-content').html(quizGeted[resultIndex].question);
	// 						$(quizGeted[resultIndex].answer).each(function(index, item) {
	// 							oModalResult.find('.result-answer p').eq(index).html(quizGeted[resultIndex].answer[index]);
	// 						});

	// 						oModalResult.find('.correct-answer').html('Correct answers: ' + quizGeted[resultIndex].result + ',&nbsp;&nbsp;Your answsers: ' + userAnswer[resultIndex] + '&nbsp;&nbsp;');
	// 						oModalResult.css('display', 'none').fadeIn(1000);

	// 						oModalResult.find('.reason-of-answer').html(quizGeted[resultIndex].reason);
	// 					};

	// 					$(wrongAnswer).each(function(i, item) {
	// 						var btnInGroup = $('<button class="btn btn-danger btn-group">' + (item.index + 1) + '</button>');
	// 						oModalFooterPre.append(btnInGroup);
	// 					});

	// 					var oModalFooterBtn = $('.modal-footer .btn-toolbar').find('.btn');
	// 					$(oModalFooterBtn).each(function(index, item) {
	// 						$(item).on('click', function() {
	// 							getCorrectAnswer(parseInt($(this).html()) - 1);
	// 						});
	// 					});
	// 					getCorrectAnswer(wrongAnswer[0].index);
	// 				}
	// 				$('#myModal').modal();
	// 			}
	// 		}, 100);
	// }
	$scope.showQuizFn = $rootScope.showQuizFn;
}])
.controller('SearchBoxController', ['$scope', '$rootScope', function($scope, $rootScope){
	$scope.userName = $rootScope.userLoginedName;
	$scope.userIconUrl = $rootScope.userLoginedIcon;
	$scope.logOutFn = function() {
		$.ajax({
			url: '/quizGym/rest/userrest/logout',
			data: {
				userId: $rootScope.userLoginedId
			}
		}).
		then(function(res) {
			if (res === '200') {
				$rootScope.userLoginedName = null;
				$rootScope.userLoginedId = null;
				$rootScope.userLoginedType = null;

				window.open('/quizGym/#/userlogin', '_self');
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
		if (!$scope.bugToSubmit || $scope.bugToSubmit.trim() === '') {
			alert('please input your reflection before submit');
		} else {

			$.ajax({
				method: 'POST',
				data: JSON.stringify({
					userName: $rootScope.userLoginedName,
					content: $scope.bugToSubmit
				}),
				contentType: 'application/json',
				url: '/quizGym/rest/userrest/submitbugs'
			})
			.then(function(res) {
				if (res === '200') {
					alert('We have received your reflection, thank you very much!');
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
		if ($scope.keyOfSearch.trim() === '' || $scope.keyOfSearch.trim() === undefined) {
			alert('please input keyword of searching');
		} else {
			$.ajax({
				url: '/quizGym/rest/groupquestionrest/findKeyList',
				data: {
					key: $scope.keyOfSearch
				}
			})
			.then(function(data) {
				////console.log(data);
				$rootScope.searchKey = $scope.keyOfSearch;
				$rootScope.searchResult = data;

				
				console.log(data)
				$rootScope.$broadcast('getSearch', {
					searchkey: $scope.keyOfSearch,
					searchResult: data
				});
				//window.open('/quizGym/#/searchlist');
				//////console.log($rootScope.searchKey + 'root')
				window.open('/quizGym/#/searchlist', '_self');
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
	$scope.searchResultList = $rootScope.searchResult;
	$scope.searchResultKey = $rootScope.searchKey;

	////console.log($rootScope.searchKey + 'scope');
	$scope.$on('getSearch', function(ev, data) {
		////console.log(data);
		$scope.$apply(function() {
			$scope.searchResultKey = data.searchkey;
			$scope.searchResultList = data.searchResult;
			$scope.scopeType = data.searchResult[0].scopeType;
			console.log($scope.scopeType);
		});
	});

	$scope.backFn = function() {
		window.open('/quizGym/#/quizlistview', '_self');
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
			//$scope.scopeType = data.scopeType;
			console.log(data);
			////console.log($scope.scopeType)
			window.open('/quizGym/#/doquiz', '_self');

			$scope.showQuizFn(false, $scope);
		});
	};

	$scope.showQuizFn = $rootScope.showQuizFn;
}])
.controller('UserCenterController', ['$scope', 'GetQuizDataList', 'GetQuestionDataList', 'GetMailDataList', 'GetMailDataList', '$rootScope', 'GetUserInfo', function($scope, GetQuizDataList, GetQuestionDataList, GetMailDataList, GetMailDataList, $rootScope, GetUserInfo) {
	GetQuizDataList.get().then(function(data) {
		$scope.quizData = data.data;
	});
	GetQuestionDataList.get().then(function(data) {
		$scope.questionData = data.data;
	});
	GetMailDataList.get().then(function(data) {
		$scope.mailData = data.data;
	});
	$scope.userType = $rootScope.userLoginedType;
	$scope.userId = $rootScope.userLoginedId;

	// $scope.getQuizUpdataFn = function() {
	// 	$.ajax({
	// 		url: '',

	// 	})
	// };

	

	$scope.rejectFn = function(id) {
		$('#rejectModal').modal();
		$scope.rejectSubmit = function() {
			$.ajax({
				url: '/quizGym/rest/groupquestionrest/passinfo',
				data: {
					id: id,
					state: -1,
					reason: $scope.rejectReason
				}
			})
			.then(function(res) {
				console.log(res);
				$scope.$apply(function() {
					$scope.quizData = res;
					$('#rejectModal').modal('hide');
				});
			});
		};
	};

	$scope.passFn = function(id) {
		$.ajax({
			url: '/quizGym/rest/groupquestionrest/passinfo',
			data: {
				id: id,
				state: 1
			}
		})
		.then(function(res) {
			console.log(res);
			$scope.$apply(function() {
//				$scope.quizData = JSON.parse(res);
				$scope.quizData = res;
			});
		});
	};


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
	})


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
//							console.log($scope.userData.userIconUrl, res)
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

}])
.controller('FooterControler', ['$scope', function($scope) {
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
//	var test = [{"_id":"1","index":"1","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"A"},{"index":"2","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"3","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"4","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"5","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"6","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"7","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"8","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"9","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"_id":"1","index":"1","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"2","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"3","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"4","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"5","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"6","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"7","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"8","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"9","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"_id":"1","index":"1","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"2","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"3","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"4","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"5","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"6","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"7","question":"1111111使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?","answer":["A、蓝色","B、黄色","C、高感光度时偏蓝，低感光度时偏黄","D、阿达阿啊"],"result":"A","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"8","question":"用日光白平衡在白炽灯条件下拍摄，影像的色调将?","answer":["A、偏蓝","B、偏红黄","C、高感光度时偏蓝，低感光度时偏红黄","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"},{"index":"9","question":"色温是?","answer":["A、数码相机的白平衡属性之一","B、光源的属性之一","C、两者都是","D、阿达阿啊"],"result":"B","reason":"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊","userResult":"blank"}];
	$scope.checkDetailData = $rootScope.checkDetailData;
	console.log($scope.checkDetailData);
//	$scope.checkDetailData = test;
	$scope.currentIndex = 0;
	$scope.userName = $rootScope.userLoginedName;
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
			alert('Your must input something to submit');
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
			console.log(res);
			$scope.$apply(function() {
				$scope.commentData = res;
			});
		});
	}
}]);


			// 			{
			// 	"index": "3",
			// 	"question": "333使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?",
			// 	"answer": ["A、333蓝色", "B、333黄色", "C、333高感光度时偏蓝，低感光度时偏黄", "D、333阿达阿啊"],
			// 	"result": "B",
			// 	"reason": "333啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
			// },