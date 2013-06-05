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

    for(var space=0; space<boardSize; space++)
        this.spaces[space] = "";
}