# Radiom
## Product Design & Development Plan

### 1. Product Overview

**Radiom** is a digital ambient workspace powered by real radio stations. It is designed for studying, coding, reading, relaxing, and long-focus sessions. The experience combines live radio playback with an immersive room-like interface, floating controls, productivity tools, and optional social features.

Radiom should feel less like a traditional music app and more like entering a calm, interactive space.

### 2. Product Goals

#### Primary goals
- Provide a visually rich, atmospheric listening experience.
- Let users discover and play live radio stations easily.
- Support long study sessions with minimal distraction.
- Create a flexible architecture that can support multiple radio providers later.
- Make the product portfolio-worthy through polished UI, technical depth, and strong interaction design.

#### Secondary goals
- Add productivity tools such as a Pomodoro timer, notes, and session tracking.
- Support personalization through themes and favorite stations.
- Create a room-based interface that feels alive and interactive.
- Keep the system modular so features can be added without redesigning the app.

### 3. Product Positioning

Radiom is not just a radio player.

It is a **digital study environment** built around live radio stations, with a room-based interface, ambient visuals, and optional productivity tools.

The radio is the background layer.
The environment is the product.

### 4. Core Design Principles

#### 4.1 Atmosphere first
The app must feel immersive, calm, and alive. Visuals, motion, and layout should support the listening experience instead of competing with it.

#### 4.2 Music should stay in the background
Music controls should be present, accessible, and elegant, but never dominate the whole screen.

#### 4.3 The UI should feel like a space
The app should resemble a digital room or workspace rather than a standard dashboard.

#### 4.4 Use floating panels instead of heavy navigation
Avoid a traditional top navigation bar and full-page switching wherever possible. Prefer drawers, overlays, widgets, dock icons, and contextual panels.

#### 4.5 Make the system modular
The app should be built so the music source can be swapped later without changing the UI or core player logic.

#### 4.6 Design for long sessions
The interface should remain comfortable for 30 minutes, 2 hours, or 8 hours of use.

### 5. Target Users

#### 5.1 Primary user
A student, developer, or knowledge worker who wants a calm background environment for focus.

#### 5.2 Secondary user
Someone who enjoys ambient digital spaces, radio discovery, and interactive UI design.

#### 5.3 Portfolio reviewer
A recruiter, interviewer, or senior developer evaluating architectural thinking, visual polish, and system complexity.

### 6. User Experience Concept

Radiom should open into a full-screen scene with a strong atmosphere. The user sees the room first, not menus.

The interface should be composed of layers:

1. **Background layer** — rain, night sky, skyline, window glow, ambient effects.
2. **Scene layer** — desk, window, lamp, laptop, shelf, or other interactive objects.
3. **Widget layer** — floating timer, notes, station details, chat, etc.
4. **Control layer** — playback controls, timestamps, volume, favorite actions.
5. **Context layer** — side panel or modal for deeper station, user, or session info.

### 7. Recommended Layout Structure

#### 7.1 Main layout concept
The app should use a full-screen canvas or scene background with UI floating above it.

**Recommended layout zones:**
- **Center/Main scene**: the interactive room and visual atmosphere.
- **Bottom floating player**: controls, track/station name, progress, play state.
- **Left dock**: quick access to main areas such as stations, favorites, notes, timer, settings.
- **Right side panel**: contextual information that changes based on the selected item.
- **Floating widgets**: optional draggable panels for focus tools.

#### 7.2 Why this structure works
- It keeps the interface visually unique.
- It prevents the app from feeling like a normal radio website.
- It allows the room to stay full-screen and immersive.
- It gives flexibility for future features.

### 8. Visual Direction

#### 8.1 Overall style
- Dark, soft, atmospheric, and minimal.
- Glassmorphism for overlays and controls.
- Gentle blur and transparency for floating panels.
- Soft glow and subtle motion rather than heavy animation.

#### 8.2 Mood themes
The app should support different environments. Example themes:
- **Rainy Library**
- **Coffee Shop**
- **Midnight Coding**
- **Late Night Tokyo**
- **Deep Focus**
- **Jazz Lounge**

Each theme may have different colors, ambient effects, background visuals, and station groupings.

#### 8.3 Visual assets
Possible visual components:
- Rain on glass
- Moving clouds
- Night city skyline
- Window light reflections
- Desk lamps
- Glowing screens
- Tiny ambient particles
- Optional animated background objects

### 9. Interface Structure in Detail

#### 9.1 Background and environment
The background should fill the entire viewport.

