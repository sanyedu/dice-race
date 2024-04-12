import * as dotenv from 'dotenv'
dotenv.config({ path: './env/local.ini' })

import DataExcelBiz from 'biz/dataExcelBiz'

async function main() {
    let input_file = process.argv[2]
    const biz = new DataExcelBiz()
    await biz.read_from_excel(input_file)
    console.log(JSON.stringify(biz.data))
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
