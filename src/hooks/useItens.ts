import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { CotacaoTDO } from "../lib/types";

export const useItem = () => {

	const [valorProduto, setValorProduto] = useState('');
	const [frete, setFrete] = useState('');
	const [st, setSt] = useState('');
	const [icms, setIcms] = useState('');
	const [mva, setMva] = useState('')
	const [desconto, setDesconto] = useState('');
	//const [formaPagamento, setFormaPagamento] = useState('');
	const [ipi, setIpi] = useState('');
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [cotacao, setCotacao] = useState<CotacaoTDO>();


	function abrirModal(cotacao: CotacaoTDO, value: string) {

		setCotacao(cotacao)
		setIpi(cotacao.ipi !== null ? cotacao?.ipi.toString() : '')
		setIcms(cotacao.icms !== null ? cotacao?.icms.toString() : '')
		setMva(cotacao.mva !== null ? cotacao?.mva.toString() : '')
		setSt(cotacao.st !== null ? cotacao?.st.toString() : '');
		setValorProduto(cotacao.valordoproduto !== null ? cotacao?.valordoproduto.toString() : '')
		setFrete(cotacao.frete !== null ? cotacao.frete.toString() : '')
		setDesconto(cotacao.desconto !== null ? cotacao.desconto.toString() : '')
		onOpen()
	}


	return {
		ipi,
		setIpi,
		icms,
		setIcms,
		mva,
		setMva,
		st,
		setSt,
		valorProduto,
		setValorProduto,
		frete,
		setFrete,
		setDesconto,
		desconto,
		abrirModal,
		onOpen,
		onClose,
		isOpen,
		cotacao
	}
}