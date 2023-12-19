import { Editor } from "codemirror";
import { ExtendedEditor } from "./types";
import { Position } from "codemirror";
import CodeMirror = require("codemirror");

export default class Autocomplete{
    constructor(private readonly context,private readonly editor: ExtendedEditor & Editor, private readonly cm:typeof CodeMirror){
        this.editor.on('cursorActivity', this.triggerHints.bind(this));
        setTimeout(()=>this.init(),1000)
    }
    init(){
        console.log(this.editor);
        
    }
    private readonly doc=this.editor.getDoc();
    private symbolRange?: {from:Position, to:Position};
    private
    triggerHints(){
        const pos = this.doc.getCursor();
        console.log(pogs);
        
    }
}