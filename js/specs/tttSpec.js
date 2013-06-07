/**
 * Created with JetBrains WebStorm.
 * User: tmurphy
 * Date: 6/5/13
 * Time: 12:53 PM
 * To change this template use File | Settings | File Templates.
 */

describe("Game", function(){
    var game, gameBoard, player1, player2;

    beforeEach(function(){
        gameBoard = new GameBoard();
        player1 = new Player("X", "human", "green");
        player2 = new Player("O", "computer", "pink");
        game = new Game(gameBoard, player1, player2);
    });

    it("is defined", function(){
        expect(game).toBeDefined();
    });

    it("has a board", function(){
        expect(game.board).toBe(gameBoard);
    });

    it("has 2 players", function(){
        expect(game.player1).toBe(player1);
        expect(game.player2).toBe(player2);
    });

    it("sets the first player as the current player on start", function(){
        expect(game.currentPlayer).toBe(player1);
    });

    it("changeCurrentPlayer switches currentPlayer", function(){
        expect(game.currentPlayer).toBe(player1);
        game.changeCurrentPlayer();
        expect(game.currentPlayer).toBe(player2);
    });

    it("initializes the board when new game created", function(){
        var board = new GameBoard();
        spyOn(board, "initialize");
        game = new Game(board, player1, player2);
        expect(board.initialize).toHaveBeenCalled();
    });

    it("nextTurn checks for a winner or draw", function(){
        spyOn(game.board, "isWinner");
        spyOn(game.board, "isDraw");
        game.nextTurn();
        expect(game.board.isWinner).toHaveBeenCalled();
        expect(game.board.isDraw).toHaveBeenCalled();
    });

    it("nextTurn changes currentPlayer", function(){
        game.nextTurn();
        expect(game.currentPlayer).toBe(player2);
    });
});

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

    it("validMove returns true for available space, false if taken", function(){
        var valid = gameBoard.isValidMove(0);
        expect(valid).toBe(true);
        gameBoard.updateBoard("X", 5);
        valid = gameBoard.isValidMove(5);
        expect(valid).toBe(false);
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

    it("determines winner when moves aren't in win order", function(){
        gameBoard = generateXDiagonalWinState();
        expect(gameBoard.isWinner("X")).toBe(true);
    });

    it("game has no open spaces when all moves taken", function(){
        gameBoard = generateXDiagonalWinState();
        expect(gameBoard.hasOpenSpaces()).toBe(false);
    });

    it("determines draw when all moves taken and no one is winner", function(){
        gameBoard = generateDrawState();
        expect(gameBoard.isDraw()).toBe(true);
    });

    it("game is over when there is a winner or draw", function(){
        gameBoard = generateDrawState();
        expect(gameBoard.isGameOver()).toBe(true);
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

describe("Player", function(){
    var game, gameBoard;
    var player1, player2;

    beforeEach(function(){
        gameBoard = new GameBoard();
        player1 = new Player("X", "human", "green");
        player2 = new Player("O", "computer", "pink");
        game = new Game(gameBoard, player1, player2);
    });

    it("is defined", function(){
        expect(player1).toBeDefined();
    });

    it("has a marker", function(){
        expect(player1.marker).toBe("X");
    });

    it("has a type", function(){
        expect(player1.type).toBe("human");
    });

    it("has a color", function(){
        expect(player1.color).toBe("green");
    });

    it("makeMove updates board", function(){
        spyOn(game.board, "updateBoard");
        player1.makeMove(game, 0);
        expect(game.board.updateBoard).toHaveBeenCalledWith(player1.marker, 0);
    });

    it("makeMove calls game.nextTurn when complete", function(){
        spyOn(game, "nextTurn");
        player1.makeMove(game, 0);
        expect(game.nextTurn).toHaveBeenCalled();
    });

    it("makeMove will not updateBoard for invalid move", function(){
        game.board.updateBoard("X", 0);
        spyOn(game.board, "updateBoard");
        player1.makeMove(game, 0);
        expect(game.board.updateBoard).not.toHaveBeenCalled();
    });
});

describe("Array", function(){
    it("compares two arrays for matching contents", function(){
        var array1 = [0,1,2];
        var array2 = [0,1,2];
        var array3 = [1,2,3];

        expect(array1.compare(array2)).toBe(true);
        expect(array2.compare(array1)).toBe(true);
        expect(array3.compare(array1)).toBe(false);
    });

    it("determines if contents of smaller array are inside larger array", function(){
        var bigArray = [0,2,6,4,7];
        var smallArray = [2,4,6];

        expect(bigArray.containsContentsOf(smallArray)).toBe(true);
    });
});

//describe("Game View", function(){
//    var view, player1, player2, game, gameBoard;
//
//    beforeEach(function(){
//        gameBoard = new GameBoard();
//        player1 = new Player("X", "human", "green");
//        player2 = new Player("O", "human", "pink");
//        game = new Game(gameBoard, player1, player2);
//        view = new GameView(game);
//        $box = affix(".box#0");
//    });
//
//    it("is defined", function(){
//        expect(view).toBeDefined();
//    });
//
//    it("has a game", function(){
//        expect(view.game).toBeDefined();
//    });
//
//    it("delegates clicks to game", function(){
//        spyOn(player1, "makeMove");
//        $("#0.box").trigger("click");
//        expect(player1.makeMove).toHaveBeenCalledWith(game, 0);
//    });
//
//});

function generateXDiagonalWinState(){
    var board = new GameBoard();
    board.initialize();

    board.updateBoard("X", 0);
    board.updateBoard("X", 1);
    board.updateBoard("X", 4);
    board.updateBoard("X", 6);
    board.updateBoard("X", 8);
    board.updateBoard("O", 2);
    board.updateBoard("O", 3);
    board.updateBoard("O", 5);
    board.updateBoard("O", 7);
    //  X X O
    //  O X O
    //  X O X
    return board;
}

function generateDrawState(){
    var board = new GameBoard();
    board.initialize();

    board.updateBoard("X", 0);
    board.updateBoard("X", 1);
    board.updateBoard("X", 5);
    board.updateBoard("X", 6);
    board.updateBoard("X", 8);
    board.updateBoard("O", 2);
    board.updateBoard("O", 3);
    board.updateBoard("O", 4);
    board.updateBoard("O", 7);
    //  X X O
    //  O O X
    //  X O X
    return board;
}