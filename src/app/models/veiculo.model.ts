export interface Veiculos extends Array<Veiculo> {}

export interface Veiculo{
  id: number | string
  vehicle: string
  volumetotal: number | string
  connected: number | string
  softwareUpdates: number | string
  img?: string
}

export interface VeiculosAPI {
  vehicles: Veiculos;
}

export interface VeiculoDados {
  id: number | string
  odometro: number
  nivelCombustivel: number
  status: 'on' | 'off'
  lat: number
  long: number
}
