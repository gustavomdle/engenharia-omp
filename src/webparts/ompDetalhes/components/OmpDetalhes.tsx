import * as React from 'react';
import styles from './OmpDetalhes.module.scss';
import { IOmpDetalhesProps } from './IOmpDetalhesProps';
import { escape } from '@microsoft/sp-lodash-subset';

import * as jquery from 'jquery';
import * as $ from "jquery";
import * as jQuery from "jquery";
import { sp, IItemAddResult, DateTimeFieldFormatType } from "@pnp/sp/presets/all";
import "bootstrap";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import { Web } from "sp-pnp-js";
import pnp from "sp-pnp-js";
import { ICamlQuery } from '@pnp/sp/lists';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { allowOverscrollOnElement, DatePicker } from 'office-ui-fabric-react';
import { PrimaryButton, Stack, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { DateTimePicker, DateConvention, TimeConvention } from '@pnp/spfx-controls-react/lib/DateTimePicker';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { SiteUser } from 'sp-pnp-js/lib/sharepoint/siteusers';
import { UrlQueryParameterCollection, Version } from '@microsoft/sp-core-library';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFile } from "@fortawesome/free-solid-svg-icons";

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");



var _idOMP;
var _url;
var _arrNomeArquivo;
var _arrNomeArquivoAttachmentFiles;
var _documentoNumero;
var _web;
var _pos = 0;
var _pos2 = 0;

export interface IReactGetItemsState {

  itemsConjuntos: [
    {
      "ID": any,
      "Title": any,
      "PIE": any,
      "PATS": any,
      "DescricaoPATS": any,
      "Atual": any,
      "VersaoAtual": any,
      "cSAtual": any,
      "Nova": any,
      "VersaoNova": any,
      "CSNova": any,
      "DisposicaoEstoque": any,
      "disposicaoEstoqueEscolha": any,
      "DisposicaoFornecedor": any,
      "DisposicaoFornecedorEscolha": any,
      "DisposicaoEmtransito": any,
      "disposicaoEmtransitoEscolha": any,
      "HistoricoAlteracao": any,
    }],
  itemsSubConjuntos: [
    {
      "ID": any,
      "Title": any,
      "PIE": any,
      "PATS": any,
      "DescricaoPATS": any,
      "Atual": any,
      "VersaoAtual": any,
      "cSAtual": any,
      "Nova": any,
      "VersaoNova": any,
      "CSNova": any,
      "DisposicaoEstoque": any,
      "disposicaoEstoqueEscolha": any,
      "DisposicaoFornecedor": any,
      "DisposicaoFornecedorEscolha": any,
      "DisposicaoEmtransito": any,
      "disposicaoEmtransitoEscolha": any,
      "HistoricoAlteracao": any,
    }],
  itemsPontoCorte: [],
  itemsAssistenciaTecnica: [],
  itemsAprovacoes: [],
  itemsListAnexosItem: [
    {
      "FileName": any,
      "ServerRelativeUrl": any,
    }
  ],
  itemsListAnexos: [
    {
      "Name": any,
      "ServerRelativeUrl": any,
    }
  ],

}


const tablecolumnsPontoCorte = [
  {
    dataField: "OMP.ID",
    text: "OMP",
    headerClasses: 'text-center',
    classes: 'text-center',
    headerStyle: { "backgroundColor": "#bee5eb", "width": "100px" },
  },
  {
    dataField: "PIE.ID",
    text: "Código PIE",
    classes: 'text-center',
    headerClasses: 'text-center',
    headerStyle: { "backgroundColor": "#bee5eb", "width": "100px" },
  },
  {
    dataField: "Title",
    text: "Observação",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "Data",
    text: "Data",
    headerClasses: 'text-center',
    headerStyle: { "backgroundColor": "#bee5eb", "width": "200px" },
    classes: 'text-center',
    formatter: (rowContent, row) => {
      var data = new Date(row.Data);
      var dtdata = ("0" + data.getDate()).slice(-2) + '/' + ("0" + (data.getMonth() + 1)).slice(-2) + '/' + data.getFullYear().toString().substr(-2) + ' ' + ("0" + (data.getHours())).slice(-2) + ':' + ("0" + (data.getMinutes())).slice(-2);
      return dtdata;
    }
  },

]


