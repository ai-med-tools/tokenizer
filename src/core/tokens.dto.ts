export enum DecorCode {
    diagnosisMain = 'diagnosisMain',
    diagnosisSup = 'diagnosisSup',
    attendDisease = 'attendDisease',
    symptom = 'symptom',
}

export class ToTokizerFormatDto {
    startFromBlock: number;
    text: string;
}

export class TokenDto {
    startFromAnamnesis: number;
    text: string;
}

export class TokensDto {
    value: TokenDto[];
}

export class InterimTokenDto {
    delay: number;
    text: string;
}