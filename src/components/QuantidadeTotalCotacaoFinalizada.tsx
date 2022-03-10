import { Flex, Spacer, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { Button } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BiPrinter } from 'react-icons/bi';
import { KeyedMutator } from 'swr';
import { CotacaoContext } from '../context/CotacaoContext';
import { ModalDesconto } from '../pages/ModalDesconto';



type Props = {
	total: number,
	totalDesconto: number,
	totalFrete: number,
	mutate: KeyedMutator<any>
}
//app 
moment.locale();
export const QuantidadeTotalCotacaoFinalizada = (props: Props) => {

	const notifications = useNotifications();

	const { isOpen: isOpenDesconto, onOpen: onOpenDesconto, onClose: onCloseDesconto } = useDisclosure();

	const price = useContext(CotacaoContext);



	const [total, setTotal] = useState<number>(0);
	const [frete, setFrete] = useState<number>(0);
	const [totalDesconto, setTotalDesconto] = useState<number>(0);

	useEffect(() => {

		if (price.total !== undefined && price.totalFrete !== undefined && price.totalDesconto !== undefined) {
			setTotal(price.total);
			setFrete(price.totalFrete)
			setTotalDesconto(price.totalDesconto)
		}
	}, [price])

	const onGenerateReport = () => {
		notifications.showNotification({
			loading: true,
			title: 'Gerando relatório',
			message: 'Os dados estão sendo carregados! 🙂',
		})

	}


	return (
		<>

			<Flex>

				<VStack px={3} alignItems={"start"} >
					<Text color={"gray.500"}>Subtotal</Text>
					<Text mr={3} fontWeight={"semibold"}>{(total | 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
				</VStack>

				<VStack px={3} alignItems={"start"} >
					<Text color={"gray.500"}>Frete</Text>
					<Text fontWeight={"semibold"}>{(frete | 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
				</VStack>

				<VStack px={3} alignItems={"start"} >
					<Text color={"gray.500"}>Desconto</Text>
					<Text fontWeight={"semibold"}>{(totalDesconto | 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
				</VStack>
				<VStack px={5} alignItems={"start"}>
					<Text color={"gray.500"}>Total geral</Text>
					<Text fontWeight={"semibold"}>{(total + frete - totalDesconto).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
				</VStack>
				{
					// props.totalDesconto > 0 ?
					// 	<VStack px={5} alignItems={"start"}>
					// 		<Text color={"gray.500"}>Total geral</Text>
					// 		<Text fontWeight={"semibold"}>{(total + frete - totalDesconto).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
					// 	</VStack>
					// 	: <></>
				}
				<Spacer />
				<Button onClick={onGenerateReport} leftIcon={<BiPrinter />}>Emitir relatório</Button>
			</Flex>


			<ModalDesconto mutate={props.mutate} isOpen={isOpenDesconto} onClose={onCloseDesconto} onOpen={onOpenDesconto} total={props.total} totalDesconto={props.totalDesconto} totalFrete={props.totalFrete} />
		</>
	);
}
