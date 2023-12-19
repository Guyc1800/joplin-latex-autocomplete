import joplin from 'api';
import { ContentScriptType, MenuItemLocation } from 'api/types';

// const note_updater=async (data)=>{
// 	async function updatenote() {
// 		await joplin.commands.execute('editor.execCommand',{
// 			name:'showHint',
// 			args:["abc","google"]
// 		});

// 		// Get the current note from the workspace.
// 		data.note = await joplin.workspace.selectedNote();
// 		// Keep in mind that it can be `null` if nothing is currently selected!
// 		if (data.note) {
// 			console.info('Note content has changed! New note is:', data.note);
// 		} else {
// 			console.info('No note is selected');
// 		}
// 	}
// 	 await joplin.workspace.onNoteChange(() => {
// 		updatenote();
// 	});
// 	// This event will be triggered when the user selects a different note
// 	await joplin.workspace.onNoteSelectionChange(() => {
// 		updatenote();
// 	});
// 	updatenote();

// };
joplin.plugins.register({
	onStart: async function() {
		const note = await joplin.workspace.selectedNote();
		joplin.contentScripts.register(
			ContentScriptType.CodeMirrorPlugin,
			"latexAutocomplete",
			"./codemirror/autoCompleteLatex.js"
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

		// let data = {note:undefined};
		// note_updater(data);
		// await joplin.commands.execute("showNoteContentProperties") 
		// const editor= document.getElementsByClassName("codeMirrorEditor");
	},
});
