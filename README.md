# Journal App

A reflective journaling app that lets you write messages to your future self.

## Features

- Write time-locked journal entries
- Multimedia support (audio/video messages)
- Reflect on past entries
- Clean, minimalist design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your mobile device

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd Journal
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## Development

- `npm start` - Start the development server
- `npm run ios` - Start the iOS simulator
- `npm run android` - Start the Android emulator
- `npm run web` - Start the web version
- `npm test` - Run tests

## Project Structure

```
app/
├── .expo/
├── assets/
├── app/          # Expo Router pages
├── components/   # Reusable components
├── hooks/        # Custom hooks
├── lib/          # Utility functions
├── services/     # API and services
├── stores/       # State management
└── types/        # TypeScript types
```

## Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router
- Supabase
