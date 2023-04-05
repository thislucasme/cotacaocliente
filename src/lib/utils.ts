import { format, parse } from 'date-fns'

export const dataToString = (data: Date) => {
  return format(data, 'yyyyMMdd')
}

export const stringToData = (data: string) => {
  return parse(data, 'yyyyMMdd', new Date())
}
export const formatedTelefoneNumber = (telefone:string) => {
return  telefone?.replace(/(\d{3})(\d{4})(\d{4})/, '($1) $2-$3');
}

export const retornarTotal = (cotacoes: any[]) => {
  return cotacoes?.reduce((acumulador, atual) => acumulador + atual?.valordoproduto * atual?.quantidade, 0)
}