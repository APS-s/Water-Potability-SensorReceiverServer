export interface ISensorData {
  sensorId: string;
  info: {
    ph: number;
    solids: number;
    turbidity: number;
    conductivity: number;
  },
  date?: Date;
}
