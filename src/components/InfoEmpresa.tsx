import { HStack, Skeleton, Stack, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { urlDataState } from "../context/atom";
import { UrlContext } from '../context/UrlContext';
import { apiGetEmpresa } from "../lib/api";
import { Empresa } from "../lib/types";
export const InfoEmpresa = () => {
	const [empresa, setEmpresa] = useState<Empresa | null>();

	const dadosUrl = useContext(UrlContext);


	useEffect(() => {

		//const data: UrlData = JSON.parse(localStorage.getItem('urlData') as string);

		const url = 'empresa/' + dadosUrl?.contratoEmpresa + '/' + dadosUrl?.codigoFornecedor + '/' + dadosUrl?.numeroEmpresa
		const result = apiGetEmpresa(url)
		result.then((result) => {
			setEmpresa(result.data);
		}).catch(error => {
		})
	}, [dadosUrl])
	return (
		empresa ?
			<HStack>
				<Text as='span' color='blue.300' fontWeight='normal'>
					{empresa?.razao}
				</Text>
				<Text fontSize={"sm"} color='gray.500'>
					CNPJ: {empresa?.cnpj}
				</Text>
				<Text fontSize={"sm"} color='gray.500'>
					CIDADE: {empresa?.cidade}
				</Text>
				<Text fontSize={"sm"} color='gray.500'>
					COTAÇÃO: {dadosUrl?.numeroCotacao ? dadosUrl?.numeroCotacao : 0}
				</Text>

			</HStack>
			:
			<Stack >
				<Skeleton height='20px' w="170px" />
				<Skeleton height='20px' w="400px" />
				<Skeleton height='20px' w="180px" />
			</Stack>
	);
}