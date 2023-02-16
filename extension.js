// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = uprequire("vscode");
const git = vscode.git;
const { exec } = require("child_process");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(
		'Congratulations, your extension "git-reminder-plus" is now active!'
	);

	console.log("VS Code opened");

	setTimeout(() => {
		checkForRemoteChanges();
	}, 1000);
	// checkForRemoteChanges();
}

async function checkForRemoteChanges() {
	try {
		const git = await vscode.extensions.getExtension("vscode.git").exports;

		const repos = await git.getRepositories();

		if (!repos || repos.length === 0) {
			return;
		}

		const repo = repos[0];

		await repo.fetch();
		const state = await repo.state;

		const branch = state.HEAD;
		if (!branch || !branch.upstream) {
			return;
		}

		// if (branch.behind) {
		// 	// There are incoming changes, do something...

		// 	vscode.window
		// 		.showInformationMessage(
		// 			"There are new changes available in the remote repository. Would you like to pull them?",
		// 			"Pull",
		// 			"Cancel"
		// 		)
		// 		.then((selectedOption) => {
		// 			if (selectedOption === "Pull") {
		// 				exec("git pull", (error, stdout, stderr) => {
		// 					if (error) {
		// 						console.error(`exec error: ${error}`);
		// 						return;
		// 					}

		// 					vscode.window.showInformationMessage(
		// 						"Changes pulled successfully"
		// 					);
		// 				});
		// 			}
		// 		});
		// }

		if (branch.behind) {
			vscode.window
				.showInformationMessage(
					"There are new changes available in the remote repository. Would you like to pull them?",
					"Pull",
					"Cancel"
				)
				.then((selectedOption) => {
					if (selectedOption === "Pull") {
						repo.pull().then(
							() => {
								vscode.window.showInformationMessage(
									"Changes pulled successfully"
								);
							},
							(error) => {
								vscode.window.showErrorMessage(error);
							}
						);
					}
				});
		}

		// console.log(repos);
	} catch (error) {
		console.error(error);
	}
}
// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
