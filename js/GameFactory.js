app.factory('GameFactory', function() {	
	var initializeColorPattern = function() {
		var rndR = Math.floor(Math.random() * 200);
		var rndG = Math.floor(Math.random() * 200);
		var rndB = Math.floor(Math.random() * 200);
		
		return {					
			rgbParams: [rndR, rndG, rndB],
			rgbColorString: 'rgb(' + rndR + ', ' + rndG + ', ' + rndB + ')',
		};
	};

	var corruptBrick = function(colorPattern) {
		var rndCorruptSign = Math.random() < 0.5 ? -1 : 1;
		var rndCorruptOffset = Math.floor((Math.random() * 30) + 20) * rndCorruptSign;
		var rndCorruptRGB = Math.floor(Math.random() * 3);
		var corruptedRGBArray = colorPattern.rgbParams.slice();

		corruptedRGBArray[rndCorruptRGB] += rndCorruptOffset;

		return {					
			style: {
				'background-color': 'rgb(' + corruptedRGBArray[0] + ', ' + corruptedRGBArray[1] + ', ' + corruptedRGBArray[2] + ')'
			},
			color: corruptedRGBArray
		};
	};

	var initializeBricksArray = function(colorPattern) {
		var bricksArray = [];
		var sizeArray = 6;
		var iRnd = Math.floor(Math.random() * sizeArray);
		var jRnd = Math.floor(Math.random() * sizeArray);

		for (var i = 0; i < sizeArray; i++) {
			bricksArray[i] = [];
			for (var j = 0; j < sizeArray; j++) {
				bricksArray[i].push({
					style: {
						'background-color': colorPattern.rgbColorString
					},
					color: colorPattern.rgbParams
				});
			}
		}
		bricksArray[iRnd][jRnd] = corruptBrick(colorPattern);

		return bricksArray;
	};

	return {
		getColorPattern: function() {
			var colorPattern = initializeColorPattern();

			return colorPattern;
		},

		getBricksArray: function(colorPattern) {
			var getBricksArray = initializeBricksArray(colorPattern);

			return getBricksArray;
		},

		checkColor: function(colorSelect, colorPattern) {
			if (colorSelect.toString() !== colorPattern.toString()) {
				return true;
			}
		},

		setGameOver: function() {
			return true;
		}
	};
});