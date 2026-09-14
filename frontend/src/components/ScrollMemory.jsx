import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// sessionStorage survives even a full page reload (e.g. if a link is a
// plain <a> tag somewhere and causes a hard navigation instead of a
// client-side route change).
const STORAGE_KEY = "scrollPositions";

function readStore() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // sessionStorage can throw in private/incognito edge cases — ignore
  }
}

// IMPORTANT: the site's global CSS sets `html { scroll-behavior: smooth }`.
// That makes window.scrollTo(x, y) animate over several hundred ms instead
// of jumping instantly. If we used the plain (x, y) form here, our own
// "reset to top" / "restore position" calls would animate too — and the
// scroll listener below would record several in-between frames of that
// animation under the page you're LEAVING, permanently overwriting the
// real saved position with a near-zero value from mid-animation. Passing
// `behavior: "instant"` bypasses the CSS smooth-scroll for calls we make
// ourselves, without touching smooth-scrolling anywhere else on the site.
function instantScrollTo(y) {
  window.scrollTo({ top: y, left: 0, behavior: "instant" });
}

// Tracks whether THIS JS session has completed at least one route change.
// A hard page reload always reports navType "POP" on its first render even
// though it isn't a real back/forward — this flag stops us from treating
// a fresh reload as if it were a browser-back navigation.
let hasNavigatedThisSession = false;

export default function ScrollMemory() {
  const { pathname, key: locationKey } = useLocation();
  const navType = useNavigationType(); // 'PUSH', 'REPLACE', or 'POP'
  const isFirstRender = useRef(true);

  // React 18 StrictMode (which Vite enables by default in dev) deliberately
  // runs effects twice per commit. Without this guard, the restore effect
  // below would run twice for the SAME browser-history entry. `key` is
  // unique per history entry, so tracking it lets us process each real
  // navigation exactly once, no matter how many times React re-invokes
  // the effect for it.
  const lastProcessedKey = useRef(null);

  // 1. Disable browser's built-in scroll restoration so it doesn't fight us
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // 2. Continuously record scroll position for the current path
  useEffect(() => {
    const handleScroll = () => {
      const store = readStore();
      store[pathname] = window.scrollY;
      writeStore(store);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // 3. Restore position on back/forward, but only once content is tall
  //    enough to actually scroll there. Async data (stats, fixtures, etc.)
  //    can still be loading, so a single fixed delay isn't reliable.
  useEffect(() => {
    if (lastProcessedKey.current === locationKey) {
      // Already handled this exact navigation (StrictMode re-run) — skip.
      return;
    }
    lastProcessedKey.current = locationKey;

    const isGenuineFirstLoad =
      isFirstRender.current && !hasNavigatedThisSession;
    isFirstRender.current = false;
    hasNavigatedThisSession = true;

    if (navType !== "POP" || isGenuineFirstLoad) {
      instantScrollTo(0);
      return;
    }

    // Capture the target ONCE, right when we decide to restore. Later
    // scroll events (including ones caused by our own polling) must not
    // change what we're aiming for.
    const store = readStore();
    const targetY = store[pathname] || 0;

    if (targetY === 0) return;

    let cancelled = false;
    let tries = 0;
    const maxTries = 40; // ~2s at 50ms intervals

    const tryScroll = () => {
      if (cancelled) return;

      const pageHeight = document.documentElement.scrollHeight;
      const isTallEnough = pageHeight - window.innerHeight >= targetY - 5;

      if (isTallEnough || tries >= maxTries) {
        instantScrollTo(targetY);
        return;
      }

      tries += 1;
      setTimeout(tryScroll, 50);
    };

    // Kick off after the initial paint
    const id = setTimeout(tryScroll, 50);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [pathname, navType, locationKey]);

  return null;
}
