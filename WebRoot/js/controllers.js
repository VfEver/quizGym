angular.module('controllers', [])

.controller('PutController', ['$scope', '$location', function($scope, $location) {
	$scope.putItem = function() {
		$location.path('/putitem');
	};
}]);