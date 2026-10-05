# moreisless

Biology competition question-bank and examination workspace.

This first frontend prototype is intentionally dependency-free: plain HTML, CSS and JavaScript. It is designed as the visual shell for the later Worker/API implementation.

## Included

- School / coach / student workspace model
- Exam dashboard and live examination workspace
- Long-document reader + answer sheet concept
- Offline-first answer state
- Indefinite-selection answers
- Question-level OCR / solution / discussion entry points
- Named discussion with coach moderation affordances
- Score-version history with immutable historical versions and explicit current version
- Inter-school results: own-school names visible; other schools show school only
- Responsive layout
- Restrained neutral visual system; no gradients or decorative color noise

## Run

Open `index.html` directly, or serve the folder with any static HTTP server.

The current files are a frontend prototype. Persistence, authentication, GitHub storage, Cloudflare Worker APIs, PDF/Word conversion, OCR, deterministic scoring and NVIDIA model calls should be wired in subsequent iterations.
