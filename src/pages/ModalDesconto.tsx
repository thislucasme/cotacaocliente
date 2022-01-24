import React, { useState } from "react";
import { HStack, Modal, Text, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useStyleConfig } from "@chakra-ui/react";
import { Button, Space, Input } from "antd";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useSetRecoilState } from "recoil";
import { percentual } from "../context/atom";

type Props = {
	isOpen: boolean,
	onClose: () => void,
	onOpen: () => void
}
export const ModalDesconto = (props: Props) => {

	const setDesconto = useSetRecoilState(percentual);
	const [value, setValue] = useState("");



	return (
		<>
			<Modal
				isOpen={props.isOpen}
				onClose={props.onClose}>

				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontWeight="normal">
						<HStack>
							<AiOutlineInfoCircle size="20px" color="#3182ce" />
							<Text>Desconto</Text>
						</HStack>
					</ModalHeader>
					<ModalCloseButton _focus={{ boxShadow: "none" }} />
					<ModalBody>
						No campo abaixo digite o quanto de desconto deseja aplicar no valor total (%).
						<Input name={value} onChange={(e) => { setValue(e.target.value) }} />
					</ModalBody>

					<ModalFooter>
						<Space>
							<Button onClick={() => { setDesconto(value); props.onClose(); }} loading={false} >
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