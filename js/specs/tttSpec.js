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

    it("should change the mark on a space when updated", function(){
        gameBoard.updateBoard("X", 0);
        expect(gameBoard.spaces[0].mark).toBe("X");
    });

    it("should return all spaces that haven't been taken", function(){
        var availableSpaces = gameBoard.getAvailableSpaces();
        expect(availableSpaces.length).toBe(9);
    });

    it("should return a board with identical properties when cloned", function(){
        var clone = gameBoard.clone();
        for(var space=0; space<9; space++){
            expect(clone.spaces[space].mark).toBe(gameBoard.spaces[space].mark);
            expect(clone.spaces[space].position).toBe(gameBoard.spaces[space].position);
        }
    });

    it("should return a new object when cloned", function(){
        var clone = gameBoard.clone();
        expect(clone).not.toBe(gameBoard);
    });

    describe("Space", function(){
        it("should have a mark field", function(){
            expect(gameBoard.spaces[0].mark).toBeDefined();
        });

        it("should have a position field", function(){
            expect(gameBoard.spaces[0].position).toBeDefined();
        });
    });
});