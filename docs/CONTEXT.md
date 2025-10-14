## Table of Contents

- [1. Overview](#1-overview)
- [2. User Flow](#2-user-flow)
  - [2.1. Welcome Screen](#21-welcome-screen)
  - [2.2. User Registration](#22-user-registration)
  - [2.3. Main Dashboard](#23-main-dashboard)
  - [2.4. Adding a New Entry](#24-adding-a-new-entry)
  - [2.5. Entry Detail & Response](#25-entry-detail--response)
- [3. Core Features](#3-core-features)
- [4. Technical Considerations](#4-technical-considerations)
- [5. Future Enhancements](#5-future-enhancements)
- [6. Database Schema](#6-database-schema)
- [7. Project Structure](#7-project-structure)
---

## 1. Overview

**App Name:** (TBD)

**Core Functionality (in 3 words):**  
**"Write. Wait. Reflect."**

**Purpose:**  
- Provide users with a means to write messages to their future selves.
- Enable users to reflect on past entries by replying with their current perspective.
- Allow integration of multimedia (audio/video) messages.

**Target Audience:**  
- Individuals seeking personal growth and self-reflection.
- Users interested in journaling with a time-based twist.

---

## 2. User Flow

### 2.1. Welcome Screen

- **Design:**  
  - Clean, minimalist design.
  - App logo and tagline displayed prominently.
  - Option for light/dark mode based on user preference.

- **Functionality:**  
  - **Greeting Message:** A brief, warm welcome message.
  - **Get Started Button:** Tapping this moves the user to the registration step.

---

### 2.2. User Registration

- **Input Fields:**
  - **Name:** User enters their name.
  - **Age:** User enters their age.
  
- **Purpose:**  
  - Personalize the user experience.
  - Potential future use for age-related insights or UI adjustments.

- **Flow:**
  1. User fills in the required fields.
  2. User taps the “Continue” button.
  3. The app validates inputs and transitions to the main dashboard.

---

### 2.3. Main Dashboard

- **Layout:**
  - **Header:** Displays a greeting (e.g., “Hello, [Name]!”).
  - **List of Entries:** A scrollable list showing all notes.  
    - Each entry displays:
      - Title/preview (if applicable).
      - Opening date (i.e., when the entry is set to be unlocked).
  - **Quick-Add Button:** A floating action button (plus sign) at the bottom of the screen for creating new entries.

- **Functionality:**
  - **Viewing Entries:**  
    - Upcoming entries show as “locked” until their opening date.
    - Unlocked entries are tappable and reveal the full content.
  - **Notifications:**  
    - Users may receive push notifications when an entry becomes available.

---

### 2.4. Adding a New Entry

- **Access:**  
  - Tapping the Quick-Add button opens the "New Entry" creation screen.

- **Screen Elements:**
  - **Text Input:**  
    - Area to write a message.
    - Optional: Title or subject line.
  - **Date Picker:**  
    - User selects a future date/time when the entry will be unlocked.
  - **Multimedia Options:**  
    - Buttons/icons to record or attach:
      - **Audio File**
      - **Video File**
  - **Save/Submit Button:**  
    - User taps to save the entry.
    - Entry is then stored with its scheduled unlock date.

- **Flow:**
  1. User enters their text and chooses an unlock date.
  2. Optionally attaches multimedia.
  3. User taps “Save” to add the entry to the dashboard.
  4. The new entry appears in the dashboard list with its unlock date clearly shown.

---

### 2.5. Entry Detail & Response

- **Access:**  
  - When an entry's unlock date/time is reached, the entry becomes tappable in the dashboard.
  
- **Detail View:**
  - **Display:**  
    - Full content of the original entry.
    - Multimedia content (if any) is viewable/playable.
  - **Reply Option:**  
    - A dedicated input area is provided at the bottom for the user to record a reply.
    - Options available:
      - **Text Input:** Type a response.
      - **Audio Recording:** Record a voice message.
      - **Video Recording:** Record a video message.
  - **Submit Response:**  
    - User submits their response, which is stored alongside the original entry.
    - The interface may display the original entry and the reply in a conversational format.

- **Functionality:**  
  - **Historical Comparison:**  
    - The app may offer a simple visual timeline or comparison to show how the user's perspective has evolved.
  - **Editing:**  
    - Users can edit their reply if needed before finalizing it (if within a set time period).

---

## 3. Core Features

- **User Personalization:**  
  - Registration with name and age.
  
- **Time-Based Messaging:**  
  - Write messages with a set unlock date.
  
- **Reflection Mechanism:**  
  - Unlock entries and reply with current perspectives.
  
- **Multimedia Support:**  
  - Option to attach or record audio/video messages.
  
- **Clean User Interface:**  
  - Minimalist, distraction-free design with intuitive navigation.

- **Push Notifications:**  
  - Notify users when an entry is ready to be unlocked.

---

## 4. Technical Considerations

- **Platform:**  
  - Consider cross-platform development (Flutter/React Native) for simultaneous iOS and Android deployment.
  
- **Data Storage:**  
  - Secure local storage for user entries, with an option for cloud backup.
  - Encryption for sensitive data.

- **Multimedia Handling:**  
  - Ensure proper permissions for recording and accessing audio/video.
  - Optimize file size and storage.

- **Date/Time Scheduling:**  
  - Background scheduling to trigger entry unlocking.
  - Local notifications when entries are ready.

- **User Authentication:**  
  - Basic registration initially; consider integration with third-party auth (Google, Apple) if needed later.

- **Scalability:**  
  - Design with a modular codebase to allow adding features like analytics, social sharing, etc., in future updates.

---

## 5. Future Enhancements

- **Advanced Analytics:**  
  - Track user journaling habits and provide insights.
  
- **Customization:**  
  - Themes, fonts, and layout personalization.
  
- **Social Sharing:**  
  - Option to share unlocked entries or inspirational quotes (with privacy controls).
  
- **AI-Driven Reflections:**  
  - Suggest reflective questions based on past entries.
  
- **Reminders & Streaks:**  
  - Encourage regular journaling with streak tracking and gentle reminders.

---

## 6. Database Schema

### Users Table

```sql
users (
id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at: timestamp with time zone DEFAULT now(),
name: text NOT NULL,
age: integer,
avatar_url: text,
settings: jsonb DEFAULT '{"theme": "light", "notifications": true}'::jsonb
)
```
###Entries Table
```sql
entries (
id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at: timestamp with time zone DEFAULT now(),
user_id: uuid REFERENCES users(id) ON DELETE CASCADE,
title: text,
content: text NOT NULL,
unlock_date: timestamp with time zone NOT NULL,
is_unlocked: boolean DEFAULT false,
media_urls: jsonb DEFAULT '[]'::jsonb
)
```
### Responses Table
```sql
responses (
id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at: timestamp with time zone DEFAULT now(),
entry_id: uuid REFERENCES entries(id) ON DELETE CASCADE,
content: text NOT NULL,
media_urls: jsonb DEFAULT '[]'::jsonb
)
```


## 7. Project Structure

app/
├── .expo/
├── assets/
│ ├── fonts/
│ ├── images/
│ └── icons/
├── app/ # Expo Router pages
│ ├── (auth)/ # Authentication routes
│ │ ├── login.tsx
│ │ ├── register.tsx
│ │ └── layout.tsx
│ ├── (main)/ # Main app routes
│ │ ├── dashboard.tsx
│ │ ├── entry/
│ │ │ ├── [id].tsx # Entry detail page
│ │ │ └── new.tsx # New entry page
│ │ └── layout.tsx
│ └── index.tsx # Welcome screen
├── components/
│ ├── common/ # Reusable components
│ │ ├── Button.tsx
│ │ ├── Input.tsx
│ │ └── ...
│ ├── entry/ # Entry-related components
│ │ ├── EntryCard.tsx
│ │ ├── EntryForm.tsx
│ │ └── ...
│ └── layout/ # Layout components
│ ├── Header.tsx
│ └── ...
├── hooks/ # Custom hooks
│ ├── useAuth.ts
│ ├── useEntries.ts
│ └── ...
├── lib/ # Utility functions and configs
│ ├── supabase.ts # Supabase client
│ ├── constants.ts
│ └── utils.ts
├── services/ # API and service functions
│ ├── auth.ts
│ ├── entries.ts
│ └── ...
├── stores/ # State management
│ ├── auth.store.ts
│ └── entries.store.ts
├── types/ # TypeScript types/interfaces
│ ├── entry.types.ts
│ └── user.types.ts
├── .gitignore
├── app.json
├── babel.config.js
├── package.json
├── tsconfig.json
└── README.md
