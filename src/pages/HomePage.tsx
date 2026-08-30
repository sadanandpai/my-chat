import { Link } from "react-router-dom";
import { CHARACTERS } from "../characters.ts";
import { HomeHero } from "../components/HomeHero.tsx";

export function HomePage() {
  return (
    <div className="home-shell">
      <header className="home-topbar">
        <p className="home-brand">My Chat</p>
      </header>

      <main className="page home">
        <HomeHero />
        <div className="home-intro">
          <h2 className="home-section-title">Characters</h2>
          <p className="lede">Pick someone to talk to.</p>
        </div>
        <ul className="character-grid">
          {CHARACTERS.map((character) => (
            <li key={character.id}>
              <Link className="character-card" to={`/chat/${character.id}`}>
                <img
                  className="character-card-avatar"
                  src={character.avatar}
                  alt=""
                  width={96}
                  height={96}
                />
                <span className="character-card-body">
                  <span className="character-card-name">{character.name}</span>
                  <span className="character-card-blurb">
                    {character.blurb}
                  </span>
                  <span className="character-card-cta">Open chat</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
