import { useContext } from "react";
import useSWR from "swr";
import { UrlContext } from "../context/UrlContext";
import { apiGetEmpresa, apiIsBloqueadoCotacao } from "../lib/api";
import { CotacaoTDOPayload } from "../lib/types";

export const useCotacaoBloqueado = () => {

	const dadosUrl = useContext(UrlContext);
	const payload: CotacaoTDOPayload = {
		codigo: dadosUrl.numeroCotacao,
		fornecedor: dadosUrl.codigoFornecedor,
		codigoEmpresa: dadosUrl.numeroEmpresa,
		flag: undefined,
		contratoEmpresa: dadosUrl.contratoEmpresa
	}

	const { data, error, mutate, isValidating } = useSWR(payload, apiIsBloqueadoCotacao, {
		revalidateIfStale: true,
		revalidateOnFocus: false,
		revalidateOnReconnect: false
	});

	const loading = !data && !error;


	return {
		data,
		error,
		mutate,
		loading,
		isValidating
	}
}