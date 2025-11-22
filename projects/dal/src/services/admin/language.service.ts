import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type LanguageCode = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translate = inject(TranslateService);
  
  private currentLanguageSubject = new BehaviorSubject<LanguageCode>('ar');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  private getDirection(lang: LanguageCode): Direction {
    return lang === 'ar' ? 'rtl' : 'ltr';
  }

  /**
   * Initializes the language based on localStorage or defaults to 'ar'.
   */
  initLanguage(): void {
    const defaultLang: LanguageCode = 'ar';
    const storedLang = localStorage.getItem('lang') as LanguageCode | null;
    const lang = storedLang && this.translate.getLangs().includes(storedLang) ? storedLang : defaultLang;

     // Initialize without re-setting local storage
    this.setLanguage(lang, false);
  }

  /**
   * Changes the application language and direction.
   * @param lang The language code ('en' or 'ar').
   * @param saveToStorage Whether to save the change to local storage (default: true).
   */
  setLanguage(lang: LanguageCode, saveToStorage: boolean = true): void {
    const dir = this.getDirection(lang);

    this.translate.use(lang);

    document.documentElement.setAttribute('dir', dir);

    if (saveToStorage) {
      localStorage.setItem('lang', lang);
    }
    
    this.currentLanguageSubject.next(lang);
  }

  switchToArabic(): void {
    this.setLanguage('ar');
  }

  switchToEnglish(): void {
    this.setLanguage('en');
  }
}


