import React from "react";
import { UrlProvider } from "../context/UrlContext";
import { VerificarData } from "./VerificarData";

export const CotacaoInterceptor = () => {
	return (
		<UrlProvider>
			<VerificarData />
		</UrlProvider>

	);
}