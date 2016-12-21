var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'view/game.html',
		controller: 'gameController'
	});
});

app.controller('gameController', function($scope, $interval, GameFactory) {
	$scope.gameStart = function() {
		$scope.resetValues();
		$scope.nextRound();
		$scope.gameTime();	
	};

	$scope.nextRound = function() {
		$scope.colorPattern = GameFactory.getColorPattern();
		$scope.bricksMultiArray = GameFactory.getBricksArray($scope.colorPattern);	
	};

	$scope.checkColor = function(colorSelect) {
		if (GameFactory.checkColor(colorSelect, $scope.colorPattern.rgbParams)) {
			$scope.points++;
			$scope.nextRound();
		}
	};

	$scope.sayHi = function() {
		console.log('Hi');
	}
});

app.directive('game', function() {
	return {		
		link: function(scope, elem, attrs) {	
			elem.bind('mousedown', function() {			
				scope.$apply(attrs.game);
				elem.css({'visibility': 'hidden'});
			})
		},
		controller: function($scope, $interval, GameFactory) {
			$scope.resetValues = function() {
				$scope.points = 0;
				$scope.countDown = 30.0; 				
			}
		},
	}
})

app.directive('timeBar', function($interval, GameFactory) {
	return {
		link: function(scope, elem, attrs) {
			$interval(function() {
				elem.css({'width': (scope.countDown / 30) * 100 + '%'});
			}, 100)
		},
		controller: function($scope, $interval, GameFactory) {
			$scope.gameTime = function() {  
				var updateTime = $interval(function() {
					$scope.countDown = ($scope.countDown - 0.1).toFixed(1);
					if ($scope.countDown <= 0) {
						GameFactory.setGameOver();
						$interval.cancel(updateTime);
					}
				}, 100);
			};
		}
	}
})