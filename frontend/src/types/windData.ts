export interface WindEntry {
    time: string;
    wind: {
        speed: number;
    };
}
  
export interface WindGraphProps {
    windData: WindEntry[];
}