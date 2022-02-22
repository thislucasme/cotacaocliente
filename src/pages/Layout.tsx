import React from "react"
import { UrlProvider } from "../context/UrlContext"
import { TesteLayout } from "./TesteLayout"

export const Layout = () => {

	return (
		<UrlProvider>
			<TesteLayout />
		</UrlProvider>

	)
}