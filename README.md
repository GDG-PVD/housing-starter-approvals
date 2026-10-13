# Site Explorer: Challenge 2 starter

**What does it take to get approved?**

A starter for [Build for Good: AI Lab for Housing](https://gdgpvd.dev/housing-jam) (DevFest Providence 2026). It is [Site Explorer](https://github.com/GDG-PVD/housing-site-explorer) with the Challenge 2 tab already built, so your team starts from a working tab and spends the afternoon making it better.

## What's already built

- A "Draft the approvals checklist" button: Gemini lists the permits and reviews a small multifamily project would likely need in this town, in order, with the reviewer, who to contact first, a typical timeline and the usual documents.
- Every step Gemini is not sure of is marked "Confirm with the town".
- Checkboxes to tick off steps, and a "Print one page" button that turns the checklist into a printable summary.

Below the map, amenities, zoning link and summary, the new tab is at the bottom of the page. The code is in `challenge.ts` (the `/api/approvals` endpoint and its Gemini prompt) and `src/components/ChallengePanel.tsx` (the tab and the printout).

## Start

1. Click **Use this template** (top right on GitHub) to make your team's own copy, then clone it.
2. Run it:

   ```
   npm install
   npm run dev
   ```

3. Put `GEMINI_API_KEY` and `GOOGLE_MAPS_API_KEY` in a `.env.local` file (it is never committed). Open http://localhost:3000, explore an address, and scroll to the Challenge 2 tab.

Working in Google AI Studio instead of an editor? [Remix Site Explorer](https://ai.studio/apps/fcbdfa66-237e-4e2a-b5b4-090284f9d4bc) and use the Challenge 2 prompt cards on [gdgpvd.dev/housing-jam](https://gdgpvd.dev/housing-jam). This repo is for teams who want their own code.

## Your Google Maps key

The app hands the Maps key to the browser to draw the map, so anyone who opens a shared copy can read it. The server also uses the same key to look up addresses and nearby places, so do not restrict it to your app's website: Google refuses website-restricted keys on server calls, and address search would fail while the map still draws. Instead, in the Google Cloud console (APIs & Services, then Credentials, then your key), restrict it to the Maps JavaScript, Geocoding, Places API (New) and Places APIs, set a low daily quota on each of those APIs, and delete the key after the event. Never paste a key into a chat or commit one.

## Keep going

Prompts to try next, in AI Studio or with your coding assistant:

1. "Let me add my own steps, edit them and drag them into a different order."
2. "Add up the typical timelines into a total and show it as a simple timeline."
3. "Add a notes box under each step for what the town told me on the phone, and include the notes in the printout."
4. "When I pick a language in the summary card, translate the approvals checklist and its printout too. Keep town office names and links as they are."

## Submit

Submit your team's app by 3:15 at [gdgpvd.dev/housing-jam](https://gdgpvd.dev/housing-jam): a screenshot and the link to your app or repo. One person submits for the whole team.

## The fine print

Everything Gemini drafts here is a starting point, not a zoning determination, legal advice or a funding commitment. Check with the town and the program.

Licensed under the [MIT License](LICENSE).
