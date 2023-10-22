import Bot from "./lib/bot.js";
import getPostText from "./lib/getPostText.js";
import fs from 'fs';
import { execSync } from 'child_process';

interface Paper {
  title: string;
  link: string;
}

const POSTED_PAPERS_PATH = './postedPapers.json';
const postedPapers = JSON.parse(fs.readFileSync(POSTED_PAPERS_PATH, 'utf8'));

async function main() {
  const papersData = await getPostText();

  if (papersData && papersData.length > 0) {
    for (const textData of papersData) {
      const { title, link, formattedText } = textData;

      if (!postedPapers.papers.some((paper: Paper) => paper.title === title && paper.link === link)) {
        await Bot.run(() => Promise.resolve(formattedText));
        
        postedPapers.papers.push({ title, link });
        fs.writeFileSync(POSTED_PAPERS_PATH, JSON.stringify(postedPapers, null, 2));

        console.log(`[${new Date().toISOString()}] Posted: "${formattedText}"`);
      } else {
        console.log(`[${new Date().toISOString()}] Already posted: "${title}"`);
      }
    }
    execSync('git add ' + POSTED_PAPERS_PATH);
    execSync('git commit -m "Added new posted papers"');
    execSync('git push origin main'); 
  } else {
    console.log(`[${new Date().toISOString()}] No new posts to publish.`);
  }
}

main();



