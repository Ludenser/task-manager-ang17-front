import { Injectable } from '@angular/core';

export type Paths = {
  [K in keyof typeof initialPaths]: string;
};

interface MenuItem {
  label: string; // Ключ для перевода
  icon?: string; // Иконка
  path?: string; // Путь для роутинга
  children?: MenuItem[]; // Подменю
}

const menuItems: MenuItem[] = [
  {
    label: 'Home',
    icon: 'home',
    path: '/profile',
  },
  {
    label: 'Friends',
    icon: 'contacts',
    path: '/friends',
  },
  {
    label: 'Todo',
    icon: 'bell',
    path: '/todo',
  },
];

const initialPaths = {
  root: '/',
  login: '/login',
  home: '/profile',
  friends: '/friends',
  todo: '/todo',
} as const;

@Injectable({
  providedIn: 'root',
})
export class PathManagementService {
  private paths!: Paths;

  constructor() {
    this.definePaths();
  }

  private definePaths() {
    this.paths = { ...initialPaths };
  }

  getPath(key: keyof Paths): string {
    return this.paths[key];
  }

  getAllPaths(): Paths {
    return this.paths;
  }

  getMenuItems(): MenuItem[] {
    return menuItems;
  }
}
