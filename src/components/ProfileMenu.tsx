import { CaretDownOutlined } from '@ant-design/icons';
import {
	FormControl,
	HStack, Link, Modal,
	ModalBody,
	ModalCloseButton, ModalContent,
	ModalFooter, ModalHeader, ModalOverlay, Skeleton, useDisclosure, useMediaQuery, VStack
} from "@chakra-ui/react";
import { Button, Checkbox, Input, Space, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { BsInfoCircleFill } from 'react-icons/bs';
import { UrlContext } from '../context/UrlContext';
import { apiGetEmpresa } from '../lib/api';

const { Text } = Typography;

export const ProfileMenu = () => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [fornecedor, setFornecedor] = useState<any>();

	const [isLargerThan600] = useMediaQuery('(min-width: 600px)');


	const dadosUrl = useContext(UrlContext);

	useEffect(() => {

		//const data: UrlData = JSON.parse(localStorage.getItem('urlData') as string);
		const url = 'empresa/fornecedor/' + dadosUrl.contratoEmpresa + '/' + dadosUrl.codigoFornecedor + '/' + dadosUrl.numeroEmpresa
		const result = apiGetEmpresa(url)
		result.then((result) => {
			setFornecedor(result.data)
		}).catch(error => {
		})
	}, [dadosUrl])

	return (
		<>
			<VStack>

				{fornecedor ?
					isLargerThan600 ?
						<HStack borderRadius={5} marginRight={2}>
							<HStack><Text style={{ color: "gray" }} strong>Razão social:</Text><Text style={{ fontSize: "14px" }} strong>{fornecedor?.nome.trim().toLowerCase()}</Text></HStack>
							<HStack><Text style={{ color: "gray" }} strong>CNPJ:</Text><Text strong>{fornecedor?.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}</Text></HStack>
							<BsInfoCircleFill color='#538EC6' cursor={"pointer"} />

							<Button onClick={onOpen} type={"primary"} icon={<CaretDownOutlined />}>Ver detalhes</Button>
						</HStack>
						:
						<></>
					:
					<HStack>
						<Skeleton height='20px' w="170px" />
						<Skeleton height='20px' w="180px" />
						<Skeleton height='30px' w="100px" />
					</HStack>
				}
			</VStack>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader alignItems="center" fontSi fontWeight="normal" >
						<Text>Identificação do vendedor</Text>
					</ModalHeader>
					<ModalCloseButton _focus={{ boxShadow: 'none' }} />
					<ModalBody >


						<VStack>
							<FormControl>
								<VStack alignItems={"flex-start"}>
									<Text>Nome</Text>
									<Input onChange={(e) => { }} placeholder="ex: João" />
									<Text>CNPJ</Text>
									<Input onChange={(e) => { }} placeholder="ex: 58.613.915/0001-52" />

									<Checkbox onChange={() => { }}>Li e concordo com os <Link>termos e condições.</Link></Checkbox>

								</VStack>



							</FormControl>
						</VStack>

					</ModalBody>

					<ModalFooter>
						<Space>
							<Button loading={false} onClick={() => { }} >
								Salvar
							</Button>
							<Button type={"primary"} onClick={onClose}>Cancelar</Button>
						</Space>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}