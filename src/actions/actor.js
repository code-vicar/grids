import { Actor } from './types'

export function addActor() {
    return {
        type: Actor.Add,
        posX: Math.ceil(15 + (Math.random() * 445)),
        posY: Math.ceil(15 + (Math.random() * 445))
    }
}
