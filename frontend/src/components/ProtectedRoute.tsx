import { type JSX } from "react";
import { useAuth } from "../context/AuthContext";
import InfoPanel from "./InfoPanel";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <InfoPanel />;
  }

  return children;
}
