import React from "react"
import { CotacaoProvider } from "../context/CotacaoContext"
import { UrlProvider } from "../context/UrlContext"
import { TesteLayout } from "./TesteLayout"

export const Layout = () => {

	return (
		<UrlProvider>
			<CotacaoProvider>
				<TesteLayout />
			</CotacaoProvider>
		</UrlProvider>

	)
}