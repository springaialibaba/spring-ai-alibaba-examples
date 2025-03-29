// 功能菜单配置
export interface FunctionMenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  link?: string;
}

export interface ActionButtonConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
  styleClass: string;
  activeColor: string;
  description?: string;
}
