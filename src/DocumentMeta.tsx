import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { characterById } from "./characters.ts";
import { useAllCharacters } from "./customCharacters.ts";
import { titleForPath } from "./site.ts";

export function DocumentMeta() {
  const { pathname } = useLocation();
  const characters = useAllCharacters();
  const characterId = pathname.startsWith("/chat/")
    ? pathname.slice("/chat/".length)
    : undefined;
  const character =
    characterId === undefined
      ? undefined
      : characterById(characterId, characters);
  const title = titleForPath(pathname, character?.name);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
