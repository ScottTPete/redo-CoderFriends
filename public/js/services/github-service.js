angular.module('coderFriends')
	.service('githubSvc', function($http, $q) {
	
	
		this.getFollowing = function() {
			return $http.get('/api/github/following').then(function(response) {
				return response.data;
			})
		}
		
		this.getEvents = function (username) {
			var deferred = $q.defer();
			$http({
				method: 'GET',
				url: '/api/github/' + username + '/activity'
			}).then(function (response) {
				// console.log(response);
				deferred.resolve(response.data.body)
			})
			return deferred.promise
		}
	
})