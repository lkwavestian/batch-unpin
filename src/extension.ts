import * as vscode from "vscode";
import { t } from "./i18n";

export function activate(context: vscode.ExtensionContext) {
  // 创建输出通道
  const outputChannel = vscode.window.createOutputChannel("Batch Unpin");
  outputChannel.appendLine("插件已激活 - 通过输出通道");

  // 注册命令
  let disposable = vscode.commands.registerCommand(
    "batch-unpin.unpinAllTabs",
    () => {
      outputChannel.appendLine("命令被触发 - 通过输出通道");
      unpinAllTabs();
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

/**
 * 批量取消所有固定标签页
 */
async function unpinAllTabs() {
  try {
    // 获取当前活动的编辑器组
    const activeEditorGroup = vscode.window.activeTextEditor?.viewColumn;

    // 获取所有标签页组
    const allTabGroups = vscode.window.tabGroups.all;

    // 使用更准确的方法找到当前活动的标签页组
    let targetTabGroup: vscode.TabGroup | undefined;

    // 方法1：使用当前活动的标签页组
    if (vscode.window.tabGroups.activeTabGroup) {
      targetTabGroup = vscode.window.tabGroups.activeTabGroup;
    }
    // 方法2：如果没有活动组，使用第一个组
    else if (allTabGroups.length > 0) {
      targetTabGroup = allTabGroups[0];
    }

    // 获取目标组中的标签页
    const tabs = targetTabGroup ? targetTabGroup.tabs : [];

    // 过滤出固定标签页
    const pinnedTabs = tabs.filter((tab: vscode.Tab) => tab.isPinned);

    if (pinnedTabs.length === 0) {
      // 使用左下角消息提醒
      vscode.window.showInformationMessage(t("message.noPinnedTabs"));
      return;
    }

    // 显示确认对话框
    const result = await vscode.window.showWarningMessage(
      t("message.confirmUnpin", pinnedTabs.length.toString()),
      { modal: true },
      t("button.confirm"),
    );

    if (result === t("button.confirm")) {
      // 显示进度
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: t("message.progressUnpinning"),
          cancellable: false,
        },
        async (progress) => {
          let unpinnedCount = 0;
          const totalTabs = pinnedTabs.length;

          // 记录原始活动标签页
          const originalActiveTab =
            vscode.window.tabGroups.activeTabGroup?.activeTab;

          // 从后向前取消固定标签页，避免闪现移位现象
          for (let i = pinnedTabs.length - 1; i >= 0; i--) {
            const tab = pinnedTabs[i];

            try {
              // 更新进度（倒序处理）
              const currentIndex = totalTabs - i;
              progress.report({
                message: t(
                  "message.progressProcessing",
                  currentIndex.toString(),
                  totalTabs.toString(),
                  tab.label,
                ),
                increment: 100 / totalTabs,
              });

              // 先激活标签页，然后取消固定
              try {
                // 检查文件是否存在
                let canActivate = true;
                if (tab.input instanceof vscode.TabInputText) {
                  try {
                    const fs = require("fs");
                    if (!fs.existsSync(tab.input.uri.fsPath)) {
                      canActivate = false;
                    }
                  } catch (fsError) {
                    // 文件检查失败，继续尝试激活
                  }
                }

                // 尝试使用VSCode的标签页API直接操作
                try {
                  // 获取标签页在组中的索引
                  const tabIndex = targetTabGroup?.tabs.indexOf(tab) ?? -1;

                  if (tabIndex !== -1) {
                    // 尝试使用标签页索引来操作
                    // 这可能更接近VSCode右键菜单的实现
                    await vscode.commands.executeCommand(
                      "workbench.action.openEditorAtIndex",
                      tabIndex,
                    );
                    await new Promise((resolve) => setTimeout(resolve, 50));
                    await vscode.commands.executeCommand(
                      "workbench.action.unpinEditor",
                    );
                    unpinnedCount++;
                  } else {
                    // 无法找到标签页索引
                  }
                } catch (error) {
                  // 索引方法失败

                  // 备选方案：激活后取消
                  try {
                    if (
                      canActivate &&
                      tab.input instanceof vscode.TabInputText
                    ) {
                      await vscode.window.showTextDocument(tab.input.uri);
                      await new Promise((resolve) => setTimeout(resolve, 100));
                    }

                    await vscode.commands.executeCommand(
                      "workbench.action.unpinEditor",
                    );
                    unpinnedCount++;
                  } catch (activateError) {
                    // 激活方法也失败
                  }
                }
              } catch (error) {
                // 取消固定标签页时出错

                // 备选方案：直接尝试取消固定
                try {
                  await vscode.commands.executeCommand(
                    "workbench.action.unpinEditor",
                  );
                  unpinnedCount++;
                } catch (fallbackError) {
                  // 备选方案也失败
                }
              }
            } catch (error) {
              // 处理标签页时出错
            }
          }

          // 恢复原始活动标签页
          if (
            originalActiveTab &&
            originalActiveTab.input instanceof vscode.TabInputText
          ) {
            try {
              await vscode.window.showTextDocument(originalActiveTab.input.uri);
            } catch (restoreError) {
              // 恢复原始活动标签页失败
            }
          }

          // 显示结果
          if (unpinnedCount > 0) {
            // 使用左下角消息提醒
            vscode.window.showInformationMessage(
              t(
                "message.successUnpin",
                unpinnedCount.toString(),
                totalTabs.toString(),
              ),
            );
          } else {
            // 使用左下角消息提醒
            vscode.window.showInformationMessage(t("message.noSuccessUnpin"));
          }
        },
      );
    }
  } catch (error) {
    vscode.window.showErrorMessage(t("message.error"));
  }
}
