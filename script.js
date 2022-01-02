//Display/UI

import { tile_status, createBoard, markTile, revealTile, checkWin, checkLose } from "./minesweeper.js";

//1. Populate the board with tiles/mines
const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

//Display the board
const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector('.board')
const minesLeftText = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.subtext')
console.log(board)

//Setting the board
board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
        //Left click on tiles to reveal
        tile.element.addEventListener('click', () => {
            revealTile(board, tile)
            checkGameEnd()
        })
        //Right click on tiles to mark
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
})

boardElement.style.setProperty("--size", BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

//assume that the marked tile is mine, reduce the number of mines left
function listMinesLeft(){
    const markTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === tile_status.marked).length
    }, 0)

    minesLeftText.textContent = NUMBER_OF_MINES - markTilesCount
}

// Check for result
function checkGameEnd(){
    const win = checkWin(board)
    const lose = checkLose(board)

    if(win || lose){
        boardElement.addEventListener('click', stopProp, { capture: true })
        boardElement.addEventListener('contextmenu', stopProp, { capture: true })
    }

    if(win){
        messageText.textContent = 'You Win'
    }
    if(lose){
        messageText.textContent = 'You Lose'
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.tile_status === tile_status.marked){
                    markTile(tile)
                }
                if(tile.mine){
                    revealTile(board, tile)
                }
            })
        })
    }
}

function stopProp(e){
    e.stopImmediatePropagation()
}