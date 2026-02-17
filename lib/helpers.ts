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

//영문 제목 추출 - title.rendered에서 ENG: 이후 제목
export function extractEnglishTitle(text: string): string {
  const match = text.match(/ENG:\s*(.*)/);
  return match ? match[1].trim() : "";
}
