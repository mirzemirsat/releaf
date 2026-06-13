import { notFound } from "next/navigation";
import { DEFAULT_CONTENT, SECTION_META, type SectionKey } from "@/lib/content/defaults";
import { getSection } from "@/lib/content/store";
import SectionEditor from "@/components/admin/SectionEditor";

export default async function ContentSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!(section in DEFAULT_CONTENT)) notFound();

  const key = section as SectionKey;
  const meta = SECTION_META[key];
  const data = await getSection(key);

  return (
    <SectionEditor
      key={key}
      section={key}
      title={meta.title}
      description={meta.description}
      initial={JSON.parse(JSON.stringify(data))}
    />
  );
}
