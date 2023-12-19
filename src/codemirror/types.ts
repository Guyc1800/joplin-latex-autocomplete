import { Position,Editor } from "codemirror";
export interface Hint {
    text: string;
    displayText?: string;
    className?: string;
    description?: string;
    render?: (container: Element, completion: Completion, hint: Hint) => void;
    // hint?: (cm: typeof CodeMirror, completion: Completion, hint: Hint) => void;
    inline: boolean;
    //container:Element|null custom container for the widget
//     select (completion, Element)
// Fired when a completion is selected. Passed the completion value (string or object) and the DOM node that represents it in the menu.

}

interface Completion {
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
