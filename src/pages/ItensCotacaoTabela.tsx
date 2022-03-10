import { Alert, AlertIcon, FormControl, FormLabel, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { Button, Input, Space, Table, Tooltip, Typography } from "antd";
import { ColumnType } from "antd/lib/table";
import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useToReal } from "../hooks/useToReal";
import { CotacaoTDO } from "../lib/types";

const { Text } = Typography;

type Props = {
	onClose: () => void,
	isOpen: boolean,
	cotacao: CotacaoTDO | undefined,
	dataSource: any,
	frete: string,
	setFrete: React.Dispatch<React.SetStateAction<string>>,
	valorProduto: string,
	setValorProduto: React.Dispatch<React.SetStateAction<string>>,
	desconto: string,
	setDesconto: React.Dispatch<React.SetStateAction<string>>,
	st: string,
	setSt: React.Dispatch<React.SetStateAction<string>>,
	icms: string,
	setIcms: React.Dispatch<React.SetStateAction<string>>,
	mva: string,
	setMva: React.Dispatch<React.SetStateAction<string>>,
	ipi: string,
	setIpi: React.Dispatch<React.SetStateAction<string>>,
	verificarHistorico(): Promise<void>,
	isAllPreenchido: boolean,
	isLoading: boolean

}

export const IntensCotacaoTabela = (props: Props) => {

	const [alertCusto, setAlertCusto] = useState(false);


	function verificarHistorico() {
		const custo = Number.parseFloat(props.valorProduto);
		if (custo === 0 || custo < 0) {
			setAlertCusto(true)
		} else {
			setAlertCusto(false)
			props.verificarHistorico()
		}

	}

	const colunas: ColumnType<any>[] = [
		{
			title: 'Descrição',
			dataIndex: 'descricao',
			key: 'descricaomodal',
			width: "40px",
			shouldCellUpdate: () => false,
			ellipsis: {
				showTitle: false
			},
			render: (value: string, record: any) => {
				return <Tooltip zIndex={99999} title={value}>
					<Text style={{ fontSize: "12px" }}>{value}</Text>
				</Tooltip>
			},

		},
		{
			title: 'Item',
			width: "40px",
			dataIndex: 'item',
			key: 'itemmodal',
			align: 'center',
			render: (value: string, record: any) => {
				return <Tooltip zIndex={99999} title={value}>
					<Text style={{ fontSize: "12px" }}>{value}</Text>
				</Tooltip>
			},
		},
		{
			title: 'Código',
			width: "40px",
			dataIndex: 'codigo',
			key: 'codigomodal',
			align: 'center',
			render: (value: string, record: any) => {
				return <Tooltip zIndex={99999} title={value}>
					<Text style={{ fontSize: "12px" }}>{value}</Text>
				</Tooltip>
			},
		},
		{
			title: 'Código/barras',
			width: "40px",
			dataIndex: 'codigobarras',
			key: 'codigobarrasmodal',
			align: 'center',
			render: (value: string, record: any) => {
				return <Tooltip zIndex={99999} title={value}>
					<Text style={{ fontSize: "12px" }}>{value}</Text>
				</Tooltip>
			},
		},
		{
			title: 'Marca',
			width: "40px",
			dataIndex: 'marca',
			key: 'marcamodal',
			align: 'center',

		},
		{
			title: 'quantidade',
			width: "40px",
			dataIndex: 'quantidade',
			key: 'quantidademodal',
			align: 'center'

		},
	];

	const firstLetterUpperCase = (word: string) => {
		return word.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
			return a.toUpperCase();
		});
	}

	const { toReal } = useToReal();
	return (
		<>
			<Modal
				isOpen={props.isOpen}
				onClose={props.onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize={"18px"} fontWeight="medium">
						<Text style={{ fontWeight: 500, fontSize: 16 }}>{`Item: ${firstLetterUpperCase(props.cotacao?.descricao ? props.cotacao?.descricao : "")}`}</Text>

					</ModalHeader>
					<ModalCloseButton _focus={{ boxShadow: 'none' }} />
					<ModalBody pb={6}>

						<Table pagination={false} scroll={{ x: 1500 }} size={"small"} dataSource={props.dataSource} columns={colunas} />
						<HStack mt={5} mb={4}>
							<FormControl>
								<FormLabel fontSize={"14px"}>Frete</FormLabel>
								<Text style={{ fontSize: "10px", color: "gray" }}>{toReal(props.frete)}</Text>
								<CurrencyInput
									className="ant-input"
									id="input-example"
									name="input-name"
									placeholder="Please enter a number"
									defaultValue={Number(props.frete)}
									prefix="R$"
									decimalScale={2}
									onValueChange={(value: any, name: any, float: any) => {
										props.setFrete(float?.float ? (float.float).toString() : (0).toString())
									}}
								/>
							</FormControl>

							<FormControl>
								<FormLabel fontSize={"14px"}>Desconto</FormLabel>
								<Text style={{ fontSize: "10px", color: "gray" }}>{toReal(props.desconto)}</Text>
								<CurrencyInput
									className="ant-input"
									id="input-example"
									name="input-name"
									placeholder="Please enter a number"
									defaultValue={Number(props.desconto)}
									prefix="R$"
									decimalScale={2}
									onValueChange={(value: any, name: any, float: any) => {
										props.setDesconto(float?.float ? (float.float).toString() : (0).toString())
									}}
								/>
							</FormControl>

							<FormControl mt={4}>
								<FormLabel fontSize={"14px"}>Custo do produto</FormLabel>
								<Text style={{ fontSize: "10px", color: "gray" }}>{toReal(props.valorProduto)}</Text>
								<CurrencyInput
									className="ant-input"
									id="input-custo-produto"
									name="input-name"
									placeholder="Please enter a number"
									defaultValue={Number(props.valorProduto)}
									prefix="R$"
									decimalScale={2}
									onValueChange={(value: any, name: any, float: any) => {
										props.setValorProduto(float?.float ? (float.float).toString() : (0).toString())

										if (float?.float ? true : false) {
											const valor = Number.parseFloat(float.float);
											if (valor !== 0 || valor > 0) {
												setAlertCusto(false)
											}
										}
										console.log("valorProduto", props.valorProduto);
									}}
								/>

							</FormControl>
						</HStack>
						<HStack mb={4}>

							<FormControl >
								<FormLabel fontSize={"14px"}>% ST</FormLabel>
								<Text style={{ fontSize: "10px", color: "gray" }}>{`${props.st}%`}</Text>
								<Input name={props.st} value={props.st} onChange={(e) => { props.setSt(e.target.value) }} placeholder='ST' />
							</FormControl>
							<FormControl mt={4}>
								<FormLabel fontSize={"14px"}>ICMS</FormLabel>
								<Text style={{ fontSize: "10px", color: "gray" }}>{`${props.icms}%`}</Text>
								<Input name={props.icms} value={props.icms} onChange={(e) => { props.setIcms(e.target.value) }} placeholder='ICMS' />
							</FormControl>
							<FormControl mt={4}>
								<FormLabel fontSize={"14px"}>% MVA</FormLabel>
								<Text style={{ fontSize: "10px", color: "gray" }}>{`${props.mva}%`}</Text>
								<Input name={props.mva?.toString()} value={props.mva} onChange={(e) => { props.setMva(e.target.value) }} placeholder='MVA' />
							</FormControl>
							<FormControl mt={4}>
								<FormLabel fontSize={"14px"}>% IPI</FormLabel>
								<Text style={{ fontSize: "10px", color: "gray" }}>{`${props.ipi}%`}</Text>
								<Input name={props.ipi} onChange={(e) => { props.setIpi(e.target.value) }} value={props.ipi} placeholder='IPI' />
							</FormControl>
						</HStack>

						<HStack>
							{
								alertCusto ?
									<Alert status='warning' my={4}>
										<AlertIcon />
										O campo custo do produto precisa ser preenchido.
									</Alert>

									: <></>
							}
							{
								alertCusto ?
									document.getElementById("input-custo-produto")?.focus()
									: <></>
							}


						</HStack>

					</ModalBody>

					<ModalFooter>
						<Space>
							<Button disabled={props.isAllPreenchido} loading={props.isLoading} onClick={() => { verificarHistorico() }}>
								Modificar
							</Button>
							<Button type="primary" onClick={props.onClose}>Cancelar</Button>
						</Space>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}