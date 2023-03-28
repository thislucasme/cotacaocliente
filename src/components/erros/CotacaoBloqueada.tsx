import { Center, Image, Text, VStack } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import Locked from '../../assets/padlock.png';
import { CotacaoContext } from "../../context/CotacaoContext";
import { InfoEmpresaContext } from "../../context/InfoEmpresaContext";
import { formatedTelefoneNumber } from "../../lib/utils";
//teste

export const CotacaoBloqueada = () => {

	const dadosEmpresa = useContext(InfoEmpresaContext)
	const price = useContext(CotacaoContext)
	const [codCotacao, setCodCotacao] = useState();

	useEffect(() => {
		if (price !== undefined) {
			setCodCotacao(price?.numeroCotacao)

		}
	}, [price])

	return (
		<Center display="flex" alignContent="center" alignItems="center" w="full">

			<VStack spacing={2}>
				<Image  src={Locked}/>
				<Text fontSize={"x-large"}>
				Acesso à cotação bloqueado.
				</Text>
				<Text align={"center"} w={"80%"} color={"gray"} fontSize={"md"}>
				Pedimos desculpas, mas a cotação que você solicitou está bloqueada
				ou encerrada. Por favor, entre em contato com
				a {dadosEmpresa?.data?.data?.razao}, a empresa solicitante,
				para obter mais informações. Você pode entrar em contato com eles
				através do número
			
				</Text>
				<Text align={"center"} w={"80%"} color={"gray"} fontSize={"md"}>
				{formatedTelefoneNumber(dadosEmpresa?.data?.data?.telefone)}.
				</Text>
			</VStack>
		</Center>
	);
}