import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { characterById } from "../characters.ts";
import { useAllCharacters } from "../customCharacters.ts";
import {
  DEFAULT_ROUNDS,
  DISCUSSION_ATTITUDES,
  DISCUSSION_MAX,
  DISCUSSION_MIN,
  MAX_ROUNDS,
  MIN_ROUNDS,
  attitudeLabels,
  discussionSystemPrompt,
  discussionUserContent,
  extraInstructionsFromAttitudes,
  rotatedOrder,
  transcriptText,
  type DiscussionAttitudeId,
  type DiscussionTurn,
} from "../discussion.ts";
import { completeChat } from "../llmProxy.ts";

type Phase = "idle" | "running" | "stopped" | "done";

export function DiscussionPage() {
  const characters = useAllCharacters();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [attitudeIds, setAttitudeIds] = useState<DiscussionAttitudeId[]>([]);
  const [rounds, setRounds] = useState(DEFAULT_ROUNDS);
  const [phase, setPhase] = useState<Phase>("idle");
  const [turns, setTurns] = useState<DiscussionTurn[]>([]);
  const [speakingId, setSpeakingId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const abortRef = useRef<AbortController | undefined>(undefined);
  const threadEndRef = useRef<HTMLLIElement | null>(null);

  const extraInstructions = extraInstructionsFromAttitudes(attitudeIds);
  const compact = phase !== "idle";
  const setupLocked = phase === "running";
  const canStart =
    !setupLocked &&
    selectedIds.length >= DISCUSSION_MIN &&
    selectedIds.length <= DISCUSSION_MAX &&
    topic.trim().length > 0 &&
    Number.isInteger(rounds) &&
    rounds >= MIN_ROUNDS &&
    rounds <= MAX_ROUNDS;

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "end" });
  }, [turns, speakingId]);

  function toggleAttitude(id: DiscussionAttitudeId) {
    if (setupLocked) return;
    setAttitudeIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setPhase("idle");
    setError(undefined);
  }

  function toggleCharacter(id: string) {
    if (setupLocked) return;
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= DISCUSSION_MAX) return current;
      return [...current, id];
    });
    setPhase("idle");
    setError(undefined);
  }

  function stopDiscussion() {
    abortRef.current?.abort();
  }

  function openSetup() {
    abortRef.current?.abort();
    setSpeakingId(undefined);
    setError(undefined);
    setTurns([]);
    setPhase("idle");
  }

  function exportTranscript() {
    const blob = new Blob(
      [
        transcriptText({
          topic,
          extraInstructions,
          turns,
        }),
      ],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "discussion.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function startDiscussion() {
    if (!canStart) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const order = rotatedOrder(selectedIds);
    const peers = order
      .map((id) => characterById(id, characters))
      .filter((character) => character !== undefined);
    setTurns([]);
    setError(undefined);
    setPhase("running");
    const collected: DiscussionTurn[] = [];
    try {
      for (let round = 0; round < rounds; round += 1) {
        for (const character of peers) {
          if (controller.signal.aborted) {
            setPhase("stopped");
            setSpeakingId(undefined);
            return;
          }
          setSpeakingId(character.id);
          const result = await completeChat({
            systemPrompt: discussionSystemPrompt({
              character,
              peers,
              topic,
              extraInstructions,
            }),
            userContent: discussionUserContent({
              speakerName: character.name,
              topic,
              turns: collected,
            }),
            signal: controller.signal,
          });
          if (controller.signal.aborted) {
            setPhase("stopped");
            setSpeakingId(undefined);
            return;
          }
          if ("error" in result) {
            if (result.error !== "Stopped") setError(result.error);
            setPhase("stopped");
            setSpeakingId(undefined);
            return;
          }
          const turn: DiscussionTurn = {
            characterId: character.id,
            name: character.name,
            text: result.text,
          };
          collected.push(turn);
          setTurns([...collected]);
        }
      }
      setPhase("done");
      setSpeakingId(undefined);
    } catch {
      if (controller.signal.aborted) {
        setPhase("stopped");
      } else {
        setError("Request failed");
        setPhase("stopped");
      }
      setSpeakingId(undefined);
    }
  }

  const actions = (
    <div className="discussion-actions">
      <button
        type="button"
        className="discussion-start"
        disabled={!canStart}
        onClick={() => {
          void startDiscussion();
        }}
      >
        Start discussion
      </button>
      <button
        type="button"
        className="chat-back discussion-stop"
        disabled={phase !== "running"}
        onClick={stopDiscussion}
      >
        Stop
      </button>
      <button
        type="button"
        className="chat-back"
        disabled={turns.length === 0}
        onClick={exportTranscript}
      >
        Export
      </button>
    </div>
  );

  return (
    <div
      className={compact ? "home-shell discussion-live-shell" : "home-shell"}
    >
      <header className="home-topbar">
        <Link className="home-brand" to="/">
          Character Chat
        </Link>
        <button type="button" className="chat-back" onClick={openSetup}>
          Back
        </button>
      </header>
      <main
        className={
          compact
            ? "page discussion-page discussion-page-live"
            : "page discussion-page"
        }
      >
        {compact ? (
          <div className="discussion-compact-bar">
            <div className="discussion-compact-faces" aria-hidden="true">
              {selectedIds.map((id) => {
                const character = characterById(id, characters);
                if (character === undefined) return null;
                return (
                  <img
                    key={character.id}
                    src={character.avatar}
                    alt=""
                    width={32}
                    height={32}
                  />
                );
              })}
            </div>
            <div className="discussion-compact-copy">
              <p className="discussion-compact-topic">{topic}</p>
              {attitudeIds.length > 0 ? (
                <p className="discussion-compact-notes">
                  {attitudeLabels(attitudeIds)}
                </p>
              ) : null}
            </div>
            <p className="discussion-compact-rounds">{rounds} rounds</p>
            {actions}
          </div>
        ) : (
          <>
            <h1>Group discussion</h1>
            <p className="lede">
              Pick {DISCUSSION_MIN} to {DISCUSSION_MAX} voices, set a topic,
              then start. You watch. They talk.
            </p>
            <fieldset className="discussion-fieldset">
              <legend>Characters</legend>
              <ul className="discussion-picks">
                {characters.map((character) => {
                  const checked = selectedIds.includes(character.id);
                  const blocked =
                    !checked && selectedIds.length >= DISCUSSION_MAX;
                  return (
                    <li key={character.id}>
                      <label
                        className={
                          checked
                            ? "discussion-pick discussion-pick-on"
                            : "discussion-pick"
                        }
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={blocked}
                          onChange={() => {
                            toggleCharacter(character.id);
                          }}
                        />
                        <img
                          src={character.avatar}
                          alt=""
                          width={40}
                          height={40}
                        />
                        <span>{character.name}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
            <label className="discussion-field">
              Topic
              <textarea
                value={topic}
                rows={2}
                placeholder="Who splits the bill, Ban the all-hands, Is remote work a bluff"
                onChange={(event) => {
                  setTopic(event.target.value);
                }}
              />
            </label>
            <fieldset className="discussion-fieldset">
              <legend>Attitudes</legend>
              <ul className="discussion-attitudes">
                {DISCUSSION_ATTITUDES.map((attitude) => {
                  const checked = attitudeIds.includes(attitude.id);
                  return (
                    <li key={attitude.id}>
                      <label
                        className={
                          checked
                            ? "discussion-pick discussion-pick-on"
                            : "discussion-pick"
                        }
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            toggleAttitude(attitude.id);
                          }}
                        />
                        <span>{attitude.label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
            <label className="discussion-field discussion-rounds">
              Rounds
              <input
                type="number"
                min={MIN_ROUNDS}
                max={MAX_ROUNDS}
                value={rounds}
                onChange={(event) => {
                  const next = Number.parseInt(event.target.value, 10);
                  if (Number.isNaN(next)) {
                    setRounds(DEFAULT_ROUNDS);
                    return;
                  }
                  setRounds(Math.min(MAX_ROUNDS, Math.max(MIN_ROUNDS, next)));
                }}
              />
            </label>
            {actions}
          </>
        )}
        {error !== undefined ? (
          <p className="discussion-error">{error}</p>
        ) : null}
        {compact ? (
          <ol className="discussion-thread">
            {turns.map((turn, index) => {
              const character = characterById(turn.characterId, characters);
              return (
                <li key={`${turn.characterId}-${index}`}>
                  {character !== undefined ? (
                    <img
                      className="discussion-turn-avatar"
                      src={character.avatar}
                      alt=""
                      width={44}
                      height={44}
                    />
                  ) : null}
                  <div>
                    <p className="discussion-turn-name">{turn.name}</p>
                    <p className="discussion-turn-text">{turn.text}</p>
                  </div>
                </li>
              );
            })}
            {speakingId !== undefined ? (
              <li className="discussion-pending" ref={threadEndRef}>
                {characterById(speakingId, characters)?.name} is speaking…
              </li>
            ) : (
              <li className="discussion-thread-end" ref={threadEndRef} />
            )}
          </ol>
        ) : null}
      </main>
    </div>
  );
}
