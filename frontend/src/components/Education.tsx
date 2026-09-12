import { GraduationCap } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

const Education = () => {
  const { profile } = useProfile();
  const education = profile?.education || [];

  if (education.length === 0) return null;

  return (
    <section id="education" className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mb-4">
            教育背景
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
            人工智能专业背景，课程和项目实践都围绕模型、算法与工程落地展开。
          </p>
        </div>

        <div className="space-y-4">
          {education.map((item) => (
            <article
              key={`${item.school}-${item.period}`}
              className="bg-card border border-border rounded-2xl p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif text-foreground">
                      {item.school}
                    </h3>
                    <p className="text-primary">
                      {item.degree} · {item.major} · {item.location}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-mono text-muted-foreground">
                  {item.period}
                </span>
              </div>

              <ul className="space-y-3">
                {item.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <span className="text-accent mt-1.5">-</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
