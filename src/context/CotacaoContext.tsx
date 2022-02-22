import { createContext, ReactNode, useState } from "react";
import { ItemCotacaoTDO } from '../lib/types'


export const CotacaoContext = createContext<ItemCotacaoTDO[]>([]);

interface CotacaoProviderProps {
	children: ReactNode
}

export function CotacaoProvider({ children }: CotacaoProviderProps) {
	
	const [cotacao, setCotacao] = useState<ItemCotacaoTDO[]>([])

	

}