import { GitFlowTag, GitFlowTagType, ProjectConfig } from 'gitex-flow';
import * as vscode from 'vscode';

/**
 * This class extending a gflow tag with some helpful functionality.
 */
export class GFlowExtTag implements GitFlowTag {
  private gitFlowTag: GitFlowTag;

  /**
   * {@inheritDoc}
   */
  public get type(): GitFlowTagType {
    return this.gitFlowTag.type;
  }

  /**
   * Initializes a new instance of this class.
   *
   * @param gitFlowTag - Git flow tag to be wrapped.
   */
  constructor(gitFlowTag: GitFlowTag) {
    this.gitFlowTag = gitFlowTag;
  }

  /**
   * {@inheritDoc}
   */
  public list(withPrefix?: boolean | undefined): Promise<string[]> {
    return this.gitFlowTag.list(withPrefix);
  }

  /**
   * {@inheritDoc}
   */
  public async start(branchName?: string): Promise<string> {
    let tagName = '';
    try {
      tagName = await this.gitFlowTag.start(branchName);
      vscode.window.showInformationMessage(`Created ${this.type} tag "${tagName}" on branch "${branchName}"`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to create ${this.type} tag on branch "${branchName}". ${error}`);
    }
    return tagName;
  }

  /**
   * {@inheritDoc}
   */
  public generateTagName(): Promise<string | undefined> {
    return this.gitFlowTag.generateTagName();
  }
}
