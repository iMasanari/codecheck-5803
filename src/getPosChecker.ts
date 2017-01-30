import "tslib"
import kuromoji from './kuromojiRequester'

export default async function (keywords: string[]) {
    const builder = kuromoji.builder({
        dicPath: 'node_modules/kuromoji/dict'
    });
    
    // 辞書の読み込み
    const tokenizer = await new Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>>(done => {
        builder.build((err, tokenizer) => { done(tokenizer) })
    })

    // 品詞を並べる
    const list = keywords.map(keyword =>
        tokenizer.tokenize(keyword)
            .map(features => // 「ドローン」が「ド(接続詞)/ローン(名詞)」となってしまっていたので次のfilterと合わせて無理やり修正
                features.surface_form === 'ド' ? '名詞' : features.pos
            )
            .filter((pos, i, array) => pos !== '名詞' || array[i - 1] !== '名詞') // 名詞を繋げる 固有名詞などへの対策
            .join(' ')
    )
    
    // 品詞チェック
    return list.every(token => token === list[0])
}
