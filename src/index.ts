import joplin from 'api';
import { ContentScriptType, MenuItemLocation } from 'api/types';

joplin.plugins.register({
	onStart: async function() {
		const note = await joplin.workspace.selectedNote();
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
