import { CHARACTERS } from "../characters.ts";

const ORBIT_COUNT = 6;

export function HomeHero() {
  const orbit = CHARACTERS.slice(0, ORBIT_COUNT);

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero-copy">
        <h1 id="home-hero-title">Talk like you sat down with them.</h1>
        <p className="home-hero-lede">
          Pick a stock type. The chat stays in that voice: the professor who
          thinks you are wasting office hours, the businessman who splits the
          bill, HR quoting the handbook. History lives on the page you are on. Close
          it and it is gone.
        </p>
      </div>
      <div className="home-hero-orbit" aria-hidden="true">
        <div className="home-hero-orbit-ring" />
        {orbit.map((character) => (
          <img
            key={character.id}
            className="home-hero-orbit-face"
            src={character.avatar}
            alt=""
            width={72}
            height={72}
          />
        ))}
      </div>
    </section>
  );
}
