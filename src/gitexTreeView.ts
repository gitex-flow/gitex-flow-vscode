import * as vscode from 'vscode';

export class GitexFlowTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private data: TreeItem[] = [
    new TreeItem('Feature', 'gitex-feature', new vscode.ThemeIcon('rocket')),
    new TreeItem('Bugfix', 'gitex-bugfix', new vscode.ThemeIcon('bug')),
    new TreeItem('Release', 'gitex-release', new vscode.ThemeIcon('package')),
    new TreeItem('Hotfix', 'gitex-hotfix', new vscode.ThemeIcon('flame')),
    new TreeItem('Support', 'gitex-support', new vscode.ThemeIcon('star-empty')),
  ];

  public getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  public getChildren(element?: TreeItem): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }
}

class TreeItem extends vscode.TreeItem {
  children: TreeItem[] | undefined;

  constructor(label: string, contextValue: string, iconPath?: vscode.ThemeIcon) {
    super(label);
    this.contextValue = contextValue;
    this.iconPath = iconPath;
  }
}
