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
        //TODO add flag that shows if the widget is open or not 
        this.editor.setOption("extraKeys",{
            'Ctrl-Space':()=> {
                this.triggerHints.bind(this);
                this.triggerHints(true)
            }
        });
    }    
    // private isActive:boolean;
    private open:boolean;// flag if the autocomplete is open
    private readonly doc=this.editor.getDoc();
    private symbolRange?: {from:Position, to:Position};
    private cursor:Position;
    private readonly trigger_symbol = '\\';
    private readonly enableinline =true //TODO settings to enable autocomplete when there is chars after the triggersymbol  
    /** this function handle triggers from editor and keyboard then decide if to activate autocomplete  
     *  @param keybind flag to indecate if the action came from keybind(ctrl-space) or cursor activity */
    triggerHints(keybind?:boolean){
        
        this.cursor = this.doc.getCursor();
        const {line:cursorLine,ch:cursorCh}=this.cursor
        /** @param {boolean} charAfter checks of there is something other then space after the cursor.(false for space, true for letter) */
        let charAfter =!/\S/.test(this.doc.getRange(this.cursor,{line:cursorLine, ch:cursorCh+1}))
        charAfter = this.enableinline || !charAfter 
        const cmMode = this.editor.getModeAt(this.cursor).name;
        if(!charAfter|| cmMode!=="setx"){/*TODO*add settings option to enable outside latex block*/
            return 
        }
        if(keybind){
            const lineText=this.editor.getRange({line:cursorLine,ch:0},this.cursor);
            if(!lineText.includes(this.trigger_symbol)){//in case there is no trigger symbol 
                this.symbolRange={from:this.cursor, to:{line:cursorLine,ch:cursorCh+1}}
            }
            else{
                const triggerToCursor= lineText.substring(lineText.lastIndexOf(this.trigger_symbol))// substring between crusor and trigger 
                if(/\s/.test(triggerToCursor) || triggerToCursor.length===0){// checks for space between the cursor and the trigger symbol and the length
                    return
                }
                this.symbolRange ={from:{line:cursorLine,ch:lineText.lastIndexOf(this.trigger_symbol)},to:{line:cursorLine,ch:lineText.lastIndexOf(this.trigger_symbol)+1}}
            }
        }
        else{//incase completion from trigger symbol
            const symbolRange = [{ line: cursorLine, ch: cursorCh - this.trigger_symbol.length }, this.cursor] as const;
            const chars = this.doc.getRange(...symbolRange);
            if(chars !== this.trigger_symbol){
                return
            }
            this.symbolRange={from:symbolRange[0],to:symbolRange[1]}
        }
        console.log("trigger passed");
        this.startCompletion()
    }
    private startCompletion(){
        this.open = true;
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
            this.open=false;
            return;// return if the cursor is before the trigger symbol
        }
        const keyword = this.doc.getRange({line,ch},this.cursor);// the chars after the triggersymbol of the completion
        const {from: completionFrom} = this.symbolRange;
        const CompletionTo = {line, ch:ch + keyword.length};
        const completion: Completion ={
            from:completionFrom,
            to: CompletionTo,
            list:this.getHints(keyword)
        };
        CodeMirror.on(completion,"close",()=>{
            this.open =false;
            console.log("open is false");
            CodeMirror.off(completion,"close",()=>{console.log("removed handler");
            });
        })
        console.log(completion);
        //TODO CodeMirror.on(completion,"select",(a?)=>{console.log(a);})
        return completion;
    }
    private getHints(keyword:string): Hint[]{
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
