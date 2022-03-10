import { Button } from "@mantine/core";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React from "react";






export const TestPdf = () => {
	const doc = new jsPDF()




	const gerar = () => {




		autoTable(doc, { html: "#table" })
		autoTable(doc, { html: "#table2" })
		let posY = (doc as any).lastAutoTable.finalY;
		// const texto = doc.text("Titulo", 20, posY + 10)
		// const tb = autoTable(doc, { html: "#table2", startY: posY + 20 })
		posY = (doc as any).lastAutoTable.finalY;
		doc.text("Titulo", 20, posY + 10)




		doc.save('table.pdf')
	}


	return (
		<>

			<table id="table">
				<thead>
					<tr>
						<th>Custo</th>
						<th>Desconto</th>
						<th>Frete</th>
						<th>ST%</th>
						<th>ICMS%</th>
						<th>IPI%</th>
						<th>MVA%</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>R$ 220,00</td>
						<td>R$ 22,00</td>
						<td>R$ 23,00</td>
						<td>R$ 50,00</td>
						<td>R$ 25,00</td>
						<td>R$ 12,00</td>
						<td>R$ 80,00</td>
					</tr>

				</tbody>
			</table>

			<table id="table2">
				<thead>
					<tr>
						<th>Custo</th>
						<th>Desconto</th>
						<th>Frete</th>
						<th>ST%</th>
						<th>ICMS%</th>
						<th>IPI%</th>
						<th>MVA%</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>R$ 220,00</td>
						<td>R$ 22,00</td>
						<td>R$ 23,00</td>
						<td>R$ 50,00</td>
						<td>R$ 25,00</td>
						<td>R$ 12,00</td>
						<td>R$ 80,00</td>
					</tr>

				</tbody>
			</table>


			<h1>hello world!</h1>
			<Button onClick={gerar}>Hello world!</Button>
		</>

	);
}