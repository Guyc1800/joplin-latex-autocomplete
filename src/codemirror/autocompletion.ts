// this file is for joplin 2.13 anxd below and codemirror 5
								// import ContextMsgType from "abc"
/*
find where to activate autocomplete(latex area)--
1. to find if inside a latex box aka ($$ here$$) where each one on seperate lines 
need to make a list of all the "pre.CodeMirror-line span.cm-katex-marker-open" and for each find the range of line up 
to the nearest closeing element which is "pre.CodeMirror-line span.cm-katex-marker-close" we make a list 
of all the lines within those areas and check if the currsor in one of these lines and only then enable the autocomplete
2. to do it for inline latex we just check if the two elements open and close are on the same line, if true we enable for that line 

events CM check out https://codemirror.net/5/doc/manual.html#events


cm.setOption(option: string, value: any) // command to change config
cm.getViewport() => line range. search only within those lines where to autocomplete???
*/


import joplin from "api"
import { Position, Editor } from "codemirror";
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
			plugin: function(cm){		
                console.log(cm);
                
				cm.defineOption("enableLatex",false, async function(cm, val ,old){
                    // when the editor is initialized the function will be called and val will be true
					if(val){
						// async function backoff(timeout:number){
						// 	const settings = await get_settings();
						// }
                        new Autocomplete(context, cm as ExtendedEditor & Editor, CodeMirror);
					}
				});
				// check if the settings loaded currectly if not use function from line 36 https://github.com/SeptemberHX/joplin-plugin-enhancement/blob/master/src/driver/codemirror/index.ts
			},
			codeMirrorResources: ['addon/hint/show-hint'],
			codeMirrorOptions: {'lineNumbers': true,firstLineNumber:0,enableLatex:true},
			assets: function() { // for css files and such
				return [

				];
			},
		}
	},
}

//check out foldcode.js https://codemirror.net/5/addon/fold/foldcode.js and overlay.js for latex highlighting

