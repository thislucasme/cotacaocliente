import React, { useContext } from "react";
import { CotacaoVencida } from "../components/erros/CotacaoVencida";
import { UrlContext } from "../context/UrlContext";
import { CotacoesAbertas } from "../pages/CotacoesAbertas";

export const VerificarData = () => {
	const dadosUrl = useContext(UrlContext);
	return (
		<>	{dadosUrl.isVencido ? <CotacaoVencida data={dadosUrl.dataValidade ?? 'Data inválida'} /> : <CotacoesAbertas />}</>

	);
}