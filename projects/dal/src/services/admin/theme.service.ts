import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeKey = 'app-theme';
  private darkKey = 'app-theme-dark';

  constructor() {
    // apply saved theme at construction (or call from appInit)
    const theme = localStorage.getItem(this.themeKey) || 'green';
    const isDark = localStorage.getItem(this.darkKey) === '1';
    this.apply(theme, isDark);
  }

  apply(themeKey: string, dark = false) {
    // remove any theme-* classes
    Array.from(document.body.classList).forEach(c => {
      if (c.startsWith('theme-')) document.body.classList.remove(c);
    });
    document.body.classList.remove('dark');

    // add chosen
    document.body.classList.add(`theme-${themeKey}`);
    if (dark) document.body.classList.add('dark');

    // persist
    localStorage.setItem(this.themeKey, themeKey);
    localStorage.setItem(this.darkKey, dark ? '1' : '0');
  }

  getCurrent() {
    return {
      theme: localStorage.getItem(this.themeKey) || 'green',
      dark: localStorage.getItem(this.darkKey) === '1'
    };
  }
}
