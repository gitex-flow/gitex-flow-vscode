import { GFlowBranch, GitFlowBranch, ProjectConfig } from 'gitex-flow';
import * as vscode from 'vscode';

/**
 * This class extending a gflow branch with some helpful functionality.
 */
export class GFlowExtBranch extends GFlowBranch {
  /**
   * Initializes a new instance of this class.
   *
   * @param gitFlowBranch - Git flow branch to be wrapped.
   * @param options - Git flow node project options.
   */
  constructor(gitFlowBranch: GitFlowBranch, options?: ProjectConfig) {
    super(gitFlowBranch, options);
  }

  /**
   * Creates and starts a new branch of the type '[[type]]'.
   *
   * @param exampleName - An branch example name.
   */
  public async start(exampleName?: string): Promise<string> {
    let branchName = await vscode.window.showInputBox({
      prompt: `Name of ${this.type}` + (exampleName ? ` (ex. ${exampleName})` : ''),
      value: await this.generateBranchName(),
    });
    if (branchName) {
      try {
        branchName = await super.start(branchName);
        vscode.window.showInformationMessage(`Created ${this.type} branch "${branchName}"`);
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to create ${this.type} branch. ${error}`);
      }
    }
    return branchName ?? '';
  }

  /**
   * Merges and finishes the branch of the branch type '[[type]]'.
   */
  public async finish(): Promise<void> {
    try {
      const branches = await this.list();
      let branchName: string | undefined = undefined;
      if (branches.length === 0) {
        throw new Error(`There is no ${this.type} branch to finish`);
      } else if (branches.length === 1) {
        branchName = branches[0];
      } else {
        branchName = await vscode.window.showQuickPick(branches, {
          placeHolder: `Name of ${this.type} branch to finish`,
        });
      }
      if (branchName) {
        let confirmation = await vscode.window.showQuickPick(['yes', 'no'], {
          placeHolder: `Do you really like to finish ${this.type} branch ${branchName}`,
        });
        if (confirmation === 'yes') {
          await super.finish(branchName);
          if (branchName) {
            vscode.window.showInformationMessage(`Merged ${this.type} branch "${branchName}"`);
          } else {
            vscode.window.showInformationMessage(`Merged current ${this.type} branch`);
          }
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to merge ${this.type} branch. ${error}`);
    }
  }
}
