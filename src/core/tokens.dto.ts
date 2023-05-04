export enum DecorCode {
    diagnosisMain = 'diagnosisMain',
    diagnosisSup = 'diagnosisSup',
    attendDisease = 'attendDisease',
    symptom = 'symptom',
}

export class ToTokizerFormatDto {
    startFromBlock: number;
    text: string;

    constructor(startFromBlock?: number, text?: string) {
        this.startFromBlock = startFromBlock ?? 0;
        this.text = text ?? '';
    }
}

export class TokenDto {
    startFromAnamnesis: number;
    text: string;

    constructor(startFromAnamnesis?: number, text?: string) {
        this.startFromAnamnesis = startFromAnamnesis ?? 0;
        this.text = text ?? '';
    }
}

export class TokensDto {
    value: TokenDto[] | [];

    constructor(value?: TokenDto[] | []) {
        this.value = value ?? [];
    }
}

export class InterimTokenDto {
    delay: number;
    text: string;

    constructor(delay?: number, text?: string) {
        this.delay = delay ?? 0;
        this.text = text ?? '';
    }
}