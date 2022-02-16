import {
	Center,
	Divider, Editable, EditableInput, EditablePreview, Flex, HStack, Spacer, Spinner, useDisclosure, VStack
} from "@chakra-ui/react";
import { Button, Layout, message, Result, Table, Tag, Tooltip, Typography } from "antd";
import 'antd/dist/antd.css';
import { ColumnType } from "antd/lib/table";
import { encode } from "base-64";
import jsPDF from "jspdf";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { BiEdit } from 'react-icons/bi';
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { InfoEmpresa } from "../components/InfoEmpresa";
import { QuantidadeTotal } from "../components/QuantidadeTotal";
import { urlDataState } from "../context/atom";
import { useCotacao } from "../hooks/useCotacao";

import { useHistorico } from '../hooks/useHistorico';
import { useItem } from '../hooks/useItens';
import { useSetStatusLocalmente } from "../hooks/useSetStatusLocalmente";
import { api } from "../lib/api";
import { CotacaoTDO, HistoricoProdutosParametro, HistoricoProdutosTDO, HistoricoProdutosTDOBoolean, ItemCotacaoTDO, UrlData } from "../lib/types";
import '../theme/styles.css';
import '../theme/tabela.css';
import { FinalizarCotacao } from './FinalizarCotacao';
import { HistoricoTributosModal } from './HistoricoTributosModal';
import { IntensCotacaoTabela } from "./ItensCotacaoTabela";

const { Content } = Layout;

const { Text } = Typography;

