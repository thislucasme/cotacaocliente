import React from "react"
import { CotacaoBloqueadoProvider } from "../context/CotacaoBloqueadoContext"
import { CotacaoProvider } from "../context/CotacaoContext"
import { InfoEmpresaProvider } from "../context/InfoEmpresaContext"
import { InfoFornecedorInfoProvider } from "../context/InfoFornecedorContext"
import { UrlProvider } from "../context/UrlContext"
import { TesteLayout } from "./TesteLayout"

export const Layout = () => {

	return (
		<UrlProvider>
			<CotacaoProvider>
				<InfoEmpresaProvider>
					<InfoFornecedorInfoProvider>
						<CotacaoBloqueadoProvider>
						<TesteLayout />
						</CotacaoBloqueadoProvider>
					</InfoFornecedorInfoProvider >
				</InfoEmpresaProvider>
			</CotacaoProvider>
		</UrlProvider>

	)
}