export type Category =
  | "Images"
  | "Forms"
  | "Color & Contrast"
  | "Page Structure"
  | "Links & Buttons"
  | "Language & Meta"
  | "ARIA"
  | "Timing & Motion"
  | "Other";

export type PlainRule = {
  category: Category;
  title: string;
  why: string;
  fix: string;
};

export type RuleMap = Record<string, PlainRule>;
