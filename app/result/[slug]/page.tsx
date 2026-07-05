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
    title: `${t.codename}(${t.nameJa})— ${t.epithet}`,
    description: `「${t.catchcopy}」あなたの基本OSは ${t.codename}。仕事・転職・プライベート・恋愛でのあなたの挙動を解説します。`,
    openGraph: {
      title: `私の基本OSは ${t.codename}(${t.nameJa})`,
      description: t.catchcopy,
      images: [`${SITE_URL}/ogp/${slug}.png`],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ResultPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return <ResultShell slug={slug as TypeSlug} />;
}
