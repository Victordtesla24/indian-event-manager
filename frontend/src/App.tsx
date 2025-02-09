import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./routes";
import { Suspense } from "react";
import { ToastProvider } from "./contexts/ToastContext";
import "./App.css";

const App = () => {
  return (
    <ToastProvider>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary-600"></div>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </ToastProvider>
  );
};

export default App;
