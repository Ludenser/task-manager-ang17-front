import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import ru from '@angular/common/locales/ru';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNzI18n, ru_RU } from 'ng-zorro-antd/i18n';
import { ApiModule } from './api/api.module';
import { Configuration } from './api/configuration';
import { routes } from './app.routes';
import { authInterceptor } from './core/Http/auth.interceptor';
import { AuthService } from './core/auth/auth.service';
import { provideNzIcons } from './icons-provider';

registerLocaleData(ru);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(ApiModule.forRoot(() => new Configuration())),
    AuthService,
    provideNzIcons(),
    provideNzI18n(ru_RU),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
