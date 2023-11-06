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

    public static tokenize(args: ToTokizerFormatDto[], log = false) {
        const arrayOfInculeTokens = args.map((value, index) => {
            if (log) {
                console.log(`Разметка номер - ${index}`)
                console.log(`Фрагмент -  ${value.text}`)
            }
            const initialDelay = value.startFromBlock;

            const firstIteration = Tokenizer.splitBySpaces(value.text, log);
            const secondIteration = Tokenizer.searchPunctuationInLimitsOfWord(firstIteration);
            return Tokenizer.calculateResultOfDelays(secondIteration, initialDelay);

        });

        return arrayOfInculeTokens;

    }

    public static splitBySpaces(fragment: string, log = false) {
        const firstIteration = fragment.split(" ");
        if (log) {
            console.log(`Разбиение по пробелам - `)
            console.log(firstIteration)
        }
        let delay = 1;
        let index = 0;

        let secondIteration: InterimTokenDto[] = [];
        for (const fragment of firstIteration) {
            if (index === 0) {
                delay = 0;
            }
            if (fragment == '' || ( fragment.length == 1 && fragment.match(/\p{P}/gu)) || ( fragment.length == 1 && fragment.match(/[\r\n\t]+/gm))) {
                delay += fragment.length +1 ;
            } else {
                if (fragment.match(/\p{P}/gu )) {
                    const splitByPMInsideTheWord = fragment.split(/\p{P}/gu);
                    let indexInside = 0
                    for (const spm of splitByPMInsideTheWord) {
                        const interim = new InterimTokenDto();
                        if (spm === '' || spm.match(/\p{P}/gu) || spm.match(/[\r\n\t]+/gm)) {
                            if (indexInside === 0 && index === 0) {
                                delay += 1
                            } else if (index !== 0 || indexInside !== 0) {
                                delay += spm.length + 1
                            }
                            indexInside++;
                            continue;
                        }
                        interim.delay = delay;
                        interim.text = spm;
                        secondIteration.push(interim);
                        delay = 1;

                    }
                } else if (fragment.match(/[\r\n\t]+/gm)) {
                    const splitByPMInsideTheWord = fragment.split(/[\r\n\t]+/gm);
                    let indexInside = 0
                    for (const spm of splitByPMInsideTheWord) {
                        const interim = new InterimTokenDto();
                        if (spm === '' || spm.match(/\p{P}/gu) || spm.match(/[\r\n\t]+/gm)) {
                            if (indexInside === 0 && index === 0) {
                                delay += 1
                            } else if (index !== 0 || indexInside !== 0) {
                                delay += spm.length + 1
                            }
                            indexInside++;
                            continue;
                        }
                        interim.delay = delay;
                        interim.text = spm;
                        secondIteration.push(interim);
                        delay = 1;

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

        if (log) {
            console.log(`Разбиение по прочим знакам препинания - `)
            console.log(secondIteration)
        }

        return secondIteration;
    }

    public static searchPunctuationInLimitsOfWord(secondIteration: InterimTokenDto[], log = false) {
        let symbolIndex = 0;
        for (const detailFragment of secondIteration) {
            const symbolsArray = detailFragment.text.split("");

            let letterDelayBegin = 0;
            for (const symbol of symbolsArray) {
                /** если знак препинания в начале */
                if (symbol.match(/\p{P}/gu) || symbol.match(/[\r\n\t]+/gm)) {
                    letterDelayBegin++;
                } else {
                    break;
                }
            }

            const reversedSymbolsArray = symbolsArray.reverse();

            let letterDelayEnd = symbolsArray.length;
            for (const symbol of reversedSymbolsArray) {
                /** если знак препинания в конце */
                if (symbol.match(/\p{P}/gu) || symbol.match(/[\r\n\t]+/gm)) {
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

        if (log) {
            console.log("Дополнительное разбиение по границам слов - ")
            console.log(secondIteration)
        }

        return secondIteration;
    }

    public static calculateResultOfDelays(secondIteration: InterimTokenDto[], initialDelay: number, log = false): TokenDto[] {
        let result: TokenDto[] = [];
        for (const detail of secondIteration) {
            const token = new TokenDto();
            token.startFromAnamnesis = initialDelay + detail.delay;
            token.text = detail.text;

            initialDelay = initialDelay + detail.delay + detail.text.length;

            result.push(token);
        }

        if (log) {
            console.log("Результат по координатам после подсчёта")
            console.log(result)
        }

        return result;
    }
}