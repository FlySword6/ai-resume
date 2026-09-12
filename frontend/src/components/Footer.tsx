import { useState } from 'react';
import { ExternalLink, Mail, Phone } from 'lucide-react';
import { useProfileContext } from '@/hooks/useProfileContext';
import { useAppVersion } from '@/hooks/useAppVersion';
import { AboutDialog } from '@/components/AboutDialog';

const Footer = () => {
  const { profile, isLoading } = useProfileContext();
  const { version } = useAppVersion();
  const [aboutOpen, setAboutOpen] = useState(false);

  if (isLoading || !profile) return null;

  const displayVersion = version?.version
    ? version.version.startsWith('v')
      ? version.version
      : `v${version.version}`
    : null;

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left column: name, title, version */}
          <div className="text-center md:text-left space-y-1">
            <p className="font-serif text-lg font-semibold text-foreground">
              {profile.name}
            </p>
            <p className="text-sm text-muted-foreground">{profile.title}</p>
            {displayVersion && (
              <p className="text-xs text-muted-foreground/60 font-mono">
                {displayVersion}
              </p>
            )}
          </div>

          {/* Right column: social icons + About */}
          <div className="flex items-center justify-center md:justify-end gap-2">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-secondary rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-secondary rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-secondary rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                aria-label="Phone"
                className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-secondary rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            )}
            <button
              onClick={() => setAboutOpen(true)}
              className="px-3 py-2 min-h-[44px] text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              关于
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground/60">
            这是一份面向 AI 应用 / Agent 实习岗位的交互式简历。
          </p>
        </div>
      </div>

      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
    </footer>
  );
};

export default Footer;
