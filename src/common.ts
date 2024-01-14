//settings
export const LATEX_DICTIONARY_PATH="latexDictionaryPath";
export const LATEX_DICTIONARY_MENU="latexDictionaryMenu";
export const LATEX_DICT_LOAD_MENU="latexDictionaryLoadMenu";
export const ENABLE_LATEX_INLINE="ENABLE_LATEX_INLINE";
export const ENABLE_ALIGN_WITH_WORD="ENABLE_ALIGN_WITH_WORD";
export const ENABLE_OUT_OF_STEX="ENABLE_OUT_OF_SETX";

//classes
export const HINT_DESCRIPTION_CLASS = 'Latex-description-span';
export const HIGHLIGHT_TEXT_CLASS = 'Latex-highlight-span'

export class LatexConfig{
    public dictionaryPath:string;
    public latexInline:boolean;
    public alignWithWord:boolean;
    public outsideOfSetx:boolean;
}
export enum ContextMsgType{
    GET_DICTIONARY,
    GET_CONFIG
}
export class ContextMsg{
    type:ContextMsgType;
    content:any;
}