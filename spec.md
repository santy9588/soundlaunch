# SoundLaunch — v3 Enhancement

## Current State
SoundLaunch is a music distribution dashboard with:
- Dark-themed UI with dashboard, releases, analytics, distribution, and copyright pages
- AudioUploader component for drag-and-drop file selection (in-memory only — no real storage)
- Persistent bottom AudioPlayer with waveform visualization
- Mock track data (5 seed tracks) stored in React state only (no persistence)
- Stripe component selected but payment flow not wired to audio distribution
- Header with Internet Identity login
- Distribution tracking for 7 platforms (Spotify, Gaana, JioSaavn, Wynk Music, Hungama Music, Resso, Boomplay)

## Requested Changes (Diff)

### Add
- **Real audio file upload & storage**: Wire AudioUploader to blob-storage so audio files are permanently stored and retrievable via URL
- **Revenue / Monetization page**: New "Earn" page showing passive revenue streams — per-platform royalty rates, total earnings breakdown, payout history table, and a "Request Payout" CTA button
- **Payment Gateway section (Stripe)**: Distribution fee checkout flow — when user clicks "Distribute" for a track, a Stripe checkout session is triggered (modal or redirect) for a small distribution fee ($1.99/track/platform)
- **Simplified dashboard**: Cleaner hero with prominent "Upload Audio" CTA button that opens file browser directly, quick-action cards (Upload, Distribute, Earn), recent activity feed
- **File browser button**: "Browse Files" button that triggers native OS file picker for audio selection (on dashboard and releases page)
- **Earnings stats on Dashboard**: Live total revenue card, per-platform breakdown mini-chart
- **Mobile-friendly sidebar nav**: Hamburger menu on mobile instead of scrollable tab bar

### Modify
- **Dashboard hero**: Simplify to one main action (Upload Track) + supporting stat cards; remove distribution network table from dashboard
- **AudioUploader**: Add visible "Choose File" button alongside drag-drop zone for discoverability
- **Releases page**: Show upload progress bar when blob-storage upload is in flight
- **Distribution page**: Add fee indication ("$1.99 per platform") and trigger Stripe checkout on "Distribute" click
- **Navigation**: Add "Earn" page link to header nav
- **Track type**: Add `blobId` and `storedAudioUrl` fields for blob-storage references

### Remove
- Nothing removed; existing pages and components retained

## Implementation Plan
1. Update `src/types/track.ts` — add `blobId?: string` and `storedAudioUrl?: string` fields; add `"earn"` to Page type
2. Update `src/backend/main.mo` — add track storage with blob references, distribution fee order tracking, payout request records
3. Wire blob-storage upload in `AudioUploader` and `App.tsx` — on file select, upload to blob storage, store returned URL in track
4. Wire Stripe checkout in `Distribution.tsx` — createCheckoutSession call for distribution fee before setting status to pending
5. Create `src/pages/Earn.tsx` — passive revenue page with royalty rate table, earnings breakdown, payout request UI
6. Update `Dashboard.tsx` — simplified layout with prominent file-picker CTA, quick-action cards
7. Update `Header.tsx` — add "Earn" nav link
8. Update `App.tsx` — handle new "earn" page, wire blob storage upload handler, wire Stripe checkout
