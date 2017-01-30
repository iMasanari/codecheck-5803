// TypeScriptで書いてjsにトランスパイルしました。tsファイルは`/src`にあります。

import "tslib"
import getCoefficients from './getCoefficients'
import getPosChecker from './getPosChecker'

async function main(argv: string[]) {
    const list = JSON.parse(argv[0]) as string[]
    const [, start, end] = argv

    const [coefficients, posChecker] = await Promise.all([
        getCoefficients(list, start, end),
        getPosChecker(list)
    ])

    const result = { coefficients, posChecker }

    console.log(JSON.stringify(result))
}

export = main
