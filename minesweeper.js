//logic

//status of tile
export const tile_status = {
    hidden: 'hidden',
    mine: 'mine',
    number: 'number',
    marked: 'marked',
}

//create Board
export function createBoard(boardSize, numberOfMines){
    //create the board
    const board = []
    const minePostitions = getMinePositions(boardSize, numberOfMines)
    console.log(minePostitions)
    //create rows and add to the board
    for(let x = 0; x < boardSize; x++){
        //For every i create a new row
        const row = []
        for(let y = 0; y < boardSize; y++){
            const element = document.createElement('div')
            element.dataset.status = tile_status.hidden
            const tiles = {
                element,
                x,
                y,
                mine: minePostitions.some(positionMatch.bind(null, { x, y })),
                get status(){
                    return this.element.dataset.status
                },
                set status(value){
                    this.element.dataset.status = value
                }
            }

            row.push(tiles)
        }
        board.push(row)
    }

    return board
}

// logic to mark/unmark the tile
export function markTile(tile){
    //check if the tile is eligible to be marked
    if(tile.status !== tile_status.hidden && tile.status !== tile_status.marked){
        return 
    }

    //mark/unmark the tile
    if(tile.status === tile_status.marked){
        tile.status = tile_status.hidden
    }else{
        tile.status = tile_status.marked
    }
}

export function revealTile(board, tile){
    //check if the tile is eligible
    if(tile.status !== tile_status.hidden){
        return 
    }

    //check if tile is mine
    if(tile.mine){
        tile.status = tile_status.mine
        return
    }

    tile.status = tile_status.number
    const adjacentTile = nearbyTiles(board, tile)
    const mines = adjacentTile.filter(t => t.mine)
    if(mines.length === 0){
        adjacentTile.forEach(revealTile.bind(null, board))
    }else{
        tile.element.textContent = mines.length
    }
}

//check for win the game
export function checkWin(board){
    return board.every(row => {
        return row.every(tile => {
            return tile.status === tile_status.number || (tile.mine && (tile.status === tile_status.hidden || tile.status === tile_status.marked))
        })
    })
}

//check for lose the game
export function checkLose(board){
    return board.some(row => {
        return row.some(tile => {
            return tile.status === tile_status.mine
        })
    })
}

//setting mine postion
function getMinePositions(boardSize, numberOfMines){
    const positions = []

    //generate the position of mine
    while(positions.length < numberOfMines){
        const position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize)
        }

        //check if the position already existed
        if(!positions.some(positionMatch.bind(null, position))) {
            positions.push(position)
        }
    }
    return positions
}

function positionMatch(a, b){
    return a.x === b.x && a.y === b.y
}


function randomNumber(size){
    return Math.floor(Math.random() * size)
}

function nearbyTiles(board, { x, y }){
    const tiles = []

    for(let xOffset = -1; xOffset <= 1; xOffset++){
        for(let yOffset = -1; yOffset <= 1; yOffset++){
            const tile = board[x + xOffset]?.[y + yOffset]
            if(tile){tiles.push(tile)}
        }
    }

    return tiles
}