import React, { useEffect, useState } from "react";
import { HStack, Modal, Text, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useStyleConfig } from "@chakra-ui/react";
import { Button, Space, Input, message } from "antd";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useSetRecoilState } from "recoil";
import { percentual } from "../context/atom";
import { useDesconto } from "../hooks/useDesconto";
import { DescontoGeral, UrlData } from "../lib/types";
import { KeyedMutator, mutate } from "swr";

type Props = {
	isOpen: boolean,
	onClose: () => void,
	onOpen: () => void,
	mutate: KeyedMutator<any>
}
export const ModalDesconto = (props: Props) => {

	const [url, setUrl] = useState<UrlData | null>(null);
	const { desconto } = useDesconto();

	const [isLoading, setIsLoading] = useState(false);

	const setDesconto = useSetRecoilState(percentual);
	//const { } = useDesconto()
	const [value, setValue] = useState("");

	async function salvarDesconto() {
		setDesconto(value);

		const data: DescontoGeral = {
			percentual: Number.parseInt(value),
			dados: {
				codigo: url?.numeroCotacao,
				codigoEmpresa: url?.numeroEmpresa,
				fornecedor: url?.codigoFornecedor,
				contratoEmpresa: url?.contratoEmpresa
			}
		}
		setIsLoading(true);
		const status = await desconto(data);

		if (status === 201) {
			message.success(`Desconto de ${value}% aplicado!`);
		} else if (status === 401) {
			message.warn('Ocorreu um erro ao aplicar o desconto!');
		}
		else {
			message.warn('Ocorreu um erro desconhecido!');
		}
		setIsLoading(false);
		props.mutate();
		props.onClose();
	}

	useEffect(() => {
		const url: UrlData = JSON.parse(localStorage.getItem('urlData') as string);
		setUrl(url)
	}, [])
	return (
		<>
			<Modal
				isOpen={props.isOpen}
				onClose={props.onClose}>

				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontWeight="normal">
						<HStack>
							<AiOutlineInfoCircle size="20px" color="#3182ce" />
							<Text>Desconto</Text>
						</HStack>
					</ModalHeader>
					<ModalCloseButton _focus={{ boxShadow: "none" }} />
					<ModalBody>
						No campo abaixo digite o quanto de desconto deseja aplicar no valor total (%).
						<Input name={value} onChange={(e) => { setValue(e.target.value) }} />
					</ModalBody>

					<ModalFooter>
						<Space>
							<Button onClick={() => { salvarDesconto() }} loading={false} >
								Salvar
							</Button>

							<Button type={"primary"} onClick={() => { props.onClose(); }} >Cancelar</Button>
						</Space>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}