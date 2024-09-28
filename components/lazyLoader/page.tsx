'use client'
import { useEffect, useRef, useState } from "react";

interface LazyLoaderProps {
  children: React.ReactNode;
}

const LazyLoader: React.FC<LazyLoaderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      {
        rootMargin: "100px 0px", 
        threshold: 0.1, 
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return <div ref={containerRef}>{isVisible ? children : null}</div>;
};

export default LazyLoader;
