import { Button, HStack, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { Tooltip } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { AiFillEdit } from 'react-icons/ai';
import { KeyedMutator } from 'swr';
import { ModalDesconto } from '../pages/ModalDesconto';

type Props = {
	total: number,
	totalDesconto: number,
	totalFrete: number,
	mutate: KeyedMutator<any>
}
//app 
moment.locale();
export const QuantidadeTotal = (props: Props) => {

	const { isOpen: isOpenDesconto, onOpen: onOpenDesconto, onClose: onCloseDesconto } = useDisclosure()

	useEffect(() => {
	}, [])

	return (
		<>
			<HStack>
				<Tooltip title={"Editar informações: Frete e desconto."}>
					<Button onClick={onOpenDesconto} rightIcon={<AiFillEdit />}>
						Editar
					</Button>
				</Tooltip>
				<VStack alignItems={"start"} >
					<Text color={"gray.500"}>Frete</Text>
					<Text fontWeight={"semibold"}>{(props.totalFrete).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
				</VStack>
				<VStack alignItems={"start"} >
					<Text color={"gray.500"}>Subtotal</Text>
					<Text mr={5} fontWeight={"semibold"}>{(props.total).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
				</VStack>
				<VStack alignItems={"start"} >
					<Text color={"gray.500"}>Desconto</Text>
					<Text fontWeight={"semibold"}>{(props.totalDesconto).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
				</VStack>
				{
					props.totalDesconto > 0 ?
						<VStack alignItems={"start"}>
							<Text color={"gray.500"}>Total geral</Text>
							<Text fontWeight={"semibold"}>{(props.total + props.totalFrete - props.totalDesconto).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
						</VStack>
						: <></>
				}



			</HStack>
			<ModalDesconto mutate={props.mutate} isOpen={isOpenDesconto} onClose={onCloseDesconto} onOpen={onOpenDesconto} />
		</>
	);
}
QuantidadeTotal.whyDidYouRender = true;