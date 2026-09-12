import { ExternalLink, Mail, MessageSquare, Phone } from 'lucide-react';
import { useProfileContext } from '@/hooks/useProfileContext';

interface HeroProps {
  onOpenChat: () => void;
}

const Hero = ({ onOpenChat }: HeroProps) => {
  const { profile, isLoading } = useProfileContext();

  // Show skeleton while loading
  if (isLoading) {
    return (
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-start px-4 sm:px-6 pt-[max(5.5rem,10vh)] sm:pt-[max(6rem,12vh)]"
      >
        <div className="max-w-4xl mx-auto w-full">
          <div className="h-10 w-64 bg-secondary rounded-full mb-8 animate-pulse" />
          <div className="h-24 w-full bg-secondary rounded-lg mb-6 animate-pulse" />
          <div className="h-12 w-3/4 bg-secondary rounded-lg mb-4 animate-pulse" />
          <div className="h-8 w-1/2 bg-secondary rounded-lg mb-8 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-start px-4 sm:px-6 pt-[max(5.5rem,10vh)] sm:pt-[max(6rem,12vh)] pb-14 sm:pb-0"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Status badge */}
        <div className="inline-flex max-w-full items-center gap-2 px-3 sm:px-4 py-2 bg-secondary rounded-2xl sm:rounded-full mb-5 sm:mb-8 animate-fade-in">
          <span className="w-2 h-2 shrink-0 rounded-full bg-success animate-pulse-soft" />
          <span className="min-w-0 text-xs sm:text-sm text-muted-foreground break-words">
            {profile.status}
          </span>
        </div>

        <div className="grid md:grid-cols-[1fr_240px] gap-8 md:gap-12 items-start">
          <div>
            {/* Main heading */}
            <div className="flex items-start justify-between gap-4 mb-4 sm:mb-6 md:block">
              <h1 className="min-w-0 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-foreground animate-slide-up break-words leading-none">
                {profile.name}
              </h1>
              {profile.avatarUrl && (
                <img
                  src={profile.avatarUrl}
                  alt={`${profile.name} 头像`}
                  className="md:hidden w-24 h-32 rounded-xl object-cover object-top shadow-xl shrink-0 animate-slide-up stagger-1"
                />
              )}
            </div>

            {/* Role */}
            <p
              data-testid="hero-subtitle"
              className="text-xl sm:text-2xl md:text-3xl text-primary font-serif mb-3 sm:mb-4 animate-slide-up stagger-1 break-words"
            >
              {profile.title}
            </p>

            {/* Location */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-6 sm:mb-8 animate-slide-up stagger-2">
              {profile.location} · 南京工业大学人工智能专业 · 2027届
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-7 animate-slide-up stagger-2">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex min-w-0 max-w-full items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="min-w-0 break-all">{profile.email}</span>
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="inline-flex min-w-0 max-w-full items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="min-w-0 break-all">{profile.phone}</span>
                </a>
              )}
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-0 max-w-full items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  GitHub
                </a>
              )}
            </div>

            {/* Tags as badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-12 animate-slide-up stagger-3">
              {profile.tags.slice(0, 8).map((tag) => (
                <span
                  key={tag}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-card border border-border rounded-full text-xs sm:text-sm text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {profile.avatarUrl && (
            <div className="hidden md:block animate-slide-up stagger-2">
              <img
                src={profile.avatarUrl}
                alt={`${profile.name} 头像`}
                className="w-56 h-72 rounded-2xl object-cover object-top shadow-xl"
              />
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          data-testid="hero-cta"
          onClick={onOpenChat}
          className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] bg-accent text-accent-foreground rounded-2xl font-medium transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/20 animate-slide-up stagger-4"
        >
          <MessageSquare className="w-5 h-5" />
          <span>询问我的 AI 简历</span>
          <span className="absolute -top-2 right-2 sm:-right-2 px-2 py-0.5 bg-success text-primary-foreground rounded-full text-xs font-medium">
            本地数据
          </span>
        </button>

        {/* Scroll indicator */}
        <div
          className="hidden sm:flex absolute bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground animate-fade-in opacity-0"
          style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
