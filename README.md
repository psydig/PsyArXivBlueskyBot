
# PsyArXiv Bluesky Bot

This project builds on the [Bluesky bot template](https://github.com/philnash/bsky-bot) provided by Phil Nash - big thanks! to automatically fetch new PsyArXiv preprints via RSS and post summaries to Bluesky.

It uses TypeScript, the `@atproto/api`, and runs as a scheduled task.

---

## Reference

For general setup, environment variables, GitHub Actions, and deployment, **please refer to the original template README**.

This README focuses only on the ArXiv-specific logic and maintenance.

---

## What This Bot Does

* **Fetches PsyArXiv RSS feed**
  Uses [`rss-parser`](https://www.npmjs.com/package/rss-parser) to read from:
  `https://osfpreprints-feed.herokuapp.com/PsyArXiv.rss`

* **Tracks already posted papers**
  Stores IDs of posted papers in `postedPapers.json` to avoid duplicates.

* **Formats Bluesky post text**
  For each new paper, creates a short post with the title and link.

* **Posts to Bluesky**
  Logs in using the configured Bluesky handle and password, then posts using the `@atproto/api`.

---

## Main Files and Logic

| File                 | Purpose                                                                               |
| -------------------- | ------------------------------------------------------------------------------------- |
| `src/config.ts`      | Loads environment variables for Bluesky login and service.                            |
| `src/bot.ts`         | Handles Bluesky login and posting.                                                    |
| `src/getPostText.ts` | Parses the RSS feed, filters out already-posted papers, and prepares post texts.      |
| `src/index.ts`       | Main script: pulls new posts, sends them to Bluesky, and updates `postedPapers.json`. |

---

## Setup

1. **Environment Variables** (set via `.env` or CI/CD configuration):

   * `BSKY_HANDLE`: Bluesky handle
   * `BSKY_PASSWORD`: Bluesky PW
   * `BSKY_SERVICE`: (optional) Bluesky service URL, defaults to `https://bsky.social`

2. **Dependencies**:

   * Node.js (v18+ recommended)
   * Install with:

     ```bash
     npm install
     ```

---

## Maintenance

* To **reset posted tracking**, delete or clear `postedPapers.json`.
* To **adjust post limits**, modify `MAX_POSTS_PER_RUN` in `getPostText.ts`.
* To **change the feed source**, update the `FEED_URL` in `getPostText.ts`. This could be done if the RSS feed does not get updated or if you want to switch to a different source.

---

## Deploy

Follow the deployment instructions from the template README — using GitHub Actions on a schedule.
