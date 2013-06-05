/**
 * Created with JetBrains WebStorm.
 * User: tmurphy
 * Date: 6/5/13
 * Time: 12:53 PM
 * To change this template use File | Settings | File Templates.
 */
describe("Game board", function(){
    var gameBoard;
    beforeEach(function(){
        gameBoard = new GameBoard();
    });

    it("should have 9 spaces", function(){
        expect(gameBoard.spaces.length).toEqual(9);
    });
});