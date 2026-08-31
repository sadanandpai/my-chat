export const SITE_URL = "https://sadanandpai.github.io/character-chat/";
export const SITE_NAME = "Character Chat";
export const SITE_DESCRIPTION =
  "Talk to stock character types in a tight voice, or run a short group discussion. Close the page and the history is gone.";

export function pageTitle(page: string): string {
  return `${page} \u00b7 ${SITE_NAME}`;
}

export function titleForPath(
  pathname: string,
  characterName: string | undefined,
): string {
  if (pathname === "/discussion") return pageTitle("Group discussion");
  if (pathname.startsWith("/chat/")) {
    return characterName === undefined
      ? pageTitle("Unknown character")
      : pageTitle(characterName);
  }
  return SITE_NAME;
}
