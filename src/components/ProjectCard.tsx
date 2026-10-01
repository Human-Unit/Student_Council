import type { Project } from "@/data/site";
import { ArrowIcon } from "./ArrowIcon";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="project-card">
      <span className="project-number">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="project-heading">
        <p className="project-eyebrow">{project.eyebrow}</p>
        <h3>{project.title}</h3>
      </div>
      <p className="project-description">{project.description}</p>
      <div className="project-action">
        {project.href ? (
          <a
            className="project-link"
            href={project.href}
            {...(project.href.startsWith("http")
              ? { target: "_blank", rel: "noreferrer" }
              : {})}
          >
            {project.cta} <ArrowIcon />
          </a>
        ) : (
          <span
            className="project-link project-link--disabled"
            aria-label={`${project.cta}: ссылка ещё не добавлена`}
          >
            <span>{project.cta}</span>
            <small>Ссылка уточняется</small>
          </span>
        )}
      </div>
    </article>
  );
}
