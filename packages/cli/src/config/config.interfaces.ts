export interface IConfigurationPorts {
  api: number;
  peer: number;
}
export interface IConfiguratioOptions {
  ports: IConfigurationPorts;
  host: string;
  database: string;
  peers: Array<string>;
}
