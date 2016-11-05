angular.module('controllersModule', [])
.controller('WelcomeController', ['$scope', '$location', function($scope, $location) {
	$scope.startTrainning = function() {
		window.open('/quizGym/#/userlogin', '_self')
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
				////console.log('resived');
				if (res !== '-1') {
					////console.log('signup success');
//					$rootScope.userLogined = res;
					$rootScope.userLoginedName = res.username;
					$rootScope.userLoginedId = res.userid;
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
	$scope.showQuizFn = function(isRandom) {
		setTimeout(function() {
				//alert('asd');s
				$('#selectedType').html($scope.scopeType);
				var quizGeted = [];
				var index = 0;
				var indexMax = 0;
				var userAnswer;
				var userDidNumber = 0;
				var $arrRadios;
				var result = [];
				var isDisabled = false;
				(function() {
					
					quizGeted = $scope.quizData;		
					console.log($scope.quizData);
					index = 0;
					indexMax = quizGeted.length - 1;
					userDidNumber = 0;
					quizNumber = indexMax + 1;
					userAnswer = new Array(quizNumber);
					for(var i = 0; i < quizNumber; i++) {
						result.push(quizGeted[i].result);
					}
					insertQuiz(0);
					quizView();
				})();
				function insertQuiz(index) {
					var questionNumber = quizGeted[index];
					////console.log(questionNumber)
					$('.num').html('NO.' + (index + 1) + ' :');
					var firstChar = questionNumber.question.substring(0, 1);
					var quizHtml = '<div class="question">'
								 + '<p><h3>&nbsp;&nbsp;&nbsp;&nbsp;' + firstChar + '&nbsp;</h3>' + questionNumber.question.substring(1) + '</p></div>'
								 + '<div class="choose-answer" id="answers">'
								 + '<label for="A">'
								 + '<input type="radio" id="A" name="answer" value="A"/>'
								 + '<p>' + questionNumber.answer[0] + '</p>'
								 + '</label>'
								 + '<label for="B">'
								 + '<input type="radio" id="B" name="answer" value="B"/>'
								 + '<p>' + questionNumber.answer[1] + '</p>'
								 + '</label>'
								 + '<label for="C">'
								 + '<input type="radio" id="C" name="answer" value="C"/>'
								 + '<p>' + questionNumber.answer[2] + '</p>'
								 + '</label>'
								 + '<label for="D">'
								 + '<input type="radio" id="D" name="answer" value="D"/>'
								 + '<p>' + questionNumber.answer[3] + '</p>'
								 + '</label>'
								 + '</div>';
					$('.question-info').html(quizHtml);
					$('.question').css('display', 'none').fadeIn(600);
					$('#answers').css('display', 'none').slideDown(600);

					var oInfo = $('.acomplish-info .acomplished');
					var oBar = $('.acomplish-info .progress .progress-bar');
					if(index === 0 && !userAnswer[0] && !userAnswer[1] && !userAnswer[2] && !userAnswer[3]) {
						oInfo.html('acomplished 0&nbsp;&nbsp;');
						oBar.html('0/' + (indexMax + 1));
						oBar.css('width', '0');

					}
					var $arrRadios = $('input[type="radio"]');
					$arrRadios.each(function(i, ele) {
						$(ele).change(function() {
							userAnswer[index] = $('input[type="radio"]:checked').val();
							for(var i = 0, len = userAnswer.length, didNumber = 0; i < len; i++) {
								if(userAnswer[i]) {
									didNumber ++;
								}
							}
							userDidNumber = didNumber;
							oInfo.html('acomplished ' + userDidNumber + '&nbsp;&nbsp;');
							oBar.html(userDidNumber + '/' + (indexMax + 1));
							oBar.css('width', (userDidNumber / quizNumber) * 100 + '%');
						});
					});
				}

				function quizView() {
					$('#pre').attr('disabled', true);
					$('#next').on('click',function() {
						if(index < indexMax) {
							insertQuiz(++index);
							if(isDisabled) {
								$('input[type="radio"]').prop('disabled', true);
							}
							if(userAnswer[index]) {
								$('input[value="' + userAnswer[index] + '"]').prop('checked', true);
							}
							$('#pre').attr('disabled', false);
							if(index == indexMax) {
								$(this).attr('disabled', true);
							}
						}
					});
					$('#pre').on('click', function() 	{
						if(index > 0) {
							insertQuiz(--index);
							if(isDisabled) {
								$('input[type="radio"]').prop('disabled', true);
							}
							if(userAnswer[index]) {
								$('input[value="' + userAnswer[index] + '"]').prop('checked', true);
							}
							$('#next').attr('disabled', false);
							if(index === 0) {
								$(this).attr('disabled', true);
							}
						}
					});
					
					$('#submit').on('click', function() {
						////console.log("submit");
						var flag = true;
						for(var i = 0, len = userAnswer.length; i < len; i++) {
							if(!userAnswer[i]) {
								flag = false;
							}
						}
						if(!flag) {
							if(!confirm('There still exist unanswered question(s), still submit ?')) {
								return;
							}
						}
						callModal();
						isDisabled = true;
						$('input[type="radio"]').prop('disabled', true);
						$(this).prop('disabled', true);

						var checkBtn = $('<button class="btn btn-info" id="checkAnswerBtn">Check errors</button>').on('click', function() {
							callModal();
						});
						$('.buttons').append(checkBtn);
					});
				}

				function recordAnswer() {
					userAnswer[index] = $('input:checked').val();
				}
				
				function callModal() {
					var quizResult = '';
					var number = 0;
					var wrongAnswer = [];
					for(var i = 0; i < quizNumber; i++) {
						if(!userAnswer[i]) {
							userAnswer[i] = 'blank';
							}
						quizResult += userAnswer[i] + ' ';
						if(userAnswer[i] == result[i]) {
							number++;
						} else {
							wrongAnswer.push({
								id: quizGeted[i].questionId,
								index: i,
								content: quizGeted[i].question,
								quizAnswers: quizGeted[i].answer,
								userGived: userAnswer[i],
								correctAnswer: result[i]
							});
						}
					}
					if (isRandom) {
						var questionResult = [];
						quizGeted.forEach(function(item, index) {
							var flag = false;
							for (var i = 0; i < wrongAnswer.length; i++) {
								if (item.questionId === wrongAnswer[i].id) {
									questionResult.push({
										"questionId": item.questionId,
										"result": 0
									});
									flag = true;
									break;
								}
							}
							if (!flag) {
								questionResult.push({
									"questionId": item.questionId,
									"result": 1
								});								
							}
						});
						var jsonObj = {
								"user_id": $rootScope.userLoginedId,
								"questionInfo": questionResult
							};
						$.ajax({
							url: '/quizGym/rest/userrest/savedonequestion',
							method: 'POST',
							contentType: 'application/json',
							dataType: 'json',
							data: JSON.stringify(jsonObj)
						});
					} else {
						$.ajax({
							url:  '/quizGym/rest/userrest/savedonelist',
							contentType: 'application/json',
							dataType: 'json',
							data: {
								"quiz_id": $scope.quizId,
								"user_id": 1,
								"worng_num": quizNumber - number,
								"correct_num": number
							}
						});
					}
					if(wrongAnswer.length === 0) {
						var allCorrectModal = '<h1 style="color: green">All correct！GoodJob!</h1>';
						$('.modal-body').html('').html(allCorrectModal);

					} else {
						var oModalResult = $('.modal-body .modal-result-info');
						var oModalFooterPre = $('.modal-footer .btn-toolbar');
						oModalFooterPre.html('');
						var  getCorrectAnswer = function(resultIndex) {
							$('.modal-body p').eq(0).html('You got <strong style="color:green">' + number + '</strong> correct answers, failed ' + '<strong style="color:red">' + (quizNumber - number) + '</strong> questions');
							

							oModalResult.find('.result-content').html(quizGeted[resultIndex].question);
							$(quizGeted[resultIndex].answer).each(function(index, item) {
								oModalResult.find('.result-answer p').eq(index).html(quizGeted[resultIndex].answer[index]);
							});

							oModalResult.find('.correct-answer').html('Correct answers: ' + quizGeted[resultIndex].result + ',&nbsp;&nbsp;Your answsers: ' + userAnswer[resultIndex] + '&nbsp;&nbsp;');
							oModalResult.css('display', 'none').fadeIn(1000);

							oModalResult.find('.reason-of-answer').html(quizGeted[resultIndex].reason);
						};

						$(wrongAnswer).each(function(i, item) {
							var btnInGroup = $('<button class="btn btn-danger btn-group">' + (item.index + 1) + '</button>');
							oModalFooterPre.append(btnInGroup);
						});

						var oModalFooterBtn = $('.modal-footer .btn-toolbar').find('.btn');
						$(oModalFooterBtn).each(function(index, item) {
							$(item).on('click', function() {
								getCorrectAnswer(parseInt($(this).html()) - 1);
							});
						});
						getCorrectAnswer(wrongAnswer[0].index);
					}
					$('#myModal').modal();
				}
			}, 100);
	};
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
				$scope.showQuizFn(true);
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

	$scope.$on('updateList', function(ev, data) {
		////console.log('update');
		$scope.$apply(function() {
			$scope.quizListData = data.listData;
		});
	});

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

			$scope.showQuizFn();
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
				$scope.showQuizFn(true);
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

	$scope.showQuizFn = function(isRandom) {
		setTimeout(function() {
				//alert('asd');
				$('#selectedType').html($scope.scopeType);
				var quizGeted = [];
				var index = 0;
				var indexMax = 0;
				var userAnswer;
				var userDidNumber = 0;
				var $arrRadios;
				var result = [];
				var isDisabled = false;
				(function() {
					quizGeted = $scope.quizData;		
					index = 0;
					indexMax = quizGeted.length - 1;
					userDidNumber = 0;
					quizNumber = indexMax + 1;
					userAnswer = new Array(quizNumber);
					for(var i = 0; i < quizNumber; i++) {
						result.push(quizGeted[i].result);
					}
					insertQuiz(0);
					quizView();
				})();
				function insertQuiz(index) {
					var questionNumber = quizGeted[index];
					////console.log(questionNumber)
					$('.num').html('NO.' + (index + 1) + ' :');
					var firstChar = questionNumber.question.substring(0, 1);
					var quizHtml = '<div class="question">'
								 + '<p><h3>&nbsp;&nbsp;&nbsp;&nbsp;' + firstChar + '&nbsp;</h3>' + questionNumber.question.substring(1) + '</p></div>'
								 + '<div class="choose-answer" id="answers">'
								 + '<label for="A">'
								 + '<input type="radio" id="A" name="answer" value="A"/>'
								 + '<p>' + questionNumber.answer[0] + '</p>'
								 + '</label>'
								 + '<label for="B">'
								 + '<input type="radio" id="B" name="answer" value="B"/>'
								 + '<p>' + questionNumber.answer[1] + '</p>'
								 + '</label>'
								 + '<label for="C">'
								 + '<input type="radio" id="C" name="answer" value="C"/>'
								 + '<p>' + questionNumber.answer[2] + '</p>'
								 + '</label>'
								 + '<label for="D">'
								 + '<input type="radio" id="D" name="answer" value="D"/>'
								 + '<p>' + questionNumber.answer[3] + '</p>'
								 + '</label>'
								 + '</div>';
					$('.question-info').html(quizHtml);
					$('.question').css('display', 'none').fadeIn(600);
					$('#answers').css('display', 'none').slideDown(600);

					var oInfo = $('.acomplish-info .acomplished');
					var oBar = $('.acomplish-info .progress .progress-bar');
					if(index === 0 && !userAnswer[0] && !userAnswer[1] && !userAnswer[2] && !userAnswer[3]) {
						oInfo.html('acomplished 0&nbsp;&nbsp;');
						oBar.html('0/' + (indexMax + 1));
						oBar.css('width', '0');

					}
					var $arrRadios = $('input[type="radio"]');
					$arrRadios.each(function(i, ele) {
						$(ele).change(function() {
							userAnswer[index] = $('input[type="radio"]:checked').val();
							for(var i = 0, len = userAnswer.length, didNumber = 0; i < len; i++) {
								if(userAnswer[i]) {
									didNumber ++;
								}
							}
							userDidNumber = didNumber;
							oInfo.html('acomplished ' + userDidNumber + '&nbsp;&nbsp;');
							oBar.html(userDidNumber + '/' + (indexMax + 1));
							oBar.css('width', (userDidNumber / quizNumber) * 100 + '%');
						});
					});
				}

				function quizView() {
					$('#pre').attr('disabled', true);
					$('#next').on('click',function() {
						if(index < indexMax) {
							insertQuiz(++index);
							if(isDisabled) {
								$('input[type="radio"]').prop('disabled', true);
							}
							if(userAnswer[index]) {
								$('input[value="' + userAnswer[index] + '"]').prop('checked', true);
							}
							$('#pre').attr('disabled', false);
							if(index == indexMax) {
								$(this).attr('disabled', true);
							}
						}
					});
					$('#pre').on('click', function() 	{
						if(index > 0) {
							insertQuiz(--index);
							if(isDisabled) {
								$('input[type="radio"]').prop('disabled', true);
							}
							if(userAnswer[index]) {
								$('input[value="' + userAnswer[index] + '"]').prop('checked', true);
							}
							$('#next').attr('disabled', false);
							if(index === 0) {
								$(this).attr('disabled', true);
							}
						}
					});
					
					$('#submit').on('click', function() {
						var flag = true;
						for(var i = 0, len = userAnswer.length; i < len; i++) {
							if(!userAnswer[i]) {
								flag = false;
							}
						}
						if(!flag) {
							if(!confirm('There still exist unanswered question(s), still submit ?')) {
								return;
							}
						}
						callModal();
						isDisabled = true;
						$('input[type="radio"]').prop('disabled', true);
						$(this).prop('disabled', true);

						var checkBtn = $('<button class="btn btn-info" id="checkAnswerBtn">Check errors</button>').on('click', function() {
							callModal();
						});
						$('.buttons').append(checkBtn);
					});
				}

				function recordAnswer() {
					userAnswer[index] = $('input:checked').val();
				}
				
				function callModal() {
					var quizResult = '';
					var number = 0;
					var wrongAnswer = [];
					for(var i = 0; i < quizNumber; i++) {
						if(!userAnswer[i]) {
							userAnswer[i] = 'blank';
						}
						quizResult += userAnswer[i] + ' ';
						if(userAnswer[i] == result[i]) {
							number++;
						} else {
							wrongAnswer.push({
								id: quizGeted[i].questionId,
								index: i,
								content: quizGeted[i].question,
								quizAnswers: quizGeted[i].answer,
								userGived: userAnswer[i],
								correctAnswer: result[i]
							});
						}
					}

					if (isRandom) {
						var questionResult = [];
						console.log(quizGeted)
						quizGeted.forEach(function(item, index) {
							var flag = false;
							for (var i = 0; i < wrongAnswer.length; i++) {
								if (item.questionId === wrongAnswer[i].id) {
									questionResult.push({
										"questionId": item.questionId,
										"result": 0
									});
									flag = true;
									break;
								}
							}
							if (!flag) {
								questionResult.push({
									"questionId": item.questionId,
									"result": 1
								});								
							}
						});
						var jsonObj = {
								"user_id": $rootScope.userLoginedId,
								"questionInfo": questionResult
							};
						$.ajax({
							url: '/quizGym/rest/userrest/savedonequestion',
							method: 'POST',
							contentType: 'application/json',
							dataType: 'json',
							data: JSON.stringify(jsonObj)
						});
					} else {
						$.ajax({
							url:  '/quizGym/rest/userrest/savedonelist',
							contentType: 'application/json',
							dataType: 'json',
							data: {
								"quiz_id": $scope.quizId,
								"user_id": 1,
								"worng_num": quizNumber - number,
								"correct_num": number
							}
						});
					}

					if(wrongAnswer.length === 0) {
						var allCorrectModal = '<h1 style="color: green">All correct！GoodJob!</h1>';
						$('.modal-body').html('').html(allCorrectModal);
					} else {
						var oModalResult = $('.modal-body .modal-result-info');
						var oModalFooterPre = $('.modal-footer .btn-toolbar');
						oModalFooterPre.html('');
						var  getCorrectAnswer = function(resultIndex) {
							$('.modal-body p').eq(0).html('You got <strong style="color:green">' + number + '</strong> correct answers, failed ' + '<strong style="color:red">' + (quizNumber - number) + '</strong> questions');
							

							oModalResult.find('.result-content').html(quizGeted[resultIndex].question);
							$(quizGeted[resultIndex].answer).each(function(index, item) {
								oModalResult.find('.result-answer p').eq(index).html(quizGeted[resultIndex].answer[index]);
							});

							oModalResult.find('.correct-answer').html('Correct answers: ' + quizGeted[resultIndex].result + ',&nbsp;&nbsp;Your answsers: ' + userAnswer[resultIndex] + '&nbsp;&nbsp;');
							oModalResult.css('display', 'none').fadeIn(1000);

							oModalResult.find('.reason-of-answer').html(quizGeted[resultIndex].reason);
						};

						$(wrongAnswer).each(function(i, item) {
							var btnInGroup = $('<button class="btn btn-danger btn-group">' + (item.index + 1) + '</button>');
							oModalFooterPre.append(btnInGroup);
						});

						var oModalFooterBtn = $('.modal-footer .btn-toolbar').find('.btn');
						$(oModalFooterBtn).each(function(index, item) {
							$(item).on('click', function() {
								getCorrectAnswer(parseInt($(this).html()) - 1);
							});
						});
						getCorrectAnswer(wrongAnswer[0].index);
					}
					$('#myModal').modal();
				}
			}, 100);
	}
}])
.controller('SearchBoxController', ['$scope', '$rootScope', function($scope, $rootScope){
	$scope.keyDownGetSearch = function($event) {
		if ($event.keyCode === 13) {
			$scope.getSearchFn();
		}
	}
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
			$scope.scopeType = data.searchResult[0].scopeType
			console.log($scope.scopeType)
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

			$scope.showQuizFn();
		});
	};

	$scope.showQuizFn = function(isRandom) {
		console.log($scope.scopeType)
		setTimeout(function() {
				//alert('asd');
				$('#selectedType').html($scope.scopeType);
				var quizGeted = [];
				var index = 0;
				var indexMax = 0;
				var userAnswer;
				var userDidNumber = 0;
				var $arrRadios;
				var result = [];
				var isDisabled = false;
				(function() {
					quizGeted = $scope.quizData;		
					index = 0;
					indexMax = quizGeted.length - 1;
					userDidNumber = 0;
					quizNumber = indexMax + 1;
					userAnswer = new Array(quizNumber);
					for(var i = 0; i < quizNumber; i++) {
						result.push(quizGeted[i].result);
					}
					insertQuiz(0);
					quizView();
				})();
				function insertQuiz(index) {
					var questionNumber = quizGeted[index];
					////console.log(questionNumber)
					$('.num').html('NO.' + (index + 1) + ' :');
					var firstChar = questionNumber.question.substring(0, 1);
					var quizHtml = '<div class="question">'
								 + '<p><h3>&nbsp;&nbsp;&nbsp;&nbsp;' + firstChar + '&nbsp;</h3>' + questionNumber.question.substring(1) + '</p></div>'
								 + '<div class="choose-answer" id="answers">'
								 + '<label for="A">'
								 + '<input type="radio" id="A" name="answer" value="A"/>'
								 + '<p>' + questionNumber.answer[0] + '</p>'
								 + '</label>'
								 + '<label for="B">'
								 + '<input type="radio" id="B" name="answer" value="B"/>'
								 + '<p>' + questionNumber.answer[1] + '</p>'
								 + '</label>'
								 + '<label for="C">'
								 + '<input type="radio" id="C" name="answer" value="C"/>'
								 + '<p>' + questionNumber.answer[2] + '</p>'
								 + '</label>'
								 + '<label for="D">'
								 + '<input type="radio" id="D" name="answer" value="D"/>'
								 + '<p>' + questionNumber.answer[3] + '</p>'
								 + '</label>'
								 + '</div>';
					$('.question-info').html(quizHtml);
					$('.question').css('display', 'none').fadeIn(600);
					$('#answers').css('display', 'none').slideDown(600);

					var oInfo = $('.acomplish-info .acomplished');
					var oBar = $('.acomplish-info .progress .progress-bar');
					if(index === 0 && !userAnswer[0] && !userAnswer[1] && !userAnswer[2] && !userAnswer[3]) {
						oInfo.html('acomplished 0&nbsp;&nbsp;');
						oBar.html('0/' + (indexMax + 1));
						oBar.css('width', '0');

					}
					var $arrRadios = $('input[type="radio"]');
					$arrRadios.each(function(i, ele) {
						$(ele).change(function() {
							userAnswer[index] = $('input[type="radio"]:checked').val();
							for(var i = 0, len = userAnswer.length, didNumber = 0; i < len; i++) {
								if(userAnswer[i]) {
									didNumber ++;
								}
							}
							userDidNumber = didNumber;
							oInfo.html('acomplished ' + userDidNumber + '&nbsp;&nbsp;');
							oBar.html(userDidNumber + '/' + (indexMax + 1));
							oBar.css('width', (userDidNumber / quizNumber) * 100 + '%');
						});
					});
				}

				function quizView() {
					$('#pre').attr('disabled', true);
					$('#next').on('click',function() {
						if(index < indexMax) {
							insertQuiz(++index);
							if(isDisabled) {
								$('input[type="radio"]').prop('disabled', true);
							}
							if(userAnswer[index]) {
								$('input[value="' + userAnswer[index] + '"]').prop('checked', true);
							}
							$('#pre').attr('disabled', false);
							if(index == indexMax) {
								$(this).attr('disabled', true);
							}
						}
					});
					$('#pre').on('click', function() 	{
						if(index > 0) {
							insertQuiz(--index);
							if(isDisabled) {
								$('input[type="radio"]').prop('disabled', true);
							}
							if(userAnswer[index]) {
								$('input[value="' + userAnswer[index] + '"]').prop('checked', true);
							}
							$('#next').attr('disabled', false);
							if(index === 0) {
								$(this).attr('disabled', true);
							}
						}
					});
					
					$('#submit').on('click', function() {
						////console.log("submit");
						var flag = true;
						for(var i = 0, len = userAnswer.length; i < len; i++) {
							if(!userAnswer[i]) {
								flag = false;
							}
						}
						if(!flag) {
							if(!confirm('There still exist unanswered question(s), still submit ?')) {
								return;
							}
						}
						callModal();
						isDisabled = true;
						$('input[type="radio"]').prop('disabled', true);
						$(this).prop('disabled', true);

						var checkBtn = $('<button class="btn btn-info" id="checkAnswerBtn">Check errors</button>').on('click', function() {
							callModal();
						});
						$('.buttons').append(checkBtn);
					});
				}

				function recordAnswer() {
					userAnswer[index] = $('input:checked').val();
				}
				
				function callModal() {
					var quizResult = '';
					var number = 0;
					var wrongAnswer = [];
					for(var i = 0; i < quizNumber; i++) {
						if(!userAnswer[i]) {
							userAnswer[i] = 'blank';
							}
						quizResult += userAnswer[i] + ' ';
						if(userAnswer[i] == result[i]) {
							number++;
						} else {
							wrongAnswer.push({
								id:  quizGeted[i].questionId,
								index: i,
								content: quizGeted[i].question,
								quizAnswers: quizGeted[i].answer,
								userGived: userAnswer[i],
								correctAnswer: result[i]
							});
						}
					}


					if (isRandom) {
						var questionResult = [];
						quizGeted.forEach(function(item, index) {
							var flag = false;
							for (var i = 0; i < wrongAnswer.length; i++) {
								if (item.questionId === wrongAnswer[i].id) {
									questionResult.push({
										"questionId": item.questionId,
										"result": 0
									});
									flag = true;
									break;
								}
							}
							if (!flag) {
								questionResult.push({
									"questionId": item.questionId,
									"result": 1
								});								
							}
						});
						var jsonObj = {
								"user_id": $rootScope.userLoginedId,
								"questionInfo": questionResult
							};
						$.ajax({
							url: '/quizGym/rest/userrest/savedonequestion',
							method: 'POST',
							contentType: 'application/json',
							dataType: 'json',
							data: JSON.stringify(jsonObj)
						});
					} else {
						$.ajax({
							url:  '/quizGym/rest/userrest/savedonelist',
							contentType: 'application/json',
							dataType: 'json',
							data: {
								"quiz_id": $scope.quizId,
								"user_id": 1,
								"worng_num": quizNumber - number,
								"correct_num": number
							}
						});
					}
					if(wrongAnswer.length === 0) {
						var allCorrectModal = '<h1 style="color: green">All correct！GoodJob!</h1>';
						$('.modal-body').html('').html(allCorrectModal);

					} else {
						var oModalResult = $('.modal-body .modal-result-info');
						var oModalFooterPre = $('.modal-footer .btn-toolbar');
						oModalFooterPre.html('');
						var  getCorrectAnswer = function(resultIndex) {
							$('.modal-body p').eq(0).html('You got <strong style="color:green">' + number + '</strong> correct answers, failed ' + '<strong style="color:red">' + (quizNumber - number) + '</strong> questions');
							

							oModalResult.find('.result-content').html(quizGeted[resultIndex].question);
							$(quizGeted[resultIndex].answer).each(function(index, item) {
								oModalResult.find('.result-answer p').eq(index).html(quizGeted[resultIndex].answer[index]);
							});

							oModalResult.find('.correct-answer').html('Correct answers: ' + quizGeted[resultIndex].result + ',&nbsp;&nbsp;Your answsers: ' + userAnswer[resultIndex] + '&nbsp;&nbsp;');
							oModalResult.css('display', 'none').fadeIn(1000);

							oModalResult.find('.reason-of-answer').html(quizGeted[resultIndex].reason);
						};

						$(wrongAnswer).each(function(i, item) {
							var btnInGroup = $('<button class="btn btn-danger btn-group">' + (item.index + 1) + '</button>');
							oModalFooterPre.append(btnInGroup);
						});

						var oModalFooterBtn = $('.modal-footer .btn-toolbar').find('.btn');
						$(oModalFooterBtn).each(function(index, item) {
							$(item).on('click', function() {
								getCorrectAnswer(parseInt($(this).html()) - 1);
							});
						});
						getCorrectAnswer(wrongAnswer[0].index);
					}
					$('#myModal').modal();
				}
			}, 100);
	};
}])
.controller('UserCenterController', ['$scope', 'GetQuizDataList', 'GetQuestionDataList', 'GetMailDataList', 'GetMailDataList', '$rootScope', 'GetUserInfo', function($scope, GetQuizDataList, GetQuestionDataList, GetMailDataList, GetMailDataList, $rootScope, GetUserInfo) {
	GetQuizDataList.get().then(function(data) {
		$scope.quizData = data.data;
	});
	GetQuestionDataList.get().then(function(data) {
		$scope.questionData = data.data;
	});
	GetMailDataList.get().then(function(data) {
		console.log(data.data)
		$scope.mailData = data.data;
	});

	$scope.userId = $rootScope.userLoginedId;

	//Photography, music , sports, film, scicence
	GetUserInfo.get($scope.userId).then(function(data) {
		$scope.userData = data.data;
		$('.user-icon-box').css({
			'background': 'url("' + $scope.userData.userIconUrl + '") no-repeat center',
			'background-size': '250px'
			});
			console.log($scope.userData)
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
		        name: 'Browser share',
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

//		$('#containerNormal').highcharts({
//			chart: {
//				type:'spline'
//			},
//			credits: {
//		    	enabled: false
//			},
//		    title: {
//		        text: 'Accuracy of the recently 10 quizs',
//		        x: -20 //center
//		    },
//		    xAxis: {
//		        categories: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']
//		    },
//		    yAxis: {
//		        title: {
//		            text: 'Accuracy (%)'
//		        },
//		        tickInterval: 10,
//		        max: 100
//		        // categories: ['0', '20', '40', '60', '80', '100'],
//		    },
//		    tooltip: {
//		        valueSuffix: '%'
//		    },
//		    legend: {
//		        layout: 'vertical',
//		        align: 'right',
//		        verticalAlign: 'middle',
//		        borderWidth: 0
//		    },
//		    series: [{
//		        name: 'Accuracy',
//		        data: $scope.userData.accuracy
//		    }],
//		    colors: [
//				// 'rgb(108,109,228)'
//				'red'
//			]
//		});
		var quizNumber = $scope.userData.accuracy.length;
		var accuracyArr = [];
		for (var i = 0; i < quizNumber; i++) {
			accuracyArr.unshift(i + '');
		}
		
		$('#containerNormal').highcharts({
			chart: {
				type:'spline'
			},
			credits: {
		    	enabled: false
			},
		    title: {
		        text: 'Accuracy of the recently 10 quizs',
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
				// 'rgb(108,109,228)'
				'red'
			]
		});
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


			// 			{
			// 	"index": "3",
			// 	"question": "333使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?",
			// 	"answer": ["A、333蓝色", "B、333黄色", "C、333高感光度时偏蓝，低感光度时偏黄", "D、333阿达阿啊"],
			// 	"result": "B",
			// 	"reason": "333啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
			// },