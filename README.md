# Deepa: The Forever Duo

A personal, single-page birthday website built with plain HTML, CSS, and JavaScript. No build step. No framework. No dependencies. It runs entirely in the browser and can be deployed to a free static host in under ten minutes.

This repository is not a template for public use. It was built for one person. If you found it by accident, you are not the intended audience.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [What This Is](#what-this-is)
3. [What You Need](#what-you-need)
4. [File Structure](#file-structure)
5. [The Four Files Explained](#the-four-files-explained)
6. [Customization](#customization)
7. [Adding Photos](#adding-photos)
8. [Adding Music](#adding-music)
9. [Testing](#testing)
10. [Deploying to GitHub Pages](#deploying-to-github-pages)
11. [Privacy and Security](#privacy-and-security)
12. [Accessibility](#accessibility)
13. [Browser Support](#browser-support)
14. [Easter Eggs](#easter-eggs)
15. [Troubleshooting](#troubleshooting)
16. [FAQ](#faq)
17. [Before You Send It](#before-you-send-it)

---

## Quick Start

1. Download all four core files: `index.html`, `style.css`, `script.js`, `config.js`.
2. Place them in the same folder on your computer.
3. Double-click `index.html`. It will open in your default browser.
4. Enter the PIN. The default is `1111`. Change it in `config.js` before sharing if you want.
5. Answer both date questions. If you need the answers while testing, they are stored in `config.dates`.
6. The full site unlocks.

That is all that is required to view the site locally. There is no installation, no package manager, and no command line involvement.

If you want to share the site as a link, follow the steps in [Deploying to GitHub Pages](#deploying-to-github-pages).

---

## What This Is

This is a scroll-based birthday gift. It is a sequence of small interactive sections, each designed to make the recipient laugh, smile, or feel seen.

The sections include:

- A circular loader with rotating messages.
- A PIN gate with personalized easter eggs for wrong entries.
- Two date verification questions.
- A hero section with a typewriter greeting and rotating floating facts.
- A BTS-themed section with Pied Piper references and a Borahae callout.
- A timeline of the relationship.
- A grid of Mobile Legends: Bang Bang hero cards.
- A buff stealing button with rotating responses and jokes.
- A stats card styled as a joke.
- A reason wheel with a cooldown timer.
- A mood check with personalized responses per mood.
- A reassurance section with a game-style victory card.
- A hug button with multiple messages.
- A fear section with specific comfort per fear.
- A voice appreciation note.
- A dream job support message.
- A shrine of favorite things.
- A photo gallery with a full-screen lightbox.
- A dream map with clickable pins.
- A love letter that types itself out on scroll.
- A quiz with humorous feedback after each answer.
- A final surprise modal with a real question.
- A downloadable and shareable certificate.
- Confetti in themed colors.
- A floating music panel for a playlist.
- Multiple hidden easter eggs.

Every text string is stored in a single file (`config.js`) so that content changes do not require touching the layout or logic.

---

## What You Need

To view or edit the site:

- Any modern browser. Chrome, Firefox, Safari, or Edge.
- A plain text editor. VS Code, Sublime Text, Notepad++, or the default text editor on your computer.

To deploy the site as a live link:

- A free GitHub account.

To add personal photos:

- Image files in JPG, PNG, WebP, GIF, or AVIF format.

To add music:

- A free Spotify account, or audio files you own.

No developer tools beyond a text editor and a browser are required at any step.

---

## File Structure

```text
.
├── index.html
├── style.css
├── script.js
├── config.js
├── README.md
└── assets/
    ├── photos/
    │   └── (put your photos here)
    └── music/
        └── (put your audio files here, optional)
```

---

## The Four Files Explained

**`index.html`** is the skeleton. It contains the structure of every section, from the loader to the final modal. You should not need to edit this file unless you are removing or adding entire sections.

**`style.css`** is the visual layer. All colors, typography, spacing, animations, and responsive rules live here. The palette is defined once at the top of the file in a `:root` block, so you can change the entire color scheme by editing a handful of variables.

**`script.js`** is the behavior. It handles the loader, the PIN gate, the date questions, every interaction on the site, and the final surprise. You should not need to edit this file unless you are adding a new section or changing the state logic.

**`config.js`** is where all personal content lives. Names, dates, jokes, captions, messages, quiz questions, the love letter, and the final question. If you only want to change the words, this is the only file you need to open.

---

## Customization

Everything specific to the recipient is stored in `config.js`. The file is a single JavaScript object divided into clearly labeled sections with comments.

Below is a table mapping common changes to the exact field you need to edit.

| What you want to change | Where to find it in `config.js` |
|-------------------------|--------------------------------|
| The PIN | `pin` |
| The wrong-PIN easter eggs | `pinEasterEgg` |
| Loader messages | `loading.loadingMessages` |
| Loader duration | `loading.minDurationMs` |
| The date you met | `dates.met` |
| The date you became a couple | `dates.relationship` |
| Her name in the hero | `hero.name` |
| The typewriter line | `hero.typewriter` |
| Floating facts | `hero.floatingFacts` |
| BTS section content | `btsLounge` |
| Timeline entries | `timeline` |
| Hero cards | `heroes.cards` |
| Buff messages and jokes | `heroes.buff` |
| Joke stats | `gamingStats.stats` |
| Reassurance messages | `reassurance.messages` |
| Mood options and responses | `moodCheck.moods` |
| Reason wheel content | `reasonsSpinner.reasons` |
| Reason wheel cooldown | `reasonsSpinner.cooldownHours` |
| Hug messages | `hugButton.hugs` |
| Fear responses | `fearFairy.fears` |
| Voice note | `voiceNote.text` |
| Dream job message | `dreamJob.message` |
| Favorites shrine | `herFavorites.items` |
| Gallery captions and photos | `gallery` |
| Dream map pins | `dreamMap.pins` |
| Love letter | `loveLetter.text` |
| Quiz questions | `quiz.questions` |
| Final question | `finalSurprise.message` |
| Certificate text | `finalSurprise.certificateTitle` |
| Small UI text | `ui` |
| Section titles | `sections` |

### Example: Changing the PIN

Open `config.js` and find the first line of the `CONFIG` object.

```javascript
pin: "1111",
```

Change the string to whatever four digits you prefer. Keep it as a string. Do not remove the quotes.

```javascript
pin: "0511",
```

### Example: Changing the timeline

Find the `timeline` array. Each entry is an object with four fields.

```javascript
timeline: [
  {
    date: "May 5",
    title: "The day we met",
    text: "You were just a voice in a game.",
    icon: "✦"
  },
  {
    date: "May 25",
    title: "The day we became us",
    text: "The day I stopped pretending.",
    icon: "♡"
  }
]
```

You can add, remove, or rewrite any entry. Keep trailing commas consistent. The `icon` field accepts any single character.

### Example: Changing a hero card

Find `heroes.cards`. Each card has five fields.

```javascript
{
  name: "Aamon",
  role: "Jungler",
  caption: "Your Aamon carried me through ranks I had no business being in.",
  color: "#7B4B9E",
  mvp: true
}
```

The `color` is used as the card's gradient background. The `mvp` flag adds a small gold badge in the top-right corner of the card. Remove it or set it to `false` if you do not want it.

### Editing safely

- Always keep quotes around text strings.
- Keep commas between array items. The last item in an array or object does not need a trailing comma, but having one is allowed.
- If the site stops working after an edit, open the browser console by pressing F12 and selecting the Console tab. It will point to the line with the syntax problem.
- To restore the original config, download the file from this repository again. Nothing you do to `config.js` can break the other three files.

---

## Adding Photos

The gallery supports real photos. When a photo is present, it replaces the gradient placeholder. When it is not, the gradient shows.

### Step 1: Prepare your photos

Place your photo files inside the `assets/photos/` folder. Rename them using lowercase letters and hyphens. Avoid spaces and special characters.

Good file names:

- `first-voice.jpg`
- `aamon-match.jpg`
- `boba-date.webp`

Bad file names:

- `My Photo (1).jpg`
- `IMG_2837.JPG`
- `photo #2.png`

### Step 2: Reference the photos in config

Open `config.js` and find the `gallery` array. Each item currently has a `caption` and a `gradient`. Add an `image` field to any item you want to replace.

Before:

```javascript
{
  caption: "The first time I heard your voice.",
  gradient: "linear-gradient(135deg, #7B4B9E, #2C1E4A)"
}
```

After:

```javascript
{
  caption: "The first time I heard your voice.",
  image: "assets/photos/first-voice.jpg"
}
```

The `gradient` field can stay or be removed. If `image` is present, the gradient is ignored. If the image fails to load for any reason, the gradient will show instead.

### Step 3: Test in the browser

Refresh `index.html`. Click a photo to open the lightbox. Use the arrow keys on desktop or swipe on mobile to navigate between photos. Press Escape or click outside the photo to close.

### Photo guidelines

- Keep each file under one megabyte. Resize large photos before uploading.
- Landscape photos look best in the lightbox. Portrait photos look best in the grid.
- Six photos is the default. The gallery works with any number you provide.
- The caption becomes the alt text for screen readers. Write captions that describe the moment.

---

## Adding Music

The site has a floating music button and a small panel designed to hold a playlist. It ships with a placeholder so nothing breaks. There are two ways to fill it.

### Option A: Spotify embed

1. Open Spotify and find your playlist.
2. Click the three dots on the playlist.
3. Choose Share, then Embed playlist.
4. Copy the `<iframe>` code.
5. Open `config.js` and find the `music` section.
6. Paste the iframe inside the `embed` field as a single-quoted string.

```javascript
music: {
  label: "Pied Piper mode",
  hint: "Tap to play our playlist.",
  placeholder: "Playlist coming soon.",
  embed: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/YOUR_PLAYLIST_ID" width="100%" height="352" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>'
}
```

Replace `YOUR_PLAYLIST_ID` with the ID from the Spotify embed code. Leave the single quotes around the entire string. The double quotes inside belong to the HTML attributes and should not be changed.

### Option B: Local audio file

If you own the audio files, you can use them directly. Place the files inside `assets/music/` and reference them in the `embed` field.

```javascript
embed: '<audio controls style="width: 100%;"><source src="assets/music/pied-piper.mp3" type="audio/mpeg"></audio>'
```

Supported formats include MP3, OGG, and WAV. MP3 is the safest choice across browsers.

### A note about autoplay

No browser will autoplay audio without user interaction. This is a deliberate browser policy and it cannot be bypassed. The music panel exists so the recipient can choose to press play. That is the correct way to offer music on a website.

---

## Testing

Before sending the link to anyone, walk through this checklist. Every item should work in your browser.

### Fresh state

1. Open `index.html?reset`. This clears the saved state and reloads the site.
2. The site should appear as if you are a new visitor.
3. Enter the PIN.
4. Answer both date questions.
5. The main site should appear.

### Sections

- **Loader.** The circular ring animates and rotates through messages. The skip button appears after a few seconds.
- **PIN gate.** Enter the correct PIN. Enter a wrong one first to confirm the shake animation and the input reset.
- **Date questions.** Answer both correctly. Try a wrong answer first to confirm the "tell me anyway" link appears.
- **Hero.** The name appears. The typewriter line types itself. Floating facts rotate. The begin button scrolls to the timeline.
- **BTS section.** All text renders, including the four Pied Piper lines and the two small notes.
- **Timeline.** All entries appear. They slide in from the left as you scroll.
- **Heroes.** All ten cards render. The Aamon card has an MVP badge.
- **Buff button.** Click once. Wait for the message. A random message and a random joke appear.
- **Stats.** All stat cards render.
- **Spinner.** Click once. A reason appears. The button disables and shows the cooldown message.
- **Mood tiles.** Click each tile. The message updates. Refresh the page to confirm the last mood stays highlighted.
- **Enough Room.** Click the button through all the messages. Confirm the VICTORY card appears at the end. Reload to confirm you land on the VICTORY card immediately.
- **Hug.** Click several times. Different messages appear.
- **Fear tiles.** Click each. The message updates.
- **Voice note.** Text renders.
- **Dream job.** Text renders.
- **Favorites.** All nine cards render.
- **Gallery.** Click a photo. The lightbox opens. Arrow keys and swipe work. Escape closes.
- **Dream map.** Click each pin. The message below updates.
- **Love letter.** The letter types itself out on scroll. Continue button appears at the end.
- **Quiz.** Answer all questions. A humorous line appears after each pick. The result screen shows at the end.
- **Final trigger.** After three interactions, a button appears near the bottom of the page.
- **Final surprise.** Click the trigger. The modal opens. Click yes. The thanks message, the after-accept message, the certificate button, the share button, and the close button appear in sequence.
- **Certificate.** Click download. A PNG downloads on desktop, or a share sheet opens on mobile.

### Easter eggs

- **Wrong PIN.** Try `0420`, `0000`, `1234`, or `1110`. Each triggers a specific message. Try `9999` for the generic message.
- **Konami code.** On a desktop keyboard, press Up, Up, Down, Down, Left, Right, Left, Right, B, A. A toast appears.
- **Secret corner.** Tap the bottom-right corner of the hero section three times quickly. A toast appears.
- **404 hash.** Append `#404` to the end of the URL. A toast appears.

### Reset

To start over at any point, add `?reset` to the URL and refresh.

---

## Deploying to GitHub Pages

GitHub Pages is free and does exactly what this site needs: hosting static files.

### Step 1: Create a repository

1. Sign in to GitHub.
2. Click the plus icon in the top-right corner and choose New repository.
3. Give the repository a name such as `for-deepa` or `birthday-site`.
4. Set it to Public. Private repositories require a paid plan for Pages.
5. Do not initialize with a README. Leave it empty.
6. Click Create repository.

### Step 2: Upload the files

You can upload through the web interface or through git. The web interface is easier for a one-time upload.

**Web upload:**

1. On the new repository page, click "uploading an existing file".
2. Drag in `index.html`, `style.css`, `script.js`, `config.js`, and the `assets` folder.
3. Scroll down and click "Commit changes".

**Git command line (alternative):**

```bash
git init
git add .
git commit -m "Initial upload"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and repository name.

### Step 3: Enable Pages

1. Open the repository Settings.
2. In the left sidebar, click Pages.
3. Under Source, choose "Deploy from a branch".
4. Under Branch, choose `main` and folder `/ (root)`.
5. Click Save.

### Step 4: Wait and open

GitHub will take about one minute to build the site. Refresh the Settings page and you will see the live URL at the top, in the format:

```text
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

Open that URL to confirm the site works online.

### Step 5: Update the site

Any time you push to `main`, GitHub rebuilds the site automatically within about one minute. If changes do not appear, hard-refresh the page with Ctrl+Shift+R on Windows or Cmd+Shift+R on Mac.

---

## Privacy and Security

The site includes `<meta name="robots" content="noindex, nofollow">` in `index.html`. This tells search engines not to index the site. Google, Bing, and others respect this tag.

This is not a lock. Anyone with the URL can open the site. The PIN is stored in `config.js` and is visible in the page source.

If you want actual privacy, choose one of these options:

- **Cloudflare Pages with Access.** Free for up to fifty users. Requires a login before the site loads.
- **Netlify with password protection.** Paid feature but easy to set up.
- **Vercel with password protection.** Similar to Netlify.
- **Unguessable URL.** A randomly generated repository name or a custom subdomain nobody will stumble onto.

For a personal birthday site, `noindex` and an unguessable URL are usually enough. Use stronger protection only if you are truly concerned.

---

## Accessibility

The site was built with keyboard and screen reader users in mind. This is already in place:

- All interactive elements are real buttons and inputs, not clickable divs.
- Focus rings appear only when using the keyboard.
- The love letter has a hidden screen reader version so the typewriter effect does not interfere with reading.
- The final modal and the lightbox trap focus and close on Escape.
- `aria-live` regions announce updates for the buff, spinner, moods, hugs, fears, quiz, and final surprise.
- All photos have alt text based on their caption.
- The `prefers-reduced-motion` media query disables animations, the circular loader ring, particles, confetti, and the typewriter effect for users who have requested reduced motion at the system level.

If you add photos, write captions that describe the moment. The caption becomes the alt text.

---

## Browser Support

The site works in:

- Chrome, desktop and mobile
- Safari, desktop and iOS
- Firefox, desktop and mobile
- Edge, desktop and mobile

It does not support Internet Explorer. It does not require any JavaScript features beyond those available in browsers from 2020 onward.

---

## Easter Eggs

These are hidden interactions that are not advertised on the site. They are documented here so you remember what is possible.

**Wrong PIN responses.** The PINs `0420`, `0000`, `1234`, and `1110` each trigger a specific personalized message. Any other wrong PIN gets the generic response. All of these are editable in `config.pinEasterEgg`.

**Konami code.** Press Up, Up, Down, Down, Left, Right, Left, Right, B, A on a desktop keyboard. A secret toast appears with a message from `config.easterEggs.konami`.

**Secret corner.** Tap the bottom-right corner of the hero section three times within two seconds. A toast appears with a message from `config.easterEggs.secretCorner`.

**404 hash.** Append `#404` to the URL. A toast appears with the content from `config.easterEggs.notFound`. The hash is cleared afterward so it does not repeat on refresh.

---

## Troubleshooting

### The page is blank after opening index.html

Open the browser console by pressing F12 and clicking the Console tab. Look for red error messages. The most common cause is a JavaScript syntax error in `config.js`, usually a missing comma or an unclosed quote. Fix the line the error points to and refresh.

### The loader runs forever

Confirm that `script.js` loads after `config.js` in `index.html`. The order of the two script tags matters. Do not move them.

### The PIN does not work

Open `config.js` and check the `pin` field. It must be a four-digit string in quotes. For example, `pin: "1111",`. If you changed it and forgot the new value, download the original file from this repository and replace your copy.

### Photos do not show in the gallery

Check three things. First, that the file path in `config.js` matches the file's actual location. Second, that the file name uses lowercase letters and hyphens with no spaces. Third, that the file is under one megabyte. Paths are case-sensitive on GitHub Pages, so `MyPhoto.jpg` and `myphoto.jpg` are different files.

### Music does not play

Browsers block autoplay by design. The music panel requires a click. If you are using a Spotify embed, confirm the playlist is set to public. If you are using a local file, confirm the path is correct and the file format is supported. MP3 is the safest format.

### The certificate does not download

Some browsers block downloads from generated URLs without user confirmation. On mobile, a share sheet usually opens instead of a direct download. On desktop, check your browser's download permissions and try again. If it continues to fail, take a screenshot of the modal instead. The certificate is fully visible on screen.

### Reveal animations do not play

The site uses `IntersectionObserver`, which is supported in all modern browsers. If the site was opened directly from your local file system and the animations are not working, it may be a browser security setting. Try opening it from the deployed URL instead.

### My edits to config.js broke something

You can always download the original `config.js` from this repository and replace your copy. Nothing in the other three files depends on your changes, so the site will always work with the original config.

---

## FAQ

**Can I change the PIN to something else?**

Yes. Open `config.js` and edit the `pin` field. Keep it as a four-digit string in quotes.

**Can I remove a section I do not want?**

Yes, but it requires editing two files. Remove the section's `<section>` block from `index.html`, and remove the corresponding `init` call from `initMainSite()` in `script.js`. For example, to remove the BTS section, delete the `btsSection` block from the HTML and remove the `initBtsLounge()` call from JavaScript.

**Can I add more quiz questions?**

Yes. Add entries to the `quiz.questions` array in `config.js`. Each entry needs a `q` string, an `options` array with three strings, and a `funny` string. The `funny` string is shown briefly after she picks an answer.

**Can I add more photos to the gallery?**

Yes. Add entries to the `gallery` array with a `caption` and an `image` path. There is no upper limit.

**Will the recipient know the easter eggs are there?**

Only if she explores. They are not advertised anywhere on the site.

**Can the site be found on Google?**

Not by default. The `noindex` meta tag prevents indexing. However, anyone with the URL can open the site. For real privacy, use a password-protected host.

**How do I reset the site for testing?**

Add `?reset` to the end of the URL and refresh. This clears the saved state so the site appears as a fresh visit.

**How often does the reason wheel reset?**

Every four hours by default. Change the `cooldownHours` field inside `config.reasonsSpinner` to adjust the timer.

**Can I change the colors?**

Yes. Open `style.css` and find the `:root` block at the top. The primary, accent, and background colors are all defined there. Change the hex values to repaint the entire site.

**Can I remove the certificate?**

Yes, but it is one of the emotional peaks of the site. If you really want to remove it, delete the certificate button from the final surprise markup in `index.html` and remove its event listener in `script.js`.

---

## Before You Send It

A short checklist for the day you share the link.

1. Deploy the site to GitHub Pages.
2. Open the live URL in a browser on your computer.
3. Walk through the PIN gate and both date questions.
4. Complete every section. Click every button.
5. Open the final surprise. Click yes. Download the certificate.
6. Open the same URL on your phone. Repeat steps 3 to 5.
7. Confirm the gallery photos load on mobile data, not just on Wi-Fi.
8. Confirm the music panel opens. If you added a playlist, confirm it plays after one tap.
9. Confirm the share button works. It should open the share sheet on iOS or Android.
10. Send the link.

Take a screenshot of the certificate on your own phone. If anything goes wrong on the recipient's device, you will have proof that the site worked on yours.

---

## Credits

Built as a birthday gift. If it is useful to you, borrow freely. If you want to adapt it for someone in your own life, start with `config.js` and work outward. The rest of the site was designed to accommodate new content without layout changes.

No frameworks. No trackers. No analytics. Just files.

Happy birthday, Deepa.