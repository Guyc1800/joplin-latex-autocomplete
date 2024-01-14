import joplin from 'api';
import {ContentScriptType, MenuItemLocation} from 'api/types';
import {latexDictionaryObject, settings} from "./settings";
import {ContextMsg, ContextMsgType} from "./common";
import getConfig = settings.getConfig;
import getDictionary = settings.getDictionary;

joplin.plugins.register({
	onStart: async function() {
		await settings.register();
		await settings.registerMenu();
		await joplin.contentScripts.onMessage(
			"latexAutocomplete",
			async (msg:ContextMsg)=>{
				if (msg.type===ContextMsgType.GET_CONFIG){
					return await getConfig();
				} else if (msg.type===ContextMsgType.GET_DICTIONARY){
					return latexDictionaryObject;
				}
			}
		)
		await joplin.views.menuItems.create("abc", "test", MenuItemLocation.Tools)
		await joplin.contentScripts.register(
			ContentScriptType.CodeMirrorPlugin,
			"latexAutocomplete",
			"./codemirror/autocompletion.js"
		);
	},
});
