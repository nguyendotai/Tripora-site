"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { SessionHydrator } from "@/shared/components/session-hydrator";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SessionHydrator />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
