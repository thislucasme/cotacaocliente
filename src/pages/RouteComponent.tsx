import React from "react";
import { Route, Routes } from 'react-router-dom';
import { ListaEmpresa } from "../components/ListaEmpresas";
import { ListaUsuarios } from "../components/ListaUsuarios";
import { PaginaInfo } from "../components/PaginaInfo";
import { CotacoesAbertas } from "./CotacoesAbertas";
import { Login } from "./Login";

import { Moeda } from "./Moeda";
import { Report } from "./Report";
import { TesteLayout } from "./TesteLayout";

export const RouteComponent = () => {
	return (

		<Routes>
			<Route index element={<Login />} />
			<Route path={"painel"} element={<TesteLayout />} >
				<Route index element={<PaginaInfo />} />
				<Route path="cotacoes-abertas/:codigoCotacao" element={<ListaEmpresa />} />
				<Route path="cotacao/:codigoCotacao" element={<CotacoesAbertas />} />
				<Route path="cotacoes-fechadas" element={<ListaEmpresa />} />
				<Route path="home/:codigoCotacao" element={<PaginaInfo />} />
				<Route path="relatorios/:codigoCotacao" element={<Report />} />
				<Route path="configuracao" element={<ListaUsuarios />} />
				<Route path=":idDocumento" element={<TesteLayout />} />
				<Route path="teste" element={<Moeda />} />
			</Route>
		</Routes>

	);
}