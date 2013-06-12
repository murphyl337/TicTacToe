/**
 * Created with JetBrains WebStorm.
 * User: tmurphy
 * Date: 6/12/13
 * Time: 12:26 PM
 * To change this template use File | Settings | File Templates.
 */
this.getComputerNextMove = function(board, player){
    return this.extracted(player, board, this.deciderComputer, true);
};

this.extracted = function (player, board, decider, shouldCalculateBestMove) {
    var bestMove;
    var otherPlayer = this.getOtherPlayer(player);
    var bestScore = this.getDefaultBestScore(player);
    var availableSpaces = board.getAvailableSpaces();

    for (var space = 0; space < availableSpaces.length; space++) {
        var gameBoardChild = board.clone();
        gameBoardChild.updateBoard(player.selector, availableSpaces[space].position);
        var score = this.minimax(gameBoardChild, otherPlayer);
        var isBestScore = this.isBestScore(player, score, bestScore);
        if (isBestScore) {
            bestScore = score;
            if (shouldCalculateBestMove) {
                bestMove = availableSpaces[space].position;
            }
        }
    }
    // return bestScore;
    return decider(bestScore, bestMove);
};
this.deciderMin = function (bestScore, bestMove) {
    return bestScore;
};
this.deciderComputer = function (bestScore, bestMove) {
    return bestMove;
};

this.minimax = function(board, player){
    if(board.isWinner(player1.selector)) return 1;
    else if(board.isWinner(player2.selector)) return -1;
    else if(board.isDraw()) return 0;
    return this.extracted(player, board, this.deciderMin);
};