const tablecolumnsAssistenciaTecnica = [
  {
    dataField: "OMP.ID",
    text: "OMP",
    headerClasses: 'text-center',
    classes: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "PIE.ID",
    text: "Código PIE",
    classes: 'text-center',
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "PATS.ID",
    text: "Código PATS",
    classes: 'text-center',
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "DataEntrega",
    text: "Data de entrega do material",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
    classes: 'text-center',
    formatter: (rowContent, row) => {
      var data = new Date(row.DataEntrega);
      var dtdata = ("0" + data.getDate()).slice(-2) + '/' + ("0" + (data.getMonth() + 1)).slice(-2) + '/' + data.getFullYear().toString().substr(-2) + ' ' + ("0" + (data.getHours())).slice(-2) + ':' + ("0" + (data.getMinutes())).slice(-2);
      return dtdata;
    }
  },
  {
    dataField: "Modified",
    text: "Data de criação",
    headerStyle: { "backgroundColor": "#bee5eb" },
    classes: 'headerPreStage text-center',
    headerClasses: 'text-center',
    formatter: (rowContent, row) => {
      var dataModificado = new Date(row.Modified);
      var dtdataModificado = ("0" + dataModificado.getDate()).slice(-2) + '/' + ("0" + (dataModificado.getMonth() + 1)).slice(-2) + '/' + dataModificado.getFullYear().toString().substr(-2) + '<br/>' + ("0" + (dataModificado.getHours())).slice(-2) + ':' + ("0" + (dataModificado.getMinutes())).slice(-2);
      //return dtdataCriacao;
      return <div dangerouslySetInnerHTML={{ __html: `${dtdataModificado}` }} />;
    }
  },
  {
    dataField: "Editor.Title",
    classes: 'headerPreStage',
    text: "Modificado por",
    headerStyle: { "backgroundColor": "#bee5eb" },
    headerClasses: 'text-center',
  },
]


const tablecolumnsAprovacoes = [
  {
    dataField: "Atribu_x00ed_da_x0020_a",
    text: "Atribuido a",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "Status",
    text: "Status",
    classes: 'text-center',
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
  },
  {
    dataField: "Data_x0020_de_x0020_Conclus_x00e",
    text: "Data de Conclusão",
    headerClasses: 'text-center',
    headerStyle: { backgroundColor: '#bee5eb' },
    classes: 'text-center',
    formatter: (rowContent, row) => {
      var data = new Date(row.Data_x0020_de_x0020_Conclus_x00e);
      var dtdata = ("0" + data.getDate()).slice(-2) + '/' + ("0" + (data.getMonth() + 1)).slice(-2) + '/' + data.getFullYear().toString().substr(-2) + ' ' + ("0" + (data.getHours())).slice(-2) + ':' + ("0" + (data.getMinutes())).slice(-2);
      return dtdata;
    }
  },
]

export default class OmpDetalhes extends React.Component<IOmpDetalhesProps, IReactGetItemsState> {


  public constructor(props: IOmpDetalhesProps, state: IReactGetItemsState) {
    super(props);
    this.state = {

      itemsConjuntos: [
        {
          "ID": "",
          "Title": "",
          "PIE": "",
          "PATS": "",
          "DescricaoPATS": "",
          "Atual": "",
          "VersaoAtual": "",
          "cSAtual": "",
          "Nova": "",
          "VersaoNova": "",
          "CSNova": "",
          "DisposicaoEstoque": "",
          "disposicaoEstoqueEscolha": "",
          "DisposicaoFornecedor": "",
          "DisposicaoFornecedorEscolha": "",
          "DisposicaoEmtransito": "",
          "disposicaoEmtransitoEscolha": "",
          "HistoricoAlteracao": "",
        }
      ],
      itemsSubConjuntos: [
        {
          "ID": "",
          "Title": "",
          "PIE": "",
          "PATS": "",
          "DescricaoPATS": "",
          "Atual": "",
          "VersaoAtual": "",
          "cSAtual": "",
          "Nova": "",
          "VersaoNova": "",
          "CSNova": "",
          "DisposicaoEstoque": "",
          "disposicaoEstoqueEscolha": "",
          "DisposicaoFornecedor": "",
          "DisposicaoFornecedorEscolha": "",
          "DisposicaoEmtransito": "",
          "disposicaoEmtransitoEscolha": "",
          "HistoricoAlteracao": "",
        }
      ],
      itemsPontoCorte: [],
      itemsAssistenciaTecnica: [],
      itemsAprovacoes: [],
      itemsListAnexosItem: [
        {
          "FileName": "",
          "ServerRelativeUrl": ""
        }
      ],
      itemsListAnexos: [
        {
          "Name": "",
          "ServerRelativeUrl": "",
        }
      ],
    }

  }

