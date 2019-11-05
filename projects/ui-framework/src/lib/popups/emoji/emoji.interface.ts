export interface EmojiCategory {
  name: string;
  data: Emoji[];
  code?: string;
}

export interface Emoji {
  code: string;
  shortname: string;
  category: string;
  description: string;
  tags: string[];
  icon: string;
}
