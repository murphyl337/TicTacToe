/**
 * Created with JetBrains WebStorm.
 * User: tmurphy
 * Date: 6/5/13
 * Time: 12:53 PM
 * To change this template use File | Settings | File Templates.
 */

describe("Game", function(){
    var game, gameBoard, rules, player1, player2, $box, $reset;

    beforeEach(function(){
        $box = affix(".box#0");
        $reset = affix(".reset");
        gameBoard = new GameBoard();
        gameBoard.initialize();
        rules = new GameRules();
        player1 = new Player("X", "human", "green");
        player2 = new Player("O", "computer", "pink");
        game = new Game(gameBoard, player1, player2);
        game.listen();
        spyOn(gameBoard, "notifyObservers");
        spyOn(gameBoard, "resetObservers");
    });

    it("should be defined", function(){
        expect(game).toBeDefined();
    });

    it("should have a board", function(){
        expect(game.board).toBe(gameBoard);
    });

    it("should have 2 players", function(){
        expect(game.player1).toBe(player1);
        expect(game.player2).toBe(player2);
    });

    it("should set the first player as the current player on start", function(){
        expect(game.currentPlayer).toBe(player1);
    });

    it("should return other player (not passed) when getOtherPlayer called", function(){
        expect(game.getOtherPlayer(player1)).toBe(player2);
    });

    it("should handle click when box is clicked", function(){
        spyOn(player1, "makeMove");
        spyOn(game, "nextTurn");
        spyOn(rules, "isGameOver");

        $box.click();

        expect($box).toHandleWith('click', game.handleClick);
    });

    it("should reset game when reset button is clicked", function(){
        spyOn(gameBoard, "initialize");

        $reset.click();

        expect($reset).toHandleWith('click', game.reset);
    });

    it("should end in draw for computer vs. computer", function(){
        player1 = new Player("X", "computer", "green");
        player2 = new Player("O", "computer", "pink");
        game = new Game(gameBoard, player1, player2);

        player1.makeMove(game, 0);

        expect(rules.isDraw(gameBoard)).toBe(true);
    });
});

