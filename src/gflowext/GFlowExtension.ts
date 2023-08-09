import { AvhGitFlow, GFlow, GFlowConfig, GFlowConfigLoader, GitFlow, GitFlowConfig } from 'gitex-flow';
import * as vscode from 'vscode';
import { GFlowExtBranch } from './branches/GFlowExtBranch';
import { GFlowExtTag } from './tags/GFlowExtTag';

/**
 * Main class of the gitex-flow extension for vscode.
 */
export class GFlowExtension extends GFlow {
  /**
   * Creates a new instance of the GFlowExtension.
   *
   * @param projectPath - Path to the vscode project.
   */
  public static async create(projectPath: string): Promise<GFlow> {
    const gitFlow = new AvhGitFlow(projectPath);
    const gFlowConfig = GFlowExtension.loadConfig(projectPath);
    const gFlow = new GFlowExtension(gitFlow, gFlowConfig);
    return gFlow;
  }

  /**
   * Initializes a new instance of this class.
   *
   * @param gitFlow - GitFlow implementation.
   * @param options - Options for configuring the GFlow.
   */
  private constructor(gitFlow: GitFlow, options: GFlowConfig) {
    super(gitFlow, options);
    this.feature = new GFlowExtBranch(this.feature, this.options.projectConfig);
    this.bugfix = new GFlowExtBranch(this.bugfix, this.options.projectConfig);
    this.release = new GFlowExtBranch(this.release, this.options.projectConfig);
    this.hotfix = new GFlowExtBranch(this.hotfix, this.options.projectConfig);
    this.support = new GFlowExtBranch(this.support, this.options.projectConfig);
    this.alpha = new GFlowExtTag(this.alpha);
    this.beta = new GFlowExtTag(this.beta);
  }

  /**
   * Setup a git repository for git flow usage.
   *
   * @param config - The git flow configuration.
   * @param force - Force reinitialisation if git flow already initialized.
   */
  public async init(): Promise<void> {
    const useDefault = await vscode.window.showQuickPick(['yes', 'no'], {
      placeHolder: `Use default git flow config`,
    });
    let config: GitFlowConfig | undefined = undefined;
    if (useDefault === 'no') {
      config = {};
      config.masterBranch = await vscode.window.showInputBox({
        prompt: 'Name of master branch',
        value: 'master',
      });
      config.developBranch = await vscode.window.showInputBox({
        prompt: 'Name of development branch',
        value: 'develop',
      });
      config.featureBranchPrefix = await vscode.window.showInputBox({
        prompt: 'Prefix of feature branches',
        value: 'feature',
      });
      config.bugfixBranchPrefix = await vscode.window.showInputBox({
        prompt: 'Prefix of bugfix branches',
        value: 'bugfix',
      });
      config.releaseBranchPrefix = await vscode.window.showInputBox({
        prompt: 'Prefix of release branches',
        value: 'release',
      });
      config.hotfixBranchPrefix = await vscode.window.showInputBox({
        prompt: 'Prefix of hotfix branches',
        value: 'hotfix',
      });
      config.supportBranchPrefix = await vscode.window.showInputBox({
        prompt: 'Prefix of support branches',
        value: 'support',
      });
    }
    try {
      await super.init(config);
      vscode.window.showInformationMessage(`Successfully initialized.`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed initialize git flow: ${error}`);
      let force = await vscode.window.showQuickPick(['yes', 'no'], {
        placeHolder: `Do you like to force reinitialization?`,
      });
      if (force === 'yes') {
        await super.init(config, true);
        vscode.window.showInformationMessage(`Successfully initialized.`);
      }
    }
  }

  /**
   * Loads the config.
   *
   * @param projectPath - The path of the projekt (workspace).
   */
  private static loadConfig(projectPath: string): GFlowConfig {
    let gFlowConfig = GFlowConfigLoader.load(projectPath);
    if (!gFlowConfig) {
      gFlowConfig = {};
    }
    if (!gFlowConfig.projectConfig) {
      gFlowConfig.projectConfig = {
        projectPath: projectPath,
      };
    } else {
      gFlowConfig.projectConfig.projectPath = projectPath;
    }
    return gFlowConfig;
  }
}
