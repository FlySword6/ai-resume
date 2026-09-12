import { useEffect, useState } from 'react';
import {
  FileText,
  Check,
  AlertTriangle,
  Loader2,
  Sparkles,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';
import { assessFit, type AssessFitResponse } from '@/lib/api-client';
import { LLMSettingsDialog } from '@/components/LLMSettingsDialog';
import { getTracer } from '@/lib/otel';
import { SpanStatusCode } from '@opentelemetry/api';

type TabType = 'example1' | 'example2' | 'custom';

const FitAssessment = () => {
  const { profile, loading: profileLoading, serviceStatus } = useProfile();
  const examples = profile?.fit_assessment_examples || [];
  const example1 = examples[0];
  const example2 = examples[1];
  const hasExamples = !!(example1 || example2);

  const [activeTab, setActiveTab] = useState<TabType>(
    hasExamples ? 'example1' : 'custom',
  );
  const [customJD, setCustomJD] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [customResult, setCustomResult] = useState<AssessFitResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (hasExamples && activeTab === 'custom' && !customJD.trim()) {
      setActiveTab('example1');
    }
  }, [activeTab, customJD, hasExamples]);

  const handleAnalyzeCustom = async () => {
    if (!customJD.trim() || customJD.trim().length < 50) {
      setError('请输入岗位描述，至少 50 个字符');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setCustomResult(null);

    const span = getTracer().startSpan('fit.assess');
    const start = performance.now();

    try {
      const result = await assessFit(customJD);
      setCustomResult(result);
      span.setAttribute(
        'response_time_ms',
        Math.round(performance.now() - start),
      );
      span.setStatus({ code: SpanStatusCode.OK });
    } catch (err) {
      setError(err instanceof Error ? err.message : '岗位匹配分析失败');
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err instanceof Error ? err.message : 'unknown',
      });
    } finally {
      span.end();
      setAnalyzing(false);
    }
  };

  // Show loading state if profile is still loading
  if (profileLoading) {
    return (
      <section id="fit-assessment" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground mt-4">
            正在加载岗位匹配分析...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="fit-assessment"
      data-testid="fit-section"
      className="py-12 sm:py-24 px-4 sm:px-6 bg-secondary/30"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mb-4">
            岗位匹配分析
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            {hasExamples
              ? '先看两类预置岗位样例；接入本地后端后，可以粘贴真实 JD 做实时分析。'
              : '接入本地后端后，可以粘贴真实 JD 做实时分析。'}
          </p>
        </div>

        {/* Tab buttons */}
        <div
          className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 flex-wrap"
          role="tablist"
          aria-label="Fit assessment examples"
        >
          {example1 && (
            <button
              role="tab"
              aria-selected={activeTab === 'example1'}
              aria-controls="tabpanel-example1"
              id="tab-example1"
              onClick={() => setActiveTab('example1')}
              className={cn(
                'px-4 sm:px-6 py-3 min-h-[44px] rounded-xl font-medium transition-all border text-sm sm:text-base',
                activeTab === 'example1'
                  ? 'bg-success-muted text-success border-success/30'
                  : 'bg-card text-muted-foreground border-border hover:border-muted-foreground',
              )}
            >
              {example1.fit_level === 'strong_fit' ? '强匹配' : '样例 1'}
            </button>
          )}
          {example2 && (
            <button
              role="tab"
              aria-selected={activeTab === 'example2'}
              aria-controls="tabpanel-example2"
              id="tab-example2"
              onClick={() => setActiveTab('example2')}
              className={cn(
                'px-4 sm:px-6 py-3 min-h-[44px] rounded-xl font-medium transition-all border text-sm sm:text-base',
                activeTab === 'example2'
                  ? 'bg-warning-muted text-warning border-warning/30'
                  : 'bg-card text-muted-foreground border-border hover:border-muted-foreground',
              )}
            >
              {example2.fit_level === 'weak_fit' ? '弱匹配' : '样例 2'}
            </button>
          )}
          <button
            role="tab"
            aria-selected={activeTab === 'custom'}
            aria-controls="tabpanel-custom"
            id="tab-custom"
            onClick={() => setActiveTab('custom')}
            className={cn(
              'px-4 sm:px-6 py-3 min-h-[44px] rounded-xl font-medium transition-all border flex items-center gap-2 text-sm sm:text-base',
              activeTab === 'custom'
                ? 'bg-accent-muted text-accent border-accent/30'
                : 'bg-card text-muted-foreground border-border hover:border-muted-foreground',
            )}
          >
            <Sparkles className="w-4 h-4" />
            粘贴 JD
          </button>
        </div>

        {/* Main interface */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Example 1 Tab */}
          {activeTab === 'example1' && example1 && (
            <div
              className="p-4 sm:p-6"
              role="tabpanel"
              id="tabpanel-example1"
              aria-labelledby="tab-example1"
            >
              {/* Job Description */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {example1.role}
                  </span>
                </div>
                <div className="bg-secondary rounded-xl p-4 border border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {example1.job_description}
                  </p>
                </div>
              </div>

              {/* Assessment */}
              <div className="animate-slide-up">
                {/* Verdict */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 p-3 sm:p-4 rounded-xl border bg-success-muted border-success/20">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-success/20">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-serif text-success break-words">
                      {example1.verdict}
                    </h3>
                  </div>
                </div>

                {/* Key Matches */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    匹配点
                  </h4>
                  <div className="p-4 bg-secondary rounded-xl border border-border">
                    <div className="flex items-start gap-3">
                      <span className="text-success mt-0.5">✓</span>
                      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {example1.key_matches}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gaps */}
                {example1.gaps && (
                  <div className="space-y-4 mb-6">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    需要注意
                    </h4>
                    <div className="p-4 bg-secondary rounded-xl border border-border">
                      <div className="flex items-start gap-3">
                        <span className="text-muted-foreground mt-0.5">○</span>
                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                          {example1.gaps}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div className="p-4 rounded-xl border bg-success-muted border-success/20">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    建议
                  </h4>
                  <p className="leading-relaxed text-success">
                    {example1.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Example 2 Tab */}
          {activeTab === 'example2' && example2 && (
            <div
              className="p-4 sm:p-6"
              role="tabpanel"
              id="tabpanel-example2"
              aria-labelledby="tab-example2"
            >
              {/* Job Description */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {example2.role}
                  </span>
                </div>
                <div className="bg-secondary rounded-xl p-4 border border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {example2.job_description}
                  </p>
                </div>
              </div>

              {/* Assessment */}
              <div className="animate-slide-up">
                {/* Verdict */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 p-3 sm:p-4 rounded-xl border bg-warning-muted border-warning/20">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-warning/20">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-serif text-warning break-words">
                      {example2.verdict}
                    </h3>
                  </div>
                </div>

                {/* Key Matches */}
                {example2.key_matches && (
                  <div className="space-y-4 mb-6">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      匹配点
                    </h4>
                    <div className="p-4 bg-secondary rounded-xl border border-border">
                      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {example2.key_matches}
                      </p>
                    </div>
                  </div>
                )}

                {/* Gaps */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    明显短板
                  </h4>
                  <div className="p-4 bg-secondary rounded-xl border border-border">
                    <div className="flex items-start gap-3">
                      <span className="text-warning mt-0.5">✗</span>
                      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {example2.gaps}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-4 rounded-xl border bg-warning-muted border-warning/20">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    建议
                  </h4>
                  <p className="leading-relaxed text-warning">
                    {example2.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Custom JD Tab */}
          {activeTab === 'custom' && (
            <div
              className="p-4 sm:p-6"
              role="tabpanel"
              id="tabpanel-custom"
              aria-labelledby="tab-custom"
            >
              {/* Input section */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-muted-foreground text-sm">
                    粘贴岗位描述
                  </span>
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(true)}
                    className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:ml-auto sm:w-auto"
                  >
                    <Settings className="h-4 w-4" />
                    模型设置
                  </button>
                </div>
                <textarea
                  value={customJD}
                  onChange={(e) => setCustomJD(e.target.value)}
                  placeholder="粘贴完整岗位描述，至少 50 个字符..."
                  className="w-full h-48 p-4 bg-secondary rounded-xl border border-border text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                {error && (
                  <p className="text-destructive text-sm mt-2">{error}</p>
                )}
                <button
                  onClick={handleAnalyzeCustom}
                  disabled={
                    analyzing || !customJD.trim() || serviceStatus === 'static'
                  }
                  className="mt-4 w-full sm:w-auto px-6 py-3 min-h-[44px] bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI 分析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {serviceStatus === 'static' ? '需启动后端' : '分析匹配度'}
                    </>
                  )}
                </button>
              </div>

              {/* Results section */}
              {customResult && !analyzing && (
                <div className="animate-slide-up">
                  {/* Verdict */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 p-3 sm:p-4 rounded-xl border bg-accent-muted border-accent/20">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-accent/20">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-serif text-accent break-words">
                        {customResult.verdict}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                        使用 {customResult.chunks_retrieved} 条上下文 ·{' '}
                        {customResult.tokens_used} tokens
                      </p>
                    </div>
                  </div>

                  {/* Key Matches */}
                  <div className="space-y-4 mb-6">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      匹配点
                    </h4>
                    {customResult.key_matches.map((match, i) => (
                      <div
                        key={i}
                        className="p-4 bg-secondary rounded-xl border border-border"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-success mt-0.5">✓</span>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {match}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gaps */}
                  <div className="space-y-4 mb-6">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      需要注意
                    </h4>
                    {customResult.gaps.map((gap, i) => (
                      <div
                        key={i}
                        className="p-4 bg-secondary rounded-xl border border-border"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-muted-foreground mt-0.5">
                            ○
                          </span>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {gap}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recommendation */}
                  <div className="p-4 rounded-xl border bg-accent-muted border-accent/20">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                      建议
                    </h4>
                    <p className="leading-relaxed text-accent">
                      {customResult.recommendation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom insight */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-block p-4 sm:p-6 bg-card rounded-2xl border border-border max-w-2xl">
            <p className="text-muted-foreground leading-relaxed">
              这里的目标不是把简历说得天花乱坠，而是让岗位匹配有证据、有边界。
              <br />
              <br />
              <span className="text-foreground font-medium">
                适合就讲清楚匹配点，不适合也明确说出原因。
              </span>
            </p>
          </div>
        </div>
        <LLMSettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
        />
      </div>
    </section>
  );
};

export default FitAssessment;
