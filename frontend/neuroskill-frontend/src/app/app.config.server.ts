import { ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideHttpClient } from '@angular/common/http';

export const config: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient() // Proporciona HttpClient para el servidor
  ]
};