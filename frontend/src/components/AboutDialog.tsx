import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';
import { useAppVersion } from '@/hooks/useAppVersion';
import { useProfileContext } from '@/hooks/useProfileContext';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  const { version, loading } = useAppVersion();
  const { profile } = useProfileContext();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="about-dialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>关于这份 AI 简历</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">版本</span>
            <span className="font-mono text-xs">
              {loading ? '...' : (version?.version ?? 'dev')}
            </span>
          </div>
          {version?.commit && version.commit !== 'unknown' && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">提交</span>
              <span className="font-mono text-xs">
                {version.commit.slice(0, 7)}
              </span>
            </div>
          )}
          {version?.model && (
            /* Model ids are long ("google/gemma-4-26b-a4b-it"), so the
               value is allowed to wrap rather than overflow the dialog. */
            <div className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground shrink-0">模型</span>
              <span
                data-testid="about-model"
                className="font-mono text-xs text-right break-all"
              >
                {version.model}
              </span>
            </div>
          )}
          <div className="border-t pt-4 space-y-3">
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                朱健科的 GitHub
              </a>
            )}
            <a
              href="https://github.com/schwichtgit/ai-resume"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              原项目源码
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
