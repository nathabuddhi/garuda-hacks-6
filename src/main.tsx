import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LandingPage from "./pages/LandingPage.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "@/components/Layout.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<LandingPage />} />
                    <Route path="*" element={<Navigate to={"/"} replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);

