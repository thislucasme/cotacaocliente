import { HStack, Modal, Select, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { Button, Input, message, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { KeyedMutator } from "swr";
import { percentual } from "../context/atom";
import { useDesconto } from "../hooks/useDesconto";
import { DescontoGeral, UrlData } from "../lib/types";

type Props = {
	isOpen: boolean,
	onClose: () => void,
	onOpen: () => void,
	mutate: KeyedMutator<any>
}

export const ModalDesconto = (props: Props) => {

	const [url, setUrl] = useState<UrlData | null>(null);
	const { desconto } = useDesconto();

	const [, setIsLoading] = useState(false);

	const setDesconto = useSetRecoilState(percentual);

	const [tipoValor, setTipoValor] = useState('');
	//const { } = useDesconto()
	const [value, setValue] = useState("");
	const [frete, setFrete] = useState("");

	async function salvarDesconto() {
		setDesconto(value);

		const data: DescontoGeral = {
			percentual: Number.parseInt(value),
			dados: {
				codigo: url?.numeroCotacao,
				codigoEmpresa: url?.numeroEmpresa,
				fornecedor: url?.codigoFornecedor,
				contratoEmpresa: url?.contratoEmpresa
			},
			frete: Number.parseInt(frete),
			tipo: tipoValor
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
							<Text>Editar</Text>
						</HStack>
					</ModalHeader>
					<ModalCloseButton _focus={{ boxShadow: "none" }} />
					<ModalBody>
						<Text mb={3}>
							Desconto
						</Text>
						<HStack>
							<Select onChange={(event: any) => { setTipoValor(event.target.value) }} size="sm">
								<option value='V'>R$</option>
								<option value='P'>%</option>
							</Select>
							<Input name={value} onChange={(e) => { setValue(e.target.value) }} />
						</HStack>
						<Text mb={3}>
							Frete
						</Text>
						<Input name={frete} onChange={(e) => { setFrete(e.target.value) }} />
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