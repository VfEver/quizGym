angular.module('lApp', ['ui.router', 'controllersModule', 'servicesModule'])
.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    
    $rootScope.sessionChecker = function() {
    	if (sessionStorage.getItem('user') == 'null' || sessionStorage.getItem('user') == null) {
    		window.open('/quizGym/#/userlogin', '_self');
    	}
    };

    $rootScope.getUserInSession = function() {
    	return JSON.parse(sessionStorage.getItem('user'));
    };
    $rootScope.showQuizFn = function(isRandom, scopeType, userObj, quizObj) {
    	
    	sessionStorage.setItem('disable', 'false');
		setTimeout(function() {
				//alert('asd');
				$('#selectedType').html(scopeType);
				var quizGeted = [];
				var index = 0;
				var indexMax = 0;
				var userAnswer;
				var userDidNumber = 0;
				var $arrRadios;
				var result = [];
				var isDisabled = false;
				(function() {
					//quizGeted = scope.quizData;		
					quizGeted = quizObj.quizData;
					console.log(quizGeted);
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
						sessionStorage.setItem('disable', 'true');
						isDisabled = true;
						$('input[type="radio"]').prop('disabled', true);
						$(this).prop('disabled', true);

						var checkBtn = $('<button class="btn btn-info" id="checkAnswerBtn">Check errors</button>').on('click', function() {
							
							$('#myModal1').modal();
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

					var questionResultCheck = quizGeted.slice(0);
					userAnswer.forEach(function(item, index) {
						questionResultCheck[index].userResult = item;
					});

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
								"user_id": JSON.parse(sessionStorage.getItem('user')).userid,
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
								"quiz_id": quizObj.quizId,
								"user_id": userObj.userid,
								"worng_num": quizNumber - number,
								"correct_num": number
							}
						});
					}
					console.log(wrongAnswer);
					if(wrongAnswer.length === 0) {
						var allCorrectModal = '<h1 style="color: green">All correct！GoodJob!</h1>';
						$('.modal-body').html('').html(allCorrectModal);
						console.log('all correct');
					} else {
						var oModalResult = $('.modal-body .modal-result-info');
//						var oModalFooterPre = $('.modal-footer .btn-toolbar');
//						oModalFooterPre.html('');
//						console.log(number);
						$('#myModal1 .modal-body p').eq(0).html('You got <strong style="color:green">' + number + '</strong> correct answers, failed ' + '<strong style="color:red">' + (quizNumber - number) + '</strong> questions');
						$('#myModal1 .modal-body p').eq(1).find('span').html((number * 100/ quizNumber).toFixed(2) + '%');
					}
					$('#myModal1').modal();

					$('.check-detail-btn').on('click', function() {
						$('#myModal').modal('hide');
//						$rootScope.checkDetailData = questionResultCheck;
						console.log(questionResultCheck);
						sessionStorage.setItem('checkDetailData', JSON.stringify(questionResultCheck));
						setTimeout(function() {
							$('body').removeClass('modal-open');
							window.open('/quizGym/#/quizdetail', '_self');
						}, 400);
					});
				}

			}, 100);
	};
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
				},
				'footer': {
					templateUrl: 'tpls/footer-welcome-tpl.html'
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
		})
		.state('quizdetail', {
			url: '/quizdetail',
			views: {
				'main': {
					templateUrl: 'tpls/quiz-detail-main-tpl.html'
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
