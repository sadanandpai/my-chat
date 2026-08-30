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
        <Link className="home-discuss-link" to="/discussion">
          Group discussion
        </Link>
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
