import {DecorCode, ToTokizerFormatDto, InterimTokenDto, TokenDto} from "./tokens.dto";

export class Tokenizer {

    public static prepareToTokenize(lotOfMarkup:{xPath: string, start: number, end: number, decorCode: DecorCode, code: string, name: string }[]) {
        return lotOfMarkup.map((value) => {
            const format = new ToTokizerFormatDto();
            format.text = value.name;
            format.startFromBlock = value.start;
            return format;
        })
    }

    public static tokenize(args: ToTokizerFormatDto[]) {
        const arrayOfInculeTokens = args.map((value) => {
            const initialDelay = value.startFromBlock;

            const firstIteration = Tokenizer.splitBySpaces(value.text);
            const secondIteration = Tokenizer.searchPunctuationInLimitsOfWord(firstIteration);
            return Tokenizer.calculateResultOfDelays(secondIteration, initialDelay);

        });

        return arrayOfInculeTokens;

    }

    public static splitBySpaces(fragment: string) {
        const firstIteration = fragment.split(" ");
        let delay = 1;
        let index = 0;

        let secondIteration: InterimTokenDto[] = [];
        for (const fragment of firstIteration) {
            if (index === 0) {
                delay = 0;
            }
            if (fragment == '') {
                delay++;
            } else {
                const interim = new InterimTokenDto();
                interim.delay = delay;
                interim.text = fragment;
                secondIteration.push(interim);
                delay = 1;
            }
            index++;
        }

        return secondIteration;
    }

    public static searchPunctuationInLimitsOfWord(secondIteration: InterimTokenDto[]) {
        let symbolIndex = 0;
        for (const detailFragment of secondIteration) {
            const symbolsArray = detailFragment.text.split("");

            let letterDelayBegin = 0;
            for (const symbol of symbolsArray) {
                /** если знак препинания в начале */
                if (symbol.match(/\p{P}/gu)) {
                    letterDelayBegin++;
                } else {
                    break;
                }
            }

            const reversedSymbolsArray = symbolsArray.reverse();

            let letterDelayEnd = symbolsArray.length;
            for (const symbol of reversedSymbolsArray) {
                /** если знак препинания в конце */
                if (symbol.match(/\p{P}/gu)) {
                    letterDelayEnd--;
                } else {
                    break;
                }
            }

            secondIteration[symbolIndex].text = secondIteration[symbolIndex].text.slice(letterDelayBegin, letterDelayEnd);
            secondIteration[symbolIndex].delay = secondIteration[symbolIndex].delay + letterDelayBegin;

            if (secondIteration.length > 1 && symbolIndex + 1 !== secondIteration.length) {
                secondIteration[symbolIndex + 1].delay = secondIteration[symbolIndex + 1].delay + symbolsArray.length - letterDelayEnd
            }

            if (symbolIndex === secondIteration.length) {
                secondIteration[symbolIndex].delay = secondIteration[symbolIndex].delay + letterDelayEnd
            }

            if (symbolIndex +1  !== secondIteration.length) {
                symbolIndex++;
            }

        }

        return secondIteration;
    }

    public static calculateResultOfDelays(secondIteration: InterimTokenDto[], initialDelay: number): TokenDto[] {
        let result: TokenDto[] = [];
        for (const detail of secondIteration) {
            const token = new TokenDto();
            token.startFromAnamnesis = initialDelay + detail.delay;
            token.text = detail.text;

            initialDelay = initialDelay + detail.delay + detail.text.length;

            result.push(token);
        }

        return result;
    }
}