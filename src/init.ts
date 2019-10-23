/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as vscode from 'vscode'
import { Button } from './types'

const registerCommand = vscode.commands.registerCommand

const disposables: vscode.Disposable[] = []

const init = async (context: vscode.ExtensionContext) => {
	disposables.forEach(d => d.dispose())
	const commands = [
		{
			"name": "Run Cell",
			"color": "#ffffff",
			"command": "cellery run madusha/tooling:0.1.0",
		},
		{
			"name": "Build Cell",
			"color": "#ffffff",
			"command": "cellery build ${file} madusha/tooling:0.1.0",
		}
	]

	console.log({commands})

	const terminals: { [name: string]: vscode.Terminal } = {}
	commands.forEach(
		({ command, name, color }: Button) => {
			const vsCommand = `extension.${name.replace(' ', '')}`

			const disposable = registerCommand(vsCommand, async () => {
				const vars = {
					file: vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.fileName : null,					
					cwd: vscode.workspace.rootPath ||  require('os').homedir()
				}
				if (vars.file !== null) {
					const assocTerminal = terminals[vsCommand]
					if (!assocTerminal) {
						const terminal = vscode.window.createTerminal({ name, cwd: vars.cwd });
						terminal.show(true)
						terminals[vsCommand] = terminal
						terminal.sendText(interpolateString(command, vars.file))
					} else {
						delete terminals[vsCommand]
						assocTerminal.dispose()
						const terminal = vscode.window.createTerminal({ name, cwd: vars.cwd });
						terminal.show(true)
						terminal.sendText(interpolateString(command, vars.file))
						terminals[vsCommand] = terminal
					}
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

function interpolateString(tpl: string, file: string): string {
	tpl = tpl.replace('${file}', file);
	return tpl;
}

export default init
