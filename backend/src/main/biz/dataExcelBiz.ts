import assert, { throws } from 'node:assert'
import Excel from 'exceljs'
import * as path from 'path'
import Student from 'model/student'
import Course from 'model/course'
import Lecture from 'model/lecture'
import Action from 'model/action'

function getRowCellStrValue(row: Excel.Row, cellIndex: number): string | null {
    const cell = row.getCell(cellIndex)
    return cell.value ? cell.value.toString() : null
}

function getRowCellIntValue(row: Excel.Row, cellIndex: number): number | null {
    const cell = row.getCell(cellIndex)
    return cell.value ? parseInt(cell.value.toString()) : null
}

function getSheetCellIntValue(
    worksheet: Excel.Worksheet,
    row: number,
    col: number
): number | null {
    const cell = worksheet.getCell(row, col)
    return cell.value ? parseInt(cell.value.toString()) : null
}

export default class DataExcelBiz {
    public data: any

    public async read_from_excel(input_file: string) {
        const workbook = new Excel.Workbook()
        const content = await workbook.xlsx.readFile(input_file)
        this.data = {
            CourseStudentDict: {}
        }
        for (let i = 0; i < content.worksheets.length; i++) {
            const worksheet = content.worksheets[i]
            const course = worksheet.name

            let students: Student[] = []
            let lectures: Lecture[] = []

            // all data rows
            const rows = worksheet.getRows(2, worksheet.rowCount - 1) ?? []

            // find all students in this course
            for (let row of rows) {
                const id = getRowCellStrValue(row, 1)
                const name = getRowCellStrValue(row, 2)
                assert(id && name)
                students.push(new Student(id, name, null))
            }

            // find all lectures for this course
            for (let c = 3; c <= worksheet.columnCount; c++) {
                let lectureId = getSheetCellIntValue(worksheet, 1, c)
                // NOTE: put zero or nagative number in the end
                if (lectureId && lectureId > 0) {
                    let colStart = c
                    let lectureLength = 1
                    for (let c1 = c + 1; c1 <= worksheet.columnCount; c1++) {
                        if (getSheetCellIntValue(worksheet, 1, c1)) break
                        lectureLength++
                    }
                    lectures.push(
                        findLecturePerformInStudentRows(
                            rows,
                            lectureId,
                            colStart,
                            lectureLength
                        )
                    )
                }
            }

            this.data[course] = new Course(course, students, lectures)
        }
    }
}

function findLecturePerformInStudentRows(
    rows: Excel.Row[],
    lectureId: number,
    colStart: number,
    lectureLength: number
): Lecture {
    // console.error(
    //     `lecture id: ${lectureId}, start: ${colStart}, length: ${lectureLength}`
    // )

    const students: Student[] = []
    for (let row of rows) {
        const id = getRowCellStrValue(row, 1)
        const name = getRowCellStrValue(row, 2)
        assert(id && name)

        const actions: Action[] = []
        for (let col = colStart; col < colStart + lectureLength; col++) {
            const val = getRowCellIntValue(row, col)
            if (val != null) {
                actions.push(new Action(val))
            }
        }

        students.push(new Student(id, name, actions))
    }

    return new Lecture(lectureId, students)
}
