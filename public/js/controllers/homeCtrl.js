angular.module('coderFriends')
	.controller("homeCtrl", function($scope, githubSvc) {
	
	githubSvc.getFollowing().then(function(response) {
		console.log(response)
		$scope.friends = response;
	})
	
	
	
})