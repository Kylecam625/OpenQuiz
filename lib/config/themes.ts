export type ThemeName = "light" | "dark" | "ocean" | "forest" | "sunset";

export interface Theme {
  name: ThemeName;
  label: string;
  description: string;
  icon: string;
}

export const themes: Theme[] = [
  {
    name: "light",
    label: "Light",
    description: "Clean and bright",
    icon: "☀️",
  },
  {
    name: "dark",
    label: "Dark",
    description: "Easy on the eyes",
    icon: "🌙",
  },
  {
    name: "ocean",
    label: "Ocean",
    description: "Deep blue waters",
    icon: "🌊",
  },
  {
    name: "forest",
    label: "Forest",
    description: "Natural greens",
    icon: "🌲",
  },
  {
    name: "sunset",
    label: "Sunset",
    description: "Warm and vibrant",
    icon: "🌅",
  },
];

export const defaultTheme: ThemeName = "light";

export function isValidTheme(theme: string): theme is ThemeName {
  return ["light", "dark", "ocean", "forest", "sunset"].includes(theme);
}

export function getTheme(name: string): Theme | undefined {
  return themes.find((theme) => theme.name === name);
}

