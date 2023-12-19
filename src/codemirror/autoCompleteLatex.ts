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

// export interface Hint {
//     text: string;
//     displayText?: string;
//     className?: string;
//     description?: string;
//     render?: (container: Element, completion: Completion, hint: Hint) => void;
//     // hint?: (cm: typeof CodeMirror, completion: Completion, hint: Hint) => void;
//     inline: boolean;
// }
// interface Completion {
//     from: Position;
//     to: Position;
//     list: Hint[];
//     selectedHint?: number;
// }

// let customHints: Hint[] = [
//     {
//         text: '|     |     |     |\r\n| --- | --- | --- |\r\n|     |     |     |',
//         displayText: '/table',
//         description: 'Markdown table',
//         inline: false
//     }
// ]
import {Completion,CompletionContext, autocompletion, CompletionSource} from "@codemirror/autocomplete"
import {EditorState} from "@codemirror/state"
import joplin from "api"
import {Language,defineLanguageFacet} from "@codemirror/language"
import {basicSetup} from "codemirror"

export enum ContextMsgType {
    GET_SETTINGS,
    OPEN_URL,
    RESOURCE_PATH,
    SHORTCUT
}

module.exports = {
	default: function(ref) {
		console.log(basicSetup);
		// async function get_settings(): Promise<EnhancementConfig> {
        //     return await ref.postMessage({
        //         type: ContextMsgType.GET_SETTINGS
        //     });
        // }

										// async function get_settings(): Promise<EnhancementConfig> {
										//     return await context.postMessage({
										//         type: ContextMsgType.GET_SETTINGS
										//     });
										// }
										// add get settings from joplin plugin settings like at enchentment plugin
		return { 
			plugin: function(CodeMirror){
				// console.log(CodeMirror)
				// const parser 
				// const fac = defineLanguageFacet()
				// const latex = new Language(fac,parser,)
				// // const a = new CompletionContext(CodeMirror)
				// let ls:CompletionSource[]
				// const complete = autocompletion({override:ls, defaultKeymap:true})			
				CodeMirror.addExtension([basicSetup[14]])	
				console.log(CodeMirror);
				
				CodeMirror.defineOption("enableLatex",false, async function(cm, val ,old){
					// if(val){
					// 	async function backoff(timeout:number){
					// 		const settings = await get_settings();
					// 	}
					// }
					
					console.info(cm, val, old);
				});
				CodeMirror.defineExtension('printSomething', function(something) {
					console.log(something);
				});
				
				// check if the settings loaded currectly if not use function from line 36 https://github.com/SeptemberHX/joplin-plugin-enhancement/blob/master/src/driver/codemirror/index.ts
			},
			codeMirrorResources: ['addon/hint/show-hint'],
			// Often addons for codemirror need to be enabled using an option,
			// There is also certain codemirror functionality that can be enabled/disabled using
			// simple options
			codeMirrorOptions: {'lineNumbers': true,firstLineNumber:0,enableLatex:true},
			assets: function() { // for css files and such
				return [

				];
			},
		}
	},
}

//check out foldcode.js https://codemirror.net/5/addon/fold/foldcode.js and overlay.js for latex highlighting



// import {Editor, Position} from "codemirror"
// import CodeMirror from "codemirror"
// //TODO import hints


// export interface Hint{
//     text: string;// what would be print after selection
//     displayText?: string;// what would be showen in the list
//     className?: string;
//     description?: string;// secondery text for the display text
//     render?: (container: Element, completion: Completion, hint: Hint) => void;
//     inline: boolean;
// }

// interface Completion {
//     from: Position;
//     to: Position;
//     list: Hint[];
//     selectedHint?:number;

// }
// export type ExtendedEditor = {
//     showHint(options: {
//         completeSingle:boolean;
//         closeCharacters:RegExp;
//         closeOnUnfocus:boolean;
//         hint: (cm:Editor) => Completion | undefined | Promise<Completion | undefined>;
//     }):void;
// };
// export default