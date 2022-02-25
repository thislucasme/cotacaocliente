import { FolderOpenOutlined, MenuOutlined } from '@ant-design/icons';
import { Box, chakra, Flex, Image, Spacer } from "@chakra-ui/react";
import { Layout, Menu } from "antd";
import 'antd/dist/antd.css';
import React, { useContext, useEffect, useState } from "react";
import { BiHomeAlt } from 'react-icons/bi';
import { Outlet, useNavigate } from "react-router-dom";
import LogoMenor from '../assets/logo-icon-48x48.png';
import LogoMaior from '../assets/logonomesuc.f5f52e7a.png';
import { Loading } from '../components/Loading';
import { ProfileMenu } from "../components/ProfileMenu";
import { Result } from '../components/Result';
import { UrlContext } from '../context/UrlContext';
import { useVendedor } from '../hooks/useVendedor';
import '../theme/styles.css';

const { Header, Sider, Content } = Layout;

const LayoutChakara = chakra(Layout);
export const TesteLayout = () => {


	const [url, setUrl] = useState<string>();
	const [collapsed, setCollapsed] = useState(true);
	const navigate = useNavigate();
	const {
		error,
		loading,
		isValidating,
		mutate
	} = useVendedor();


	//aqui é pego a url que é passada através do context
	const dadosUrl = useContext(UrlContext);


	useEffect(() => {

		/* Por padrão a url foi definida da seguinte forma:
		contraro+separador+numeroDaEmpresa+separador + numeroDaCotacao + separador + cnpjFornecedor + separador + codigoFornecedor */

		/*daddosUrl é um objeto contendo as seguintes propriedades: contratoEmpresa, numeroEmpresa, numeroCotacao e codigoFornecedor */

		if (dadosUrl !== undefined) {
			setUrl(dadosUrl.parametroUrl)
		}

		//if (vendedor?.data === null) navigate('/')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dadosUrl])

	if (loading) {
		return (<Loading />);
	}
	let isConnectionError = error && Object.entries(error).length === 0;
	let isErrorUndefined = error === undefined;

	if (!isConnectionError && !isErrorUndefined) return <Result onClick={mutate} isValidating={isValidating} />



	const toggle = () => {
		setCollapsed(!collapsed);
	};

	return (
		<LayoutChakara h={"100vh"} >
			<Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
				{collapsed ? <Image className={"logo"} src={LogoMenor} /> : <Image className={"logo"} src={LogoMaior} />}
				<Menu theme="light" mode="inline" defaultSelectedKeys={['2']}>
					<Menu.Item onClick={() => { navigate('home/' + url) }} key="1" icon={<BiHomeAlt />}>
						Home
					</Menu.Item>
					<Menu.Item onClick={() => { navigate('cotacao/' + url) }} key="2" icon={<FolderOpenOutlined />}>
						Cotações abertas
					</Menu.Item>
					{/*	<Menu.Item onClick={() => { navigate('cotacoes-fechadas') }} key="3" icon={<MailOutlined />}>
						Cotações fechadas
					</Menu.Item> */}
					{/*<Menu.Item key="4" onClick={() => { navigate('relatorios/' + url) }} icon={<FilePdfOutlined />}>
						Relatórios
				</Menu.Item>*/}

					{/* <Menu.Item key="5" onClick={() => { navigate('configuracao/' + url) }} icon={<SettingOutlined />}>
						Configurar usuários
					</Menu.Item> */}
				</Menu>
			</Sider>
			<Layout className="site-layout">
				<Header className="site-layout-background" style={{ padding: 0 }}>

					<Flex bg='#bee3f8'>
						<Box>
							{React.createElement(collapsed ? MenuOutlined : MenuOutlined, {
								className: 'trigger',
								onClick: toggle,
							})}
						</Box>
						<Spacer />
						<Box >
							<ProfileMenu />
						</Box>
					</Flex>
				</Header>
				<Content
					className="site-layout-background"
					style={{
						margin: '24px 16px',
						padding: 24,
						minHeight: 280,
					}}
				>
					<Outlet />
				</Content>
			</Layout>
		</LayoutChakara >
	);
}