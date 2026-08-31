import { useState } from "react";
import { Link } from "react-router-dom";
import { CharacterFormModal } from "../components/CharacterFormModal.tsx";
import { HomeHero } from "../components/HomeHero.tsx";
import type { CustomCharacter } from "../characters.ts";
import {
  deleteCustomCharacter,
  useAllCharacters,
} from "../customCharacters.ts";

type ModalMode =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; character: CustomCharacter };

export function HomePage() {
  const characters = useAllCharacters();
  const [modal, setModal] = useState<ModalMode>({ kind: "closed" });

  return (
    <div className="home-shell">
      <header className="home-topbar">
        <Link className="home-brand" to="/">
          Character Chat
        </Link>
        <div className="home-topbar-actions">
          <Link className="home-discuss-link" to="/discussion">
            Group discussion
          </Link>
          <a
            className="home-github-link"
            href="https://github.com/sadanandpai/my-chat"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
          >
            <svg
              className="home-github-icon"
              viewBox="0 0 16 16"
              width="20"
              height="20"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
              />
            </svg>
          </a>
        </div>
      </header>

      <main className="page home">
        <HomeHero />
        <div className="home-intro home-intro-row">
          <div>
            <h2 className="home-section-title">Characters</h2>
            <p className="lede">Pick someone to talk to.</p>
          </div>
          <button
            type="button"
            className="discussion-start"
            onClick={() => {
              setModal({ kind: "create" });
            }}
          >
            Add new character
          </button>
        </div>
        <ul className="character-grid">
          {characters.map((character) => (
            <li key={character.id}>
              <div className="character-tile">
                <Link className="character-card" to={`/chat/${character.id}`}>
                  <img
                    className="character-card-avatar"
                    src={character.avatar}
                    alt=""
                    width={96}
                    height={96}
                  />
                  <span className="character-card-body">
                    <span className="character-card-name">
                      {character.name}
                    </span>
                    <span className="character-card-blurb">
                      {character.blurb}
                    </span>
                    <span className="character-card-cta">Open chat</span>
                  </span>
                </Link>
                {character.kind === "custom" ? (
                  <div className="character-card-actions">
                    <button
                      type="button"
                      className="character-card-action"
                      onClick={() => {
                        setModal({ kind: "edit", character });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="character-card-action"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete ${character.name}? This only removes the local copy.`,
                          )
                        ) {
                          deleteCustomCharacter(character.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </main>
      <CharacterFormModal
        mode={modal}
        onClose={() => {
          setModal({ kind: "closed" });
        }}
      />
    </div>
  );
}
