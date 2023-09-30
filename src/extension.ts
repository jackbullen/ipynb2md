import * as vscode from 'vscode';
import * as cp from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    let disposableMd = vscode.commands.registerCommand('extension.convertNotebook', () => {
        const editor = vscode.window.activeNotebookEditor;
        if (editor) {
            const filePath = editor.notebook.uri.fsPath;
            if (filePath.endsWith('.ipynb')) {
                convertToMarkdown(filePath);
            } else {
                vscode.window.showErrorMessage('The current file is not a Jupyter Notebook');
            }
        } else {
            vscode.window.showErrorMessage('No active editor found');
        }
    });

    let disposableDocx = vscode.commands.registerCommand('extension.convertNotebookDocx', () => {
        const editor = vscode.window.activeNotebookEditor;
        if (editor) {
            const filePath = editor.notebook.uri.fsPath;
            if (filePath.endsWith('.ipynb')) {
                convertToDocx(filePath);
            } else {
                vscode.window.showErrorMessage('The current file is not a Jupyter Notebook');
            }
        } else {
            vscode.window.showErrorMessage('No active editor found');
        }
    });

    context.subscriptions.push(disposableMd);

    context.subscriptions.push(disposableDocx);
}

function convertToMarkdown(filePath: string) {
    const command = `jupyter nbconvert --to markdown ${filePath}`;
    cp.exec(command, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage('Failed to convert notebook to Markdown: ' + stderr);
        } else {
            vscode.window.showInformationMessage('Successfully converted notebook to Markdown');
        }
    });
}

function convertToDocx(filePath: string) {
    const command = `pandoc ${filePath.replace('.ipynb', '.md')} -o ${filePath.replace('.ipynb', '.docx')}`;
    cp.exec(command, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage('Failed to convert notebook to Docx: ' + stderr);
        } else {
            vscode.window.showInformationMessage('Successfully converted notebook to Docx');
        }
    });
}

export function deactivate() {}
