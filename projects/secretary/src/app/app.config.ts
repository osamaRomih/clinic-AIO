import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { authInterceptor, InitService, ThemeService } from 'DAL';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
      provideHttpClient(
        withFetch(),
        withInterceptors([authInterceptor])
      ),
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideAnimations(),
      provideToastr(),
      importProvidersFrom(NgxSpinnerModule.forRoot({ type: 'square-jelly-box' })),
      // Ensure theme is applied even on routes outside layout (e.g., login)
      {
        provide: APP_INITIALIZER,
        useFactory: () => {
          // injecting ThemeService triggers its constructor to apply saved theme
          inject(ThemeService);
          return () => Promise.resolve();
        },
        multi: true,
      },
      {
        provide: APP_INITIALIZER,
        useFactory: () => {
          const initService = inject(InitService);
          return () => initService.init();
        },
        multi: true,
      },
      {
        provide:MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {appearance:'outline',subscriptSizing:'dynamic'}
      }
    ],
  };
  