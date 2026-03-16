import type { ReactNode } from "react";
import type { Slide } from "./data/sushiData";
import { DataContext } from "./assets/hooks/useData";

type DataProviderProps = {
  data: Slide[];
  children: ReactNode;
};

export function DataProvider({ data, children }: DataProviderProps) {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
