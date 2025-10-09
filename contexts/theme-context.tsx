"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ThemeName, defaultTheme, isValidTheme } from "@/lib/config/themes";

const THEME_STORAGE_KEY = "app-theme";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && isValidTheme(savedTheme)) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Try to load from database if user is logged in
      if (session?.user) {
        fetchThemeFromDatabase();
      }
    }
    setIsInitialized(true);
  }, []);

  // Sync with database when user logs in
  useEffect(() => {
    if (session?.user && isInitialized) {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!savedTheme) {
        fetchThemeFromDatabase();
      }
    }
  }, [session?.user, isInitialized]);

  const fetchThemeFromDatabase = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        if (data.theme && isValidTheme(data.theme)) {
          setThemeState(data.theme);
          applyTheme(data.theme);
          localStorage.setItem(THEME_STORAGE_KEY, data.theme);
        }
      }
    } catch (error) {
      console.error("Failed to fetch theme from database:", error);
    }
  };

  const applyTheme = (newTheme: ThemeName) => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      "light",
      "dark",
      "ocean",
      "forest",
      "sunset"
    );
    // Add the new theme class
    document.documentElement.classList.add(newTheme);
  };

  const setTheme = async (newTheme: ThemeName) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // Save to localStorage immediately
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    // Save to database if user is logged in
    if (session?.user) {
      try {
        await fetch("/api/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: newTheme }),
        });
      } catch (error) {
        console.error("Failed to save theme to database:", error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}

