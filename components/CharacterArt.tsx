import { TYPE_BY_SLUG, type TypeSlug } from "@/content/types";

// GPT Image 2の本画像が用意できたら、拡張子を .svg → .png に変えるだけで差し替わる
const EXT = "png";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function CharacterArt({
  slug,
  className = "hero-char",
}: {
  slug: TypeSlug;
  className?: string;
}) {
  const t = TYPE_BY_SLUG[slug];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${BASE_PATH}/characters/${slug}.${EXT}`}
      alt={`${t.codename}（${t.nameJa}）のキャラクター`}
      className={className}
      loading="lazy"
    />
  );
}
