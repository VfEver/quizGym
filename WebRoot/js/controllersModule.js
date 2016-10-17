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
.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location) {

	$scope.loginCheck = function() {
//		$http({
//			method: 'GET',
//			//地址
//			url: '/quizGym/rest/userrest/loginSuccess',
//			data: {
//				username: $scope.loginUserName,
//				password: $scope.loginUserPassword
//			}
//		}).then(function(res) {
//			//res 是 200 则 登录，不然错误 
//			//之后加上 返回 个人信息
//			if (res.data === 200) {
//				$scope.loginSuccess();
//			} else {
//				alert('Your password or username made some misstakes, please re-login after check it');
//			}
//		});
		//$http.post('/quizGym/LoginServlet', {username: $scope.loginUserName, password: $scope.loginUserPassword})
		//	.then()
		$.ajax({
			url: '/quizGym/rest/userrest/loginSuccess',
			data: {
				username: $scope.loginUserName,
				password: $scope.loginUserPassword
			},
			type: 'GET'
		})
		.then(function(data) {
			if (data === '200') {
				//console.log(data);
				//alert('success');
				//$location.path('/quizmain');
				window.open('/quizGym/#/quizmain', '_self');
			} else {
				alert('Your password or username made some mistakes, please re-login after check it');
			}
		});
	};
}])
.controller('SignupController', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.signupSuccess = function() {
//		$location.path('/quizmain');
		window.open('/quizGym/#/quizmain', '_self');
	};
	$scope.signupCheck = function() {
		console.log('clicked');
		if ($scope.signupUserPassword === $scope.signupUserConfirm) {
//			$http({
//				method: 'GET',
//				//地址
//				url: '/signup',
//				data: {
//					username: $scope.signupUserName,
//					password: $scope.signupUserPassworld,
//					email: $scope.signupUserEmail
//				}
			console.log('registed')
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
				//res 是 200 则 登录，不然错误 
				//之后加上 返回 个人信息
				console.log('resived');
				if (res === '200') {
					console.log('signup success');
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
.controller('QuizController', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.getRandom = function() {
		var number = Math.floor(Math.random() * 5 + 1);
		var quizScopes = ['photography', 'music', 'film', 'science', 'sports'];
		$scope.getQuiz(quizScopes[number]);
	};

	$scope.getQuiz = function(quizname) {
		$scope.quizName = quizname;
//		$http({
//			method: 'GET',
//			//之后改成对应的
//			//url: 'test/quizTest1.json',
//			url: '/quizGym/rest/questionrest/randFindQuestion',
//			data: {
//				scopeType: $scope.quizName
//			}
		$.ajax({
			url: '/quizGym/rest/questionrest/randFindQuestion',
			data: {
				scopeType: $scope.quizName
			},
			type: 'GET'
		}).then(function(data) {
			$scope.quizData = data;
			console.log($scope.quizData);
			//`$location.path('/doquiz');
			window.open('/quizGym/#/doquiz', '_self');
			//先写不规范的给老师看看 之后改成正规Angular, 之后用PROMISE $Q 完成
			setTimeout(function() {
				//alert('asd');
				$('#selectedType').html($scope.quizName);
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
					console.log(questionNumber)
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
						console.log("submit");
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
								index: i,
								content: quizGeted[i].question,
								quizAnswers: quizGeted[i].answer,
								userGived: userAnswer[i],
								correctAnswer: result[i]
							});
						}
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
		});
	};
}]);

			// 			{
			// 	"index": "3",
			// 	"question": "333使用数码相机日光白平衡拍摄时，雪地中的阴影在照片上呈现出微微的?",
			// 	"answer": ["A、333蓝色", "B、333黄色", "C、333高感光度时偏蓝，低感光度时偏黄", "D、333阿达阿啊"],
			// 	"result": "B",
			// 	"reason": "333啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
			// },