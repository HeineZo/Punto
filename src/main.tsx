import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Generate from "./routes/Generate.layout.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/generate",
    element: <Generate />
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="min-h-screen">
      <RouterProvider router={router} />
    </main>
  </React.StrictMode>
);
