import React, { createContext, ReactNode } from "react";
import { encode } from "base-64";
import { useParams } from "react-router-dom";
import { UrlDataPosition, UrlVazioEnum } from "../enuns/enuns";
import { UrlData } from "../lib/types";

export const UrlContext = createContext<UrlData | Partial<UrlData>>({});

interface UrlProviderProps {
	children: ReactNode
}



export function UrlProvider({ children }: UrlProviderProps) {

	const { codigoCotacao } = useParams();

	const data: any = codigoCotacao?.split(encode('-success'));

	const urlData: UrlData = {
		contratoEmpresa: data[UrlDataPosition.CONTRATO_EMPRESA],
		numeroEmpresa: data[UrlDataPosition.NUMERO_EMPRESA],
		numeroCotacao: data[UrlDataPosition.NUMERO_COTACAO],
		cnpjFornecedor: data[UrlDataPosition.CNPJ_FORNECEDOR],
		codigoFornecedor: data[UrlDataPosition.CODIGO_FORNECEDOR]
	}


	const empty: Partial<UrlData> = { contratoEmpresa: UrlVazioEnum.VAZIO }

	return (
		<UrlContext.Provider value={urlData ? urlData : empty}>
			{children}
		</UrlContext.Provider>
	);
}