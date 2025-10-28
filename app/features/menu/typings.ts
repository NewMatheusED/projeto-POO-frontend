import Svg from "../../src/assets/svgs";
export type MenuStatus = "green" | "yellow" | "red";

export interface IMenuItem {
  path?: string;
  label: string;
  status: string;
  dropdown?: Record<string, IMenuItem>;
  icon?: keyof typeof Svg;
  target?: string;
  active?: boolean;
  dinamic_id?: string;
  isOpen?: boolean;
  currentSelected?: boolean;
}

export type IMenuConfig = {
  [key: string]: IMenuItem;
};

export const MenuConfig = {
  inicio: {
    label: "Início",
    status: "green",
    icon: "home",
    path: "/",
  },
  status: {
    label: "Status",
    status: "green",
    icon: "graph",
    path: "/status",
  },
  "analise-legislativa": {
    label: "Análise Legislativa",
    status: "green",
    icon: "building_library",
    path: "/analise-legislativa",
  },
} satisfies IMenuConfig;

export class MenuClass {
  config: IMenuConfig;
  constructor(config: IMenuConfig) {
    this.config = this.applyDefaults(config);
  }
  private applyDefaults(config: IMenuConfig): IMenuConfig {
    const withDefaults = (item: IMenuItem): IMenuItem => {
      const dropdown = item.dropdown
        ? Object.fromEntries(
            Object.entries(item.dropdown).map(([k, v]) => [k, withDefaults(v)])
          )
        : undefined;
      return {
        ...item,
        isOpen: item.isOpen ?? false,
        currentSelected: item.currentSelected ?? false,
        dropdown,
      };
    };
    return Object.fromEntries(
      Object.entries(config).map(([k, v]) => [k, withDefaults(v)])
    );
  }
  // Método setMenu removido - não há mais sistema de allowed_views
  getMenu() {
    return this.config;
  }
}

export const MenuHanlder = new MenuClass(MenuConfig);

export type MenuKeys = keyof typeof MenuConfig;