Examples:
- Animated rain over a window
- Subtle night sky movement
- Neon city lights in the distance
- Slow particle drift
- Interactive window opening

The background should not be purely decorative. It should support the user mood and help the app feel like a place.

#### 9.2 Scene objects
The room can include clickable or hoverable objects.

Examples:
- **Window** → weather, atmosphere, day/night settings
- **Desk** → study stats, session details, notes
- **Laptop** → current station, track history, favorites
- **Bookshelf** → saved stations, curated collections
- **Lamp** → brightness or mood controls
- **Clock** → timer, session duration, local time

#### 9.3 Floating player
The player should remain visible and accessible, ideally anchored near the bottom center.

Player should include:
- Station name or current stream title
- Live/playing state
- Play/pause
- Skip or next station
- Volume control
- Timestamp / elapsed time
- Progress indicator
- Favorite button
- Quick mood switch

#### 9.4 Left dock
A slim icon dock can hold quick actions.

Recommended items:
- Home / Room
- Stations
- Favorites
- Study Tools
- Sessions
- Settings

This keeps the main scene clean.

#### 9.5 Right contextual panel
This panel should appear when users click a station, theme, object, or widget.

Possible contents:
- Station metadata
- Genre / tags
- Country / language
- Stream bitrate or source info
- Artist or station website
- Session info
- User notes
- Activity log

### 10. Feature Specification

#### 10.1 Radio and station browsing
Core feature set:
- Search stations
- Filter by tag, language, country, genre
- Open station detail panel
- Add to favorites
- Play selected station
- Switch quickly between themed stations

#### 10.2 Favorites
Users can favorite stations and access them quickly from a dedicated panel.

#### 10.3 Listening history
Track recently played stations and playback duration.

#### 10.4 Study timer
A built-in Pomodoro-style timer or custom session timer.

Options:
- 25/5
- 50/10
- custom durations
- auto-start next focus session

#### 10.5 Notes
A lightweight floating notes widget for quick thoughts.

#### 10.6 Session tracking
Track:
- session start time
- session duration
- stations used
- focus time
- breaks taken

#### 10.7 Real-time chat or shared room features
Optional later phase:
- room chat
- presence indicators
- shared study rooms
- live “people here now” count

### 11. Architecture Strategy

Radiom should use a layered architecture so the app remains flexible.

#### 11.1 Domain layer
This is the core app language.

Suggested entities:
- Station
- Track
- Channel
- Theme
- Favorite
- Session
- User
- Widget
- ChatMessage

#### 11.2 Provider layer
The app must not depend directly on one API.

Create a provider interface such as:
- `searchStations()`
- `getStationById()`
- `getStationStreamUrl()`
- `getStationGenres()`
- `getFeaturedStations()`

Provider implementations can later include:
- Radio Browser provider
- Custom provider
- Additional station directory provider

#### 11.3 Service layer
Services should handle business logic:
- playback service
- queue/service logic
- theme service
- session tracking service
- favorites service
- timer service
- chat service later

#### 11.4 State layer
Use a state management approach that keeps different concerns separate.

Suggested store groups:
- player store
- station store
- theme store
- widget store
- favorites store
- session store
- user store
- chat store later

#### 11.5 UI layer
The UI should only consume state and call service actions. It should not contain provider-specific logic.

### 12. Data Model Suggestions

#### 12.1 Station
- id
- name
- description
- streamUrl
- faviconUrl
- website
- country
- language
- tags
- genre
- bitrate
- isLive
- sourceProvider

#### 12.2 Theme
- id
- name
- backgroundType
- accentColor
- ambientEffects
- defaultStations
- sceneStyle

#### 12.3 Favorite
- id
- userId
- stationId
- createdAt

#### 12.4 Session
- id
- userId
- startedAt
- endedAt
- totalFocusMinutes
- stationIdsUsed
- notesCount

#### 12.5 Widget
- id
- type
- position
- size
- isVisible
- isPinned

### 13. Recommended Technology Stack

#### Frontend
- React
- TypeScript
- Vite
- Zustand or equivalent state solution
- TanStack Query for server state
- Framer Motion for motion and transitions

#### Visuals
- Canvas-based animation for rain and ambient effects
- Optional PixiJS for richer 2D scenes
- Optional Three.js only if a 3D scene becomes necessary later

#### Backend
- Node.js
- Express or similar lightweight API layer
- PostgreSQL for persistence
- Redis later for real-time or queue support

#### Realtime
- Socket.io or WebSocket-based transport for chat and live session features

