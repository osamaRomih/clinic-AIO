import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
})
export class LanguageSelectorComponent {
  // languages = [
  //   { code: 'en', name: 'English', flag: '🇬🇧' },
  //   { code: 'es', name: 'Español', flag: '🇪🇸' },
  // ];

  // isOpen = false;
  // private translate = inject(TranslateService);

  // constructor() {
  //   const browserLang = this.translate.getBrowserLang();
  //   this.translate.setFallbackLang('en');
  //   this.translate.use(browserLang?.match(/en|es/) ? browserLang : 'en');
  // }

  // getCurrentLanguage() {
  //   return this.languages.find((lang) => lang.code === this.translate.currentLang) || this.languages[0];
  // }

  // isCurrentLanguage(code: string): boolean {
  //   return code === this.translate.currentLang;
  // }

  // toggleDropdown(): void {
  //   this.isOpen = !this.isOpen;
  // }

  // switchLanguage(langCode: string): void {
  //   this.translate.use(langCode);
  //   this.isOpen = false;
  // }
}
