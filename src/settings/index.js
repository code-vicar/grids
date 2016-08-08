import { Grid } from '@code-vicar/svutils'

export function getInitialState() {
    let grid = new Grid()
    grid.runSidewinderMaze()
    console.log(grid.toString())
    return {
        scene: {
            height: 500,
            width: 500,
            backgroundColor: 0x3498db,
            maze: {
                padding: 50,
                grid
            }
        }
    }
}
