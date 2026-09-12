# HerCalm — Wellness Toolkit Source Code

HerCalm is a lightweight, privacy-first cycle wellness toolkit with local tracking, practical timers, planning tools and an optional AI-powered **CalmPlan** generator.

## Included
- Cycle & Comfort Tracker
- Mood Check
- Yoga Flow
- Calm Breathing
- Heat/Rest Timer
- Self-Massage Timers
- Calm Sound Timers
- Warm Drink & Comfort Guide
- Cycle Planner
- Gentle Stretch Timer
- Hydration Timer
- Local Pattern Insights
- **CalmPlan AI** — turns mood, goal, time and optional notes into a short personalized wellness routine
- Collapsible navigation menu
- About, Privacy, Terms and Wellness Disclaimer pages
- Local data deletion
- PWA manifest

## AI setup
The included Vercel-style serverless endpoint is `api/ai.js`.

Set this environment variable in your deployment:
`GEMINI_API_KEY=your_google_ai_studio_key`

The endpoint uses the stable `gemini-3.1-flash-lite` model. Google currently lists paid pricing at $0.25 per 1M input tokens and $1.50 per 1M output tokens, with a free tier subject to Google limits. Pricing and limits can change, so verify them before commercial launch.

**Never put the Gemini API key in client-side JavaScript.**

## Deploy
The frontend is static and can be deployed to Vercel or another static host. The `/api/ai` endpoint needs a serverless-compatible host such as Vercel.

## Customization
Replace the app name, colors, copy, affiliate links, legal contact email, AI provider and tool durations before selling or white-labeling the source.

## Safety
The source intentionally avoids diagnostic/treatment claims. CalmPlan AI is constrained to general wellness content and explicitly refuses medical-advice use cases.

## Production hardening
- The AI endpoint is server-side; the API key is never shipped to the browser.
- The included endpoint has a lightweight per-instance rate limit of 5 requests per 10 minutes per client identifier. For high-traffic deployments, add durable rate limiting/authentication at the hosting layer.
- Use a current Gemini API key with the restrictions/authentication required by Google.
- Replace the sample legal copy and add the deployment owner's real privacy contact before commercial launch.
- The included calm sounds use the browser Web Audio API and require user interaction; some browsers may block audio until a tap/click.
- The source does not include personal Google verification files, personal domains or personal analytics configuration.
- The included robots.txt is intentionally generic. Generate a sitemap for the buyer's actual production domain instead of shipping a hard-coded seller URL.


### AI cost and safety
The included endpoint uses Gemini 3.1 Flash-Lite. Google currently lists it as a cost-efficient model at $0.25/1M input tokens and $1.50/1M output tokens on the standard paid tier. The endpoint keeps GEMINI_API_KEY server-side, limits inputs, times out after 15 seconds, and includes a lightweight per-instance request limiter. Production operators should still apply platform-level rate limiting/quotas because serverless memory is not a durable global rate limiter.
