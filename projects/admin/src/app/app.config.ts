import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { authInterceptor, errorInterceptor, InitService, loadingInterceptor } from 'DAL';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ThemeService } from 'DAL';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor, loadingInterceptor]),withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    importProvidersFrom(NgxSpinnerModule.forRoot({ type: 'square-jelly-box' })),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const initService = inject(InitService);
        // Wait 500ms, run app initialization, then remove splash screen before bootstrapping
        return () =>
          new Promise<void>((resolve) => {
            setTimeout(async () => {
              try {
                return lastValueFrom(initService.init());
              } finally {
                const splash = document.getElementById('initial-splash');
                if (splash) splash.remove();
                resolve();
              }
            }, 500);
          });
      },
      multi: true,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
    },
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
