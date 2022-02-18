import { Alert, AlertIcon, FormControl, FormLabel, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text } from "@chakra-ui/react";
import { Button, message, Space } from "antd";
import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useSetRecoilState } from "recoil";
import { KeyedMutator } from "swr";
import { percentual } from "../context/atom";
import { FormaPagamento, TipoDesconto } from "../enuns/enuns";
import { useDesconto } from "../hooks/useDesconto";
import { DescontoGeral, UrlData } from "../lib/types";

type Props = {
	isOpen: boolean,
	onClose: () => void,
	onOpen: () => void,
	mutate: KeyedMutator<any>,
	total: number,
	totalDesconto: number,
	totalFrete: number,
}

export const ModalDesconto = (props: Props) => {

	const [url, setUrl] = useState<UrlData | null>(null);
	const { desconto } = useDesconto();

	const [, setIsLoading] = useState(false);

	const setDesconto = useSetRecoilState(percentual);

	const [tipoValor, setTipoValor] = useState<number>(TipoDesconto.VALOR);
	const [formaPagamento, setFormaPagamento] = useState(FormaPagamento.BOLETO_BANCARIO);
	//const { } = useDesconto()
	const [value, setValue] = useState<number>(props.totalDesconto);
	const [frete, setFrete] = useState<number>(props.totalFrete);

	async function salvarDesconto() {
		setDesconto(value);

		const data: DescontoGeral = {
			percentual: Number.parseFloat(value.toString()),
			dados: {
				codigo: url?.numeroCotacao,
				codigoEmpresa: url?.numeroEmpresa,
				fornecedor: url?.codigoFornecedor,
				contratoEmpresa: url?.contratoEmpresa
			},
			frete: Number.parseFloat(frete.toString()),
			tipo: tipoValor,
			formaPagamento: formaPagamento
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
						<HStack>
							<FormControl mt={0}>
								<FormLabel fontSize={"14px"}>Tipo desconto</FormLabel>
								<Select _focus={{ boxShadow: "none" }} onChange={(event: any) => { setTipoValor(Number.parseInt(event.target.value)) }} size="sm">
									<option value={TipoDesconto.VALOR}>R$</option>
									<option value={TipoDesconto.PERCENTUAL}>%</option>
								</Select>
							</FormControl>
							<FormControl mt={4}>
								<FormLabel fontSize={"14px"}>Desconto</FormLabel>
								<CurrencyInput
									className="ant-input"
									id="input-custo-produtosddsds"
									name="input-name"
									placeholder="Please enter a number"
									defaultValue={Number(value)}
									prefix="R$"
									decimalScale={2}
									onValueChange={(value: any, name: any, float: any) => {
										setValue(float?.float ? (float.float).toString() : (0).toString())
									}}
								/>
							</FormControl>
						</HStack>
						<FormControl mt={4}>
							<FormLabel fontSize={"14px"}>Pagamento</FormLabel>
							<Select _focus={{ boxShadow: "none" }} onChange={(event: any) => { setFormaPagamento(Number.parseInt(event.target.value)) }} size="sm">
								<option value={FormaPagamento.BOLETO_BANCARIO}>Boleto Bancário</option>
								<option value={FormaPagamento.DINHEIRO}>Dinheiro</option>
								<option value={FormaPagamento.CHEQUE}>Cheque</option>
								<option value={FormaPagamento.OUTROS}>Outros</option>
							</Select>
						</FormControl>

						<FormControl mt={4}>
							<FormLabel fontSize={"14px"}>Frete</FormLabel>
							{/* <Text style={{ fontSize: "10px", color: "gray" }}>{toReal(props.valorProduto)}</Text> */}
							<CurrencyInput
								className="ant-input"
								id="input-custo-produto"
								name="input-name"
								placeholder="Please enter a number"
								defaultValue={Number(frete)}
								prefix="R$"
								decimalScale={2}
								onValueChange={(value: any, name: any, float: any) => {
									setFrete(float?.float ? (float.float).toString() : (0).toString())
								}}
							/>

						</FormControl>

						<Alert status='warning' my={4}>
							<AlertIcon />
							É necessário preencher todos os campos.
						</Alert>
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