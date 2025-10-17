export interface MenuItem {
  title?: string;
  icon?: string;
  link?: string;
  color?: string;

  hideFor?: string;

  expanded?: boolean;
}

export type Menu = MenuItem[];