const toReal = (value: string) => {
	return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

//moeda formatada para numero
const unMaskReais = (value: string) => {
	return typeof (value) === 'number' ? value : (Number(value.replace(/\D/g, "")) / 100);
}

export function CotacoesAbertas() {

	const { codigoCotacao } = useParams();

	const [isVerificandoFlag, setIsVerificandoFlag] = useState(false);

	const success = () => {
		message.success('Item salvo com sucesso!');
	};
	const pdfGerado = () => {
		message.success('Relatório gerado com sucesso!');
	};
	const [quantidade] = useState('');
	const {
		abrirModal, onClose, isOpen, icms, setIcms, frete, setFrete,
		valorProduto, setValorProduto, st, setSt, mva, setMva, ipi, setIpi,
		cotacao
	} = useItem();



	const [isLoading, setLoading] = useState(false);
	const [isUpdateLoading, setUpdateLoading] = useState(false);
	const { cotacoes, total, totalFrete, totalDesconto, mutate, setFornecedorCode, setCotacaoCode, setEmpresaContratoCode, setEmpresaCode, isReady } = useCotacao();

	// const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isOpenSegundo, onOpen: onOpenSegundo, onClose: onCloseSegundo } = useDisclosure();




	const [quantidadeItensPreenchidos, setQuantidadeItensPreenchidos] = useState(0);

	const { verificarHistoricoTributos } = useHistorico();

	const [historico, setHistoricos] = useState<HistoricoProdutosTDO>();
	const [historicoBoolean, setHistoricoBoolean] = useState<HistoricoProdutosTDOBoolean>();
	const [isAllPreenchido, setAllPreenchido] = useState(false);



	const { isEnviado, statusLocalmente, setEnviado } = useSetStatusLocalmente();

	const [parametro, setParametro] = useState<any>();
	const [urlData, setUrlData] = useState<UrlData>();

	const setUrlDataState = useSetRecoilState(urlDataState);

	const dataUrl = useRecoilValue(urlDataState)

	const [gerandoPDF, setGerandoPDF] = useState(false);





	useEffect(() => {




		const data: any = codigoCotacao?.split(encode('-success'));
		setParametro(data);

		const urlData: UrlData = {
			contratoEmpresa: data[0],
			numeroEmpresa: data[1],
			numeroCotacao: data[2],
			cnpjFornecedor: data[3],
			codigoFornecedor: data[4]
		}

		setUrlDataState([urlData])

		setUrlData(urlData)

		//codigoCotacao: string, fornecedor: string, contratoEmpresa: string

		setIsVerificandoFlag(true);
		statusLocalmente(urlData?.numeroCotacao, urlData?.codigoFornecedor, urlData?.contratoEmpresa, dataUrl[0]?.numeroEmpresa);
		setIsVerificandoFlag(false);

		localStorage.removeItem('urlData');
		localStorage.setItem('urlData', JSON.stringify(urlData));
		localStorage.setItem('url', JSON.stringify(codigoCotacao));

		setFornecedorCode(data[4]);
		setCotacaoCode(data[2]);
		setEmpresaContratoCode(data[0])
		setEmpresaCode(data[1])

		//console.log(parametro ? decode(parametro[4]) : 3)

		// console.log(fornecedor, "demulidor")
		// setFornecedorCode(fornecedor)
		// setCotacaoCode('0000000001')

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [codigoCotacao])

	//aastat
	var generateData = function (amount: number) {

		const itens: Array<CotacaoTDO> = [
			...cotacoes.data
		]
		console.log(itens)
		console.log(cotacoes.data.length)
		var result = [];
		var data = {
			item: "dd",
			codigo_barras: "codigo_barras",
			codigo_interno: "codigo_interno",
			descricao: "descricao",
			marca: "marca",
			quantidade: "quantidade",
			custo: "custo",
			frete: "frete",
			st: "st",
			icms: "icms",
			forma_pagamento: "forma_pagamento",
			ipi: "ipi",
			mva: "mva"
		};
		for (var i = 0; i < cotacoes.data.length; i += 1) {
			data.item = itens[i].item ? itens[i].item : "**";
			data.quantidade = itens[i].quantidade ? itens[i].quantidade.toString() : "0";
			data.codigo_barras = itens[i].codbarras ? itens[i].codbarras : "0";
			data.codigo_interno = itens[i].codigo ? itens[i].codigo : "0";
			data.descricao = itens[i].descricao ? itens[i].descricao : "**";
			data.marca = itens[i].marca ? itens[i].marca : "**";
			data.custo = itens[i].valordoproduto ? itens[i].valordoproduto.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : "**";
			data.frete = itens[i].frete ? itens[i].frete.toString() : "**";
			data.st = itens[i].st ? itens[i].st.toString() : "**";
			data.icms = itens[i].icms ? itens[i].icms.toString() : "**";
			data.forma_pagamento = itens[i].formaPagamento ? itens[i].formaPagamento.toString() : "**";
			data.ipi = itens[i].ipi ? itens[i].ipi.toString() : "**";
			data.mva = itens[i].mva ? itens[i].mva.toString() : "**";
			result.push(Object.assign({}, data));
		}
		return result;
	};



	function createHeaders(keys: any) {
		var result = [];
		for (var i = 0; i < keys.length; i += 1) {
			result.push({
				id: keys[i],
				name: keys[i],
				prompt: keys[i],
				width: 65,
				align: "center",
				padding: 10
			});
		}
		return result;
	}

	var headers: any = createHeaders([
		"item",
		"codigo_barras",
		"codigo_interno",
		"descricao",
		"marca",
		"quantidade",
		"custo",
		"frete",
		"st",
		"icms",
		"forma_pagamento",
		"ipi",
		"mva"
	]);


	function gerarRelatorio() {

		setGerandoPDF(true)
		var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });

		doc.addImage('https://i.ibb.co/Qk15TwS/logonomesuc-f5f52e7a-f5f52e7a.png', "PNG", 15, 10, 50, 15)
		// doc.setFont("times", "normal");
		// doc.text("Success Sistemas", 70, 25)


		doc.table(3, 30, generateData(20), headers, { autoSize: true, fontSize: 8 })
		doc.save('relatório' + dataUrl[0]?.numeroCotacao)
		setGerandoPDF(false)
		pdfGerado();

		// doc.html(element ? element : '', {
		// 	callback: function (doc) {
		// 		doc.save("a4.pdf");
		// 	},
		// 	x: 10,
		// 	y: 10
		// })

	}


	const dataSource = [
		{
			descricao: cotacao?.descricao,
			item: cotacao?.item,
			codigo: cotacao?.produto,
			marca: cotacao?.marca,
			quantidade: cotacao?.quantidade,
			codigobarras: cotacao?.codbarras ? cotacao?.codbarras : 'xxx-xxxx'
		},

	];

	async function compararItens(data: HistoricoProdutosTDO) {
		const isIpi: boolean = data.ipi === Number(ipi);
		const isSt: boolean = data.st !== null ? data.st === Number(st) : true;
		const isIcms: boolean = data.icms === Number(icms);
		const isMva: boolean = data.mva === Number(mva);
		const historicoBoolean: HistoricoProdutosTDOBoolean = {
			icms: isIcms,
			st: isSt,
			ipi: isIpi,
			mva: isMva
		}
		setHistoricoBoolean(historicoBoolean);

		const historico: HistoricoProdutosTDO = {
			icms: data.icms,
			st: data.st,
			ipi: data.ipi,
			mva: data.mva,
			fornecedor: data.fornecedor,
			produto6: data.produto6
		}
		//const array: Array<HistoricoProdutosTDO> = [...historicos, historico]
		setHistoricos(historico);

		if (historicoBoolean.icms && historicoBoolean.ipi && historicoBoolean.mva && historicoBoolean.st) {
			salvarItensLocalmente();
		} else {
			onClose();
			onOpenSegundo();
		}

	}
	async function verificarHistorico() {
		setLoading(true)
		// const item: HistoricoProdutosParametro = {
		// 	contratoEmpresa: "1EDFFA7D75A6",
		// 	numeroEmpresa: "01",
		// 	fornecedor: "A6CFFA7D7D9E79B6",
		// 	produto6: "VEFR069"
		// }

		const item: HistoricoProdutosParametro = {
			contratoEmpresa: urlData?.contratoEmpresa || "",
			numeroEmpresa: urlData?.numeroEmpresa || "",
			fornecedor: urlData?.codigoFornecedor || "",
			produto6: cotacao?.produto || ""
		}
		const result = await verificarHistoricoTributos(item);
		setLoading(false)
		result.data ?
			compararItens(result.data[0])
			: salvarItensLocalmente();


	}
	async function salvarItensLocalmente() {
		mutate()
		setLoading(true);
		const item: ItemCotacaoTDO = {
			quantidade: Number(quantidade),
			codigoInterno: cotacao?.produto,
			fornecedor: "AG000002",
			codigo: cotacao?.codigo,
			item: cotacao?.item,
			descricao: cotacao?.descricao,
			marca: cotacao?.marca,
			valorProduto: unMaskReais(valorProduto),
			frete: Number(frete),
			st: Number(st),
			icms: Number(icms),
			formaPagamento: "",
			ipi: Number(ipi),
			mva: Number(mva),
			status: true,
			codbarras: cotacao?.codbarras,
			data: moment(Date()).format('YYYYMMDDHHmm'),
			contratoEmpresa: ""
		};

		localStorage.setItem(`@App:${item.item}`, JSON.stringify(item));
		setLoading(false);
		salvarItem();
	}
	async function salvarItem() {


		setUpdateLoading(true);
		const item: ItemCotacaoTDO = {
			quantidade: Number(quantidade),
			codigoInterno: cotacao?.produto,
			fornecedor: urlData?.codigoFornecedor,
			codigo: cotacao?.codigo,
			item: cotacao?.item,
			descricao: cotacao?.descricao,
			marca: cotacao?.marca,
			valorProduto: Number(valorProduto),
			frete: Number(frete),
			st: Number(st),
			icms: Number(icms),
			formaPagamento: "",
			ipi: Number(ipi),
			mva: Number(mva),
			status: false,
			codbarras: cotacao?.codbarras,
			data: moment(Date()).format('YYYYMMDDHHmm'),
			contratoEmpresa: urlData?.contratoEmpresa || ""
		};

		try {
			const res = await api.post('price/update', item);
			// const payload: CotacaoTDOPayload = {
			// 	codigo: urlData?.numeroCotacao || "",
			// 	fornecedor: urlData?.codigoFornecedor || "",
			// 	flag: ".S",
			// 	codigoEmpresa: ""
			// }
			// await apiPostVerificarFlagFornecedor(payload);


			// dados.forEach((item: any) => {
			// 	if (item.valordoproduto === 0) {
			// 		console.log("==========verificação=========")
			// 		console.log(false)
			// 		return false;
			// 	} else {
			// 		console.log("==========verificação=========")
			// 		console.log(true)
			// 		return true;
			// 	}
			// });

			setLoading(false);
			onClose();
			mutate();
			success();
			setUpdateLoading(false)
			onCloseSegundo()
			//		statusLocalmente(urlData?.numeroCotacao, urlData?.codigoFornecedor, urlData?.contratoEmpresa);
			statusLocalmente(dataUrl[0].numeroCotacao, dataUrl[0].codigoFornecedor, dataUrl[0].contratoEmpresa, dataUrl[0]?.numeroEmpresa);
			return res;
		} catch (e: any) {
			setUpdateLoading(false)
			onCloseSegundo()
		}

	}
	const columns: ColumnType<any>[] = useMemo(
		() => [
			{
				title: 'Ações',
				dataIndex: 'acoes',
				key: 'acoes',
				shouldCellUpdate: () => true,
				align: "center",
				width: "40px",
				render: (value: string, record: any) => {
					return (
						<Tooltip title={"Editar"}>
							<Button color={"red"} size="small" onClick={() => abrirModal(record, value)}><BiEdit color="gray" /></Button>
						</Tooltip>
					)
				},
			},
			{
				title: 'status',
				dataIndex: 'status',
				key: 'status',
				align: "center",
				shouldCellUpdate: () => true,
				width: '100px',
				render: (value: boolean, record: CotacaoTDO) => {

					if (record.valordoproduto > 0) {
						setQuantidadeItensPreenchidos(quantidadeItensPreenchidos + 1);
						return <>
							<Tag style={{ fontSize: "12px" }} color="#87D068">
								MODIFICADO
							</Tag>
						</>
					} else {
						return <>
							<Tag style={{ fontSize: "12px", width: "90px" }} color="#808080">
								PENDENTE
							</Tag>
						</>
					}
				},
			},

			{
				title: 'Item',
				dataIndex: 'item',
				key: 'item',
				width: '50px',
				align: "center",
				ellipsis: {
					showTitle: false
				},
				shouldCellUpdate: () => false,
				render: (value: string, record: any) => {
					return (
						<Tooltip title={value}>
							<Text style={{ fontSize: "12px" }}>{value}</Text>
						</Tooltip>
					)
				},
			},
			{
				title: 'Código/barras',
				dataIndex: 'codbarras',
				key: 'codbarras',
				width: '100px',
				align: "center",
				ellipsis: {
					showTitle: false
				},
				shouldCellUpdate: () => false,
				render: (value: string, record: any) => {
					return (
						<Tooltip title={value ? value : "Campo vazio"}>
							<Text style={{ fontSize: "12px" }}>{value ? value : "XXX-XXX"}</Text>
						</Tooltip>
					)
				},
			},
			{
				title: 'Código interno',
				dataIndex: 'produto',
				key: 'produto',
				width: "70px",
				ellipsis: {
					showTitle: false
				},
				shouldCellUpdate: () => false,
				render: (value: string, record: any) => {
					return (
						<Tooltip title={value}>
							<Text style={{ fontSize: "12px" }}>{value}</Text>
						</Tooltip>
					)
				},
			},
			{
				title: 'Descrição',
				dataIndex: 'descricao',
				key: 'descricao',
				width: '140px',
				shouldCellUpdate: () => false,
				ellipsis: {
					showTitle: false
				},
				render: (value: string, record: any) => {
					return <Tooltip title={value}>
						<Text style={{ fontSize: "12px" }}>{value}</Text>
					</Tooltip>
				},

			},
			{
				title: 'marca',
				dataIndex: 'marca',
				key: 'marca',
				width: '60px',
				shouldCellUpdate: () => false,
				ellipsis: {
					showTitle: false
				},
				render: (value: string, record: any) => {
					return <Tooltip style={{ fontSize: "12px" }} title={value}>
						{value}
					</Tooltip>
				},
			},
			{
				title: 'quantidade',
				dataIndex: 'quantidade',
				key: 'quantidade',
				align: 'center',
				width: '80px',
				ellipsis: {
					showTitle: false
				},
				shouldCellUpdate: () => true,
				render: (value: string, record: any) => {
					return <Tooltip title={value}>
						<Editable fontSize={"12px"}>
							<EditablePreview />
							{value}
							<EditableInput />
						</Editable>
					</Tooltip>
				},
			},
			{
				title: 'Custo',
				dataIndex: 'valordoproduto',
				key: 'valordoproduto',
				align: 'right',
				ellipsis: {
					showTitle: false
				},
				shouldCellUpdate: () => true,
				width: '100px',
				render: (value: string, record: any) => {
					return <Editable fontSize={"12px"} >
						{Number(value).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
						<EditablePreview />
						<EditableInput />
					</Editable>;
				},
			},
			{
				title: 'Frete',
				dataIndex: 'frete',
				key: 'frete',
				width: '100px',
				ellipsis: {
					showTitle: false
				},
				align: 'right',
				shouldCellUpdate: () => true,
				render: (value: string, record: any) => {
					return <Editable fontSize={"12px"}>
						<EditablePreview />
						{toReal(value)}
						<EditableInput />
					</Editable>
				},
			},
			{
				title: '% ST',
				dataIndex: 'st',
				key: 'st',
				align: 'center',
				width: '40px',
				shouldCellUpdate: () => true,
				render: (value: string, record: any) => {
					return <Editable fontSize={"12px"}>
						{value}
						<EditablePreview />
						<EditableInput />
					</Editable>;
				},
			},
			{
				title: 'ICMS',
				dataIndex: 'icms',
				key: 'icms',
				align: 'center',
				width: '8%',
				shouldCellUpdate: () => true,
				render: (value: string, record: any) => {
					return <Editable fontSize={"12px"} >
						{value}
						<EditablePreview />
						<EditableInput />
					</Editable>;
				},
			},
			{
				title: 'Forma de pagamento',
				dataIndex: 'formapagamento',
				align: 'center',
				key: 'formapagamento',
				shouldCellUpdate: () => true,
				width: '150px',
				render: (value: string, record: any) => {
					return <Editable fontSize={"12px"} defaultValue='BOLETO BANCARIO'>
						<EditablePreview />
						<EditableInput />
					</Editable>;
				},
			},
			{
				title: '% IPI',
				dataIndex: 'ipi',
				align: 'center',
				key: 'ipi',
				shouldCellUpdate: () => true,
				width: '8%',
				render: (value: string, record: any) => {
					return <Editable fontSize={"12px"}>
						{value}
						<EditablePreview />
						<EditableInput />
					</Editable>;
				},
			},
			{
				title: '% MVA',
				dataIndex: 'mva',
				align: 'center',
				key: 'mva',
				shouldCellUpdate: () => true,
				width: '8%',
				render: (value: string, record: any) => {
					return <Editable fontSize={"12px"}>
						{value}
						<EditablePreview />
						<EditableInput />
					</Editable>;
				},
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
		], []
	)


	return (
		<>
			{isVerificandoFlag ?
				<Center w="full" h="100vh">
					<VStack>
						<Spinner color='blue' />
						<Text>Carregando...</Text>
					</VStack>
				</Center>
				:
				<>
					<HistoricoTributosModal isLoading={isUpdateLoading} historicoBoolean={historicoBoolean} salvarItem={salvarItensLocalmente} historicos={historico} isOpen={isOpenSegundo} onClose={onCloseSegundo} onOpen={onOpenSegundo} />
					<Content
						className="site-layout-background"
						style={{
							margin: '3px 2px',
							padding: 3,
							minHeight: 280,
						}}>
						<Flex mb={3}>
							<VStack mb={3}>
								<HStack w="full">
									<InfoEmpresa />
								</HStack>
							</VStack>
							<Spacer />

						</Flex>

						<Divider />
						{!isEnviado ?
							<>
								<Table
									rowKey={"item"}
									rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
									className="tabela"
									size={'small'}
									loading={cotacoes?.data ? false : true}
									dataSource={cotacoes?.data}
									columns={columns}
									pagination={{ pageSize: 10 }}
									scroll={{ y: "200px", x: 1500 }}
								/>
								<QuantidadeTotal totalFrete={totalFrete.data === undefined ? 0 : totalFrete?.data[0]?.totalFrete} mutate={mutate} totalDesconto={totalDesconto.data === undefined ? 0 : totalDesconto?.data[0]?.totalDesconto} total={total.data === undefined ? 0 : total?.data[0]?.total} />
								{/* {console.log("RIGATTI", isReady?.data ? isReady?.data[0].isReady : false)} */}
								<FinalizarCotacao readyToSend={isReady?.data ? isReady?.data[0].isReady : false} mutate={mutate} parametro={parametro} setEnviado={setEnviado} loading={!isEnviado} setAllPreenchido={setAllPreenchido} />
							</> : <Result
								status="success"
								title="Dados enviados com sucesso!"
								subTitle="Após a confirmação do envio, não é possível editar, apenas vizualizar e emitir relatórios."
								extra={[
									<Button loading={gerandoPDF} onClick={() => { setAllPreenchido(false); gerarRelatorio() }} type="primary" key="console">
										Emitir relatório
									</Button>,
									<Button key="buy">Detalhes</Button>,
								]}
							/>
						}
					</Content>
					<IntensCotacaoTabela onClose={onClose} isOpen={isOpen} cotacao={cotacao}
						dataSource={dataSource} frete={frete} setFrete={setFrete} valorProduto={valorProduto}
						setValorProduto={setValorProduto} st={st} setSt={setSt} icms={icms} setIcms={setIcms}
						mva={mva} setMva={setMva} ipi={ipi} setIpi={setIpi} verificarHistorico={verificarHistorico} isAllPreenchido={isAllPreenchido}
						isLoading={isLoading} />

				</>}
		</>
	);
}


