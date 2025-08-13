import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class I18n {
  private static instance: I18n;
  private messages: { [key: string]: string } = {};
  private language: string = 'en';

  private constructor() {
    this.loadLanguage();
  }

  public static getInstance(): I18n {
    if (!I18n.instance) {
      I18n.instance = new I18n();
    }
    return I18n.instance;
  }

  private loadLanguage(): void {
    try {
      // 获取 VSCode 的语言设置
      this.language = vscode.env.language || 'en';
      
      // 尝试加载对应的语言包
      const languageFile = path.join(__dirname, '..', 'i18n', `${this.language}.json`);
      
      if (fs.existsSync(languageFile)) {
        const content = fs.readFileSync(languageFile, 'utf8');
        this.messages = JSON.parse(content);
      } else {
        // 如果找不到对应语言，使用英文作为后备
        const fallbackFile = path.join(__dirname, '..', 'i18n', 'en.json');
        if (fs.existsSync(fallbackFile)) {
          const content = fs.readFileSync(fallbackFile, 'utf8');
          this.messages = JSON.parse(content);
        }
      }
    } catch (error) {
      console.error('Failed to load language file:', error);
    }
  }

  public t(key: string, ...args: string[]): string {
    let message = this.messages[key] || key;
    
    // 替换参数 {0}, {1}, {2} 等
    args.forEach((arg, index) => {
      message = message.replace(`{${index}}`, arg);
    });
    
    return message;
  }

  public getLanguage(): string {
    return this.language;
  }
}

// 导出便捷函数
export const t = (key: string, ...args: string[]): string => {
  return I18n.getInstance().t(key, ...args);
};
