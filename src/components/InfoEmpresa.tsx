import { HStack, Skeleton, Spacer, Stack, Text, useMediaQuery, VStack } from '@chakra-ui/react';
import { Badge } from 'antd';
import React, { useContext, useEffect, useState } from "react";
import { CotacaoContext } from '../context/CotacaoContext';
import { UrlContext } from '../context/UrlContext';
import { apiGetEmpresa } from "../lib/api";
import { Empresa } from "../lib/types";
export const InfoEmpresa = () => {
	const [empresa, setEmpresa] = useState<Empresa | null>();

	const [isLargerThan600] = useMediaQuery('(min-width: 600px)');


	const dadosUrl = useContext(UrlContext);
	const price = useContext(CotacaoContext)

	const [codCotacao, setCodCotacao] = useState();

	useEffect(() => {

		//const data: UrlData = JSON.parse(localStorage.getItem('urlData') as string);

		const url = 'empresa/' + dadosUrl?.contratoEmpresa + '/' + dadosUrl?.codigoFornecedor + '/' + dadosUrl?.numeroEmpresa
		const result = apiGetEmpresa(url)
		result.then((result) => {
			setEmpresa(result.data);
		}).catch(error => {
		})

		if (price !== undefined) {
			setCodCotacao(price.numeroCotacao)

		}

	}, [dadosUrl, price])

	const firstLetterUpperCase = (word: string) => {
		return word.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
			return a.toUpperCase();
		});
	}



	return (
		empresa ?
			isLargerThan600 ?

				<>

					<HStack>

						<Text fontSize={"16px"} fontFamily={"Roboto"} style={{ fontWeight: 500 }} as='span' color='blue.300' fontWeight='normal'>
							{firstLetterUpperCase(empresa?.razao)}
						</Text>
						<Text fontSize={"16px"} fontFamily={"Roboto"} style={{ fontWeight: 500 }} color='gray.500'>
							CNPJ: {empresa?.cnpj}
						</Text>
						<Text fontSize={"16px"} fontFamily={"Roboto"} style={{ fontWeight: 500 }} color='gray.500'>
							cidade: {empresa?.cidade}
						</Text>
						<Text fontSize={"16px"} fontFamily={"Roboto"} style={{ fontWeight: 500 }} color='gray.500'>
							ctação: {codCotacao}
						</Text>
						<Spacer />
						<Text fontSize={"16px"} fontFamily={"Roboto"} style={{ fontWeight: 500 }} color='gray.500'>
							vencimento: {dadosUrl?.dataMoment?.format('llll').toLowerCase()}
						</Text>
					</HStack>

				</>
				: <VStack alignItems={"start"}>
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
						COTAÇÃO: {codCotacao}
					</Text>
					<Spacer />
					<Text fontSize={"sm"} color='gray.500'>
						VENCIMENTO: {dadosUrl?.dataMoment?.format('llll').toUpperCase()}
					</Text>
				</VStack>
			:
			<Stack >
				<Skeleton height='20px' w="170px" />
				<Skeleton height='20px' w="400px" />
				<Skeleton height='20px' w="180px" />
			</Stack>
	);
}