import { ExternalLink, GitBranch } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

const Projects = () => {
  const { profile } = useProfile();
  const projects = profile?.projects || [];

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mb-4">
            项目经历
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
            重点放在 Agent
            编排、检索增强、流式交互和任务持久化这些真实工程环节。
          </p>
        </div>

        <div className="space-y-6">
          {projects.map((project) => {
            const githubUrl =
              project.github_url ||
              (project.url?.includes('github.com') ? project.url : undefined);
            const liveUrl =
              project.live_url ||
              (project.url && !project.url.includes('github.com')
                ? project.url
                : undefined);

            return (
              <article
                key={project.name}
                className="bg-card border border-border rounded-2xl p-5 sm:p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <GitBranch className="w-5 h-5 text-accent" />
                      <h3 className="text-xl sm:text-2xl font-serif text-foreground">
                        {project.name}
                      </h3>
                    </div>
                    <p className="text-primary">{project.role}</p>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">
                    {project.period}
                  </span>
                </div>

                {(githubUrl || liveUrl) && (
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                      >
                        <GitBranch className="h-4 w-4 shrink-0" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {liveUrl && (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm text-accent transition-colors hover:bg-accent/15"
                      >
                        <ExternalLink className="h-4 w-4 shrink-0" />
                        <span>项目上线地址，点击体验</span>
                      </a>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 bg-secondary border border-border rounded-full text-xs text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <ul className="space-y-3 mb-6">
                  {project.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className="text-accent mt-1.5">-</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-3 overflow-x-auto pb-1">
                  {project.outcomes.map((outcome) => (
                    <div
                      key={outcome}
                      className="min-w-[260px] flex-1 bg-success-muted border border-success/20 rounded-xl p-4 text-sm text-foreground"
                    >
                      {outcome}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
