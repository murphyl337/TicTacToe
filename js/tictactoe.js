$(document).ready(function(){
    var game = startGame();
    if(game.currentPlayer.type === 'computer'){
        var move = game.getBestMove(game.board, game.currentPlayer);
        game.currentPlayer.makeMove(game, move);
    }

    game.listen();
});

function startGame(){
    var board = new GameBoard();
    var player1 = new Player("X", "computer", "green");
    var player2 = new Player("O", "computer", "pink");
    board.initialize();
    var view = new GameView();
    return new Game(view, board, player1, player2);
}

function GameBoard(){
    this.spaces = [];
    var boardSize = 9;

    this.initialize = function(){
        for(var space=0; space<boardSize; space++){
            this.spaces[space] = new Space("-");
            this.spaces[space].position = space;
        }
    };

    this.updateBoard = function(marker, position){
        this.spaces[position].mark = marker;
    };

    this.getAvailableSpaces = function(){
        var spaces = [];
        for(var space=0; space<boardSize; space++){
            if(this.spaces[space].mark === "-")
                spaces.push(this.spaces[space]);
        }
        return spaces;
    };

    this.isValidMove = function(position){
        var valid = true;
        if(this.spaces[position].mark !== "-") valid = false;
        return valid;
    };

    this.getMoves = function(marker){
        var moves = [];
        for(var space=0; space<boardSize; space++){
            if(this.spaces[space].mark === marker)
                moves.push(space);
        }

        return moves;
    };

    this.hasOpenSpaces = function(){
        var over = true;
        if(this.getAvailableSpaces().length === 0) over = false;
        return over;
    };

    this.isWinner = function(marker){
        var wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        var moves = this.getMoves(marker);
        var winner = false;
        for(var win=0; win<wins.length; win++){
            if(moves.containsContentsOf(wins[win]))
                winner = true
        }
        return winner;
    };

    this.isDraw = function(){
        var draw = false;
        if(!this.hasOpenSpaces() &&
            (!this.isWinner("X") && !this.isWinner("O")))
                draw = true;
        return draw;
    };

    this.isGameOver = function(){
        var over = false;
        if(this.isWinner("X") || this.isWinner("O") || this.isDraw()) over = true;
        return over;
    };

    this.getState = function(){
        var state = "";
        if(this.isGameOver()){
            if(this.isWinner("X")) state = "X is winner";
            if(this.isWinner("O")) state = "O is winner";
            if(this.isDraw()) state = "It's a draw";
        }
        return state;
    };

    GameBoard.prototype.clone = function(){
        var clone = new GameBoard();
        clone.initialize();
        for(var space=0; space<boardSize; space++){
            clone.spaces[space].mark = this.spaces[space].mark;
            clone.spaces[space].position = this.spaces[space].position;
        }
        return clone;
    };
}

function Space(mark){
    this.mark = mark;
    this.position;
}

function Player(marker, type, color){
    this.marker = marker;
    this.type   = type;
    this.color  = color;

    this.makeMove = function(game, position){
        var box = document.getElementById(position);
        if(game.board.isValidMove(position)){
            game.board.updateBoard(this.marker, position);
            game.view.update(box, this);
            game.nextTurn();
        }
    };
}

function Game(view, board, player1, player2){
    this.view = view;
    this.board   = board;
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = player1;
    var game = this;

    this.listen = function(){
        var $box = $(".box");
        var $reset = $(".reset");
        $box.on('click', game.handleClick);
        $reset.on('click', game.reset);
    };

    this.handleClick = function(event){
        if(!game.board.isGameOver()){
            if(game.board.isValidMove(event.target.id))
                game.currentPlayer.makeMove(game, event.target.id);
        }
    };

    this.reset = function(){
        game.board.initialize();
        game.currentPlayer = game.player1;
        game.view.clearView();
        if(game.currentPlayer.type === 'computer')
            game.currentPlayer.makeMove(game, 0);
    };

    this.isFirstMove = function(){
        return (game.board.getAvailableSpaces().length == 9);
    };

    this.nextTurn = function(){
        var otherPlayer = this.getOtherPlayer(this.currentPlayer);
        this.currentPlayer = otherPlayer;

        if(this.board.isGameOver() == false){
            if(this.currentPlayer.type === "computer"){
                var move = game.getBestMove(game.board, game.currentPlayer);
                var box = document.getElementById(move);
                game.view.update(box, game.currentPlayer);
                this.currentPlayer.makeMove(game, move);
            }
        }

        game.view.overlay(game.board.getState());
    };

    this.getOtherPlayer = function(player){
        var otherPlayer = (player === this.player1) ? this.player2 : this.player1;
        return otherPlayer;
    };


    this.getDefaultBestScore = function(player){
        return (player === this.player1) ? -10000 : 10000;
    };

    this.isBestScore = function(score, bestScore, player){
        var isBestScore = false;
        if(player === this.player1){
            if(score > bestScore) isBestScore = true;
        }
        else if(player === this.player2){
            if(score < bestScore) isBestScore = true;
        }
        return isBestScore;
    };

    this.getBestMove = function(board, player){
        var otherPlayer = this.getOtherPlayer(player);
        var availableSpaces = board.getAvailableSpaces();
        var bestMove;
        var bestScore = this.getDefaultBestScore(player);

        for(var space = 0; space < availableSpaces.length; space++){
            var gameBoardChild = board.clone();
            gameBoardChild.updateBoard(player.marker, availableSpaces[space].position);
            var currentScore = this.minimax(gameBoardChild, otherPlayer);
            var isBestScore = this.isBestScore(currentScore, bestScore, player);
            if(isBestScore){
                bestScore = currentScore;
                bestMove = availableSpaces[space].position;
            }
        }
        return bestMove;
    };

    this.minimax = function(board, player){
        if(board.isWinner(this.player1.marker)) return 1;
        else if(board.isWinner(this.player2.marker)) return -1;
        else if(board.isDraw()) return 0;

        var otherPlayer = this.getOtherPlayer(player);
        var availableSpaces = board.getAvailableSpaces();
        var bestScore = this.getDefaultBestScore(player);

        for(var space = 0; space < availableSpaces.length; space++){
            var gameBoardChild = board.clone();
            gameBoardChild.updateBoard(player.marker, availableSpaces[space].position);
            var score = this.minimax(gameBoardChild, otherPlayer);
            var isBestScore = this.isBestScore(score, bestScore, player);
            if(isBestScore)
                bestScore = score;
        }
        return bestScore;
    };
}

function GameView(){
    this.update = function(box, player){
        markBox(box, player);
    };

    this.overlay = function(message){
        $("#info").text(message);
    };

    this.clearView = function(){
        for(var space=0; space<9; space++){
            var $space = $("#" + space);
            $space.removeClass().addClass("box");
            $space.html("");
        }

        $("#info").html("");
    };

    var markBox = function(box, player){
        box.innerHTML = player.marker;
        box.className += " " + player.color;
    };
}

Array.prototype.compare = function (array) {
    if (!array)
        return false;

    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
};

Array.prototype.containsContentsOf = function(array) {
    var contains = true;
    if(!array)
        contains = false;

    for(var item=0; item<array.length; item++){
        if(this.indexOf(array[item]) < 0)
            contains = false;
    }

    return contains;
};