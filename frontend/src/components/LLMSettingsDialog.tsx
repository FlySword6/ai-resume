import { useEffect, useState } from 'react';
import { Eye, EyeOff, RotateCcw, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DEFAULT_LLM_SETTINGS,
  clearLLMSettings,
  getLLMSettings,
  getProviderDefaults,
  saveLLMSettings,
  type LLMProvider,
  type LLMSettings,
} from '@/lib/llm-settings';

interface LLMSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LLMSettingsDialog({
  open,
  onOpenChange,
}: LLMSettingsDialogProps) {
  const [settings, setSettings] = useState<LLMSettings>(
    DEFAULT_LLM_SETTINGS,
  );
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setSettings(getLLMSettings());
      setSaved(false);
    }
  }, [open]);

  const update = <K extends keyof LLMSettings>(
    key: K,
    value: LLMSettings[K],
  ) => {
    setSaved(false);
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleProviderChange = (provider: LLMProvider) => {
    const defaults = getProviderDefaults(provider);
    setSaved(false);
    setSettings((current) => ({
      ...current,
      provider,
      baseUrl: defaults.baseUrl,
      model: defaults.model,
    }));
  };

  const handleSave = () => {
    saveLLMSettings({
      ...settings,
      baseUrl: settings.baseUrl.trim(),
      model: settings.model.trim(),
      apiKey: settings.apiKey.trim(),
    });
    setSaved(true);
  };

  const handleReset = () => {
    clearLLMSettings();
    setSettings(DEFAULT_LLM_SETTINGS);
    setSaved(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>模型设置</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pb-[env(safe-area-inset-bottom)]">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              服务商
            </label>
            <select
              value={settings.provider}
              onChange={(event) =>
                handleProviderChange(event.target.value as LLMProvider)
              }
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="deepseek">DeepSeek</option>
              <option value="openrouter">OpenRouter</option>
              <option value="custom">自定义兼容接口</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              API Key
            </label>
            <div className="flex rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
              <input
                value={settings.apiKey}
                onChange={(event) => update('apiKey', event.target.value)}
                type={showKey ? 'text' : 'password'}
                autoComplete="off"
                spellCheck={false}
                placeholder="sk-..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey((value) => !value)}
                className="min-h-10 min-w-10 text-muted-foreground hover:text-foreground"
                aria-label={showKey ? '隐藏 API Key' : '显示 API Key'}
                title={showKey ? '隐藏 API Key' : '显示 API Key'}
              >
                {showKey ? (
                  <EyeOff className="mx-auto h-4 w-4" />
                ) : (
                  <Eye className="mx-auto h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              Base URL
            </label>
            <input
              value={settings.baseUrl}
              onChange={(event) => update('baseUrl', event.target.value)}
              placeholder="https://api.deepseek.com"
              className="h-10 min-w-0 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">模型</label>
            <input
              value={settings.model}
              onChange={(event) => update('model', event.target.value)}
              placeholder="deepseek-flash"
              className="h-10 min-w-0 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Temperature
              </label>
              <input
                value={settings.temperature}
                onChange={(event) =>
                  update('temperature', Number(event.target.value))
                }
                type="number"
                min={0}
                max={2}
                step={0.1}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Max Tokens
              </label>
              <input
                value={settings.maxTokens}
                onChange={(event) =>
                  update('maxTokens', Number(event.target.value))
                }
                type="number"
                min={1}
                max={8192}
                step={1}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            API Key 只保存在当前浏览器，并随请求发送给本地后端代理调用模型。公开部署时不要把个人密钥放在前端。
          </p>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              重置
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              <Save className="h-4 w-4" />
              {saved ? '已保存' : '保存设置'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
