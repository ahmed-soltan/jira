"use client";

import { parseAsString, useQueryState } from "nuqs";

export const useOrigin = () => {
  const [origin, setOrigin] = useQueryState(
    "origin",
    parseAsString.withDefault("/").withOptions({ clearOnDefault: true })
  );

  return {
    origin,
    setOrigin,
  };
};
