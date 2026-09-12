const STORAGE_KEY = 'ai-resume.llm-settings.v1';

export type LLMProvider = 'deepseek' | 'openrouter' | 'custom';

export interface LLMSettings {
  provider: LLMProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export const DEFAULT_LLM_SETTINGS: LLMSettings = {
  provider: 'deepseek',
  apiKey: '',
  baseUrl: 'https://api.deepseek.com',
  model: 'deepseek-flash',
  temperature: 0.7,
  maxTokens: 1024,
};

const PROVIDER_DEFAULTS: Record<
  LLMProvider,
  Pick<LLMSettings, 'baseUrl' | 'model'>
> = {
  deepseek: {
    baseUrl: 'https://api.deepseek.com',
    model: 'deepseek-flash',
  },
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'deepseek/deepseek-chat',
  },
  custom: {
    baseUrl: '',
    model: '',
  },
};

function coerceSettings(value: unknown): LLMSettings {
  if (!value || typeof value !== 'object') {
    return DEFAULT_LLM_SETTINGS;
  }

  const data = value as Partial<LLMSettings>;
  const provider: LLMProvider =
    data.provider === 'openrouter' || data.provider === 'custom'
      ? data.provider
      : 'deepseek';
  const defaults = PROVIDER_DEFAULTS[provider];

  return {
    provider,
    apiKey: typeof data.apiKey === 'string' ? data.apiKey : '',
    baseUrl:
      typeof data.baseUrl === 'string' && data.baseUrl.trim()
        ? data.baseUrl
        : defaults.baseUrl,
    model:
      typeof data.model === 'string' && data.model.trim()
        ? data.model
        : defaults.model,
    temperature:
      typeof data.temperature === 'number' ? data.temperature : 0.7,
    maxTokens: typeof data.maxTokens === 'number' ? data.maxTokens : 1024,
  };
}

export function getProviderDefaults(
  provider: LLMProvider,
): Pick<LLMSettings, 'baseUrl' | 'model'> {
  return PROVIDER_DEFAULTS[provider];
}

export function getLLMSettings(): LLMSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_LLM_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? coerceSettings(JSON.parse(raw)) : DEFAULT_LLM_SETTINGS;
  } catch {
    return DEFAULT_LLM_SETTINGS;
  }
}

export function saveLLMSettings(settings: LLMSettings): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event('llm-settings-changed'));
}

export function clearLLMSettings(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('llm-settings-changed'));
}

export function buildLLMHeaders(): Record<string, string> {
  const settings = getLLMSettings();
  const headers: Record<string, string> = {};

  if (settings.apiKey.trim()) {
    headers['X-LLM-API-Key'] = settings.apiKey.trim();
  }
  if (settings.baseUrl.trim()) {
    headers['X-LLM-Base-URL'] = settings.baseUrl.trim();
  }
  if (settings.model.trim()) {
    headers['X-LLM-Model'] = settings.model.trim();
  }
  if (Number.isFinite(settings.temperature)) {
    headers['X-LLM-Temperature'] = String(settings.temperature);
  }
  if (Number.isFinite(settings.maxTokens)) {
    headers['X-LLM-Max-Tokens'] = String(settings.maxTokens);
  }

  return headers;
}

export function hasLLMApiKey(): boolean {
  return !!getLLMSettings().apiKey.trim();
}
