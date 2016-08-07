import { Grid } from '@code-vicar/svutils'

export function getInitialState() {
    let grid = new Grid()
    grid.runBinaryTreeMaze()
    console.log(grid.toString())
    return {
        scene: {
            height: 500,
            width: 500,
            backgroundColor: 0x3498db,
            actors: [],
            grid,
            gridPadding: 50
        }
    }
}
