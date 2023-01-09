/* eslint-disable react-hooks/exhaustive-deps */
import { Text as TextChakra } from "@chakra-ui/react";
import {
	Editable,
	EditableInput,
	EditablePreview,
	HStack, Modal,
	ModalBody,
	Badge,
	ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure, useMediaQuery, VStack
} from "@chakra-ui/react";
import { Button, Modal as ModalMantine } from '@mantine/core';
import { message, Space, Tooltip, Typography } from "antd";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { KeyedMutator } from "swr";
import { UrlContext } from "../context/UrlContext";
import { Flag } from "../enuns/enuns";
import { useFlagFornecedor } from '../hooks/useFlagFornecedor';
import { criarObservacaoCotacao, getObservacaoCotacao } from "../lib/api";
import { CotacaoTDO, CotacaoTDOPayload, ObservacaoGeralTDO } from "../lib/types";
import { ModalDesconto } from '../pages/ModalDesconto';
import { styles } from "../style/style";
import Table, { ColumnType } from "antd/lib/table";
import { Button as ButtonAnt, Layout } from "antd";


const { Text } = Typography;
type Props = {
	setAllPreenchido: React.Dispatch<React.SetStateAction<boolean>>,
	loading: boolean,
	setEnviado: React.Dispatch<React.SetStateAction<boolean>>,
	mutate: KeyedMutator<any>,
	readyToSend: boolean,
	cotacoes: any

}

