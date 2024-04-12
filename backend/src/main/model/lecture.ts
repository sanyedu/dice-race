import Student from './student'

export default class Lecture {
    id: number
    students: Student[]

    constructor(id: number, students: Student[]) {
        this.id = id
        this.students = students
    }
}
