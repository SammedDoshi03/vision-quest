import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface PortalContextValue {
  mount: (key: string, node: ReactNode) => void;
  unmount: (key: string) => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

let portalCounter = 0;

export function PortalHost({ children }: { children: ReactNode }) {
  const [portals, setPortals] = useState<Map<string, ReactNode>>(new Map());

  const mount = (key: string, node: ReactNode) => {
    setPortals((prev) => new Map(prev).set(key, node));
  };

  const unmount = (key: string) => {
    setPortals((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  };

  return (
    <PortalContext.Provider value={{ mount, unmount }}>
      {children}
      {Array.from(portals.entries()).map(([key, node]) => (
        <React.Fragment key={key}>{node}</React.Fragment>
      ))}
    </PortalContext.Provider>
  );
}

export function Portal({ children }: { children: ReactNode }) {
  const ctx = useContext(PortalContext);
  const [key] = useState(() => `portal_${++portalCounter}`);

  React.useEffect(() => {
    if (!ctx) return;
    ctx.mount(key, children);
    return () => ctx.unmount(key);
  }, [ctx, key, children]);

  if (!ctx) {
    return <>{children}</>;
  }

  return null;
}
