import { CHARACTERS } from "../characters.ts";

const PREVIEW_COUNT = 3;

export function HomeHero() {
  const preview = CHARACTERS.slice(0, PREVIEW_COUNT);

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <p className="home-hero-kicker">Character chat</p>
      <h1 id="home-hero-title">Talk like you sat down with them.</h1>
      <p className="home-hero-lede">
        Pick a person. The chat stays in that voice: Dhoni finishing a chase,
        Kalam with a student, Rajini on a talk show. History lives on the page
        you are on. Close it and it is gone.
      </p>
      <div className="home-hero-faces" aria-hidden="true">
        {preview.map((character) => (
          <img
            key={character.id}
            className="home-hero-face"
            src={character.avatar}
            alt=""
            width={56}
            height={56}
          />
        ))}
        <span className="home-hero-face-more">{CHARACTERS.length} voices</span>
      </div>
    </section>
  );
}
