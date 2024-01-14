// this file is for joplin 2.13 and below and codemirror 5
import {  Editor } from "codemirror";
import { ExtendedEditor } from "./types";
import Autocomplete from "./classes";
import CodeMirror = require("codemirror");

module.exports = {
	default: function(context) {
		// async function get_settings(): Promise<EnhancementConfig> {
        //     return await ref.postMessage({
        //         type: ContextMsgType.GET_SETTINGS
        //     });
        // }

		return { 
			plugin: function(codemirror){	
				codemirror.defineOption("enableLatex",false, async function(cm, val ,old){
                    // when the editor is initialized the function will be called and val will be true
					if(val){
                        new Autocomplete(context, cm as ExtendedEditor & Editor, CodeMirror);
					}
				});
				// check if the settings loaded currectly if not use function from line 36 https://github.com/SeptemberHX/joplin-plugin-enhancement/blob/master/src/driver/codemirror/index.ts
			},
			codeMirrorResources: ['addon/hint/show-hint'],
			codeMirrorOptions: {'lineNumbers': true,firstLineNumber:0,enableLatex:true},
			assets: function() {
				return [
					{
						name:'./autocomplete.css'
					}
				];
			},
		}
	},
}