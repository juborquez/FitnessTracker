import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { IonicModule } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';
import { CapacitorSQLite } from '@capacitor-community/sqlite';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(IonicModule.forRoot()),
    provideHttpClient(),
    { provide: 'CapacitorSQLite', useValue: CapacitorSQLite }
  ],
};