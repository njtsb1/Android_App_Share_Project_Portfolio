# Creating an Android App to Share Your Project Portfolio

Project developed during the Santander Bootcamp 2023 - Mobile Android with Kotlin, under the guidance of specialist [Igor Rotondo Bagliotti](https://github.com "Igor Rotondo Bagliotti").

This project consists of a **hybrid Android application** that uses a native Kotlin container (`WebView`) to render an optimized web interface. The app stores a GitHub username, lists all their public repositories, and allows the user to reset this information to search for a new profile.

## Features

- **Save GitHub username** in `localStorage` / `SharedPreferences`.
- **List public repositories** using the GitHub REST API.
- **Share repository links** via Web Share API with clipboard fallback.
- **Dark / Light mode** toggle (dark is default) with accessible icons.
- **Multilanguage** support: **English (en-US)**, **Português (pt-BR)**, **Español (es)**.
- **Responsive** layout optimized for desktop, tablet, and mobile (WebView).
- **Accessibility**: semantic HTML, ARIA attributes, keyboard support, and focus styles.

## Technologies Used

### Mobile & Core

- **Kotlin**: Native Android mobile container, managing the `WebView` lifecycle, hardware integration, and user preferences persistence.

### AI & Accessibility

- **AI Assistive Tech**: Artificial intelligence features tailored for accessibility, including contextual suggestions, voice guidance, and enhanced UX for users with disabilities.

### Web Frontend

- **HTML5**: Semantic and fully accessible layout structure.
- **CSS3**: Responsive design implementation with native CSS theme variables (Dark/Light mode).
- **JavaScript**: Core logic for multi-language switching, theme persistence, GitHub API integrations, and share/copy workflows.

## How to Run

### Android Application (Native Container)

1. Clone this repository to your local machine.
2. Open the project folder in **Android Studio**.
3. Sync the project with Gradle files.
4. Run the application on an **Android Emulator** or a physical device (API 24+ recommended).

### Web Interface Demo (Standalone)

1. Open `index.html` directly in a browser (Chrome, Firefox, Edge, Safari).
2. Enter a GitHub username and press **Confirm**.
3. Use **Open Saved** to fetch the saved username's repos.
4. Use **Reset** to clear the saved username.
5. Toggle language and theme - preferences persist in `localStorage`.

## Notes

- **GitHub rate limits**: Unauthenticated requests are rate-limited. For heavy testing, consider using a personal access token on a server or proxy (do not embed tokens in client-side code).
- **Share support**: The Web Share API works on many mobile browsers and native WebViews. If not available, the app copies the repo URL to the clipboard.
- **Security**: This is a client-side demo. Do not store secrets or tokens in client code.
- **Improvements**: pagination, search/filter, loading skeletons, error UI, and unit tests.

## Accessibility & Semantics

- Uses semantic elements (`header`, `main`, `section`, `footer`).
- ARIA attributes for live regions and controls.
- Keyboard accessible controls and visible focus outlines.
- High contrast color variables and adjustable theme.

![screenshot web demo](assets/screenshot_web_demo.png)

[LICENSE](./LICENSE)
