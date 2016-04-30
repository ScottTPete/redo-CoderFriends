angular.module('coderFriends')
	.controller("friendCtrl", function($scope, githubSvc, $stateParams) {

	/*$scope.getFriendActivity = function() {
		var username = $stateParams.github_username;
		
		githubSvc.getFriendActivity(username).then(function(response) {
			$scope.activities = response.body;
			console.log($scope.activities)
		})
	}*/
	
	/*var username = $stateParams.github_username;
	
//	$scope.getFriendActivity();
	
	githubSvc.getFriendActivity(username).then(function(response) {
		$scope.activities = response.body;
		console.log($scope.activities)
	})*/
	
	
	
	$scope.activity = function () {
		var username = $stateParams.github_username;
		githubSvc.getEvents(username).then(function (response) {
			 console.log(response);
			$scope.activities = response;
		})
	}
	$scope.activity();


})