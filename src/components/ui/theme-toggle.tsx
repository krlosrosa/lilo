"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const ThemeToggle = ({ isCollapsed }: { isCollapsed?: boolean }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita hidratação até que o componente esteja montado
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  const handleToggle = () => setTheme(isDark ? "light" : "dark");
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") handleToggle();
  };

  // Renderiza um placeholder até estar montado
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 w-full opacity-50">
        <div className="w-4 h-4" />
        {!isCollapsed && (
          <span className="text-sm">Carregando...</span>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 w-full cursor-pointer"
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      {!isCollapsed && (
        <span className="text-sm">{isDark ? "Tema Claro" : "Tema Escuro"}</span>
      )}
    </div>
  );
};

export default ThemeToggle; 