  public async componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);
    var queryParms = new UrlQueryParameterCollection(window.location.href);
    _idOMP = parseInt(queryParms.getValue("DocumentoID"));

    document
      .getElementById("btnEditar")
      .addEventListener("click", (e: Event) => this.editar());

    document
      .getElementById("btnVoltar")
      .addEventListener("click", (e: Event) => this.voltar());

    this.handler();
    this.getAnexos();

  }

  public render(): React.ReactElement<IOmpDetalhesProps> {

    return (

      <div id="container">

        <div id="accordion">

          <div className="card">
            <div className="card-header btn" id="headingInformacoesProduto" data-toggle="collapse" data-target="#collapseInformacoesProduto" aria-expanded="true" aria-controls="collapseInformacoesProduto">
              <h5 className="mb-0 text-info">
                Detalhes da OMP
              </h5>
            </div>
            <div id="collapseInformacoesProduto" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md text-info ">
                      <b>OMP Nro: <span id='txtNro'></span></b><br></br>
                      Status: <span id='txtStatus'></span>

                    </div>
                    <div className="form-group col-md text-secondary right ">

                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtSintese">Síntese</label><br></br>
                      <span className="text-info" id='txtSintese'></span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtTipo">Tipo</label><br></br>
                      <span className="text-info" id='txtTipo'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtObjetivo">Objetivo</label><br></br>
                      <span className="text-info" id='txtObjetivo'></span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtDivisaoImpressora">Divisão de impressoras?</label><br></br>
                      <span className="text-info" id='txtDivisaoImpressora'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtProducao">Produção</label><br></br>
                      <span className="text-info" id='txtProducao'></span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtAssistenciaTecnica">Assistência Técnica</label><br></br>
                      <span className="text-info" id='txtAssistenciaTecnica'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtObservacao">Observação</label><br></br>
                      <span className="text-info" id='txtObservacao'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtDescricaoProblema">Descrição do Problema</label><br></br>
                      <span className="text-info" id='txtDescricaoProblema'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtSolucaoEncontrada">Solução encontrada</label><br></br>
                      <span className="text-info" id='txtSolucaoEncontrada'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtAlteracoes">Alterações</label><br></br>
                      <span className="text-info" id='txtAlteracoes'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtDocumentosAlterados">Documentos alterados</label><br></br>
                      <span className="text-info" id='txtDocumentosAlterados'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtDocumentosOrigem">Documentos de origem</label><br></br>
                      <span className="text-info" id='txtDocumentosOrigem'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtResponsavelTecnico">Responsável técnico</label><br></br>
                      <span className="text-info" id='txtResponsavelTecnico'></span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtResponsavelArea">Responsável da área</label><br></br>
                      <span className="text-info" id='txtResponsavelArea'></span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtAreaExecutoraFabrica">Área executora fábrica</label><br></br>
                      <span className="text-info" id='txtAreaExecutoraFabrica'></span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtAreaExecutoraAT">Área executora AT</label><br></br>
                      <span className="text-info" id='txtAreaExecutoraAT'></span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingAnexos" data-toggle="collapse" data-target="#collapseAnexos" aria-expanded="true" aria-controls="collapseAnexos">
              <h5 className="mb-0 text-info">
                Anexos
              </h5>
            </div>
            <div id="collapseAnexos" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <div className="form-row ">
                    <div className="form-group col-md" >
                      {this.state.itemsListAnexosItem.map((item, key) => {

                        _pos++;
                        var txtAnexoItem = "anexoItem" + _pos;
                        var btnExcluirAnexoitem = "btnExcluirAnexoitem" + _pos;

                        var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Anexos')/items('${_idOMP}')/AttachmentFiles`;
                        url = this.props.siteurl;

                        var caminho = `${url}/Lists/Anexos/Attachments/${_idOMP}/${item.FileName}`;

                        return (

                          <><a id={txtAnexoItem} target='_blank' data-interception="off" href={caminho} title="">{item.FileName}</a><br></br></>


                        );



                      })}
                      {this.state.itemsListAnexos.map((item, key) => {

                        _pos++;
                        var txtAnexoItem = "anexoItem" + _pos;
                        var btnExcluirAnexoitem = "btnExcluirAnexoitem" + _pos;

                        var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Anexos')/items('${_idOMP}')/AttachmentFiles`;
                        url = this.props.siteurl;

                        var caminho = item.ServerRelativeUrl;

                        var idBotao = `btnExcluirAnexo2${_pos2}`;
                        var idImagem = `anexo2${_pos2}`;

                        var relativeURL = window.location.pathname;
                        var url = window.location.pathname;
                        var nomePagina = url.substring(url.lastIndexOf('/') + 1);
                        var strRelativeURL = relativeURL.replace(`SitePages/${nomePagina}`, "");

                        return (

                          <><a id={idImagem} target='_blank' data-interception="off" href={caminho} title="">{item.Name}</a><br></br></>

                        );



                      })}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingConjuntos" data-toggle="collapse" data-target="#collapseConjuntos" aria-expanded="true" aria-controls="collapseConjuntos">
              <h5 className="mb-0 text-info">
                Conjuntos
              </h5>
            </div>

            <div id="collapseConjuntos" className="collapse show" aria-labelledby="headingOne">

              <div className="card-body">

                {this.state.itemsConjuntos.map(function (item, key) {
                  return (
                    <><div className='padding10 col-md border m-1 bg-light text-dark rounded'>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            PIE
                          </div>
                          <div className="form-group col-md border m-1">
                            Código<br></br>
                            <span className="text-info" id='txtSintese'>{item.PIE}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Descrição<br></br>
                            <span className="text-info" id='txtTipo'>{item.Title}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            PATS<br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            Código<br></br>
                            <span className="text-info" id='txtSintese'>{item.PATS}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Descrição<br></br>
                            <span className="text-info" id='txtTipo'>{item.DescricaoPATS}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            <label htmlFor="txtSintese">Atual</label><br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            Revisão<br></br>
                            <span className="text-info" id='txtTipo'>{item.Atual}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Versão<br></br>
                            <span className="text-info" id='txtSintese'>{item.VersaoAtual}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            CS<br></br>
                            <span className="text-info" id='txtSintese'>{item.cSAtual}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            Nova<br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            Revisão<br></br>
                            <span className="text-info" id='txtTipo'>{item.Nova}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Versão<br></br>
                            <span className="text-info" id='txtSintese'>{item.VersaoNova}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            CS<br></br>
                            <span className="text-info" id='txtSintese'>{item.CSNova}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            Estoque<br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            Revisão<br></br>
                            <span className="text-info" id='txtTipo'>{item.DisposicaoEstoque}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Versão<br></br>
                            <span className="text-info" id='txtSintese'>{item.disposicaoEstoqueEscolha}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            Fornecedor<br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            Disposição<br></br>
                            <span className="text-info" id='txtTipo'>{item.DisposicaoFornecedor}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Escolha<br></br>
                            <span className="text-info" id='txtSintese'>{item.DisposicaoFornecedorEscolha}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            Em trânsito<br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            Disposição<br></br>
                            <span className="text-info" id='txtTipo'>{item.DisposicaoEmtransito}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Escolha<br></br>
                            <span className="text-info" id='txtSintese'>{item.disposicaoEmtransitoEscolha}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            Histórico<br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            <span className="text-info" id='txtTipo'>{item.HistoricoAlteracao}</span>
                          </div>
                        </div>
                      </div>


                    </div><br></br></>
                  );

                })}

              </div>

            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingSubConjuntos" data-toggle="collapse" data-target="#collapseSubConjuntos" aria-expanded="true" aria-controls="collapseSubConjuntos">
              <h5 className="mb-0 text-info">
                Sub-Conjuntos
              </h5>
            </div>

            <div id="collapseSubConjuntos" className="collapse show" aria-labelledby="headingOne">

              <div className="card-body">


                {this.state.itemsSubConjuntos.map(function (item, key) {
                  return (
                    <><div className='padding10 col-md border m-1 bg-light text-dark rounded'>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            PIE
                          </div>
                          <div className="form-group col-md border m-1">
                            Código<br></br>
                            <span className="text-info" id='txtSintese'>{item.PIE}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Descrição<br></br>
                            <span className="text-info" id='txtTipo'>{item.Title}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            PATS<br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            Código<br></br>
                            <span className="text-info" id='txtSintese'>{item.PATS}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Descrição<br></br>
                            <span className="text-info" id='txtTipo'>{item.DescricaoPATS}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            <label htmlFor="txtSintese">Atual</label><br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            Revisão<br></br>
                            <span className="text-info" id='txtTipo'>{item.Atual}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Versão<br></br>
                            <span className="text-info" id='txtSintese'>{item.VersaoAtual}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            CS<br></br>
                            <span className="text-info" id='txtSintese'>{item.cSAtual}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            Nova<br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            Revisão<br></br>
                            <span className="text-info" id='txtTipo'>{item.Nova}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Versão<br></br>
                            <span className="text-info" id='txtSintese'>{item.VersaoNova}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            CS<br></br>
                            <span className="text-info" id='txtSintese'>{item.CSNova}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            Estoque<br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            Revisão<br></br>
                            <span className="text-info" id='txtTipo'>{item.DisposicaoEstoque}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Versão<br></br>
                            <span className="text-info" id='txtSintese'>{item.disposicaoEstoqueEscolha}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            Fornecedor<br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            Disposição<br></br>
                            <span className="text-info" id='txtTipo'>{item.DisposicaoFornecedor}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Escolha<br></br>
                            <span className="text-info" id='txtSintese'>{item.DisposicaoFornecedorEscolha}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            Em trânsito<br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            Disposição<br></br>
                            <span className="text-info" id='txtTipo'>{item.DisposicaoEmtransito}</span>
                          </div>
                          <div className="form-group col-md border m-1">
                            Escolha<br></br>
                            <span className="text-info" id='txtSintese'>{item.disposicaoEmtransitoEscolha}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="form-row">
                          <div className="form-group labelConjuntosSubconjutos ">
                            Histórico<br></br>
                          </div>
                          <div className="form-group col-md border m-1">
                            <span className="text-info" id='txtTipo'>{item.HistoricoAlteracao}</span>
                          </div>
                        </div>
                      </div>


                    </div><br></br></>
                  );

                })}

              </div>

            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingPontoCorte" data-toggle="collapse" data-target="#collapsePontoCorte" aria-expanded="true" aria-controls="collapsePontoCorte">
              <h5 className="mb-0 text-info">
                Ponto de Corte
              </h5>
            </div>
            <div id="collapsePontoCorte" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">
                <div id='tabelaPontoCorte'>
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensPontoCorte" keyField='id' data={this.state.itemsPontoCorte} columns={tablecolumnsPontoCorte} headerClasses="header-class" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingAssistenciaTecnica" data-toggle="collapse" data-target="#collapseAssistenciaTecnica" aria-expanded="true" aria-controls="collapseAssistenciaTecnica">
              <h5 className="mb-0 text-info">
                Informações Assistência Técnica
              </h5>
            </div>
            <div id="collapseAssistenciaTecnica" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">
                <div id='tabelaAssistenciaTecnica'>
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensAssistenciaTecnica" keyField='id' data={this.state.itemsAssistenciaTecnica} columns={tablecolumnsAssistenciaTecnica} headerClasses="header-class" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingAprovacoes" data-toggle="collapse" data-target="#collapseAprovacoes" aria-expanded="true" aria-controls="collapseAprovacoes">
              <h5 className="mb-0 text-info">
                Aprovações
              </h5>
            </div>
            <div id="collapseAprovacoes" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">
                <div id='tabelaAprovacoes'>
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensAprovacoes" keyField='id' data={this.state.itemsAprovacoes} columns={tablecolumnsAprovacoes} headerClasses="header-class" />
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="text-right">
          <button style={{ "margin": "2px" }} type="submit" id="btnVoltar" className="btn btn-secondary">Voltar</button>
          <button style={{ "margin": "2px" }} id="btnEditar" className="btn btn-success">Editar</button><br></br><br></br>
        </div>

      </div>











    );


  }


  protected handler() {


    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Ordem de Modificação de Produto')/items?$top=4999&$orderby= ID desc&$select=ID,Title,Numero,TipoOMP,Objetivo,Status,Created,Author/Title,DivisaoImpressoras,CIProducao,CIAssistenciaTecnica,CIObservacao,DescricaoProblema,SolucaoEncontrada,Alteracoes,DocumentosAlterados,DocumentosOrigem,ResponsavelTecnico/Title,ResponsavelArea/Title,AreaExecutoraFabrica/Title,AreaExecutoraAT/Title,siteNovoSPOnline,txtResponsavelTecnico,txtResponsavelArea,txtAreaExecutoraFabrica,txtAreaExecutoraAT&$expand=Author,ResponsavelTecnico,ResponsavelArea,AreaExecutoraFabrica,AreaExecutoraAT&$filter=ID eq ` + _idOMP,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        console.log("resultData", resultData);

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var numero = resultData.d.results[i].Numero;
            _documentoNumero = numero;

            console.log("_documentoNumero", _documentoNumero);

            var status = resultData.d.results[i].Status;

            var sintese = resultData.d.results[i].Title;
            var tipo = resultData.d.results[i].TipoOMP;
            var objetivo = resultData.d.results[i].Objetivo;
            var divisaoImpressora = resultData.d.results[i].DivisaoImpressoras;
            var producao = resultData.d.results[i].CIProducao;
            var assistenciaTecnica = resultData.d.results[i].CIAssistenciaTecnica;
            var observacao = resultData.d.results[i].CIObservacao;
            var descricaoProblema = resultData.d.results[i].DescricaoProblema;
            var solucaoEncontrada = resultData.d.results[i].SolucaoEncontrada;
            var alteracoes = resultData.d.results[i].Alteracoes;
            var documentosAlterados = resultData.d.results[i].DocumentosAlterados;
            var documentosOrigem = resultData.d.results[i].DocumentosOrigem;

            var itemNovo = resultData.d.results[i].siteNovoSPOnline;

            if (itemNovo == "Sim") {

              var responsavelTecnico = resultData.d.results[i].ResponsavelTecnico;
              var responsavelArea = resultData.d.results[i].ResponsavelArea;
              var areaExecutoraFabrica = resultData.d.results[i].AreaExecutoraFabrica;
              var areaExecutoraAT = resultData.d.results[i].txtAreaExecutoraAT;

            } else {

              var responsavelTecnico = resultData.d.results[i].txtResponsavelTecnico;
              var responsavelArea = resultData.d.results[i].txtResponsavelArea;
              var areaExecutoraFabrica = resultData.d.results[i].txtAreaExecutoraFabrica;
              var areaExecutoraAT = resultData.d.results[i].txtAreaExecutoraAT;

            }

            console.log("numero", numero);

            jQuery("#txtNro").html(numero);
            jQuery("#txtStatus").html(status);

            jQuery("#txtSintese").html(sintese);
            jQuery("#txtTipo").html(tipo);
            jQuery("#txtObjetivo").html(objetivo);
            jQuery("#txtDivisaoImpressora").html(divisaoImpressora);
            jQuery("#txtProducao").html(producao);
            jQuery("#txtAssistenciaTecnica").html(assistenciaTecnica);
            jQuery("#txtObservacao").html(observacao);
            jQuery("#txtDescricaoProblema").html(descricaoProblema);
            jQuery("#txtSolucaoEncontrada").html(solucaoEncontrada);
            jQuery("#txtAlteracoes").html(alteracoes);
            jQuery("#txtDocumentosAlterados").html(documentosAlterados);
            jQuery("#txtDocumentosOrigem").html(documentosOrigem);
            jQuery("#txtResponsavelTecnico").html(responsavelTecnico);
            jQuery("#txtResponsavelArea").html(responsavelArea);
            jQuery("#txtAreaExecutoraFabrica").html(areaExecutoraFabrica);
            jQuery("#txtAreaExecutoraAT").html(areaExecutoraAT);




          }

        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactItemsConjuntos = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Conjuntos e Subconjuntos')/items?$top=50&$filter=Conjuntos eq 'Conjunto' and OMP/ID eq ` + _idOMP,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactItemsConjuntos.setState({
          itemsConjuntos: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactItemsSubConjuntos = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Conjuntos e Subconjuntos')/items?$top=50&$filter=Conjuntos eq 'Subconjunto' and OMP/ID eq ` + _idOMP,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactItemsSubConjuntos.setState({
          itemsSubConjuntos: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactItemsPontoCorte = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Ponto de Corte')/items?$top=50&$orderby= Created asc&$select=ID,Title,OMP/ID,PIE/ID,Data&$expand=OMP,PIE&$filter=OMP/ID eq ` + _idOMP,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        console.log("resultData", resultData);
        reactItemsPontoCorte.setState({
          itemsPontoCorte: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactItemsInforAssistenciaTecnica = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Materiais')/items?$top=50&$orderby= Created asc&$select=ID,Title,OMP/ID,PIE/ID,PATS/ID,DataEntrega,Modified,Editor/Title&$expand=OMP,PIE,PATS,Editor&$filter=OMP/ID eq ` + _idOMP,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        console.log("resultData", resultData);
        reactItemsInforAssistenciaTecnica.setState({
          itemsAssistenciaTecnica: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactItemsAprovacoes = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Aprovacoes_BKP02')/items?$top=50&$orderby= Created asc&$select=ID,Title,Atribu_x00ed_da_x0020_a,Status,Data_x0020_de_x0020_Conclus_x00e&$filter=Title eq ` + _documentoNumero,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        console.log("resultData", resultData);
        reactItemsAprovacoes.setState({
          itemsAprovacoes: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });




  }


  protected async getAnexos() {

    var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Ordem de Modificação de Produto')/items('${_idOMP}')/AttachmentFiles`;
    var _url = this.props.siteurl;
    // console.log("url", url);
    $.ajax
      ({
        url: url,
        method: "GET",
        async: false,
        headers:
        {
          // Accept header: Specifies the format for response data from the server.
          "Accept": "application/json;odata=verbose"
        },
        success: async (resultData) => {

          var dataresults = resultData.d.results;

          var reactHandler = this;

          reactHandler.setState({
            itemsListAnexosItem: dataresults
          });

        },
        error: function (xhr, status, error) {
          console.log("Falha anexo");
        }
      }).catch((error: any) => {
        console.log("Erro Anexo do item: ", error);
      });


    ///

    var relativeURL = window.location.pathname;
    var url = window.location.pathname;
    var nomePagina = url.substring(url.lastIndexOf('/') + 1);
    var strRelativeURL = relativeURL.replace(`SitePages/${nomePagina}`, "");

    console.log("strRelativeURL", strRelativeURL);

    await _web.getFolderByServerRelativeUrl(`${strRelativeURL}/Anexos/${_idOMP}`).files.orderBy('TimeLastModified', true)

      .expand('ListItemAllFields', 'Author').get().then(r => {

        console.log("r", r);

        var reactHandler = this;

        reactHandler.setState({
          itemsListAnexos: r
        });

      }).catch((error: any) => {
        console.log("Erro onChangeCliente: ", error);
      });


  }


  protected editar() {
    window.location.href = `OMP-Editar.aspx?DocumentoID=` + _idOMP;
  }

  protected voltar() {
    history.back();
  }

}
