import {DecorCode, ToTokizerFormatDto, InterimTokenDto, TokenDto} from "./tokens.dto";

export class Tokenizer {

    public static neededKeys = ['xPath', 'start', 'end', 'decorCode', 'code', 'name'];
    public static prepareToTokenize(lotOfMarkup:{xPath: string, start: number, end: number, decorCode: DecorCode, code: string, name: string }[]) {
        return lotOfMarkup.map((value) => {
            const format = new ToTokizerFormatDto();
            format.text = value.name;
            format.startFromBlock = value.start;
            return format;
        })
    }

    public static tokenize(args: ToTokizerFormatDto[]) {
        const arrayOfInculeTokens = args.map((value, index) => {
            console.log(`Разметка номер - ${index}`)
            console.log(`Фрагмент -  ${value.text}`)
            const initialDelay = value.startFromBlock;

            const firstIteration = Tokenizer.splitBySpaces(value.text);
            // console.log(firstIteration);
            const secondIteration = Tokenizer.searchPunctuationInLimitsOfWord(firstIteration);
            return Tokenizer.calculateResultOfDelays(secondIteration, initialDelay);

        });

        return arrayOfInculeTokens;

    }

    public static splitBySpaces(fragment: string) {
        const firstIteration = fragment.split(" ");
        console.log(`Разбиение по пробелам - `)
        console.log(firstIteration)
        let delay = 1;
        let index = 0;

        let secondIteration: InterimTokenDto[] = [];
        for (const fragment of firstIteration) {
            // console.log(fragment);
            if (index === 0) {
                delay = 0;
            }
            if (fragment == '' || ( fragment.length == 1 && fragment.match(/\p{P}/gu))) {
                delay++;
            } else {
                if (fragment.match(/\p{P}/gu )) {
                        const splitByPMInsideTheWord = fragment.split(/\p{P}/gu);
                        let indexInside = 0
                        for (const spm of splitByPMInsideTheWord) {
                            const interim = new InterimTokenDto();
                            if (spm === '') {
                                if (indexInside === 0 && index === 0) {
                                    delay = 1
                                } else if (index !== 0) {
                                    delay = 2
                                }
                                continue;
                            }
                            interim.delay = delay;
                            interim.text = spm;
                            secondIteration.push(interim);
                            delay = 1;

                            indexInside++;
                        }
                } else {
                    const interim = new InterimTokenDto();
                    interim.delay = delay;
                    interim.text = fragment;
                    secondIteration.push(interim);
                    delay = 1;
                }
            }
            index++;
        }

        console.log(`Разбиение по прочим знакам препинания - `)
        console.log(secondIteration)

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

        console.log("Дополнительное разбиение по границам слов - ")
        console.log(secondIteration)

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

        console.log("Результат по координатам после подсчёта")
        console.log(result)

        return result;
    }
}