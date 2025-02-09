import { createContext, useContext } from "react";
import toast, { ToastOptions } from "react-hot-toast";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const showToast = (message: string, type: ToastType = "info") => {
    const options: ToastOptions = {
      duration: 4000,
      position: "top-right",
      style: {
        background: "#363636",
        color: "#fff",
        padding: "12px 24px",
      },
    };

    switch (type) {
      case "success":
        toast.success(message, {
          ...options,
          icon: "🎉",
          style: {
            ...options.style,
            background: "#059669",
          },
        });
        break;
      case "error":
        toast.error(message, {
          ...options,
          icon: "❌",
          style: {
            ...options.style,
            background: "#DC2626",
          },
        });
        break;
      case "warning":
        toast(message, {
          ...options,
          icon: "⚠️",
          style: {
            ...options.style,
            background: "#D97706",
          },
        });
        break;
      default:
        toast(message, {
          ...options,
          icon: "i️",
        });
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
