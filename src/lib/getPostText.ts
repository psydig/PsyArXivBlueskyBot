import fs from 'fs';
import Parser from 'rss-parser';

const FEED_URL = 'https://osfpreprints-feed.herokuapp.com/PsyArXiv.rss';
const POSTED_PAPERS_PATH = './postedPapers.json';
const ONE_DAY = 24 * 60 * 60 * 1000;  // One day in milliseconds

export default async function getPostText() {
  const parser = new Parser();
  const feed = await parser.parseURL(FEED_URL);
  const postedPapers = JSON.parse(fs.readFileSync(POSTED_PAPERS_PATH, 'utf8'));

  const currentDate = new Date();

  for (const item of feed.items) {
    const publicationDate = item.pubDate ? new Date(item.pubDate) : new Date();

    // Check if the paper is already posted by comparing title and link
    const isAlreadyPosted = postedPapers.papers.some(paper => paper.title === item.title && paper.link === item.link);

    // If publication is newer than one day, and it's not already posted
    if (!isAlreadyPosted && (currentDate.getTime() - publicationDate.getTime() <= ONE_DAY)) {
      return `${item.title}: ${item.link}`;  // Format this as you'd like
    }
  }

  // If no new papers are found
  return null;
}