describe("Game board", function(){
    var gameBoard, player1, player2;

    beforeEach(function(){
        gameBoard = new GameBoard();
        gameBoard.initialize();
        player1 = new Player("X", "human", "green");
        player2 = new Player("O", "human", "pink");
    });

    it("should be defined", function(){
        expect(gameBoard).toBeDefined();
    });

    it("should have 9 spaces", function(){
        expect(gameBoard.spaces.length).toBe(9);
    });

    it("should be blank when initialized", function(){
        for(var space=0; space<gameBoard.spaces.length; space++){
            expect(gameBoard.spaces[space].mark).toBe("");
        }
    });

    it("should change the mark on a space when updated", function(){
        gameBoard.updateBoard(player1, 0);

        expect(gameBoard.spaces[0].mark).toBe("X");
    });

    it("should return all spaces that haven't been taken when getAvailableSpaces is called", function(){
        var availableSpaces = gameBoard.getAvailableSpaces();

        expect(availableSpaces.length).toBe(9);
    });

    it("should notify observers when updating spaces", function(){
        spyOn(gameBoard, "notifyObservers");

        gameBoard.updateBoard(player1, 0, true);

        expect(gameBoard.notifyObservers).toHaveBeenCalled();
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

    it("should have no open spaces when all moves taken", function(){
        gameBoard = generateXDiagonalWinState();

        expect(gameBoard.hasOpenSpaces()).toBe(false);

        gameBoard.initialize();

        expect(gameBoard.hasOpenSpaces()).toBe(true);
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

describe("Game Rules", function(){
    var board, rules, player1, player2;
    beforeEach(function(){
        board = new GameBoard();
        board.initialize();
        rules = new GameRules();
        player1 = new Player("X", "human", "green");
        player2 = new Player("O", "human", "pink");
    });

    it("should determine winner when moves aren't in win order", function(){
        board = generateXDiagonalWinState();

        expect(rules.isWinner(board, "X")).toBe(true);
    });

    it("should return all of a player's moves when getMove is called", function(){
        board.updateBoard(player1, 0);
        board.updateBoard(player2, 1);
        board.updateBoard(player1, 5);

        var xMoves = rules.getMoves(board, "X");

        expect(xMoves.compare([0,5])).toBe(true);
    });

    it("should determine draw when all moves taken and no one is winner", function(){
        board = generateDrawState();

        expect(rules.isDraw(board)).toBe(true);
    });

    it("should be over when there is a winner or draw", function(){
        board = generateDrawState();

        expect(rules.isGameOver(board)).toBe(true);
    });

    it("should return true for available space, false if taken for isValidMove", function(){
        var valid = rules.isValidMove(board, 0);

        expect(valid).toBe(true);

        board.updateBoard("X", 5);
        valid = rules.isValidMove(board, 5);

        expect(valid).toBe(false);
    });

});

describe("Player", function(){
    var game, gameBoard, view;
    var player1, player2;
    var rules;

    beforeEach(function(){
        gameBoard = new GameBoard();
        gameBoard.initialize();
        player1 = new Player("X", "human", "green");
        player2 = new Player("O", "human", "pink");
        rules = new GameRules();
        game = new Game(gameBoard, player1, player2);
        game.listen();
    });

    it("should be defined", function(){
        expect(player1).toBeDefined();
    });

    it("should have a marker", function(){
        expect(player1.marker).toBe("X");
    });

    it("should have a type", function(){
        expect(player1.type).toBe("human");
    });

    it("should have a color", function(){
        expect(player1.color).toBe("green");
    });

    it("should update board when player makes move", function(){
        spyOn(gameBoard, "updateBoard");

        player1.makeMove(game, 0);

        expect(game.board.updateBoard).toHaveBeenCalledWith(player1, 0, true);
    });

    it("should call game.nextTurn when complete", function(){
        spyOn(game, "nextTurn");
        spyOn(gameBoard, "notifyObservers");

        player1.makeMove(game, 0);

        expect(game.nextTurn).toHaveBeenCalled();
    });

    it("should not updateBoard when making invalid move", function(){
        game.board.updateBoard("X", 0);
        spyOn(game.board, "updateBoard");

        player1.makeMove(game, 0);

        expect(game.board.updateBoard).not.toHaveBeenCalled();
    });
});

describe("Minimax/Move calculation", function(){
    var game, gameBoard, player1, player2;
    var bestScore, score;

    beforeEach(function(){
        gameBoard = new GameBoard();
        gameBoard.initialize();
        player1 = new Player("X", "human", "green");
        player2 = new Player("O", "computer", "pink");
        game = new Game(gameBoard, player1, player2);
        game.listen();
    });

    it("getDefaultBestScore should be -10000 for player1, 10000 for player2", function(){
        bestScore = game.getDefaultBestScore(player1);
        expect(bestScore).toBe(-10000);

        bestScore = game.getDefaultBestScore(player2);
        expect(bestScore).toBe(10000);
    });

    it("isBestScore should be true for player1 when score is > than bestScore", function(){
        bestScore = game.getDefaultBestScore(player1);
        gameBoard = generateXDiagonalWinState();
        game = new Game(gameBoard, player1, player2);

        score = game.minimax(gameBoard);

        expect(game.isBestScore(score, bestScore, player1)).toBe(true);
    });

    it("should return 1 for player1 win (minimax)", function(){
        gameBoard = generateXDiagonalWinState();
        game = new Game(gameBoard, player1, player2);

        var score = game.minimax(gameBoard, player1);

        expect(score).toBe(1);
    });

    it("should return center space when corner space taken (getBestMove)", function(){
        gameBoard.updateBoard(player1, 0);
        var move = game.getBestMove(gameBoard, player2);

        expect(move).toBe(4);
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

function generateXDiagonalWinState(){
    var board = new GameBoard();
    board.initialize();
    var player1 = new Player("X", "human", "pink");
    var player2 = new Player("O", "computer", "pink");

    board.updateBoard(player1, 0);
    board.updateBoard(player1, 1);
    board.updateBoard(player1, 4);
    board.updateBoard(player1, 6);
    board.updateBoard(player1, 8);
    board.updateBoard(player2, 2);
    board.updateBoard(player2, 3);
    board.updateBoard(player2, 5);
    board.updateBoard(player2, 7);
    //  X X O
    //  O X O
    //  X O X
    return board;
}

function generateDrawState(){
    var board = new GameBoard();
    board.initialize();
    var player1 = new Player("X", "human", "pink");
    var player2 = new Player("O", "computer", "pink");

    board.updateBoard(player1, 0);
    board.updateBoard(player1, 1);
    board.updateBoard(player1, 5);
    board.updateBoard(player1, 6);
    board.updateBoard(player1, 8);
    board.updateBoard(player2, 2);
    board.updateBoard(player2, 3);
    board.updateBoard(player2, 4);
    board.updateBoard(player2, 7);
    //  X X O
    //  O O X
    //  X O X
    return board;
}