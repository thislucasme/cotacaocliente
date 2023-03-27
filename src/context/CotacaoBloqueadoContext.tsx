import React, { createContext, ReactNode } from "react";
import { useCotacaoBloqueado } from "../hooks/useCotacaoBloqueado";


export const CotacaoBloqueadoContext = createContext<any>(null);

interface CotacaoBloqueadoProviderProps {
	children: ReactNode
}

export function CotacaoBloqueadoProvider({ children }: CotacaoBloqueadoProviderProps) {

	const cotacaoBLoqueado = useCotacaoBloqueado();
	

	return (
		<CotacaoBloqueadoContext.Provider value={cotacaoBLoqueado}>
			{children}
		</CotacaoBloqueadoContext.Provider>
	);
}