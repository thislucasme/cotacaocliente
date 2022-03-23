import React from "react"
import { CotacaoProvider } from "../context/CotacaoContext"
import { InfoEmpresaProvider } from "../context/InfoEmpresaContext"
import { UrlProvider } from "../context/UrlContext"
import { TesteLayout } from "./TesteLayout"

export const Layout = () => {

	return (
		<UrlProvider>
			<CotacaoProvider>
				<InfoEmpresaProvider>
					<TesteLayout />
				</InfoEmpresaProvider>
			</CotacaoProvider>
		</UrlProvider>

	)
}