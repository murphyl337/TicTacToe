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
        gameBoard.initialize();
    });

    it("should be defined", function(){
        expect(gameBoard).toBeDefined();
    });

    it("should have 9 spaces", function(){
        expect(gameBoard.spaces.length).toBe(9);
    });

    it("should be blank when initialized", function(){
        for(var space=0; space<gameBoard.spaces.length; space++){
            expect(gameBoard.spaces[space].mark).toBe("-");
        }
    });

    describe("Space", function(){
        it("should have a mark field", function(){
            expect(gameBoard.spaces[0].mark).toBeDefined();
        });
    });
});