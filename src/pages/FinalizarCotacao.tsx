/* eslint-disable react-hooks/exhaustive-deps */
import {
	Alert,
	AlertIcon, HStack, Modal,
	ModalBody,
	ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure
} from "@chakra-ui/react"
import { Button, message, Space, Typography } from "antd"
import React, { useContext, useEffect, useState } from "react"
import { AiOutlineInfoCircle } from "react-icons/ai"
import { useRecoilValue } from "recoil"
import { KeyedMutator } from "swr"
import { urlDataState } from "../context/atom"
import { UrlContext } from "../context/UrlContext"
import { useFlagFornecedor } from '../hooks/useFlagFornecedor'
import { CotacaoTDOPayload } from "../lib/types"
import { ModalDesconto } from '../pages/ModalDesconto'


const { Text } = Typography;
type Props = {
	setAllPreenchido: React.Dispatch<React.SetStateAction<boolean>>,
	loading: boolean,
	setEnviado: React.Dispatch<React.SetStateAction<boolean>>,
	parametro: any,
	mutate: KeyedMutator<any>,
	readyToSend: boolean

}
export const FinalizarCotacao = (props: Props) => {

	const [, setContratoEmpresa] = useState('');
	const [, setNumeroEmpresa] = useState('');
	const [, setNumeroCotacao] = useState('');
	const [, setCnjFornecedor] = useState('');
	const [, setCodigoFornecedor] = useState('');


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

	const { apiPostFlagFornecedor } = useFlagFornecedor();

	const dadosUrl = useContext(UrlContext);



	const { isOpen: isOpenDesconto, onOpen: onOpenDesconto, onClose: onCloseDesconto } = useDisclosure()



	useEffect(() => {


		setContratoEmpresa(dadosUrl?.contratoEmpresa ? dadosUrl?.contratoEmpresa : "")
		setNumeroEmpresa(dadosUrl?.numeroEmpresa ? dadosUrl?.numeroEmpresa : "")
		setNumeroCotacao(dadosUrl?.numeroCotacao ? dadosUrl?.numeroCotacao : "")
		setCnjFornecedor(dadosUrl?.cnpjFornecedor)
		setCodigoFornecedor(dadosUrl.codigoFornecedor)


		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])


	function salvar() {
		onOpen();
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
		<Button type="primary" disabled={!props.readyToSend} onClick={() => { salvar() }}>
			Confirmar envio
		</Button>

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
		<ModalDesconto mutate={props.mutate} isOpen={isOpenDesconto} onClose={onCloseDesconto} onOpen={onOpenDesconto} />
	</>
}