const firstLetterUpperCase = (word: string) => {
	return word?.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
		return a?.toUpperCase();
	});
}
export const FinalizarCotacao = (props: Props) => {

	const [isLargerThan600] = useMediaQuery('(min-width: 600px)');

	const [listaItensNaoPreenchidos, setListaItensNaoPreenchidos] = useState<any[]>([]);

	console.log(props?.cotacoes?.data)

	//const { dados } = useCotacaoFlag(payload);
	const [observacao, setObservacao] = useState('');

	const [opened, setOpened] = useState(false);

	const [isConfirmarLoading, setConfirmarLoading] = useState(false);

	const [existItemNaoPreenchido, setExistItemNaoPreenchido] = useState(false);
	const success = () => {
		message.success('Dados enviados com sucesso!');

	};
	// const showMensagemSuccess = (text:String) => {
	// 	message.success(text);

	// };
	const error = () => {
		message.error('Fornecedor não foi encontrado na base de dados', 1);
	};
	const showError = (txt: String) => {
		message.error(txt, 1);
	};
	const msgErro = (text: string, duration: number) => {
		message.error(text, duration);

	};

	const { isOpen, onOpen, onClose } = useDisclosure()

	const [isLoading, setIsLoading] = useState(false);

	const { apiPostFlagFornecedor, apiPostOfferInfo } = useFlagFornecedor();



	const dadosUrl = useContext(UrlContext);



	const { isOpen: isOpenDesconto, onOpen: onOpenDesconto, onClose: onCloseDesconto } = useDisclosure()

	const toReal = (value: string) => {
		return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
	}
	const columns: ColumnType<any>[] = useMemo(
		() => [
			{
				title: 'Status',
				dataIndex: 'status',
				key: 'status',
				align: "center",
				shouldCellUpdate: () => true,
				width: '100px',
				render: (value: boolean, record: CotacaoTDO) => {

					if (record?.valordoproduto > 0) {
						return <>
							<Badge style={styles.Badge} variant="dot" color={"green"}>Preenchido</Badge>
						</>
					} else {
						return <>
							<Badge style={styles.Badge} variant="dot" color={"orange"}>Pendente</Badge>
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
							<Text style={styles.Font14}>{value}</Text>
						</Tooltip>
					)
				},
			},
			{
				title: 'Marca',
				dataIndex: 'marca',
				align: 'center',
				key: 'marca',
				width: '60px',
				shouldCellUpdate: () => false,
				ellipsis: {
					showTitle: false
				},
				render: (value: string, record: any) => {
					return <Tooltip style={styles.Font14
					} title={value}>
						<Text style={styles.Font14}>{firstLetterUpperCase(value)}</Text>
					</Tooltip>
				},
			},
			{
				title: 'Quantidade',
				dataIndex: 'quantidade',
				key: 'quantidade',
				align: 'center',
				width: '60px',
				ellipsis: {
					showTitle: false
				},
				shouldCellUpdate: () => true,
				render: (value: string, record: any) => {
					return <Tooltip title={value}>
						<Editable fontSize={styles.Font14.width}>
							<EditablePreview />
							<Text style={styles.Font14}>{value}</Text>
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
				width: '70px',
				render: (value: string, record: any) => {
					return <Editable fontSize={styles.Font14.width} >
						<Text style={styles.Font14}>	{Number(value).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>
						<EditablePreview />
						<EditableInput />
					</Editable>;
				},

			},
		], []
	)

	function retornaItensNaoPreenchidos(lista: any[]) {
		let quantItens = 0;
		let newList: any[] = [];
		lista?.forEach((element) => {
			if (element?.valordoproduto <= 0) {
				newList.push(element)

			}

		})
		//	setListaItensNaoPreenchidos(newList)
		// if(quantItens > 0){
		// 	setExistItemNaoPreenchido(true)
		// }else{
		// 	setExistItemNaoPreenchido(false)
		// }
		// console.log(lista)
		return newList;
	}

	useEffect(() => {
		const observacaoTDO: ObservacaoGeralTDO = {
			codigoEmpresa: dadosUrl?.numeroEmpresa ?? '',
			contratoEmpresa: dadosUrl?.contratoEmpresa ?? '',
			observacao: observacao,
			cotacao: dadosUrl.numeroCotacao ?? ''
		}

	}, [isConfirmarLoading])

	function salvarObservacao() {

		setConfirmarLoading(true)
		const observacaoTDO: ObservacaoGeralTDO = {
			codigoEmpresa: dadosUrl?.numeroEmpresa ?? '',
			contratoEmpresa: dadosUrl?.contratoEmpresa ?? '',
			observacao: observacao,
			cotacao: dadosUrl.numeroCotacao ?? ''
		}

		criarObservacaoCotacao(observacaoTDO).then((result) => {
			success();
			onClose();
			setConfirmarLoading(false)

		})
	}

	function salvar() {
		onOpen();
	}


	async function updateFlagFornecedor() {
		setIsLoading(true)

		const payLoad: CotacaoTDOPayload = {
			codigo: dadosUrl?.numeroCotacao,
			fornecedor: dadosUrl?.codigoFornecedor,
			flag: Flag.PREENCHIDO,
			contratoEmpresa: dadosUrl?.contratoEmpresa,
			codigoEmpresa: dadosUrl?.numeroEmpresa
		}

		const result = await apiPostFlagFornecedor(payLoad)
		if (result.data.data === 201) {

			//*Criar o objeto e passar ele como parameteo na função apiPostOfferInfo */

			const data = {
				...payLoad,
				dados: {
					observacao: "something here",
					tempoEntrega: 12
				}
			}

			await apiPostOfferInfo(data).then((result: any) => {
				if (result?.error) {
					msgErro("Ocorreu um erro ao salvar a observação; " + result.error, 3)
				}
			})
			setOpened(true)

			salvarObservacao();


			success();

			setIsLoading(false)

			props.setAllPreenchido(true);
			props.setEnviado(true)
			//localStorage.clear();
		}
		else if (result.data.data === 400) {
			msgErro('Ocorreu um erro na payload:', 2);
		}
		else {
			onClose();
			setIsLoading(false)
			error();
		}

	}

	return <>
		{/* <Alert status='info' my={4}>
			<AlertIcon />
			<Text style={{ color: "#228BE6	" }}>	Antes de efetuar o envio, certifique-se de preencher todos os itens da tabela.</Text>
		</Alert> */}
		<Button style={{ boxShadow: "none", width: isLargerThan600 ? "" : "100%" }} disabled={false} onClick={() => { salvar() }}>
			Finalizar cotação
		</Button>

		<Space />

		<Modal	
			size={"lg"}
			isOpen={isOpen}
			onClose={onClose}>

			<ModalOverlay />
			<ModalContent>
				<ModalHeader fontWeight="normal">
					<HStack>
						<Text style={{ fontWeight: 500, fontSize: 16 }}>Confirmação de envio</Text>
					</HStack>
				</ModalHeader>
				<ModalCloseButton _focus={{ boxShadow: "none" }} />
				<ModalBody>
					<Text style={styles.Font16}>Após a confirmação a cotação não poderá mais ser editada.</Text>

					{/* <Textarea
						mt={5}
						placeholder="Observação"
						value={observacao}
						onChange={(e) => {
							setObservacao(e.target.value)
						}}

					/> */}
					{
						retornaItensNaoPreenchidos(props?.cotacoes?.data).length > 0 ?
							<VStack alignItems={"start"}>
								<TextChakra  color={"red"}>Estes itens devem ser preenchidos antes de finalizar a cotação.</TextChakra>
								<Table pagination={false} style={{ maxHeight: "300px", overflowY: "auto" }}
									dataSource={retornaItensNaoPreenchidos(props?.cotacoes?.data)} columns={columns} />
							</VStack>
							: <></>
					}



				</ModalBody>

				<ModalFooter>
					<Space>
						<Button disabled={retornaItensNaoPreenchidos(props?.cotacoes?.data).length > 0 ? true : false} loading={isLoading} onClick={() => { updateFlagFornecedor() }} >
							Confirmar
						</Button>

						<Button variant="outline" onClick={onClose}>Cancelar</Button>
					</Space>
				</ModalFooter>
			</ModalContent>
		</Modal>

		{/*EDITAR AQUI*/}

		<ModalDesconto mutate={props.mutate} isOpen={isOpenDesconto} onClose={onCloseDesconto} onOpen={onOpenDesconto} total={0} totalDesconto={0} totalFrete={0} />

		<ModalMantine
			opened={opened}
			onClose={() => setOpened(false)}
			title="Introduce yourself!"
		>
			{/* Modal content */}
		</ModalMantine>
	</>
}