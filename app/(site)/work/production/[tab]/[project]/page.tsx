import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProjectView from '@/components/ProjectView';
import { getProject, projectHref, projects } from '@/lib/projects';
import { pageMetadata } from '@/lib/site';

type Props = { params: Promise<{ tab: string; project: string }> };

export const dynamicParams = false;

/** Every project, under its own tab: /work/production/travel/nepal/. */
export function generateStaticParams() {
  return projects.map((p) => ({ tab: p.tab, project: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tab, project: slug } = await params;
  const project = getProject(tab, slug);
  if (!project) return { robots: { index: false, follow: false } };
  return pageMetadata({
    path: projectHref(project),
    title: `${project.title} | Asri Studios`,
    description: project.lead,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { tab, project: slug } = await params;
  const project = getProject(tab, slug);
  if (!project) notFound();
  return <ProjectView project={project} />;
}
