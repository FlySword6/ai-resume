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
            重点放在 Agent 编排、检索增强、流式交互和任务持久化这些真实工程环节。
          </p>
        </div>

        <div className="space-y-6">
          {projects.map((project) => (
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

              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full items-center gap-2 text-sm text-accent hover:text-accent/80 mb-5"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span className="min-w-0 break-all">{project.url}</span>
                </a>
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

              <div className="grid gap-3 sm:grid-cols-3">
                {project.outcomes.map((outcome) => (
                  <div
                    key={outcome}
                    className="bg-success-muted border border-success/20 rounded-xl p-4 text-sm text-foreground"
                  >
                    {outcome}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
