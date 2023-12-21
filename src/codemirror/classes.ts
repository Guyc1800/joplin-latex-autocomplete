import { Editor } from "codemirror";
import { ExtendedEditor,Completion } from "./types";
import { Position } from "codemirror";
import CodeMirror = require("codemirror");

export default class Autocomplete{
    constructor(private readonly context,private readonly editor: ExtendedEditor & Editor, private readonly cm:typeof CodeMirror){
        this.editor.on('cursorActivity', this.triggerHints.bind(this));
    }    
    private readonly doc=this.editor.getDoc();
    private symbolRange?: {from:Poisition, to:Position};
    private readonly trigger_symbol = '\\';
    triggerHints(){
        const pos = this.doc.getCursor();
        const symbolRange = [{ line: pos.line, ch:pos.ch-this.trigger_symbol.length},pos] as const;
        const chars = this.doc.getRange(...symbolRange);
        // TODO : check if the cursor is inside latex block 
        if(chars=== this.trigger_symbol && !/\S/.test(this.doc.getRange(pos,{line:pos.line, ch:pos.line+1}))){ 
            //second statment is to check that there is no char other then space after the cursor pos
            this.editor.showHint({
                closeCharacters:/[\s()\[\]{};:>,]/,
                closeOnUnfocus:true,
                completeSingle:false,
                hint:this.getCompletion.bind(this),
            });
        }
    }
    private async getCompletion(): Promise<Completion | undefined> {
        if(!this.symbolRange){
            throw new Error('no symbolRange');
        }
        const {line, ch} = this.symbolRange.to; // the pos where trigger symbol ends
        const cursor = this.doc.getCursor();
        if(cursor.line < line || cursor.ch < ch){
            return;
        }
        const keyword = this.doc.getRange({line,ch},{line: cursor.line, ch:cursor.ch});// the chars after the triggersymbol of the completion
        const {from: completionFrom} = this.symbolRange;
        const CompletionTo = {line, ch: + keyword.length};
        const completion: Completion ={
            from:completionFrom,
            to: CompletionTo,
            list:this.getHints(
                keyword,
                this.doc.getRange
            )

            }

            /

        }
    }
}