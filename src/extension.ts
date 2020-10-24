import * as vscode from 'vscode';
import { GitexFlowTreeProvider } from './gitexTreeView';
import { GFlowExtension } from './gflowext/GFlowExtension';

/**
 * This method is called when your extension is activated.
 * Your extension is activated the very first time the command is executed.
 *
 * @param context - The context of the extension.
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  vscode.window.registerTreeDataProvider('gitexFlowActionsTreeView', new GitexFlowTreeProvider());

  const extension = await GFlowExtension.create();

  const initDisposable = vscode.commands.registerCommand('gitex-flow.init', async () => {
    await extension.init();
  });

  const featureStartDisposable = vscode.commands.registerCommand('gitex-flow.feature.start', async () => {
    await extension.feature.start('#<issue>');
  });
  const featureFinishDisposable = vscode.commands.registerCommand('gitex-flow.feature.finish', async () => {
    await extension.feature.finish();
  });

  const bugfixStartDisposable = vscode.commands.registerCommand('gitex-flow.bugfix.start', async () => {
    await extension.bugfix.start('#<issue>');
  });
  const bugfixFinishDisposable = vscode.commands.registerCommand('gitex-flow.bugfix.finish', async () => {
    await extension.bugfix.finish();
  });

  const releaseStartDisposable = vscode.commands.registerCommand('gitex-flow.release.start', async () => {
    await extension.release.start();
  });
  const releaseFinishDisposable = vscode.commands.registerCommand('gitex-flow.release.finish', async () => {
    await extension.release.finish();
  });

  const hotfixStartDisposable = vscode.commands.registerCommand('gitex-flow.hotfix.start', async () => {
    await extension.hotfix.start();
  });
  const hotfixFinishDisposable = vscode.commands.registerCommand('gitex-flow.hotfix.finish', async () => {
    await extension.hotfix.finish();
  });

  const supportStartDisposable = vscode.commands.registerCommand('gitex-flow.support.start', async () => {
    await extension.support.start('2.0.0-lts');
  });
  const supportStopDisposable = vscode.commands.registerCommand('gitex-flow.support.finish', async () => {
    await extension.support.finish();
  });

  context.subscriptions.push(
    initDisposable,
    featureStartDisposable,
    featureFinishDisposable,
    bugfixStartDisposable,
    bugfixFinishDisposable,
    releaseStartDisposable,
    releaseFinishDisposable,
    hotfixStartDisposable,
    hotfixFinishDisposable,
    supportStartDisposable,
    supportStopDisposable,
  );

  console.log('The gitex-flow extension started successfully!');
}

/**
 * This method is called when your extension is deactivated.
 */
export async function deactivate(): Promise<void> {}
