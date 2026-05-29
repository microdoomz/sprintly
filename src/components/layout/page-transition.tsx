"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [animationClass, setAnimationClass] = useState("page-enter-active");
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      // New page - trigger enter animation
      setAnimationClass("");
      // Force a reflow before adding the animation class
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setDisplayChildren(children);
          setAnimationClass("page-enter-active");
        });
      });
      prevPathname.current = pathname;
    } else {
      // Same page, just update children (e.g. data refresh)
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <div className={`page-transition ${animationClass}`}>
      {displayChildren}
    </div>
  );
}
