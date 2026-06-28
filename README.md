# Squeeze — Pelvic Floor Trainer

A cross-platform iOS & Android pelvic floor exercise app built with Expo. Clinically informed, privacy-first, no dark patterns.

## What makes it different

- **Notifications that work** — smart suppression (skips reminders if you've already exercised today)
- **No rep caps** — fully customisable including physio-prescribed values (1–50 reps, 1–30s holds)
- **Background mode** — exercises run with the screen off via haptics; doesn't pause your music
- **Cross-device sync** — Supabase-backed, local-first; history survives phone upgrades
- **Transparent freemium** — core engine free forever, one-time premium purchase, no subscription traps

## Tech Stack

| Layer       | Choice                                 |
|-------------|----------------------------------------|
| Framework   | Expo SDK 56 + React Native 0.85        |
| Language    | TypeScript (strict)                    |
| Routing     | Expo Router v3                         |
| Styling     | NativeWind v4 (Tailwind)               |
| Animations  | React Native Reanimated 4              |
| State       | Zustand                                |
| Local DB    | Expo SQLite + Drizzle ORM              |
| Fast KV     | React Native MMKV                      |
| Backend     | Supabase (auth + PostgreSQL sync)      |
| Notifications | expo-notifications                   |
| Haptics     | expo-haptics                           |
| Build       | EAS Build + EAS Update                 |

## Branching

| Branch    | Purpose                                              |
|-----------|------------------------------------------------------|
| `main`    | App Store / Play Store releases (EAS `production`)   |
| `develop` | TestFlight / Play beta (EAS `preview`)               |
| `feature/*` | Day-to-day work, PR into `develop`               |

## Getting started

```bash
# Install dependencies
npm install

# Copy env template and fill in your Supabase keys
cp .env.example .env

# Start Expo dev server
npm start
```

## Environment variables

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EAS_PROJECT_ID=your-eas-project-id
```

## Project structure

```
src/
  app/              Expo Router file-based routes
    (tabs)/         Tab screens (Home, History, Programs, Settings)
    exercise/       Active exercise full-screen modal
    onboarding/     First-run setup flow
  features/
    exercise/       Timer engine, programs, session repository
    reminders/      Notification scheduling
    auth/           Supabase auth hook
  components/ui/    SqueezeRing, Button, Card, SessionCard…
  lib/              DB client, MMKV, Supabase client, constants
```

## Exercise types

- **Slow Hold** — sustained contraction (the classic Kegel)
- **Quick Flick** — rapid pulse contractions
- **Mixed** — combination of both (recommended for most programs)

## Programs

| Program       | Difficulty    | Premium |
|---------------|---------------|---------|
| Foundation    | Beginner      | Free    |
| Build & Hold  | Intermediate  | Yes     |
| Power Floor   | Advanced      | Yes     |
