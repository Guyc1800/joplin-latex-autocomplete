import { Position,Editor } from "codemirror";
export interface Hint {
    text: string;//the completion output
    displayText?: string; // the text on the left
    // className?: string;
    description?: string;
    inline: boolean;
}
export interface Completion {
    from: Position;
    to: Position;
    list: Hint[];
    selectedHint?: number;
}

export type ExtendedEditor = {
    showHint(options: {
        alignWithWord?:boolean;
        completeSingle: boolean;
        closeCharacters: RegExp;
        closeOnUnfocus: boolean;
        hint: (cm: Editor) => Completion | undefined | Promise<Completion | undefined>;
    }): void;
};
