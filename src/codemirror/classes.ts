import { Editor } from "codemirror";
import { ExtendedEditor,Completion ,Hint} from "./types";
import { Position } from "codemirror";
import CodeMirror = require("codemirror");
import {ContextMsgType, HIGHLIGHT_TEXT_CLASS, HINT_DESCRIPTION_CLASS, LatexConfig} from "../common";
const fs = require("fs");
export default class Autocomplete{
     constructor(private readonly context,private readonly editor: ExtendedEditor & Editor, private readonly cm:typeof CodeMirror){
        this.editor.on('cursorActivity', ()=>{
            this.triggerHints.bind(this);
            this.triggerHints(false);
        }
       );
        this.getConfig()
        this.getLatexDict();
        console.log(editor);
        console.log(CodeMirror);
        this.editor.setOption("extraKeys",{
            'Ctrl-Space':()=> {
                this.triggerHints.bind(this);
                this.triggerHints(true)
            },
            'F5':()=>{
                this.getConfig.bind(this);
                this.getLatexDict.bind(this);
                this.getConfig();
                this.getLatexDict();
            }
        });
    }
    private settings:LatexConfig;
    private readonly doc=this.editor.getDoc();
    private symbolRange?: {from:Position, to:Position};
    private cursor:Position;
    private readonly TRIGGER_SYMBOL = '\\';
    private dictionary:{dict:Hint[],history:string[]};
    private async getConfig(){
        this.settings = await this.context.postMessage({type:ContextMsgType.GET_CONFIG});
    }
    private async getLatexDict(){
        this.dictionary=await this.context.postMessage({type:ContextMsgType.GET_DICTIONARY});
    }
    private async updateHistory(newHistory:string[]){
        let content;
        if(!fs.existsSync(this.settings.dictionaryPath)){
            return
        }
        try{
            content = JSON.parse(fs.readFileSync(this.settings.dictionaryPath,"utf-8"))
        }catch (err){
            console.log(err)
        }
        if(typeof content.history==="object"&&typeof content.dict==="object") {
            content.history=newHistory;
            fs.writeFileSync(this.settings.dictionaryPath,JSON.stringify(content));
        }
    }
    /** this function handle triggers from editor and keyboard then decide if to activate autocomplete
     *  @param keybind flag to indicate if the action came from keybind(ctrl-space) or cursor activity */
    triggerHints(keybind?:boolean){
        this.cursor = this.doc.getCursor();
        const {line:cursorLine,ch:cursorCh}=this.cursor
        /** @param {boolean} charAfter checks of there is something other than space after the cursor.(true for space, false for letter) */
        let charAfter =!/\S/.test(this.doc.getRange(this.cursor,{line:cursorLine, ch:cursorCh+1}))
        charAfter = this.settings.latexInline || charAfter
        const cmMode = this.editor.getModeAt(this.cursor).name;
        if(!charAfter|| !(cmMode==="stex"|| this.settings.outsideOfSetx)){
            return
        }
        if(keybind){
            const lineText=this.editor.getRange({line:cursorLine,ch:0},this.cursor);
            if(!lineText.includes(this.TRIGGER_SYMBOL)){//in case there is no trigger symbol
                this.symbolRange={from:this.cursor, to:{line:cursorLine,ch:cursorCh+1}}
            }
            else{
                const triggerToCursor= lineText.substring(lineText.lastIndexOf(this.TRIGGER_SYMBOL))// substring between cursor and trigger
                if(/\s/.test(triggerToCursor) || triggerToCursor.length===0){// checks for space between the cursor and the trigger symbol and the length
                    return
                }
                this.symbolRange ={from:{line:cursorLine,ch:lineText.lastIndexOf(this.TRIGGER_SYMBOL)},to:{line:cursorLine,ch:lineText.lastIndexOf(this.TRIGGER_SYMBOL)+1}}
            }
        }
        else{//in case completion from trigger symbol
            const symbolRange = [{ line: cursorLine, ch: cursorCh - this.TRIGGER_SYMBOL.length }, this.cursor] as const;
            const chars = this.doc.getRange(...symbolRange);
            if(chars !== this.TRIGGER_SYMBOL){
                return
            }
            this.symbolRange={from:symbolRange[0],to:symbolRange[1]}
        }
        this.startCompletion()
    }
    private startCompletion(){
        this.editor.showHint({
            closeCharacters:/\s/,
            closeOnUnfocus:false,//TODO set to ture once built 
            completeSingle:false,
            hint:this.getCompletion.bind(this),
            alignWithWord:this.settings.alignWithWord,
        });
    }
    private async getCompletion()  : Promise<Completion | undefined> {
        const {line, ch} = this.symbolRange.to; // the pos where trigger symbol ends
        // if(this.cursor.line < line || this.cursor.ch < ch){
        //     return;// return if the cursor is before the trigger symbol
        // }
        const keyword = this.doc.getRange({line,ch},this.cursor);// the chars after the triggerSymbol of the completion
        const {from: completionFrom} = this.symbolRange;
        const CompletionTo = {line, ch:ch + keyword.length};
        const completion: Completion ={
            from:completionFrom,
            to: CompletionTo,
            list:this.getHints(keyword)
        };
        // CodeMirror.on(completion,"pick",(pick?)=>{
        //     let newHis = this.dictionary.history.filter((v)=>v!==pick.text);
        //     this.dictionary.history=[pick.text].concat(newHis);
        //
        // });
        return completion;
    }
    private getHints(keyword:string): Hint[]{
        let completions:Hint[];
        let includes = [];
        let startWith=[];
        let history= [];
        for(let hint of this.dictionary.dict){
            if(hint.displayText.startsWith(this.TRIGGER_SYMBOL+keyword))startWith.push(hint)
            else if(hint.displayText.includes(keyword))includes.push(hint)
        }
        includes.sort((a,b)=>a<b?-1:1)
        startWith.sort((a,b)=>a<b?-1:1)
        completions =startWith.concat(includes);
        // if(keyword.length===0){
        //     completions.filter((val)=>{
        //         if (this.dictionary.history.includes(val.text)){
        //             history.push(val);
        //             return false
        //         }
        //         return true
        //     });
        //     history.sort((a,b)=>a<b?-1:1)
        //     completions= history.concat(completions);
        // }
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
