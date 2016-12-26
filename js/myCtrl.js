var app = angular.module('myApp', ['ngRoute', 'ngAnimate']);

app.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'view/game.html',
		controller: 'gameController'
	})
	.when('/gameOver', {
		templateUrl: 'view/gameOver.html',
		controller: 'gameController'
	});
});

app.controller('gameController', function($scope, $interval, GameFactory) {
	$scope.gameIsStarted = false;
	$scope.gameIsFinished = false;

	$scope.gameStart = function() {
		if (!$scope.gameIsStarted) {
			$scope.resetScore();
			$scope.startTime();
			$scope.nextRound();

			$scope.gameIsStarted = true;		
		}		
	};

	$scope.gameRestart = function() {		
		$scope.resetGameConditions();
		$scope.resetTime();
		$scope.gameStart();
	}

	$scope.nextRound = function() {
		$scope.colorPattern = GameFactory.getColorPattern();
		$scope.bricksMultiArray = GameFactory.getBricksArray($scope.colorPattern);	
	};

	$scope.checkColor = function(colorSelect) {
		if (!$scope.gameIsFinished && GameFactory.checkColor(colorSelect, $scope.colorPattern.rgbParams)) {
			$scope.addPoints();
			$scope.addTime();
			$scope.nextRound();
		} else {
			$scope.wrongBrick();
			console.log($scope.countDown);
		}
	};
});

app.directive('game', function() {
	return {		
		link: function(scope, elem, attrs) {
			scope.resetTime();
			scope.resetScore();
			scope.nextRound();
			elem.bind('mousedown', function() {			
				scope.$apply(attrs.game);
			})
		},
		controller: function($scope, $interval, GameFactory, ValuesFactory) {
			$scope.resetTime = function() {
				$scope.countDown = ValuesFactory.fullTime; 				
			};

			$scope.resetScore = function() {				
				$scope.points = { 
					score: 0, 
					progress: { 'height': 0 }
				}
			};

			$scope.resetGameConditions = function() {				
				$scope.gameIsStarted = false;
				$scope.gameIsFinished = false;
			};

			$scope.wrongBrick = function() {
				$scope.countDown -= ValuesFactory.penaltyTime; 
			};			

			$scope.addTime = function() {
				$scope.countDown += ValuesFactory.bonusTime;
				$scope.countDown = ($scope.countDown >= ValuesFactory.fullTime) ? ValuesFactory.fullTime : $scope.countDown;
			};

			$scope.addPoints = function() {
				$scope.points.score++;
				$scope.points.progress = { 'height': $scope.points.score + '%' };
				console.log($scope.points);
			}
		},
	}
})

app.directive('timeBar', function($interval, GameFactory, ValuesFactory) {
	return {
		link: function(scope, elem, attrs) {
			$interval(function() {
				elem.css({'width': (scope.countDown / ValuesFactory.fullTime) * 100 + '%'});
			}, 100)
		},
		controller: function($scope, $interval) {
			$scope.startTime = function() {
				var updateTime = $interval(function() {
					$scope.countDown = (($scope.countDown - 0.1).toFixed(1)) / 1;
					if ($scope.countDown <= 0) {
						$scope.countDown = 0;
						$scope.gameIsFinished = true;
						$interval.cancel(updateTime);
					}
				}, 100);
			};
		}
	}
})

app.directive('gameOver', function(GameFactory) {
	return {
		templateUrl: 'view/gameOver.html'
	}
})