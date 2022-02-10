import { HStack, Skeleton, Stack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { urlDataState } from "../context/atom";
import { apiGetEmpresa } from "../lib/api";
import { Empresa } from "../lib/types";
export const InfoEmpresa = () => {
	const [empresa, setEmpresa] = useState<Empresa | null>();

	const data = useRecoilValue(urlDataState)


	useEffect(() => {

		//const data: UrlData = JSON.parse(localStorage.getItem('urlData') as string);

		const url = 'empresa/' + data[0]?.contratoEmpresa + '/' + data[0]?.codigoFornecedor + '/' + data[0]?.numeroEmpresa
		const result = apiGetEmpresa(url)
		result.then((result) => {
			setEmpresa(result.data);
		}).catch(error => {
		})
	}, [data])
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
					COTAÇÃO: {data[0].numeroCotacao ? data[0].numeroCotacao : 0}
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