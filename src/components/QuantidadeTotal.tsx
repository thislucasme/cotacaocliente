import { HStack, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { Button } from '@mantine/core';
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { CgEyeAlt } from 'react-icons/cg';
import { KeyedMutator } from 'swr';
import { CotacaoContext } from '../context/CotacaoContext';
import { ModalDesconto } from '../pages/ModalDesconto';
import { motion } from 'framer-motion'
import { Tooltip } from 'antd';
type Props = {
	total: number,
	totalDesconto: number,
	totalFrete: number,
	mutate: KeyedMutator<any>
}
//app 
moment.locale();
export const QuantidadeTotal = (props: Props) => {


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

	return (
		<>
			<HStack>

				<VStack px={3} alignItems={"start"} >
					<Text color={"gray.500"}>Subtotal</Text>
					<Text mr={3} fontWeight={"semibold"}>{(total | 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
				</VStack>

				<VStack px={3} alignItems={"start"} >
					<Text color={"gray.500"}>Frete</Text>
					<Text fontWeight={"semibold"}>{Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(frete)}</Text>
				</VStack>

				<VStack px={3} alignItems={"start"} >
					<Text color={"gray.500"}>Desconto</Text>
					<Text fontWeight={"semibold"}>{Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(totalDesconto)}</Text>
				</VStack>
				<VStack alignItems={"start"}>
					<Text color={"gray.500"}>Total geral</Text>
					<Text fontWeight={"semibold"}>{(total + frete - totalDesconto).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
				</VStack>
				<motion.div
					style={{ paddingLeft: 3, paddingRight: 3 }}
					whileHover={{ scale: 1.2, color: "red" }}
				>
					<Tooltip title={"Mais informações"}>
						<Button style={{ boxShadow: "none" }} variant='subtle' onClick={onOpenDesconto}>
							<CgEyeAlt color='gray' />
						</Button>
					</Tooltip>
				</motion.div>
				{
					// props.totalDesconto > 0 ?
					// 	<VStack alignItems={"start"}>
					// 		<Text color={"gray.500"}>Total geral</Text>
					// 		<Text fontWeight={"semibold"}>{(total + frete - totalDesconto).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
					// 	</VStack>
					// 	: <></>
				}



			</HStack>
			<ModalDesconto mutate={props.mutate} isOpen={isOpenDesconto} onClose={onCloseDesconto} onOpen={onOpenDesconto} total={props.total} totalDesconto={props.totalDesconto} totalFrete={props.totalFrete} />
		</>
	);
}
QuantidadeTotal.whyDidYouRender = true;