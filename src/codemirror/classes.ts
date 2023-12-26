import { Editor } from "codemirror";
import { ExtendedEditor,Completion ,Hint} from "./types";
import { Position } from "codemirror";
import CodeMirror = require("codemirror");
const HINT_DESCRIPTION_CLASS = 'Latex-description-span';
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
        this.editor.setOption("extraKeys",{"Ctrl-Space":this.triggerHints.bind(this)})//TODO add ctrl-space trigger
    }    
    // private isActive:boolean;
    private readonly doc=this.editor.getDoc();
    private symbolRange?: {from:Position, to:Position};
    private cursor:Position;
    private readonly trigger_symbol = '\\';
    private readonly enableinline =false //TODO settings to enable autocomplete when there is chars after the triggersymbol  
    triggerHints(show:boolean){
        this.cursor = this.doc.getCursor();
        const {line:cursorLine,ch:cursorCh}=this.cursor
        const symbolRange = [{ line: cursorLine, ch: cursorCh - this.trigger_symbol.length }, this.cursor] as const;
        const chars = this.doc.getRange(...symbolRange);
        const cmMode = this.editor.getModeAt(this.cursor).name;
        console.log(cmMode);
        if(chars === this.trigger_symbol&& (!/\S/.test(this.doc.getRange(this.cursor,{line:cursorLine, ch:cursorCh+1}))|| this.enableinline) && (cmMode==="stex"/*TODO*add settings option to enable outside*/)){ 
            this.symbolRange={from:symbolRange[0],to:symbolRange[1]}
            //second statment is to check that there is no char other then space after the cursor pos  
            this.editor.showHint({
                closeCharacters:/\s/,
                closeOnUnfocus:false,//TODO set to ture once built 
                completeSingle:false,
                hint:this.getCompletion.bind(this),
                alignWithWord:false,//TODO add settings option for align
            });
        }
    }
    private async getCompletion(): Promise<Completion | undefined> {
        const {line, ch} = this.symbolRange.to; // the pos where trigger symbol ends
        if(this.cursor.line < line || this.cursor.ch < ch){
            return;// return if the cursor is before the trigger symbol
        }
        
        const keyword = this.doc.getRange({line,ch},this.cursor);// the chars after the triggersymbol of the completion
        console.log(`keyword:"${keyword}" line,ch:${line},${ch}`);
        
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
        return completion;
    }
    private getHints(keyword:string, indent:string): Hint[]{
        let includes = [];
        let startwith=[];
        let history= [];        
        for(let hint of LatexHints){
            if(hint.displayText.startsWith(this.trigger_symbol+keyword)){
                if(startwith[startwith.length-1]<hint.displayText){startwith.push(hint)}
                else [].co
            }
            else if(hint.displayText.includes(keyword)){
                includes.push(hint)
            }
        }
        startwith.pu
        includes.push({
            text: (hint.inline)?hint.text:`\n${hint.text}\n`,
            displayText:hint.displayText,
            render(container) {
                container.innerHTML =
                    hint.displayText + `<span class="${HINT_DESCRIPTION_CLASS}">${hint.description}</span>`;
            },
        })
        return hints.sort((h1:Hint,h2:Hint)=>{
            
        })
        
    }
    // TODO sort matchs by history if no text after the trigger symbol, if there is sort by first "startwith" ,includes 
}

function alphabeticalOrder(arr) {
    return arr.sort((a, b) => a < b ? -1 : 1)
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