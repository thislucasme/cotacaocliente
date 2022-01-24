import {
	Alert,
	AlertIcon, HStack, Modal,
	ModalBody,
	ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure
} from "@chakra-ui/react"
import { Button, message, Space, Typography } from "antd"
import React, { useEffect, useState } from "react"
import { AiOutlineInfoCircle } from "react-icons/ai"
import { useRecoilState, useRecoilValue } from "recoil"
import { percentual, urlDataState } from "../context/atom"
import { useFlagFornecedor } from '../hooks/useFlagFornecedor'
import { CotacaoTDOPayload } from "../lib/types"
import { ModalDesconto } from '../pages/ModalDesconto'


const { Text } = Typography;
type Props = {
	setAllPreenchido: React.Dispatch<React.SetStateAction<boolean>>,
	loading: boolean,
	setEnviado: React.Dispatch<React.SetStateAction<boolean>>,
	parametro: any,

}
export const FinalizarCotacao = (props: Props) => {

	const [contratoEmpresa, setContratoEmpresa] = useState('');
	const [numeroEmpresa, setNumeroEmpresa] = useState('');
	const [numeroCotacao, setNumeroCotacao] = useState('');
	const [cnpjFornecedor, setCnjFornecedor] = useState('');
	const [codigoFornecedor, setCodigoFornecedor] = useState('');

	const payload: CotacaoTDOPayload = {
		codigo: numeroCotacao,
		fornecedor: codigoFornecedor,
		flag: "xx",
		contratoEmpresa: "",
		codigoEmpresa: ""
	}
	//const { dados } = useCotacaoFlag(payload);

	const success = () => {
		message.success('Dados enviados com sucesso!');
	};
	const error = () => {
		message.error('Fornecedor não foi encontrado na base de dados', 1);
	};
	const msgErro = (text: string) => {
		message.error(text, 1);
	};

	const { isOpen, onOpen, onClose } = useDisclosure()

	const [isLoading, setIsLoading] = useState(false);

	const { apiPostFlagFornecedor, apiPostVerificarFlagFornecedor } = useFlagFornecedor();

	const dataUrl = useRecoilValue(urlDataState)

	const desconto = useRecoilState(percentual);

	const { isOpen: isOpenDesconto, onOpen: onOpenDesconto, onClose: onCloseDesconto } = useDisclosure()


	useEffect(() => {


		setContratoEmpresa(dataUrl[0]?.contratoEmpresa)
		setNumeroEmpresa(dataUrl[0]?.numeroEmpresa)
		setNumeroCotacao(dataUrl[0]?.numeroCotacao)
		setCnjFornecedor(dataUrl[0]?.cnpjFornecedor)
		setCodigoFornecedor(dataUrl[0]?.codigoFornecedor)

	}, [])


	function salvar() {
		onOpen();
		//props.salvarItensLocalmente()
	}

	async function updateFlagFornecedor() {
		setIsLoading(true)

		const payLoad: CotacaoTDOPayload = {
			codigo: dataUrl[0]?.numeroCotacao,
			fornecedor: dataUrl[0]?.codigoFornecedor,
			flag: "P",
			contratoEmpresa: dataUrl[0]?.contratoEmpresa,
			codigoEmpresa: dataUrl[0]?.numeroEmpresa
		}

		// const payLoad: CotacaoTDOPayload = {
		// 	codigo: numeroCotacao,
		// 	fornecedor: codigoFornecedor,
		// 	flag: "P",
		// 	contratoEmpresa: contratoEmpresa,
		// 	codigoEmpresa: numeroEmpresa
		// }

		//chamada da API para atualizar as flags para (P)
		//endpoint localhost:/apiFornecedor/
		const result = await apiPostFlagFornecedor(payLoad)
		if (result.data.data === 201) {
			onClose();
			success();
			setIsLoading(false)
			props.setAllPreenchido(true);
			props.setEnviado(true)
			//localStorage.clear();
		}
		else if (result.data.data === 400) {
			msgErro('Ocorreu um erro na payload');
		}
		else {
			onClose();
			setIsLoading(false)
			error();
		}
	}

	return <>
		<Alert status='info' my={4}>
			<AlertIcon />
			Antes de efetuar o envio, certifique-se de preencher todos os itens da tabela.
		</Alert>
		<Button type="primary" disabled={!props.loading} onClick={() => { salvar() }}>
			Confirmar envio
		</Button>
		<Button onClick={onOpenDesconto} style={{ "marginLeft": "5px" }}>Aplicar desconto</Button>

		<Space />

		<Modal
			isOpen={isOpen}
			onClose={onClose}>

			<ModalOverlay />
			<ModalContent>
				<ModalHeader fontWeight="normal">
					<HStack>
						<AiOutlineInfoCircle size="20px" color="#3182ce" />
						<Text>Atenção!</Text>
					</HStack>
				</ModalHeader>
				<ModalCloseButton _focus={{ boxShadow: "none" }} />
				<ModalBody>
					Ao confirma o envio para a cotação, após a confirmação a cotação não poderá mais ser editada. Deseja continuar?
				</ModalBody>

				<ModalFooter>
					<Space>
						<Button loading={isLoading} onClick={() => { updateFlagFornecedor() }} >
							Salvar
						</Button>

						<Button type={"primary"} onClick={onClose}>Cancelar</Button>
					</Space>
				</ModalFooter>
			</ModalContent>
		</Modal>
		<ModalDesconto isOpen={isOpenDesconto} onClose={onCloseDesconto} onOpen={onOpenDesconto} />
	</>
}