import DATA from './data.json'

function sortedSumActionShiftByStudentAtLecture(lecture: any): any[] {
    // sum up and sort the shift in lecture['students']
    let students = []
    for (let student of lecture.students) {
        let sum = 0
        for (let action of student.actions) {
            sum += action.shift
        }
        students.push({ name: student.name, totalShift: sum })
    }
    students.sort((a, b) => b.totalShift - a.totalShift)
    return students
}

function sortedSumActionShiftByStudentToLecture(
    students: any[],
    lectures: any[]
): any[] {
    let returnedStudents = []

    for (let student of students) {
        let sum = 0
        for (let lecture of lectures) {
            for (let lectureStudent of lecture.students) {
                if (lectureStudent.id == student.id) {
                    for (let action of lectureStudent.actions) {
                        sum += action.shift
                    }
                    break
                }
            }
        }
        returnedStudents.push({ name: student.name, totalShift: sum })
    }
    returnedStudents.sort((a, b) => b.totalShift - a.totalShift)
    return returnedStudents
}

function rankedStudentList(
    students: any[],
    max: number,
    maxPercent: number
): any[] {
    const ranked: any[] = students.map((s: any) => {
        return {
            name: s.name,
            percent: (s.totalShift / max) * maxPercent
        }
    })
    ranked.sort((a, b) => a.percent - b.percent)
    return ranked
}

function rankAtCourseLecture(course: string, lectureId: number): any[] {
    const courseData: any = DATA[course as keyof typeof DATA]
    let lecture = null
    for (let i = 0; i < courseData['lectures'].length; i++) {
        if (courseData['lectures'][i]['id'] == lectureId) {
            lecture = courseData['lectures'][i]
            break
        }
    }
    if (!lecture) throw new Error(`can not find the lecture: ${lectureId}`)

    const students = sortedSumActionShiftByStudentAtLecture(lecture)
    let max = students[0].totalShift
    const rankedStudents = rankedStudentList(students, max, 100)
    return rankedStudents
}

function rankToCourseLecture(course: string, lectureId: number): any[] {
    const courseData: any = DATA[course as keyof typeof DATA]
    let lectures: any[] = []
    for (let i = 0; i < courseData['lectures'].length; i++) {
        const id = parseInt(courseData['lectures'][i]['id'])
        if (id <= lectureId) {
            lectures.push(courseData['lectures'][i])
        }
    }
    if (lectures.length <= 0)
        throw new Error(`can not find the lectures less then id: ${lectureId}`)

    const students = sortedSumActionShiftByStudentToLecture(
        courseData['students'],
        lectures
    )
    let max = students[0].totalShift
    const maxPercent = (lectureId / courseData['lectures'].length) * 100.0
    const rankedStudents = rankedStudentList(students, max, maxPercent)
    return rankedStudents
}

function createOption(course: string, lecture: number, isAt: boolean) {
    const title = `${course} at ${lecture}`
    let rank = isAt
        ? rankAtCourseLecture(course, lecture)
        : rankToCourseLecture(course, lecture)
    let option: any = {
        title: {
            text: title
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: {
                formatter: '{value} %'
            }
        },
        yAxis: {
            type: 'category',
            data: rank.map((i) => {
                return i['name']
            })
        },
        series: [
            {
                name: '排行榜',
                type: 'bar',
                data: rank.map((i) => {
                    return i['percent']
                })
            }
        ]
    }
    return option
}

export { createOption }
