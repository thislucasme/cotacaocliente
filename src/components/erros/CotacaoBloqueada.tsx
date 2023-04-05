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
				Pedimos desculpas, mas a cotação que você solicitou já está encerrada 
				ou foi bloqueada. Para mais informações entre em contato com a empresa 
				{dadosEmpresa?.data?.data?.razao} através do telefone {formatedTelefoneNumber(dadosEmpresa?.data?.data?.telefone)}.
				</Text>
			</VStack>
		</Center>
	);
}