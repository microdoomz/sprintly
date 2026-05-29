"use client";

import { useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMax?: number;
  glowColor?: string;
  scale?: number;
}

export function TiltCard({
  children,
  className,
  tiltMax = 8,
  glowColor = "rgba(20, 184, 166, 0.15)",
  scale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate tilt angles
        const rotateX = ((y - centerY) / centerY) * -tiltMax;
        const rotateY = ((x - centerX) / centerX) * tiltMax;

        setTransform(
          `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
        );

        // Spotlight follows cursor
        setSpotlightStyle({
          background: `radial-gradient(600px circle at ${x}px ${y}px, ${glowColor}, transparent 40%)`,
        });
      });
    },
    [tiltMax, glowColor, scale]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTransform("");
    setSpotlightStyle({});
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn("tilt-card", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
    >
      <div className="tilt-spotlight" style={spotlightStyle} />
      {children}
    </div>
  );
}
