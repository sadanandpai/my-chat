# Character Chat

1:1 chats and a short group discussion with stock character types. Each person stays in a tight voice: one or two sentences, no celebrity names, no "as an AI". Close a chat and the history is gone. Custom characters live in this browser only.

Live build: https://sadanandpai.github.io/character-chat/

## What it does

**1:1 chat.** Home lists the built-ins (arrogant professor, stingy businessman, cynical detective, wellness guru, overconfident founder, hotheaded coach) plus anyone you add. Open a card and talk. The widget is [Deep Chat](https://github.com/OvidijusParsiunas/deep-chat). The last 4 user/assistant turns go to the model with that character's system prompt.

**Your own characters.** Add new character on home. Name, blurb, system prompt, one of four local avatars. Edit and delete only apply to those. They are stored under `character-chat.custom-characters` in `localStorage`. Built-ins are not editable.

**Group discussion.** Pick 2 to 4 people, a topic, optional stacked attitudes (professional, rude, witty, and the rest), and 2 to 5 rounds. Speakers rotate. You can stop mid-run. The transcript stays on that page until you leave or start again.

Routing is hash-based (`#/chat/professor`, `#/discussion`) so GitHub Pages works with `base: /character-chat/`.

## Run it

Needs Node 24 and, for local chat, [Ollama](https://ollama.com/) with `llama3.2` (or set `VITE_OLLAMA_MODEL`).

```bash
npm install
npm run dev
```

Dev defaults to Ollama. Vite proxies `/ollama` to `http://127.0.0.1:11434`. Production builds use the Cloudflare worker at `https://llm-proxy.sadanandpai.workers.dev/` unless you force otherwise.

| Variable            | Meaning                                                                           |
| ------------------- | --------------------------------------------------------------------------------- |
| `VITE_LLM_BACKEND`  | `ollama` or `proxy`. Unset: ollama in `npm run dev`, proxy in a production build. |
| `VITE_OLLAMA_URL`   | Chat endpoint. Default `/ollama/api/chat`.                                        |
| `VITE_OLLAMA_MODEL` | Default `llama3.2`.                                                               |

```bash
npm run lint
npm run build
npm run preview
```

Push to `main` runs lint + build, then deploys `dist` to GitHub Pages.
