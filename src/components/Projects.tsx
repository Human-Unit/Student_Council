import { projects } from "@/data/site";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  return (
    <section
      className="section section--projects"
      id="projects"
      aria-labelledby="projects-title"
    >
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="Направления"
          title="Наши проекты"
          titleId="projects-title"
        />
        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
