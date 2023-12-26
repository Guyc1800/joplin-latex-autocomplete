import joplin from 'api';
import { ContentScriptType, MenuItemLocation, SettingItemType } from 'api/types';
joplin.plugins.register({
	onStart: async function() {
		console.log(joplin)
		console.log(SettingItemType);
		
		//TODO add check version before 2.14 await joplin.versionInfo()
		const section= "Latex"
		await joplin.settings.registerSection(section,{label:"auto complete",})
		const settings = {
			arr:{
				value:[],
				public:true,
				section:section,
				type:SettingItemType.Array,
				label:"array"
			},
			obj:{
				value:{},
				public:true,
				section:section,
				type:SettingItemType.Object,
				label:"obj"
			},
			check:{
				value:true,
				public:true,
				section:section,
				type:SettingItemType.Bool,
				label:"checkbox"
			}
		}
		await joplin.settings.registerSettings(settings)
		
		joplin.contentScripts.register(
			ContentScriptType.CodeMirrorPlugin,
			"latexAutocomplete",
			"./codemirror/autocompletion.js"
		);
		await joplin.commands.register({
			name: 'printSomething',
			label: 'Print some random string',
			execute: async () => {
				await joplin.commands.execute('editor.execCommand', {
					name: 'printSomething',
					args: ['Anything']
				});
			},
		});
		await joplin.views.menuItems.create('printSomethingButton', 'printSomething', MenuItemLocation.Tools, { accelerator: 'Ctrl+Alt+Shift+U' });
	},
});
