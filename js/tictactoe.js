/**
 * Created with JetBrains WebStorm.
 * User: tmurphy
 * Date: 6/5/13
 * Time: 12:44 PM
 * To change this template use File | Settings | File Templates.
 */
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
}

function Space(mark){
    this.mark = mark;
    this.position;
}