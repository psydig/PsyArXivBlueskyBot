import Parser from 'rss-parser';
import fs from 'fs';

interface Paper {
  title: string;
  link: string;
}

const FEED_URL = 'https://osfpreprints-feed.herokuapp.com/PsyArXiv.rss';
const POSTED_PAPERS_PATH = './postedPapers.json';
const postedPapers = JSON.parse(fs.readFileSync(POSTED_PAPERS_PATH, 'utf8'));

const ONE_DAY = 24 * 60 * 60 * 1000;  // One day in milliseconds

export default async function getPostText() {
  const parser = new Parser();
  const feed = await parser.parseURL(FEED_URL);
  const papersToPost = [];

  for (const item of feed.items) {
    const publicationDate = item.pubDate ? new Date(item.pubDate) : new Date();
    const currentDate = new Date();

    // Check if title is defined and skip papers with titles longer than 280 graphemes
    if (!item.title || item.title.length > 280) {
      continue;
    }

    const isAlreadyPosted = postedPapers.papers.some((paper: Paper) => paper.title === item.title && paper.link === item.link);

    if (!isAlreadyPosted && (currentDate.getTime() - publicationDate.getTime() <= ONE_DAY)) {
      papersToPost.push({
        title: item.title,
        link: item.link,
        formattedText: `${item.title}: ${item.link}`
      });
    }
  }

  return papersToPost.length > 0 ? papersToPost : null;
}


