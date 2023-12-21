import { Position,Editor } from "codemirror";
export interface Hint {
    text: string;//the output after completion
    displayText?: string; // the keyword short
    className?: string; 
    description?: string;// description
    render?: (container: Element, completion: Completion, hint: Hint) => void;
    //TODO hint?: (cm: typeof CodeMirror, completion: Completion, hint: Hint) => void;
    inline: boolean;
    //TODO container:Element|null custom container for the widget
//     select (completion, Element)
// Fired when a completion is selected. Passed the completion value (string or object) and the DOM node that represents it in the menu.

}
export interface Completion {
    from: Position;
    to: Position;
    list: Hint[];
    selectedHint?: number;
}

export type ExtendedEditor = {
    showHint(options: {
        completeSingle: boolean;
        closeCharacters: RegExp;
        closeOnUnfocus: boolean;
        hint: (cm: Editor) => Completion | undefined | Promise<Completion | undefined>;
    }): void;
};
