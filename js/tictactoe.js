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

    this.getMoves = function(marker){
        var moves = [];
        for(var space=0; space<boardSize; space++){
            if(this.spaces[space].mark === marker)
                moves.push(space);
        }

        return moves;
    };

    this.isGameOver = function(){
        var over = false;
        if(this.getAvailableSpaces().length === 0) over = true;
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
        if(this.isGameOver() &&
            (!this.isWinner("X") && !this.isWinner("O")))
                draw = true;
        return draw;
    };

    GameBoard.prototype.clone = function(){
        var clone = new GameBoard();
        clone.initialize();
        for(var space=0; space<boardSize; space++)
            clone.spaces[space] = this.spaces[space];
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

    this.makeMove = function(board, position){
        board.updateBoard(this.marker, position);
    };
}

function Game(board, player1, player2){
    this.board   = board;
    this.player1 = player1;
    this.player2 = player2;
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