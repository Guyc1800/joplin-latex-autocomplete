import { Editor } from "codemirror";
import { ExtendedEditor,Completion ,Hint} from "./types";
import { Position } from "codemirror";
import CodeMirror = require("codemirror");
const HINT_DESCRIPTION_CLASS = '.Latex-description-span';
let LatexHints: Hint[]=[
    {
        text:'a',
        displayText:'\\abc',
        description:"an a",
        inline:false,
    },
    {
        text:'b',
        displayText:'\\bcd',
        description:"an b",
        inline:false,
    }
]
export default class Autocomplete{
    constructor(private readonly context,private readonly editor: ExtendedEditor & Editor, private readonly cm:typeof CodeMirror){
        this.editor.on('cursorActivity', this.triggerHints.bind(this));
    }    
    private readonly doc=this.editor.getDoc();
    private symbolRange?: {from:Position, to:Position};
    private cursor:Position;
    private readonly trigger_symbol = '\\a';
    private readonly enableinline =false // settings to enable autocomplete when there is chars after the triggersymbol  
    triggerHints(){
        this.cursor = this.doc.getCursor();
        const {line:cursorLine,ch:cursorCh}=this.cursor
        const symbolRange = [{ line: cursorLine, ch: cursorCh - this.trigger_symbol.length }, this.cursor] as const;
        const chars = this.doc.getRange(...symbolRange);
        console.log(`chars:${chars}`);
        // TODO  : check if the cursor is inside latex block 
        if(chars === this.trigger_symbol&& (!/\S/.test(this.doc.getRange(this.cursor,{line:cursorLine, ch:cursorCh+1}))|| this.enableinline)){ 
            this.symbolRange={from:symbolRange[0],to:symbolRange[1]}
            //second statment is to check that there is no char other then space after the cursor pos  
            this.editor.showHint({
                closeCharacters:/\s/,
                closeOnUnfocus:false,
                completeSingle:false,
                hint:this.getCompletion.bind(this),
            });
        }
    }
    private async getCompletion(): Promise<Completion | undefined> {
        const {line, ch} = this.symbolRange.to; // the pos where trigger symbol ends
        const cursor = this.doc.getCursor();
        if(cursor.line < line || cursor.ch < ch){
            return;// return if the cursor is before the trigger symbol
        }
        const keyword = this.doc.getRange({line,ch},cursor);// the chars after the triggersymbol of the completion
        console.log(`keyword:"${keyword}" line,ch:${line},${ch}`);
        
        const {from: completionFrom} = this.symbolRange;
        const CompletionTo = {line, ch:ch + keyword.length};
        const completion: Completion ={
            from:completionFrom,
            to: CompletionTo,
            list:this.getHints(
                keyword,
                this.doc.getRange({line:cursor.line, ch:0},{line:cursor.line, ch:cursor.ch-1}) //FIXME check if it fits the code
            ),
        };
        return completion;
    }
    private getHints(keyword:string, indent:string): Hint[]{
    
        
        
        let hints = [];
        let textIndent = indent.trimStart();
        
        for(let hint of LatexHints){
            // if(hint.) // TODO sort matchs by history if no text after the trigger symbol, if there is sort by first "startwith" ,includes 
            hints.push({
                text: textIndent,
                displayText:hint.displayText,
                render(container) {
                    container.innerHTML =
                        hint.displayText + `<span class="${HINT_DESCRIPTION_CLASS}">${hint.description}</span>`;
                },
            })
        }
        return hints
        
    }
}




// const arr=[]
// arr.sort((a,b)=>{
//     if(typeof a === typeof b){
//         return (a>b)?1:-1;
//     }else if(typeof a ==="number"){
//         return -1;
//     }else{
//         return 1;
//     }
// })