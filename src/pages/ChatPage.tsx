import { DeepChat } from "deep-chat-react";
import { Link, useParams } from "react-router-dom";
import { characterById } from "../characters.ts";
import { useAllCharacters } from "../customCharacters.ts";
import {
  aiAvatar,
  auxiliaryStyle,
  chatStyle,
  inputAreaStyle,
  messageStyles,
  submitButtonStyles,
  textInput,
} from "../chatWidgetStyles.ts";
import {
  HISTORY_WINDOW,
  LLM_BACKEND,
  assistantReplyFromProxy,
  proxyRequestBody,
} from "../llmProxy.ts";

export function ChatPage() {
  const characters = useAllCharacters();
  const { characterId } = useParams();
  const character =
    characterId === undefined
      ? undefined
      : characterById(characterId, characters);

  if (character === undefined) {
    return (
      <div className="chat-app">
        <header className="home-topbar chat-topbar">
          <Link className="home-brand" to="/">
            Character Chat
          </Link>
        </header>
        <main className="page">
          <p>Unknown character.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="chat-app">
      <header className="home-topbar chat-topbar">
        <Link className="home-brand" to="/">
          Character Chat
        </Link>
        <div className="chat-header-who">
          <img
            className="chat-header-avatar"
            src={character.avatar}
            alt=""
            width={44}
            height={44}
          />
          <div className="chat-header-copy">
            <h1>{character.name}</h1>
            <p className="chat-header-blurb">{character.blurb}</p>
          </div>
        </div>
      </header>
      <main className="chat-page">
        <div className="chat-shell">
          <DeepChat
            key={character.id}
            className="chat-widget"
            style={{ width: "100%", height: "100%" }}
            chatStyle={chatStyle}
            inputAreaStyle={inputAreaStyle}
            textInput={textInput}
            submitButtonStyles={submitButtonStyles}
            messageStyles={messageStyles}
            auxiliaryStyle={auxiliaryStyle}
            connect={{
              url: LLM_BACKEND.url,
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }}
            requestBodyLimits={{ maxMessages: HISTORY_WINDOW }}
            requestInterceptor={(details) => ({
              ...details,
              body: proxyRequestBody({
                systemPrompt: character.systemPrompt,
                body: details.body,
              }),
            })}
            responseInterceptor={assistantReplyFromProxy}
            remarkable={{ html: false }}
            displayLoadingBubble={true}
            avatars={{
              ai: { src: character.avatar, styles: aiAvatar.styles },
            }}
            introMessage={{
              text: `Talk to ${character.name}. History stays on this page.`,
            }}
          />
        </div>
      </main>
    </div>
  );
}
