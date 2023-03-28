import { Center, Image, Text, VStack } from "@chakra-ui/react";
import { Button, Result } from "antd";
import React, { useContext } from "react";
import Waring  from '../../assets/complain (2).png'
import { UrlContext } from "../../context/UrlContext";

type CotacaoProps = {
	data: string
}

export const CotacaoVencida = ({ data }: CotacaoProps) => {
	const dadosUrl = useContext(UrlContext);
	return (
		<Center display="flex" alignContent="center" alignItems="center" w="full">

			<VStack spacing={2}>
				<Image  src={Waring}/>
				<Text fontSize={"x-large"}>
				Validade expirada!
				</Text>
				<Text align={"center"} w={"80%"} color={"gray"} fontSize={"md"}>
				Não é possível preencher ou visualizar esta cotação
				pois a data limite de preenchimento definida pela empresa
				que solicitou a cotação era somente até {dadosUrl?.dataMoment?.format('l').toLowerCase()}.
				</Text>
			</VStack>
		</Center>
	);
}