export interface InsightArticle {
  slug: string;
  category: "GEO / Yapay Zeka Arama" | "Ajans Modelleri" | "Core Web Vitals" | "Lokal SEO";
  title: string;
  summary: string;
  readTime: string;
  date: string;
  author: string;
  tags: string[];
  content: string[];
  marketCaseStudy: {
    clientType: string;
    challenge: string;
    appliedSolution: string;
    concreteResult: string;
  };
  codeSnippet?: {
    language: string;
    code: string;
    caption: string;
  };
  keyTakeaways: string[];
  ctaText: string;
}

export const INSIGHTS_DATA: InsightArticle[] = [];
