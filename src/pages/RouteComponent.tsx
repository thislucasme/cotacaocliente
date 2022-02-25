import React from "react";
import { Route, Routes } from 'react-router-dom';
import { ListaEmpresa } from "../components/ListaEmpresas";
import { ListaUsuarios } from "../components/ListaUsuarios";
import { PaginaInfo } from "../components/PaginaInfo";
import { CotacaoInterceptor } from "../pageInterceptores/CotacaoInterceptor";
import { Layout } from "./Layout";
import { Login } from "./Login";
import { Moeda } from "./Moeda";
import { Report } from "./Report";


export const RouteComponent = () => {
	return (

		<Routes>
			<Route index element={<Login />} />
			<Route path={"painel"} element={<Layout />} >
				<Route index element={<PaginaInfo />} />
				<Route path="cotacoes-abertas/:codigoCotacao" element={<ListaEmpresa />} />
				<Route path="cotacao/:url" element={<CotacaoInterceptor />} />
				<Route path="cotacoes-fechadas" element={<ListaEmpresa />} />
				<Route path="home/:url" element={<PaginaInfo />} />
				<Route path="relatorios/:codigoCotacao" element={<Report />} />
				<Route path="configuracao" element={<ListaUsuarios />} />
				<Route path=":idDocumento" element={<Layout />} />
				<Route path="teste" element={<Moeda />} />

			</Route>
		</Routes>
	);
}