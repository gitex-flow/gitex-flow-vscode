import * as vscode from 'vscode';
import { GitexFlowTreeProvider } from './gitexTreeView';
import { GFlowExtension } from './gflowext/GFlowExtension';
import { GFlow } from 'gitex-flow';

/**
 * This method is called when your extension is activated.
 * Your extension is activated the very first time the command is executed.
 *
 * @param context - The context of the extension.
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  vscode.window.registerTreeDataProvider('gitexFlowActionsTreeView', new GitexFlowTreeProvider());

  const initDisposable = vscode.commands.registerCommand('gitex-flow.init', async function () {
    const extension = await createGFlow();
    await extension.init();
  });

  const featureStartDisposable = vscode.commands.registerCommand('gitex-flow.feature.start', async function () {
    const extension = await createGFlow();
    await extension.feature.start('#<issue>');
  });
  const featureFinishDisposable = vscode.commands.registerCommand('gitex-flow.feature.finish', async function () {
    const extension = await createGFlow();
    await extension.feature.finish();
  });

  const bugfixStartDisposable = vscode.commands.registerCommand('gitex-flow.bugfix.start', async function () {
    const extension = await createGFlow();
    await extension.bugfix.start('#<issue>');
  });
  const bugfixFinishDisposable = vscode.commands.registerCommand('gitex-flow.bugfix.finish', async function () {
    const extension = await createGFlow();
    await extension.bugfix.finish();
  });

  const releaseStartDisposable = vscode.commands.registerCommand('gitex-flow.release.start', async function () {
    const extension = await createGFlow();
    await extension.release.start();
  });
  const releaseFinishDisposable = vscode.commands.registerCommand('gitex-flow.release.finish', async function () {
    const extension = await createGFlow();
    await extension.release.finish();
  });

  const prereleaseStartDisposable = vscode.commands.registerCommand('gitex-flow.prerelease.start', async function () {
    const extension = await createGFlow();

    const featureBranches = await extension.feature.list();
    const bugfixBranches = await extension.bugfix.list();
    const releaseBranches = await extension.release.list();
    const hotfixBranches = await extension.hotfix.list();
    const config = await extension.config.get();
    const alphaBranches = [...featureBranches, ...bugfixBranches, config.developBranch ?? 'develop'];
    const betaBranches = [...releaseBranches, ...hotfixBranches];

    const availablePrereleases = ['alpha'];
    if (betaBranches.length !== 0) {
      availablePrereleases.push('beta');
    }

    let prereleaseType: string | undefined = availablePrereleases[0];
    if (availablePrereleases.length > 1) {
      prereleaseType = await vscode.window.showQuickPick(availablePrereleases, {
        placeHolder: `Prerelease type`,
      });
    }

    if (prereleaseType === 'alpha') {
      const branchName = await vscode.window.showQuickPick(alphaBranches, {
        placeHolder: `Base branch for alpha release`,
      });
      if (branchName) {
        await extension.alpha.start(branchName);
      }
    } else if (prereleaseType === 'beta') {
      const branchName = await vscode.window.showQuickPick(betaBranches, {
        placeHolder: `Base branch for beta release`,
      });
      if (branchName) {
        await extension.beta.start(branchName);
      }
    }
  });
  const hotfixStartDisposable = vscode.commands.registerCommand('gitex-flow.hotfix.start', async function () {
    const extension = await createGFlow();
    await extension.hotfix.start();
  });
  const hotfixFinishDisposable = vscode.commands.registerCommand('gitex-flow.hotfix.finish', async function () {
    const extension = await createGFlow();
    await extension.hotfix.finish();
  });

  const supportStartDisposable = vscode.commands.registerCommand('gitex-flow.support.start', async function () {
    const extension = await createGFlow();
    await extension.support.start('2.0.0-lts');
  });
  const supportStopDisposable = vscode.commands.registerCommand('gitex-flow.support.finish', async function () {
    const extension = await createGFlow();
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
    prereleaseStartDisposable,
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

/**
 * Creates GFlow instance.
 *
 * @returns A promise on the GFlow instance.
 */
async function createGFlow(): Promise<GFlow> {
  const workspaceFolder = await getWorkspaceFolder();
  return GFlowExtension.create(workspaceFolder.uri.fsPath);
}

/**
 * Gets the workspace path.
 */
async function getWorkspaceFolder(): Promise<vscode.WorkspaceFolder> {
  let workspaceFolder: vscode.WorkspaceFolder | undefined;
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length === 1) {
    workspaceFolder = vscode.workspace.workspaceFolders[0];
  } else {
    workspaceFolder = await vscode.window.showWorkspaceFolderPick();
  }
  if (!workspaceFolder) {
    throw new Error('No workspace folder was set.');
  }
  return workspaceFolder;
}
