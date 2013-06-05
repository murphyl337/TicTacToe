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

    it("is defined", function(){
        expect(gameBoard).toBeDefined();
    });

    it("has 9 spaces", function(){
        expect(gameBoard.spaces.length).toBe(9);
    });

    it("is blank when initialized", function(){
        for(var space=0; space<gameBoard.spaces.length; space++){
            expect(gameBoard.spaces[space].mark).toBe("-");
        }
    });

    it("changes the mark on a space when updated", function(){
        gameBoard.updateBoard("X", 0);
        expect(gameBoard.spaces[0].mark).toBe("X");
    });

    it("returns all spaces that haven't been taken", function(){
        var availableSpaces = gameBoard.getAvailableSpaces();
        expect(availableSpaces.length).toBe(9);
    });

    it("returns a board with identical properties when cloned", function(){
        var clone = gameBoard.clone();
        for(var space=0; space<9; space++){
            expect(clone.spaces[space].mark).toBe(gameBoard.spaces[space].mark);
            expect(clone.spaces[space].position).toBe(gameBoard.spaces[space].position);
        }
    });

    it("returns a new object when cloned", function(){
        var clone = gameBoard.clone();
        expect(clone).not.toBe(gameBoard);
    });

    it("returns all of a player's moves", function(){
        gameBoard.updateBoard("X", 0);
        gameBoard.updateBoard("O", 1);
        gameBoard.updateBoard("X", 5);

        var xMoves = gameBoard.getMoves("X");
        expect(xMoves.compare([0,5])).toBe(true);
    });

    describe("Space", function(){
        it("has a mark field", function(){
            expect(gameBoard.spaces[0].mark).toBeDefined();
        });

        it("has a position field", function(){
            expect(gameBoard.spaces[0].position).toBeDefined();
        });
    });
});

describe("Array", function(){
    it("compares two arrays appropriately", function(){
        var array1 = [0,1,2];
        var array2 = [0,1,2];
        var array3 = [1,2,3];

        expect(array1.compare(array2)).toBe(true);
        expect(array2.compare(array1)).toBe(true);
        expect(array3.compare(array1)).toBe(false);
    });
});