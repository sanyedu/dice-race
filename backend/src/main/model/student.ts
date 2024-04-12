import Action from './action'

export default class Student {
    name: string
    id: string
    actions: Action[] | null

    constructor(id: string, name: string, actions: Action[] | null) {
        this.id = id
        this.name = name
        this.actions = actions
    }
}
