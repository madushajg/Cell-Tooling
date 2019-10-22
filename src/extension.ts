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

import * as vscode from "vscode";
import init from './init'

// export function activate({ subscriptions }: vscode.ExtensionContext) {
// 	const myCommandId = 'sample.celleryBuild';
// 	let buildButton: vscode.StatusBarItem;
// 	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
// 		vscode.window.showInformationMessage(`Build your Cell`);
// 	}));

// 	// create a new status bar item that we can now manage
// 	buildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 50);
// 	buildButton.command = myCommandId;
// 	subscriptions.push(buildButton);
	

// 	// update status bar item once at start
//     buildButton.text = `Cellery Build`;
//     buildButton.show();
// }

export function activate(context: vscode.ExtensionContext) {
	init(context)

	let disposable = vscode.commands.registerCommand(
		'extension.celleryButtons',
		() => init(context)
	)

	context.subscriptions.push(disposable)
}


export const deactivate = () => {
    // Do nothing
};
