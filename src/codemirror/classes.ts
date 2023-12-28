import { Editor } from "codemirror";
import { ExtendedEditor,Completion ,Hint} from "./types";
import { Position } from "codemirror";
import CodeMirror = require("codemirror");
const HINT_DESCRIPTION_CLASS = 'Latex-description-span';
const HIGHLIGHT_TEXT_CLASS = 'Latex-highlight-span'
let LatexHints: Hint[]=[
    {
        text:'\\alpha',
        displayText:'\\alpha',
        description:"α",
        inline:false,
    },
    {
        text:'inline',
        displayText:'\\bcd',
        description:"beta",
        inline:true,
    }
]

export default class Autocomplete{
    constructor(private readonly context,private readonly editor: ExtendedEditor & Editor, private readonly cm:typeof CodeMirror){
        this.editor.on('cursorActivity', this.triggerHints.bind(this));
        console.log(editor);
        console.log(CodeMirror);
        
        this.editor.setOption("extraKeys",{
            'Ctrl-Space':()=> {
                this.triggerHints(true)
            }
        });
        // this.triggerHints.bind(this)})//TODO add ctrl-space trigger
    }    
    // private isActive:boolean;
    private readonly doc=this.editor.getDoc();
    private symbolRange?: {from:Position, to:Position};
    private cursor:Position;
    private readonly trigger_symbol = '\\';
    private readonly enableinline =true //TODO settings to enable autocomplete when there is chars after the triggersymbol  

    triggerHints(keybind?:boolean){
        this.cursor = this.doc.getCursor();
        const {line:cursorLine,ch:cursorCh}=this.cursor
        /**
         * @param {boolean} charAfter checks of there is something other then space after the cursor. 
        */
        const charAfter:boolean =!/\S/.test(this.doc.getRange(this.cursor,{line:cursorLine, ch:cursorCh+1}))
        char
        if(keybind){
            const lineText=this.editor.getRange({line:cursorLine,ch:0},this.cursor);
            if(/\s/.test(lineText.substring(lineText.lastIndexOf(this.trigger_symbol),cursorCh))
            && this.editor.getRange(this.cursor,{line:cursorLine,ch:cursorCh+1})!==" "){
                this.symbolRange
            }
            this.symbolRange ={from}
            return
            "asd".
        }
        const symbolRange = [{ line: cursorLine, ch: cursorCh - this.trigger_symbol.length }, this.cursor] as const;
        const chars = this.doc.getRange(...symbolRange);
        const cmMode = this.editor.getModeAt(this.cursor).name;
        if(chars === this.trigger_symbol
            &&(!/\S/.test(this.doc.getRange(this.cursor,{line:cursorLine, ch:cursorCh+1}))|| this.enableinline) 
            && (cmMode==="stex"/*TODO*add settings option to enable outside latex block*/)
            ){
            this.symbolRange={from:symbolRange[0],to:symbolRange[1]}
            //second statment is to check that there is no char other then space after the cursor pos  
        }
    }
    private startCompletion(){
        this.editor.showHint({
            closeCharacters:/\s/,
            closeOnUnfocus:false,//TODO set to ture once built 
            completeSingle:false,
            hint:this.getCompletion.bind(this),
            alignWithWord:false,//TODO add settings option for align
        });

    }
    private async getCompletion()  : Promise<Completion | undefined> {
        const {line, ch} = this.symbolRange.to; // the pos where trigger symbol ends
        if(this.cursor.line < line || this.cursor.ch < ch){
            return;// return if the cursor is before the trigger symbol
        }
        const keyword = this.doc.getRange({line,ch},this.cursor);// the chars after the triggersymbol of the completion
        const {from: completionFrom} = this.symbolRange;
        const CompletionTo = {line, ch:ch + keyword.length};
        const completion: Completion ={
            from:completionFrom,
            to: CompletionTo,
            list:this.getHints(
                keyword,
                this.doc.getRange({line:this.cursor.line, ch:0},{line:this.cursor.line, ch:this.cursor.ch-1}) //FIXME check if it fits the code
            ),
        };
        //TODO CodeMirror.on(completion,"select",(a?)=>{console.log(a);})
        return completion;
    }
    private getHints(keyword:string, indent:string): Hint[]{
        let completions:Hint[];
        let includes = [];
        let startwith=[];
        let history= [
            {
                text:'history',
                displayText:'\\his',
                description:"history",
                inline:true,
            }
        ];        
        if(keyword.length!==0){
            for(let hint of LatexHints){
                if(hint.displayText.startsWith(this.trigger_symbol+keyword))startwith.push(hint)
                else if(hint.displayText.includes(keyword))includes.push(hint)            
            }
            includes.sort((a,b)=>a<b?-1:1)
            startwith.sort((a,b)=>a<b?-1:1)
            completions =startwith.concat(includes);
        }
        else{
            //TODO add history management and storage, also add all of the rest after history
            history.sort((a,b)=>a<b?-1:1)
            completions= history
        }
        return completions.map(hint => {
            let displayText = hint.displayText
            let i = displayText.search(keyword);
            let renderText = (i===-1||keyword.length===0)?displayText://i is -1 when no match is found and 
            `${displayText.substring(0,i)}<span class="${HIGHLIGHT_TEXT_CLASS}">${displayText.substring(i,i+keyword.length)}</span>${displayText.substring(i+keyword.length,displayText.length)}`;
            return{
                text: (hint.inline)?hint.text:`\n${hint.text}\n`,
                displayText:displayText,
                inline:hint.inline,
                render(container) {
                    container.innerHTML =renderText+`<span class="${HINT_DESCRIPTION_CLASS}">${hint.description}</span>`;
                }
            }
        });
    }
}
