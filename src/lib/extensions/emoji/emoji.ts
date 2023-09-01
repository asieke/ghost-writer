// const slashExtension = Extension.create({
// 	name: 'slash',

// 	addOptions() {
// 		return {
// 			suggestion: {
// 				char: '/',
// 				pluginKey: new PluginKey('slash'),
// 				command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
// 					props.command({ editor, range });
// 				}
// 			}
// 		};
// 	},

// 	addProseMirrorPlugins() {
// 		return [
// 			Suggestion({
// 				editor: this.editor,
// 				...this.options.suggestion
// 			})
// 		];
// 	}
// });
