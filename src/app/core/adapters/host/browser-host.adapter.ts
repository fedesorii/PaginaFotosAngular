import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HostEnvironmentPort } from '../../ports/host-environment.port';
import {
  HostPlatformType,
  PortfolioRuntimeConfig,
} from '../../domain/models/runtime-config.model';

const RUNTIME_CONFIG_STORAGE_KEY = 'ij_portfolio_runtime_config_v1';

const DEFAULT_RUNTIME_CONFIG: PortfolioRuntimeConfig = {
  mediaAdapter: 'cloudinary-hybrid',
  cloudinaryPrimaryCloudName: 'ddozsonun',
  cloudinaryFallbackCloudName: 'dp874hdq8',
  cloudinaryUploadPreset: '',
  emailAdapter: 'resilient-queue',
  emailJsServiceId: '',
  emailJsTemplateId: '',
  emailJsPublicKey: 'h4J1ZgcMYgZUej6ca',
  webhookEndpointUrl: '',
  watermarkText: '© IGNACIO JUÁREZ · FOTOGRAFÍA',
  watermarkEnabled: true,
};

@Injectable({
  providedIn: 'root',
})
export class BrowserHostAdapter implements HostEnvironmentPort {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly memoryStore = new Map<string, string>();
  private readonly runtimeConfigSignal = signal<PortfolioRuntimeConfig>(DEFAULT_RUNTIME_CONFIG);

  constructor() {
    if (this.isBrowser()) {
      const saved = this.getStorageItem<Partial<PortfolioRuntimeConfig> | null>(
        RUNTIME_CONFIG_STORAGE_KEY,
        null
      );
      if (saved && typeof saved === 'object') {
        this.runtimeConfigSignal.set({
          ...DEFAULT_RUNTIME_CONFIG,
          ...saved,
        });
      }
    }
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  detectHostPlatform(): HostPlatformType {
    if (!this.isBrowser()) {
      return 'node-ssr';
    }
    const host = window.location.hostname.toLowerCase();
    if (host.includes('vercel.app')) {
      return 'vercel';
    }
    if (host.includes('github.io')) {
      return 'github-pages';
    }
    if (host.includes('netlify.app')) {
      return 'netlify';
    }
    return 'browser-local';
  }

  getBaseUrl(): string {
    if (!this.isBrowser()) {
      return 'http://localhost:4200';
    }
    return window.location.origin;
  }

  getStorageItem<T>(key: string, fallback: T): T {
    try {
      if (this.isBrowser() && typeof window.localStorage !== 'undefined') {
        const raw = window.localStorage.getItem(key);
        if (raw !== null) {
          return JSON.parse(raw) as T;
        }
      } else if (this.memoryStore.has(key)) {
        return JSON.parse(this.memoryStore.get(key)!) as T;
      }
    } catch {
      // Fallback silencioso si localStorage está bloqueado o el JSON es inválido
    }
    return fallback;
  }

  setStorageItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      if (this.isBrowser() && typeof window.localStorage !== 'undefined') {
        window.localStorage.setItem(key, serialized);
      } else {
        this.memoryStore.set(key, serialized);
      }
    } catch {
      // Ignorar cuota excedida o modo privado estricto
    }
  }

  removeStorageItem(key: string): void {
    try {
      if (this.isBrowser() && typeof window.localStorage !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      this.memoryStore.delete(key);
    } catch {
      // Ignorar errores de acceso
    }
  }

  getRuntimeConfig(): PortfolioRuntimeConfig {
    return this.runtimeConfigSignal();
  }

  updateRuntimeConfig(partial: Partial<PortfolioRuntimeConfig>): PortfolioRuntimeConfig {
    const updated: PortfolioRuntimeConfig = {
      ...this.runtimeConfigSignal(),
      ...partial,
    };
    this.runtimeConfigSignal.set(updated);
    this.setStorageItem(RUNTIME_CONFIG_STORAGE_KEY, updated);
    return updated;
  }

  resetRuntimeConfig(): PortfolioRuntimeConfig {
    this.runtimeConfigSignal.set(DEFAULT_RUNTIME_CONFIG);
    this.removeStorageItem(RUNTIME_CONFIG_STORAGE_KEY);
    return DEFAULT_RUNTIME_CONFIG;
  }
}
