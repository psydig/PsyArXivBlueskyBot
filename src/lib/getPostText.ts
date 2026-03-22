import Parser from 'rss-parser';
import fs from 'fs';

interface Paper {
  title: string;
  link: string;
}

const FEED_URL = 'https://share.osf.io/api/v2/feeds/atom/?elasticQuery=%7B%22bool%22%3A%7B%22filter%22%3A%5B%7B%22term%22%3A%7B%22sources%22%3A%22PsyArXiv%22%7D%7D%2C%7B%22term%22%3A%7B%22type%22%3A%22preprint%22%7D%7D%5D%7D%7D';
const POSTED_PAPERS_PATH = './postedPapers.json';

function loadPostedPapers() {
  try {
    return JSON.parse(fs.readFileSync(POSTED_PAPERS_PATH, 'utf8'));
  } catch {
    return { papers: [] };
  }
}

const postedPapers = loadPostedPapers();

const ONE_DAY = 24 * 60 * 60 * 1000;  // ✅ fixed: 24 hours in milliseconds
const MAX_POSTS_PER_RUN = 20;

export default async function getPostText() {
  const parser = new Parser();
  const feed = await parser.parseURL(FEED_URL);

  const papersToPost = [];

  for (const item of feed.items) {
    const publicationDate = item.pubDate ? new Date(item.pubDate) : new Date();
    const currentDate = new Date();

    const isAlreadyPosted = postedPapers.papers.some((paper: Paper) => paper.title === item.title && paper.link === item.link);
    const formattedText = `${item.title}: ${item.link}`;
    const isWithinLengthLimit = formattedText.length <= 290;

    if (!isAlreadyPosted && (currentDate.getTime() - publicationDate.getTime() <= ONE_DAY) && isWithinLengthLimit) {
      papersToPost.push({
        title: item.title,
        link: item.link,
        formattedText: formattedText
      });

      if (papersToPost.length >= MAX_POSTS_PER_RUN) {
        break;
      }
    }
  }

  return papersToPost.length > 0 ? papersToPost : null;
}
