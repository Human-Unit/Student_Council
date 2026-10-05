"use client";

import { useState } from "react";
import { projects } from "@/data/site";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  const [orderedProjects, setOrderedProjects] = useState(projects);

  function shuffleProjects() {
    setOrderedProjects((current) => {
      const shuffled = [...current];

      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [
          shuffled[swapIndex],
          shuffled[index],
        ];
      }

      return shuffled;
    });
  }

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
        <div className="projects-tools" data-reveal="up">
          <button className="projects-shuffle" onClick={shuffleProjects}>
            Перемешать проекты <span aria-hidden="true">↻</span>
          </button>
        </div>
        <div className="projects-grid">
          {orderedProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
