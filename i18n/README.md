# Internationalization (i18n)

The `feynman-technique` skill mirrors the user's explanation language. To support this well, each target language needs a tone and translation guide.

## Currently Supported

- 🇬🇧 [English](en.md) (reference)
- 🇰🇷 [Korean](ko.md)

## How to Add a Language

1. Copy [TEMPLATE.md](TEMPLATE.md) to `<lang>.md` using ISO 639-1 code (e.g., `ja.md`, `es.md`, `fr.md`, `de.md`, `zh.md`, `pt.md`).
2. Fill in:
   - Language metadata
   - Translations of the 7 gap category codes
   - Example Turn Response Template in the target language
   - Tone guidance (formal vs casual, regional norms)
   - 3-5 locally relatable analogies for stock metaphors
   - Translations of standard AI phrases (praise, exit triggers, etc.)
3. Submit a PR with the file.

## Contribution Guidelines

- **Native speakers only for the primary content** — translations by fluent-but-non-native speakers can miss tone nuances.
- **Don't translate the category codes themselves** (`[factual-error]`, `[jargon-dodge]`, etc.) — keep them as English identifiers. Translate only the human-readable descriptions.
- **Provide real example sentences** in the target language. Machine translations from English feel off.
- **Note regional variations** if relevant (e.g., European Spanish vs Latin American Spanish, formal vs informal Japanese).

## Why Separate Files Instead of One Big Translation File

Each language has its own tone conventions, humor, analogies, and politeness norms. A flat translation file can't capture "when to use 반말 vs 존댓말" or "tu vs usted" or Japanese register choices. Each `<lang>.md` is a living document the maintainer can refine over time.

## Currently Wanted Languages

Help wanted for:

- 🇯🇵 Japanese (ja)
- 🇨🇳 Chinese Simplified (zh-CN)
- 🇹🇼 Chinese Traditional (zh-TW)
- 🇪🇸 Spanish (es)
- 🇵🇹 Portuguese (pt)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇮🇹 Italian (it)
- 🇷🇺 Russian (ru)
- 🇻🇳 Vietnamese (vi)
- 🇮🇩 Indonesian (id)
- 🇮🇳 Hindi (hi)
- 🇸🇦 Arabic (ar)

Any language missing from the list is also welcome. Open an issue before translating to avoid duplicate work.
