export enum PersonaType {
  CEO = 'CEO', // 霸总
  SOCIALITE = 'SOCIALITE' // 名媛/大女主
}

export interface Post {
  content: string;
  imageDescription: string;
  hashtags: string[];
  likes: string;
}

export interface PersonaData {
  idName: string;
  title: string;
  tags: string[];
  bio: string;
  location: string;
  posts: Post[];
}

export interface GenerationRequest {
  keyword: string;
  type: PersonaType;
}

export interface GenerationOptions {
  includeMCN: boolean;
  includeShareholders: boolean;
  includeStats: boolean;
}