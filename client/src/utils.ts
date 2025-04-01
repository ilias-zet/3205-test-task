import { Analytics, DB_Link, Link } from "./types";

const SERVER_URL = "http://localhost:3005";

export const urlShorten = async (originalUrl: string, expiresAt?: string): Promise<{ id: string }> => {
  const data = await fetch(`${SERVER_URL}/shorten/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ originalUrl, expiresAt }),
  });

  return data.json();
}

export const urlDelete = (shortLinkId: string) => {
  return fetch(`${SERVER_URL}/delete/${shortLinkId}`, {
    method: 'DELETE',
  });
}

export const getLinkObj = (shortLinkId: string, originalUrl: string): Link => {
  const url = new URL(`${SERVER_URL}/${shortLinkId}`);

  return ({
    id: shortLinkId,
    shortUrl: url.host + url.pathname,
    originalUrl,
    href: url.href, 
  })
}

export const getLinks = async (): Promise<Link[]> => {
  const data = await fetch(`${SERVER_URL}/links/`);
  const links: DB_Link[] = await data.json();
  return links.map(({ id, original_url }) => getLinkObj(id, original_url));
}

export const getAnalytics = async (shortLinkId: string): Promise<Analytics> => {
  const data = await fetch(`${SERVER_URL}/analytics/${shortLinkId}`);
  return data.json();
}

export const isValidUrl = (string: string): boolean => {
  let url;

  try {
    url = new URL(string);
  } catch {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
