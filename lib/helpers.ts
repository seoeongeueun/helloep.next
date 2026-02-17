import type { ParsedContent, TableSection } from "@/types";

// wp 쪽에서 반환되는 html 엔티티를 변환
export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'");
}

//string의 html 태그 제거
export function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

//영문 제목 추출 - title.rendered에서 ENG: 또는 eng: 이후 제목
export function extractEnglishTitle(text: string): string {
  const match = text.match(/ENG:\s*(.*)/i);
  return match ? match[1].trim() : "";
}

//post의 p 태그를 기준으로 문단 구성
export function htmlToParagraphs(html: string): string[] {
  // <br> 는 공백으로
  const brAsSpace = html.replace(/<br\s*\/?>/gi, " ");

  // <p>...</p> 단위로 추출
  const pRegex = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  const paragraphs: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = pRegex.exec(brAsSpace)) !== null) {
    const inner = match[1];

    // p 내부의 모든 태그 제거
    const noTags = inner.replace(/<[^>]+>/g, "");

    // 공백 정리
    const cleaned = noTags
      .replace(/\r/g, "")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (cleaned) paragraphs.push(cleaned);
  }

  // p가 없을 때 fallback
  if (paragraphs.length === 0) {
    const fallback = brAsSpace
      .replace(/<[^>]+>/g, "")
      .replace(/\r/g, "")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return fallback ? [fallback] : [];
  }

  return paragraphs;
}

//post의 content로 국문/영문/이미지를 파싱
export function parseWpContent(html: string): ParsedContent {
  // 1) figure 블록 추출 + 이미지 src 모으기
  const images: string[] = [];
  const figureRegex = /<figure\b[^>]*>[\s\S]*?<\/figure>/gi;

  const figures = html.match(figureRegex) ?? [];
  for (const fig of figures) {
    const imgSrcRegex = /<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi;
    let m: RegExpExecArray | null;
    while ((m = imgSrcRegex.exec(fig)) !== null) {
      images.push(m[1]);
    }
  }

  // figure 제거한 본문
  const withoutFigures = html.replace(figureRegex, "").trim();

  // 2) ENG: (또는 eng:)가 들어있는 "첫 번째" p 블록을 경계로 나눔
  const engBlockRegex =
    /<p\b[^>]*>\s*(?:<[^>]+>\s*)*(eng:)\s*(?:<\/[^>]+>\s*)*<\/p>/i;
  const match = engBlockRegex.exec(withoutFigures);

  let koHtml = "";
  let enHtml = "";

  if (!match || match.index == null) {
    koHtml = withoutFigures;
    enHtml = "";
  } else {
    const start = match.index;
    const end = start + match[0].length;
    koHtml = withoutFigures.slice(0, start).trim();
    enHtml = withoutFigures.slice(end).trim();
  }

  // 3) HTML를 문단으로 텍스트 배열 (p 기준, br=공백)
  const content_ko = htmlToParagraphs(koHtml);
  const content_en = htmlToParagraphs(enHtml);

  return { images, content_ko, content_en };
}

//cv의 테이블 형태를 파싱
export function parseWpTableSections(html: string): TableSection[] {
  const src = html ?? "";

  // p 또는 table figure 블록을 "순서대로" 토큰화
  const tokenRegex =
    /<p\b[^>]*>[\s\S]*?<\/p>|<figure\b[^>]*wp-block-table[^>]*>[\s\S]*?<\/figure>/gi;

  const tokens = src.match(tokenRegex) ?? [];

  const sections: TableSection[] = [];
  let current: TableSection | null = null;

  for (const token of tokens) {
    if (/^<p\b/i.test(token)) {
      const title = decodeHtmlEntities(stripHtmlTags(token))
        .replace(/\s+/g, " ")
        .trim();

      // 빈 p면 무시
      if (!title) continue;

      current = { title, items: [] };
      sections.push(current);
      continue;
    }

    // table figure
    if (/^<figure\b/i.test(token)) {
      // 섹션 제목이 없는데 table이 먼저 오면, "Untitled" 섹션으로라도 받음
      if (!current) {
        current = { title: "Untitled", items: [] };
        sections.push(current);
      }

      // tr 단위로 파싱
      const trRegex = /<tr\b[^>]*>[\s\S]*?<\/tr>/gi;
      const trs = token.match(trRegex) ?? [];

      for (const tr of trs) {
        const tdRegex = /<td\b[^>]*>([\s\S]*?)<\/td>/gi;
        const cells: string[] = [];
        let m: RegExpExecArray | null;

        while ((m = tdRegex.exec(tr)) !== null) {
          // td 내부에서 <br>은 공백 처리
          const cell = decodeHtmlEntities(
            stripHtmlTags(m[1].replace(/<br\s*\/?>/gi, " ")),
          )
            .replace(/\s+/g, " ")
            .trim();
          cells.push(cell);
        }

        // year/label 2칸만 쓰는 구조라고 가정 (부족하면 빈문자)
        const year = (cells[0] ?? "").trim();
        const label = (cells[1] ?? "").trim();

        // 둘 다 비면 빈 row로 판단하고 제외
        if (!year && !label) continue;

        current.items.push({ year, label });
      }
    }
  }

  // 섹션 중 items가 0개인 건 필요하면 걸러도 됨
  return sections.filter((s) => s.title && s.items.length > 0);
}
