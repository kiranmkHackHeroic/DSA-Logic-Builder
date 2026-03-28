import { useRef, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Skip to main content link for keyboard navigation
 */
export const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
    >
      Skip to main content
    </a>
  );
};

/**
 * Focus trap for modal dialogs and popups
 */
interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  className?: string;
}

export const FocusTrap = ({ children, active = true, className }: FocusTrapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [active]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

/**
 * Visually hidden component for screen readers
 */
interface VisuallyHiddenProps {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const VisuallyHidden = ({ children, as: Component = "span" }: VisuallyHiddenProps) => {
  return <Component className="sr-only">{children}</Component>;
};

/**
 * Live region for announcing dynamic content to screen readers
 */
interface LiveRegionProps {
  children: ReactNode;
  mode?: "polite" | "assertive";
  className?: string;
}

export const LiveRegion = ({ children, mode = "polite", className }: LiveRegionProps) => {
  return (
    <div
      aria-live={mode}
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      {children}
    </div>
  );
};

/**
 * Loading announcement for screen readers
 */
interface LoadingAnnouncerProps {
  isLoading: boolean;
  loadingText?: string;
  loadedText?: string;
}

export const LoadingAnnouncer = ({
  isLoading,
  loadingText = "Loading content...",
  loadedText = "Content loaded",
}: LoadingAnnouncerProps) => {
  return (
    <LiveRegion mode="polite">
      {isLoading ? loadingText : loadedText}
    </LiveRegion>
  );
};

/**
 * Keyboard-only focus styles wrapper
 */
interface KeyboardFocusProps {
  children: ReactNode;
  className?: string;
}

export const KeyboardFocus = ({ children, className }: KeyboardFocusProps) => {
  return (
    <div
      className={cn(
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  );
};

export default {
  SkipToContent,
  FocusTrap,
  VisuallyHidden,
  LiveRegion,
  LoadingAnnouncer,
  KeyboardFocus,
};
