// import { buildConfigFromPackageJson } from './packageJson'
import * as vscode from 'vscode'
import { Button } from './types'
import * as path from 'path'

const registerCommand = vscode.commands.registerCommand

const disposables: vscode.Disposable[] = []

const init = async (context: vscode.ExtensionContext) => {
	disposables.forEach(d => d.dispose())
	const cmds = [
		{
			"name": "Run Cell",
			"color": "#000000",
			"command": "cellery run madusha/tooling:0.1.0", // This is executed in the terminal.
		},
		{
			"name": "Build Cell",
			"color": "#000000",
			"command": "cellery build ${file} madusha/tooling:0.1.0",
		}
	]
	const commands = []
	commands.push(...cmds)

	console.log({commands})

	const terminals: { [name: string]: vscode.Terminal } = {}
	commands.forEach(
		({ command, name, color }: Button) => {
			const vsCommand = `extension.${name.replace(' ', '')}`

			const disposable = registerCommand(vsCommand, async () => {
				const vars = {
					file: (vscode.window.activeTextEditor) ? vscode.window.activeTextEditor.document.fileName : null,					
					cwd: vscode.workspace.rootPath ||  require('os').homedir()
				}

				const assocTerminal = terminals[vsCommand]
				if (!assocTerminal) {
					const terminal = vscode.window.createTerminal({ name, cwd: vars.cwd });
					terminal.show(true)
					terminals[vsCommand] = terminal
					terminal.sendText(interpolateString(command, vars))
				} else {
					delete terminals[vsCommand]
					assocTerminal.dispose()
					const terminal = vscode.window.createTerminal({ name, cwd: vars.cwd });
					terminal.show(true)
					terminal.sendText(interpolateString(command, vars))
					terminals[vsCommand] = terminal
				}
			})

			context.subscriptions.push(disposable)

			disposables.push(disposable)

			loadButton({
				vsCommand,
				command,
				name,
				color: color,
			})
		}
	)
}

function loadButton({ command, name, color, vsCommand }: Button) {
	const button = vscode.window.createStatusBarItem()
	button.text = name
	button.color = color
	button.tooltip = command
	button.command = vsCommand
	button.show()
	disposables.push(button)
}

function interpolateString(tpl: string, data: object): string {
	let re = /\$\{([^\}]+)\}/g, match;
	while (match = re.exec(tpl)) {
		let path = match[1].split('.').reverse();
		// let pathv = path.pop();
		let obj = (data as any)[path.pop()!];
		// if (pathv !== undefined) {
			// let obj = (data as any)[pathv];
			while (path.length) obj = obj[path.pop()!];
			tpl = tpl.replace(match[0], obj)
		// }		

	}
	return tpl;
}

export default init
