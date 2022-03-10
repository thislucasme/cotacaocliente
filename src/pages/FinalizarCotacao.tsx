/* eslint-disable react-hooks/exhaustive-deps */
import {
	HStack, Modal,
	ModalBody,
	ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure
} from "@chakra-ui/react";
import { Button, Textarea } from '@mantine/core';
import { Input } from '@mantine/core';
import { message, Space, Typography } from "antd";
import React, { useContext, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { KeyedMutator } from "swr";
import { UrlContext } from "../context/UrlContext";
import { Flag } from "../enuns/enuns";
import { useFlagFornecedor } from '../hooks/useFlagFornecedor';
import { CotacaoTDOPayload } from "../lib/types";
import { ModalDesconto } from '../pages/ModalDesconto';
import { styles } from "../style/style";


const { Text } = Typography;
type Props = {
	setAllPreenchido: React.Dispatch<React.SetStateAction<boolean>>,
	loading: boolean,
	setEnviado: React.Dispatch<React.SetStateAction<boolean>>,
	mutate: KeyedMutator<any>,
	readyToSend: boolean

}
export const FinalizarCotacao = (props: Props) => {



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
		{/* <Alert status='info' my={4}>
			<AlertIcon />
			<Text style={{ color: "#228BE6	" }}>	Antes de efetuar o envio, certifique-se de preencher todos os itens da tabela.</Text>
		</Alert> */}
		<Button style={{ boxShadow: "none" }} disabled={false} onClick={() => { salvar() }}>
			Próximo
		</Button>

		<Space />

		<Modal
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
					<Textarea
						mt={5}
						placeholder="Observação"
						label="Deixe aqui sua observação"
						autosize
						minRows={2}
					/>

				</ModalBody>

				<ModalFooter>
					<Space>
						<Button loading={isLoading} onClick={() => { updateFlagFornecedor() }} >
							Confirmar
						</Button>

						<Button variant="outline" onClick={onClose}>Cancelar</Button>
					</Space>
				</ModalFooter>
			</ModalContent>
		</Modal>

		{/*EDITAR AQUI*/}

		<ModalDesconto mutate={props.mutate} isOpen={isOpenDesconto} onClose={onCloseDesconto} onOpen={onOpenDesconto} total={0} totalDesconto={0} totalFrete={0} />
	</>
}