#### Storage
- Object storage for user-uploaded assets later
- Local storage or IndexedDB for offline preferences and cached UI state

### 14. UI Component Breakdown

#### 14.1 Global components
- App shell
- Scene background
- Scene object layer
- Floating dock
- Side panel
- Modal system
- Notification system
- Keyboard shortcut helper

#### 14.2 Player components
- Play button
- Pause button
- Next station button
- Progress/stream state bar
- Time label
- Station label
- Favorite action
- Volume slider
- Mini-now-playing card

#### 14.3 Station components
- Station card
- Station list item
- Station detail panel
- Tag chips
- Filter bar
- Search input

#### 14.4 Productivity components
- Pomodoro timer
- Quick notes panel
- Session summary
- Focus statistics

#### 14.5 Environment components
- Window view
- Rain overlay
- Lighting controls
- Day/night switch
- Ambient particle layer

### 15. Interaction Design Rules

#### 15.1 Floating action behavior
Controls should appear near the bottom and stay out of the way.

#### 15.2 Smooth transitions
Panel open/close, theme changes, and station changes should animate smoothly.

#### 15.3 Minimal obstruction
Important controls should never block the room view unnecessarily.

#### 15.4 Context-sensitive panels
Clicking an object should open related information rather than sending users to another page.

#### 15.5 Keyboard shortcuts
The app should support quick actions such as:
- space to play/pause
- arrows for station navigation
- `F` to favorite
- `T` to toggle timer
- `N` to open notes

### 16. Development Phases

## Phase 0 — Discovery and validation

### Objectives
- Confirm the chosen station provider works well.
- Explore available station metadata and stream reliability.
- Decide on the initial visual style.

### Deliverables
- Small proof-of-concept station browser
- Basic stream playback
- Simple metadata display

### Exit criteria
- A station can be searched and played.
- Stream URL is reliable enough for development.

---

## Phase 1 — Core audio foundation

### Objectives
Build a stable playback system before adding visuals.

### Features
- station search
- station selection
- play / pause
- volume control
- stream loading state
- error handling for dead stations
- recently played list

### Deliverables
- working player core
- reliable audio state management
- basic station browsing UI

### Exit criteria
- Users can search and listen without refresh issues.

---

## Phase 2 — App shell and layout system

### Objectives
Build the visual foundation of the experience.

### Features
- full-screen layout
- floating player
- left dock
- right side panel
- overlay/modal system
- responsive shell for desktop-first design

### Deliverables
- stable layout architecture
- reusable floating panel system
- polished shell that supports future content

### Exit criteria
- The app already feels like a product, even before advanced features.

---

## Phase 3 — Theme and environment system

### Objectives
Introduce mood-based rooms.

### Features
- theme switching
- custom color tokens per theme
- background animation layer
- rain and ambience effects
- interactive window or room object

### Deliverables
- 3 to 5 themed environments
- animated atmospheric background
- scene object interactions

### Exit criteria
- Users can feel a real visual difference between themes.

---

## Phase 4 — Station discovery and curation

### Objectives
Make station browsing feel thoughtful, not generic.

### Features
- genre filters
- country filters
- language filters
- mood-based channel grouping
- featured stations
- favorites

### Deliverables
- curated station collections for each room mood
- clean browsing and discovery flow

### Exit criteria
- Users can easily jump between station categories that match a mood.

---

## Phase 5 — Study tools and personal workflow features

### Objectives
Make the app useful for longer sessions.

### Features
- Pomodoro timer
- custom timer presets
- quick notes widget
- session tracking
- history timeline

### Deliverables
- floating productivity widgets
- focus session management
- session summary view

### Exit criteria
- Users can study or work inside the app for a long session without needing another tool.

---

## Phase 6 — Persistence and user personalization

### Objectives
Make the app remember user preferences.

### Features
- favorites persistence
- theme persistence
- last played station restore
- widget layout memory
- session history storage

### Deliverables
- user preference layer
- local persistence or authenticated account support

### Exit criteria
- The app feels personal and continues where the user left off.

---

## Phase 7 — Real-time and social features

### Objectives
Add community value and portfolio depth.

### Features
- live room presence
- chat
- shared study room counts
- active station presence
- optional reactions or status indicators

### Deliverables
- real-time room experience
- chat panel or drawer
- user presence logic

### Exit criteria
- Users can share the study environment with others in a meaningful way.

---

## Phase 8 — Advanced immersion

### Objectives
Make the world feel alive.

### Features
- day/night cycle
- weather controls
- animated object states
- improved ambient sound layering
- dynamic background detail changes

