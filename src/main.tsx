import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import App from "./App.tsx";
import "./index.css";
import AudioProvider from "./providers/AudioProvider.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { cache } from "./utils/cache.ts";

const client = new ApolloClient({
  uri: import.meta.env.VITE_APP_TADDY_URI,
  cache,
  headers: {
    "Content-Type": "application/json",
    "X-USER-ID": import.meta.env.VITE_APP_TADDY_USER_ID || "",
    "X-API-KEY": import.meta.env.VITE_APP_TADDY_API_KEY || "",
  },
});

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk publishable key to the .env.local file");
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <AudioProvider>
        <ApolloProvider client={client}>
          <StrictMode>
            <App />
          </StrictMode>
        </ApolloProvider>
      </AudioProvider>
    </ClerkProvider>
  </BrowserRouter>
);
