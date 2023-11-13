import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Generate from "./routes/generate/index.tsx";
import History from "./routes/history/index.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/generate",
    element: <Generate />,
  },
  {
    path: "/history",
    element: <History />
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="min-h-screen">
      <RouterProvider router={router} />
      <Toaster />
    </main>
  </React.StrictMode>
);
