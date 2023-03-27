import { Center, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";
import Locked from '../../assets/padlock.png';

export const CotacaoBloqueada = () => {
	return (
		<Center display="flex" alignContent="center" alignItems="center" w="full">

			<VStack spacing={2}>
				<Image  src={Locked}/>
				<Text fontSize={"x-large"}>
				Acesso à cotação bloqueado.
				</Text>
				<Text align={"center"} w={"80%"} color={"gray"} fontSize={"md"}>
				Desculpe-nos, mas a cotação solicitada está bloqueada
				ou encerrada.
				Por favor, entre em contato com a empresa solicitante para mais informações. Obrigado.
				</Text>
			</VStack>
		</Center>
	);
}