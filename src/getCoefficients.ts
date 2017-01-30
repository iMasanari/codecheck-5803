import * as request from 'request'

const ackey = '869388c0968ae503614699f99e09d960f9ad3e12'

interface Doc {
    Id: string
    PageName: string
    Title: string
    Body: string
    Category: string
    Keyword: string,
    PublicationKind: string,
    ReleaseDate: string,
    WordCount: string,
    Page: string
}

interface ResponseData {
    status: 'ok' | 'ng',
    code: string,
    result: {
        numFound: string,
        start: string,
        doc: Doc[]
    }
}

export default async function (list: string[], start: string, end: string) {
    const startDate = getDateFrom1970_01_01(start)
    const endDate = getDateFrom1970_01_01(end)
    const weeks = (endDate - startDate) / 7 | 0

    const docsList = await Promise.all(list.map(async keyword => {
        // 記事の読み込み
        const response = await sendRequest(keyword, `[${start} TO ${end}]`, 0)

        const numFound = +response.result.numFound
        const docs = response.result.doc

        // 追加読み込み
        const promises = []
        for (let i = 1; (i - 1) * 100 <= numFound; ++i) {
            const promise = sendRequest(keyword, `[${start} TO ${end}]`, i * 100).then(response => {
                if (response.result.doc) {
                    docs.push(...response.result.doc)
                }
            })

            promises.push(promise)

            if (i > 100) break
        }

        // 読み込み完了を待つ
        await Promise.all(promises)

        return docs || []
    }))
    // console.log(docsList.map(v => v.length))

    // 週ごとの記事数を集計する
    const countsList = docsList.map(docs => {
        const counts = new Array<number>(weeks).fill(0)

        docs.forEach(doc => {
            const date = getDateFrom1970_01_01(doc.ReleaseDate) - startDate
            const index = date / 7 | 0

            if (index < weeks)
                ++counts[index]
        })
        return counts
    })

    // console.log(countsList)

    // 相関係数の表を作る
    const coefficients = countsList.map(value1 => countsList.map(value2 => {
        if (value1 === value2) return 1

        const res = correlationCoefficient(value1, value2)
        return res != null ? Math.round(res * 1000) / 1000 : null
    }))

    return coefficients
}

function getDateFrom1970_01_01(yyyy_mm_dd: string) {
    const [year, month, date] = yyyy_mm_dd.split('-').map(v => +v)
    return new Date(year, month - 1, date).getTime() / (1000 * 60 * 60 * 24)
}

function sendRequest(keyword: string, releaseDate: string, start: number) {
    const q = encodeURIComponent(`Body:${keyword} AND ReleaseDate:${releaseDate}`)
    const url = `http://54.92.123.84/search?q=${q}&rows=100&start=${start}&wt=json&ackey=${ackey}`

    return new Promise<ResponseData>(done => {
        request.get({ url, json: true, }, (error, response, body) => { done(body.response) })
    })
}

function correlationCoefficient(dataX: number[], dataY: number[]) {
    const len = dataX.length

    // 平均
    const mx = dataX.reduce((a, b) => a + b) / len
    const my = dataY.reduce((a, b) => a + b) / len

    // 不偏分散
    const vx = dataX.reduce((prev, v) => prev + (v - mx) ** 2, 0) / (len - 1)
    const vy = dataY.reduce((prev, v) => prev + (v - my) ** 2, 0) / (len - 1)

    // 共分散
    const vxy = dataX.reduce((prev, dataX_i, i) => prev + (dataX_i - mx) * (dataY[i] - my), 0) / (len - 1)

    // 標準偏差
    const sdx = Math.sqrt(vx);
    const sdy = Math.sqrt(vy);

    return sdx * sdy ? vxy / sdx / sdy : null
}
