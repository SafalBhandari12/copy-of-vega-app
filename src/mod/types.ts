export interface Post {
  title: string;
  link: string;
  image: string;
}

export interface Link {
  title: string;
  episodesLink?: string;
  directLinks: {link: string; title: string; type: string}[];
  quality?: string;
}

export interface Info {
  title: string;
  synopsis: string;
  image: string;
  imdbId: string;
  type: string;
  linkList: Link[];
}

export interface Stream {
  server: string;
  link: string;
  type: string;
}

export interface EpisodeLink {
  title: string;
  link: string;
}
