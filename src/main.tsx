import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Generate from "./routes/generate/index.tsx";
import History from "./routes/history/index.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import PlayGame from "./routes/play/index.tsx";
import Footer from "./components/shared/Footer.tsx";

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
  },
  {
    path: "/play",
    element: <PlayGame />
  },
  {
    path: "/history/:id",
    element: <div>History detail</div>
  },
  {
    path: "*",
    element: <div>404</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="min-h-screen mt-10">
      <RouterProvider router={router} />
      <Toaster />
    </main>
    <Footer />
  </React.StrictMode>
);
