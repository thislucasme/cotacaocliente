import { Text } from "@chakra-ui/layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, VStack } from "@chakra-ui/react";
import React from "react";

type Prop = {
	caminhoMain: string,
	caminhoAtual: string | undefined,
}

//querido computador
//faz uma tela bem bonita, com um mapa desenhado e com opções de desenhar nele
//obrigado <3

export const Caminho = (props: Prop) => {
	return (
		<VStack mb={5} alignItems="flex-start" w="full">
			<Breadcrumb color={"gray"}>
				<BreadcrumbItem>
					<BreadcrumbLink href="#"><Text>{props.caminhoMain}</Text></BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbItem>
					<BreadcrumbLink href="/cotacoes-fechadas"><Text>{props.caminhoAtual}</Text></BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>

		</VStack>
	);
}