import * as vscode from 'vscode';
import {exec} from 'child_process';

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

    let disposablePdf = vscode.commands.registerCommand('extension.convertMarkdownToPdf', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const filePath = editor.document.uri.fsPath;
            if (filePath.endsWith('.md')) {
                convertMarkdownToPdf(filePath);
            } else {
                vscode.window.showErrorMessage('The current file is not a Markdown file');
            }
        } else {
            vscode.window.showErrorMessage('No active editor found');
        }
    });

    context.subscriptions.push(disposablePdf);

    context.subscriptions.push(disposableMd);

    context.subscriptions.push(disposableDocx);
}

function convertMarkdownToPdf(filePath: string) {
    const pdfPath = filePath.replace('.md', '.pdf');
    const command = `pandoc "${filePath}" --pdf-engine=xelatex -o "${pdfPath}"`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage('Failed to convert notebook to Markdown: ' + stderr);
        } else {
            vscode.window.showInformationMessage('Successfully converted Markdown to PDF');
        }
    });
}

function convertToMarkdown(filePath: string) {
    const command = `jupyter nbconvert --to markdown ${filePath}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage('Failed to convert notebook to Markdown: ' + stderr);
        } else {
            vscode.window.showInformationMessage('Successfully converted notebook to Markdown');
        }
    });
}

function convertToDocx(filePath: string) {
    const command = `pandoc ${filePath.replace('.ipynb', '.md')} -o ${filePath.replace('.ipynb', '.docx')}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage('Failed to convert notebook to Docx: ' + stderr);
        } else {
            vscode.window.showInformationMessage('Successfully converted notebook to Docx');
        }
    });
}

export function deactivate() {}