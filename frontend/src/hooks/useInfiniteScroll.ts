"use client";
import { useEffect, useRef, useState } from "react";
export function useInfiniteScroll(total: number) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const sentinel = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    timer.current = setTimeout(() => {
      setCount(Math.min(6, total));
      setLoading(false);
    }, 550);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [total]);
  useEffect(() => {
    const element = sentinel.current;
    if (!element || loading || count >= total) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setLoading(true);
          timer.current = setTimeout(() => {
            setCount((current) => Math.min(current + 3, total));
            setLoading(false);
          }, 650);
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [count, total, loading]);
  return { count, loading, sentinel, hasMore: count < total };
}
