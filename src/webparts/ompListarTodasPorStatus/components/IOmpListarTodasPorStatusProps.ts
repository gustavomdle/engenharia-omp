import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IOmpListarTodasPorStatusProps {
  description: string;
  context: WebPartContext;
  siteurl: string;
  statusDocumento: string
}