### Deliverables
- polished immersive experience
- more responsive room atmosphere based on station or time

### Exit criteria
- The environment feels reactive and alive.

---

## Phase 9 — Performance, polish, and release preparation

### Objectives
Prepare the app for real public use or portfolio presentation.

### Features
- caching and stream fallback behavior
- loading skeletons
- graceful error states
- keyboard shortcuts
- PWA support
- accessibility checks
- responsive behavior tuning
- animation performance tuning

### Deliverables
- release-quality product
- polished demo flows
- polished landing page and onboarding

### Exit criteria
- The app can be shown as a finished portfolio project.

### 17. UX Flows

#### Flow 1: First-time visitor
1. User opens Radiom.
2. The room and ambience appear first.
3. A featured station is already highlighted.
4. User presses play.
5. The player expands slightly and begins streaming.
6. User explores the room and widgets.

#### Flow 2: Station discovery
1. User opens the stations panel.
2. Filters are used to narrow by mood, country, or genre.
3. User selects a station.
4. The player and visual mood update.
5. The station is optionally favorited.

#### Flow 3: Focus session
1. User starts the timer.
2. Music plays in the background.
3. Notes or widgets stay open lightly.
4. Session stats are saved at the end.

### 18. Accessibility Considerations

Radiom should remain usable even with visual complexity.

Important considerations:
- keyboard navigation
- visible focus states
- sufficient contrast for text
- reduced motion support
- accessible volume and playback controls
- screen-reader friendly labels for station and playback elements

### 19. Error Handling and Resilience

Radio streams are often unstable, so the app should anticipate failures.

#### Must handle:
- dead stream URLs
- loading timeouts
- provider errors
- missing artwork
- invalid metadata
- disconnected network
- playback interruption

#### Recommended behavior:
- show a fallback station
- retry with a delay
- present a clear but non-scary error state
- keep the interface usable even when one station fails

### 20. Performance Considerations

Because this app is visually rich, performance matters.

#### Key strategies
- avoid unnecessary re-renders
- keep animation layers lightweight
- lazy load advanced widgets
- virtualize long station lists
- separate audio state from UI state where possible
- use memoization for scene objects and panels
- avoid over-animating every component

### 21. Testing Strategy

#### Unit tests
- provider mapping logic
- playback state transitions
- timer logic
- favorites logic
- session calculations

#### Integration tests
- station selection flow
- play / pause behavior
- theme switching
- widget opening/closing

#### Manual testing
- stream reliability
- mobile responsiveness if supported
- long-session behavior
- low-bandwidth cases
- animation smoothness

### 22. Release Strategy

#### MVP release
A polished desktop-first version with:
- radio playback
- room theme
- floating controls
- station browser
- favorites
- one or two widgets

#### Beta release
Add:
- more themes
- timer
- notes
- session tracking
- better persistence

#### Final release
Add:
- real-time features
- more immersive animation
- stronger customization
- improved station curation

### 23. Long-Term Roadmap

Possible future expansions:
- custom user-uploaded stations
- personal radio presets
- collaborative study rooms
- social listening rooms
- visualizers tied to audio intensity
- mobile app version
- desktop app version using Electron or Tauri
- offline focus mode with local ambience

### 24. Final Product Definition

Radiom should ultimately feel like:
- a room you enter,
- a station you settle into,
- and a study environment you return to daily.

It should be visually calm, technically modular, and memorable enough to stand out in a portfolio while still feeling useful as a personal productivity space.

---

## Appendix A — Suggested MVP Feature Set

If you need the smallest credible version of Radiom, build only:
- station search
- live playback
- floating player
- one room theme
- favorites
- one productivity widget
- persistent theme and station state

That alone can already look impressive if the design and motion are polished.

## Appendix B — Suggested File/Folder Structure

```text
src/
  app/
    layout/
    routing/
    providers/

  domain/
    models/
    types/
    constants/

  services/
    playback/
    stations/
    themes/
    sessions/

  stores/
    playerStore.ts
    stationStore.ts
    themeStore.ts
    widgetStore.ts
    favoritesStore.ts
    sessionStore.ts

  components/
    shell/
    player/
    dock/
    panel/
    widgets/
    scene/
    station/

  features/
    radio/
    study/
    favorites/
    chat/
    settings/

  styles/
  assets/
  utils/
```

## Appendix C — Design Language Summary

- full-screen immersive room
- floating glass UI
- soft blur overlays
- dark background with mood accents
- minimal text density
- light motion, not excessive motion
- atmosphere as the primary visual asset

