import { InjectionToken } from '@angular/core';
import { HostPlatformType, PortfolioRuntimeConfig } from '../domain/models/runtime-config.model';

/**
 * Puerto de salida (Hexagonal Architecture) para abstraer el entorno de ejecución y host
 * (Vercel, Netlify, GitHub Pages, Node SSR, Cloudflare Pages).
 * Garantiza seguridad en SSR/Prerendering y desacopla la persistencia de configuración.
 */
export interface HostEnvironmentPort {
  /** Indica si la aplicación se está ejecutando en un navegador real (no SSR/Node) */
  isBrowser(): boolean;

  /** Detecta la plataforma de hosting actual */
  detectHostPlatform(): HostPlatformType;

  /** Obtiene la URL base canónica del despliegue actual */
  getBaseUrl(): string;

  /** Lee un valor persistido de forma segura (compatible con SSR) */
  getStorageItem<T>(key: string, fallback: T): T;

  /** Persiste un valor de forma segura (compatible con SSR) */
  setStorageItem<T>(key: string, value: T): void;

  /** Elimina una clave del almacenamiento */
  removeStorageItem(key: string): void;

  /** Obtiene la configuración activa de los adaptadores (Cloudinary, EmailJS, Marca de agua) */
  getRuntimeConfig(): PortfolioRuntimeConfig;

  /** Actualiza en caliente la configuración de los adaptadores */
  updateRuntimeConfig(partial: Partial<PortfolioRuntimeConfig>): PortfolioRuntimeConfig;

  /** Restaura la configuración por defecto */
  resetRuntimeConfig(): PortfolioRuntimeConfig;
}

export const HOST_ENVIRONMENT_PORT = new InjectionToken<HostEnvironmentPort>(
  'HOST_ENVIRONMENT_PORT'
);
