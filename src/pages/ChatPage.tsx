import { DeepChat } from "deep-chat-react";
import { Link, useParams } from "react-router-dom";
import { characterById } from "../characters.ts";
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
  LLM_PROXY_URL,
  assistantReplyFromProxy,
  proxyRequestBody,
} from "../llmProxy.ts";

export function ChatPage() {
  const { characterId } = useParams();
  const character =
    characterId === undefined ? undefined : characterById(characterId);

  if (character === undefined) {
    return (
      <main className="page">
        <p>Unknown character.</p>
        <Link to="/">Back</Link>
      </main>
    );
  }

  return (
    <div className="chat-app">
      <main className="chat-page">
        <header className="chat-header">
          <Link className="chat-back" to="/">
            Back
          </Link>
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
        </header>
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
              url: LLM_PROXY_URL,
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }}
            requestBodyLimits={{ maxMessages: HISTORY_WINDOW }}
            requestInterceptor={(details) => ({
              ...details,
              body: proxyRequestBody(character.systemPrompt, details.body),
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
