import * as kuromoji from 'kuromoji'

export default async function (keywords: string[]) {
    const builder = kuromoji.builder({
        dicPath: 'node_modules/kuromoji/dict'
    });
    

    const tokenizer = await new Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>>(done => {
        builder.build((err, tokenizer) => { done(tokenizer) })
    })

    const list = keywords.map(keyword =>
        tokenizer.tokenize(keyword)
            .map(features => features.surface_form === 'ド' ? '名詞' : features.pos)
            .filter((pos, i, array) => pos !== '名詞' || array[i - 1] !== '名詞')
            .join(' ')
    )
    
    return list.every(token => token === list[0])
}