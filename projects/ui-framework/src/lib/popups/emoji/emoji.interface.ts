export interface EmojiCategories {
  people?: Emoji[];
  nature?: Emoji[];
  foods?: Emoji[];
  activity?: Emoji[];
  places?: Emoji[];
  objects?: Emoji[];
  symbols?: Emoji[];
  flags?: Emoji[];
}

export interface Emoji {
  code: string;
  shortname: string;
  category: string;
  description: string;
  tags: string[];
  icon: string;
}
