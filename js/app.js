"use strict";

var lastGuess;
var misses;
var matches;
var remaining;
var flipping = false;
var fadeTime = 100;
var tiles = [];
var idx;
var timerID;

for (idx = 1; idx <= 32; idx++) {
	tiles.push({
		tileNum: idx,
		src: 'img/tile' + idx +'.jpg',
		flipped: false,
		matched: false
	});
}

$(document).ready(function() {
	$('#start-game').click(function() {

		if(flipping) {
			return;
		}

		document.getElementById('start-game').innerHTML = 'Reset';

		resetBoard()
		
		tiles = _.shuffle(tiles);
		var selectedTiles = tiles.slice(0, remaining);
		var tilePairs = [];
		_.forEach(selectedTiles, function(tile) {
			tilePairs.push(tile);
			tilePairs.push(_.clone(tile));
		});
		tilePairs = _.shuffle(tilePairs);

		var gameBoard = $('#game-board');
		var headingH = $('header').height();
		var h = $(window).height() - headingH;
		var w = $(window).width();
		gameBoard.css('height', h + 10);
		gameBoard.css('width', h);
		gameBoard.css('margin-left', (w - h)/2)
		gameBoard.css('margin-right', (w - h)/2)

		var row = $(document.createElement('div'));
		var img;

		_.forEach(tilePairs, function(tile, elemIndex) {
			if (elemIndex > 0 && 0 === (elemIndex % 4)) {
				gameBoard.append(row);
				row = $(document.createElement('div'))
			}

			img = $(document.createElement('img'));

			img.attr({
				src: 'img/tile-back.png',
				alt: 'tile ' + tile.tileNum
			});

			img.data('tile', tile);
			row.append(img);
			gameBoard.append(img);
		});

		var startTime = Date.now();
		timerID = window.setInterval(function() {
			var elapsedSeconds = (Date.now() - startTime) / 1000;
			elapsedSeconds = Math.floor(elapsedSeconds);
			if (elapsedSeconds == 1) {
				$('#elapsed-seconds').text('Time: ' + elapsedSeconds + ' second');

			} else {
				$('#elapsed-seconds').text('Time: ' + elapsedSeconds + ' seconds');
			}
		}, 1000);


		//code doesn't keep track of actual turns, but accomplishes the same thing
		$('#game-board img').click(function() {

			var clickedImg = $(this);
			var tile = clickedImg.data('tile');

			if (flipping || tile.flipped) {
				return;
			}
			flipping = true;

			flipTile(tile, clickedImg)
				
			setTimeout(function() {
				if (lastGuess != null) {
					if (tile.tileNum == lastGuess.data('tile').tileNum) {
						matches++;
						$('#matches').text('Matches: ' + matches);
						remaining--
						$('#remaining').text('Remaining: ' + remaining);
						lastGuess = null;
						flipping = false;
					} else {
 						misses++;
						$('#missed').text('Misses: ' + misses);
						setTimeout(function() {
							flipTile(tile, clickedImg);
							flipTile(lastGuess.data('tile'), lastGuess);
							lastGuess = null;
							flipping = false;
						}, 1000);
					}
				} else {
					lastGuess = clickedImg;
					flipping = false;
				}

				if (remaining == 0) {
					endGame();
				}
			}, 2 * fadeTime)	


			//if guesse = 0, end game/reset
		});

	});

});

function resetBoard() {
	$('#game-board').empty();
	document.getElementById('winner').style.display = 'none';
	document.getElementById('game-board').style.display = 'block';
	document.getElementById('stats').style.display = 'block';
	window.clearInterval(timerID);
	lastGuess = null;
	misses = 0;
	matches = 0;
	remaining = 8;
	$('#elapsed-seconds').text('Time: 0 seconds');
	$('#matches').text('Matches: 0');
	$('#remaining').text('Remaining: 8');
	$('#missed').text('Missed: 0');
}

function flipTile(tile, img) {
	img.fadeOut(fadeTime, function() {
		if (tile.flipped) {
			img.attr('src', 'img/tile-back.png')
		} else {
			img.attr('src', tile.src);
		}
		img.fadeIn(fadeTime, function() {
			tile.flipped = !tile.flipped;
		});
	});
}

function endGame() {

	window.clearInterval(timerID);

	document.getElementById('winner').style.display = 'block';
	document.getElementById('game-board').style.display = 'none';
	document.getElementById('stats').style.display = 'none';


	var winnerDiv = $('#winner');

	var w = $(window).width();
	var gifW = $('#winnerGif').width()

	winnerDiv.css('margin-left', (w - gifW)/2)
	winnerDiv.css('margin-right', (w - gifW)/2);

	document.getElementById('start-game').innerHTML = 'Start New Game';
}