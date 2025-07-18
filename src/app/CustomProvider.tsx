"use client";
import { store } from "@/store/store";
import posthog from "posthog-js";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PostHogProvider as PHProvider } from "posthog-js/react";

export default function CustomProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    posthog.init("phc_8e0LX3r916ljt4x3jOBGRF40OxQCJf4RBf03gPNve7m", {
      api_host: "https://us.i.posthog.com",
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    });
  }, []);
  return (
    <PHProvider client={posthog}>
      <Provider store={store}>{children}</Provider>
    </PHProvider>
  );
}
