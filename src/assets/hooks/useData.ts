import { createContext, useContext } from "react";
import type { Slide } from "../../data/sushiData";

type DataContextType = Slide[];

export const DataContext = createContext<DataContextType | null>(null);

export function useData() {
    const context = useContext(DataContext)

    if (!context) {
        throw new Error('useData must be used within Provider')
    }

    return context;
}