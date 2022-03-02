import { Alert, AlertIcon, FormControl, FormLabel, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text } from "@chakra-ui/react";
import { Button, Input, message, Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { KeyedMutator } from "swr";
import { CotacaoContext } from "../context/CotacaoContext";
import { UrlContext } from "../context/UrlContext";
import { FormaPagamento, TipoDesconto } from "../enuns/enuns";
import { useDesconto } from "../hooks/useDesconto";
import { useToReal } from "../hooks/useToReal";
import { DescontoGeral } from "../lib/types";

//lucas

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

	const dadosUrl = useContext(UrlContext);
	const { toReal } = useToReal();


	const [, setIsLoading] = useState(false);

	const off = useDesconto();


	const [tipoValor, setTipoValor] = useState<number>(TipoDesconto.VALOR);
	const [descontoEmPercentual, setDescontoEmPercentual] = useState<string>("0");
	const [formaPagamento, setFormaPagamento] = useState(FormaPagamento.BOLETO_BANCARIO);
	//const { } = useDesconto()
	const [desconto, setDesconto] = useState<number>(0);
	const [frete, setFrete] = useState<number>(0);
	const [total, setTotal] = useState<number>(0);

	const price = useContext(CotacaoContext);


	useEffect(() => {
		if (price.total !== undefined && price.totalFrete !== undefined && price.totalDesconto !== undefined) {
			setFrete(price.totalFrete)
			setDesconto(price.totalDesconto)
			setFormaPagamento(price.formaPagamento)
			setTotal(price.total)
		}
	}, [price])

	async function salvarDesconto() {
		//setDesconto(desconto);
		const data: DescontoGeral = {
			percentual: prepararDesconto(),
			dados: {
				codigo: dadosUrl?.numeroCotacao,
				codigoEmpresa: dadosUrl?.numeroEmpresa,
				fornecedor: dadosUrl?.codigoFornecedor,
				contratoEmpresa: dadosUrl?.contratoEmpresa
			},
			frete: Number.parseFloat(frete.toString()),
			tipo: tipoValor,
			formaPagamento: formaPagamento
		}
		setIsLoading(true);
		const status = await off.desconto(data);

		if (status === 201) {
			message.success(`Desconto de ${tipoValor === TipoDesconto.VALOR ? toReal(desconto.toString()) : descontoEmPercentual + "%"} aplicado.`);
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

	function prepararDesconto() {
		if (tipoValor === TipoDesconto.VALOR) {
			const valorDesconto = Number.parseFloat(desconto.toString());
			return valorDesconto;
		} else {
			const valorTotalItens = total;
			const percentual = Number.parseFloat(descontoEmPercentual) / 100;
			const valorFinal = percentual * valorTotalItens;
			console.log(valorFinal, total)
			return valorFinal;
		}
	}


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
								<Select defaultValue={tipoValor} _focus={{ boxShadow: "none" }} onChange={(event: any) => { setTipoValor(Number.parseInt(event.target.value)) }} size="sm">
									<option value={TipoDesconto.VALOR}>R$</option>
									<option value={TipoDesconto.PERCENTUAL}>%</option>
								</Select>
							</FormControl>
							{
								tipoValor === TipoDesconto.VALOR
									?
									<FormControl mt={4}>
										<FormLabel fontSize={"14px"}>Desconto</FormLabel>
										<CurrencyInput
											className="ant-input"
											id="input-custo-produtosddsds"
											name="input-name"
											placeholder="Please enter a number"
											defaultValue={desconto}
											prefix="R$"
											decimalScale={2}
											onValueChange={(value: any, name: any, float: any) => {
												setDesconto(float?.float ? (float.float).toString() : (0).toString())
												float?.float === 0 ? setDesconto(props.totalDesconto) : setDesconto(float?.float ? (float.float).toString() : (0).toString())

											}}
										/>



									</FormControl>
									:
									<FormControl>
										<FormLabel fontSize={"14px"}>ex: 0,34</FormLabel>
										<Input type={"number"} value={descontoEmPercentual} step="0.01" onChange={(e) => { setDescontoEmPercentual(e.target.value); console.log(descontoEmPercentual) }} />
									</FormControl>
							}


						</HStack>
						<FormControl mt={4}>
							<FormLabel fontSize={"14px"}>Pagamento</FormLabel>
							<Select defaultValue={formaPagamento} _focus={{ boxShadow: "none" }} onChange={(event: any) => { setFormaPagamento(Number.parseInt(event.target.value)) }} size="sm">
								<option value={FormaPagamento.BOLETO_BANCARIO}>Boleto Bancário</option>
								<option value={FormaPagamento.DINHEIRO}>Dinheiro</option>
								<option value={FormaPagamento.CHEQUE}>Cheque</option>
								<option value={FormaPagamento.OUTROS}>Outros</option>
								<option value={FormaPagamento.NENHUM}>Nenhum</option>
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