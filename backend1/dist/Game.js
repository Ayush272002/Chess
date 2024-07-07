"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        //let the parties know that the game has started
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black",
            },
        }));
    }
    makeMove(socket, move) {
        //validate the type of move using zod
        console.log(this.moveCount);
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("early return 1");
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("early return 2");
            return;
        }
        console.log("did not early return");
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            return;
        }
        console.log("move successs");
        //check if the game is over
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "Black" : "White",
                },
            }));
            this.player2.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "Black" : "White",
                },
            }));
            return;
        }
        console.log(this.moveCount % 2);
        if (this.moveCount % 2 === 0) {
            console.log("sent1");
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        else {
            console.log("sent2");
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        this.moveCount++;
        //send the updated board to both players
    }
}
exports.Game = Game;
