import {DecorCode} from "./core/tokens.dto";
import {Tokenizer} from "./core/tokenizer";

const textFragment = ' АД: 130/90';

const x = [{xPath: '', start: 1, end: 2, decorCode: DecorCode.symptom, code: '', name: textFragment }];

const tokenizedX = Tokenizer.prepareToTokenize(x);
console.log({tokenizedX});
const result = Tokenizer.tokenize(tokenizedX);
console.log(JSON.stringify(result, null, 2));