import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import {
  authInterceptor,
  errorInterceptor,
  InitService,
  loadingInterceptor,
} from 'DAL';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ThemeService } from 'DAL';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor, loadingInterceptor])
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
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: () => {
    //     const initService = inject(InitService);
    //     return () => initService.init();
    //   },
    //   multi: true,
    // },
    importProvidersFrom(SocialLoginModule),
    {
      provide:MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {appearance:'outline',subscriptSizing:'dynamic'}
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '839121286524-98tlkoiq5rmuegtlkl2prirucmdmmboh.apps.googleusercontent.com',{
                oneTapEnabled:false
              }
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
};
