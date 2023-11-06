import {DecorCode} from "./core/tokens.dto";
import {Tokenizer} from "./core/tokenizer";

// const textFragment = ') Рос и развивался';
// // const textFragment = ' АД: 130/90';
//
// const x = [{xPath: '', start: 1, end: 2, decorCode: DecorCode.symptom, code: '', name: textFragment }];
//
// const tokenizedX = Tokenizer.prepareToTokenize(x);
// // console.log({tokenizedX});
// const result = Tokenizer.tokenize(tokenizedX);
// console.log(JSON.stringify(result, null, 2));

const textFragment1 = ' АД: 130/90';
// const textFragment = ' АД: 130/90';

const x1 = [{xPath: '', start: 3, end: 2, decorCode: DecorCode.symptom, code: '', name: textFragment1 }];

const tokenizedX1 = Tokenizer.prepareToTokenize(x1);
// console.log({tokenizedX});
const result1 = Tokenizer.tokenize(tokenizedX1, true);
console.log(JSON.stringify(result1, null, 2));