'use server';

import * as cheerio from 'cheerio';

export async function extractLinksFromHTML(html: string): Promise<{ link: string; text: string }[]> {
    const $ = cheerio.load(html);
    const links: { link: string; text: string }[] = [];

    $('td a').each((_, el) => {
        const link = $(el).attr('href');
        const text = $(el).text().trim();
        if (link) {
            links.push({ link, text });
        }
    });

    return links;
}
