import type { Metadata } from "next";
import ResultShell from "@/components/ResultShell";
import { TYPES, TYPE_BY_SLUG, type TypeSlug } from "@/content/types";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jibun-os.example.com").replace(/\/$/, "");

export const dynamicParams = false;

export function generateStaticParams() {
  return TYPES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const t = TYPE_BY_SLUG[slug as TypeSlug];
  return {
    title: `${t.codename}(${t.nameJa})とは — 16の光 図鑑`,
    description: `${t.family}「${t.codename}」(${t.epithet})の解説。${t.catchcopy}`,
    openGraph: { images: [`${SITE_URL}/ogp/${slug}.png`] },
  };
}

export default async function TypeCatalogPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return <ResultShell slug={slug as TypeSlug} catalog />;
}
