/**
 * Created with JetBrains WebStorm.
 * User: tmurphy
 * Date: 6/5/13
 * Time: 12:44 PM
 * To change this template use File | Settings | File Templates.
 */
function GameBoard(){
    this.spaces = [];
    var wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    var boardSize = 9;
    var winSize = 8;

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
        var counter = 0;
        var moves = this.getMoves(marker);
        var winner = false;
        for(var win=0; win<wins.length; win++){
            for(var move=0; move < 3; move++){
                if(moves.indexOf(wins[win][move]) >= 0)
                    counter++;
            }
            if(counter === 3)
                winner = true;
            counter = 0;
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