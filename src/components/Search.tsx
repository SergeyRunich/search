import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Search.module.css";

type Item = { id: number; title: string; description: string };

export default function Search() {
  const router = useRouter();
  const initialQuery = typeof router.query.q === "string" ? router.query.q : "";

  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  // request counter to ignore stale responses
  const requestIdRef = useRef(0);

  // keep the latest request's abort controller
  const abortControllerRef = useRef<AbortController | null>(null);

  // debounce timer
  const debounceRef = useRef<number | null>(null);

  // sync URL when query changes (debounced to avoid too many pushes)
  useEffect(() => {
    const clean = () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
    return clean;
  }, []);

  // Perform search with debounce
  useEffect(() => {
    // update URL immediately (so browser history shows typed query) — shallow push to avoid reload
    const pushUrl = () => {
      const newQuery = query ? { q: query } : {};
      // replace to avoid polluting history on each keystroke, but user can still go back to previous pages
      router.replace(
        { pathname: router.pathname, query: newQuery },
        undefined,
        { shallow: true }
      );
    };
    pushUrl();

    // debounce 300ms
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      doSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]); // router intentionally excluded

  // Do actual fetch; ensures stale responses ignored
  const doSearch = (q: string) => {
    // increment request id
    const reqId = ++requestIdRef.current;

    // abort previous network request if any
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch {}
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // if empty query -> clear results (fast UX)
    if (q.trim() === "") {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/search?q=${encodeURIComponent(q)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        // check if this response is still the latest
        if (reqId !== requestIdRef.current) {
          // stale — ignore
          return;
        }
        setResults(data.results ?? []);
        setLoading(false);
        setError(null);
        setHighlightIndex(-1);
      })
      .catch((err) => {
        // if aborted, do nothing
        if (err.name === "AbortError") return;
        // only set error if this is the latest request
        if (reqId !== requestIdRef.current) return;
        setLoading(false);
        setError(err.message ?? "Ошибка");
      });
  };

  // keyboard navigation for results
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && highlightIndex < results.length) {
        // example action: navigate to item page (not implemented) or just fill input
        const item = results[highlightIndex];
        setQuery(item.title);
        setResults([]);
        setHighlightIndex(-1);
      }
    } else if (e.key === "Escape") {
      setResults([]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.inputRow}>
          <input
            id='search'
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder='Type here to find products'
            aria-label='Search'
            autoComplete='off'
          />
          {query && (
            <button
              className={styles.clearBtn}
              onClick={() => {
                setQuery("");
                setResults([]);
                setError(null);
                requestIdRef.current++;
                try {
                  abortControllerRef.current?.abort();
                } catch {}
              }}
              aria-label='reset'
            >
              ✕
            </button>
          )}
          <div className={styles.loadingArea}>
            {loading && <div className={styles.spinner} aria-hidden />}
          </div>
        </div>
      </div>

      <div className={styles.results}>
        {error && <div className={styles.error}>Error: {error}</div>}

        {!loading && results.length === 0 && query.trim() !== "" && !error && (
          <div className={styles.empty}>Nothing found</div>
        )}

        <ul
          className={styles.list}
          role='listbox'
          aria-activedescendant={
            highlightIndex >= 0 ? `result-${highlightIndex}` : undefined
          }
        >
          {results.map((it, idx) => (
            <li
              id={`result-${idx}`}
              key={it.id}
              className={`${styles.item} ${
                idx === highlightIndex ? styles.highlight : ""
              }`}
              onMouseEnter={() => setHighlightIndex(idx)}
              onMouseLeave={() => setHighlightIndex(-1)}
              onClick={() => {
                setQuery(it.title);
                setResults([]);
                setHighlightIndex(-1);
              }}
              role='option'
              aria-selected={idx === highlightIndex}
            >
              <div className={styles.itemTitle}>{it.title}</div>
              <div className={styles.itemDesc}>{it.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
