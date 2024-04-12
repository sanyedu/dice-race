import Lecture from './lecture'
import Student from './student'

export default class Course {
    name: string
    lectures: Lecture[]
    students: Student[]

    constructor(name: string, students: Student[], lectures: Lecture[]) {
        this.name = name
        this.students = students
        this.lectures = lectures
    }
}
