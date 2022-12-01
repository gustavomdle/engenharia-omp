import * as React from 'react';
import styles from './OmpEditarItem.module.scss';
import { IOmpEditarItemProps } from './IOmpEditarItemProps';
import { escape } from '@microsoft/sp-lodash-subset';

import * as jquery from 'jquery';
import * as $ from "jquery";
import * as jQuery from "jquery";
import { sp, IItemAddResult, DateTimeFieldFormatType } from "@pnp/sp/presets/all";
import "bootstrap";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import pnp, { Web } from "sp-pnp-js";
import { allowOverscrollOnElement, DatePicker } from 'office-ui-fabric-react';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { UrlQueryParameterCollection, Version } from '@microsoft/sp-core-library';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");

var _web;
var _caminho;
var _observacao = "";
var _descricaoProblema = "";
var _solucaoEncontrada = "";
var _alteracoes = "";
var _documentosAlterados = "";
var _idOMP;
var _documentoNumero;
var _producao = [];
var _assistenciaTecnica = [];
var _url;
var _pos = 0;
var _pos2 = 0;
var _pastaCriada;

export interface IReactGetItemsState {

  itemsTipo: [],
  itemsObjetivo: [],
  itemsDivisaoImpressora: [],
  itemsProducao: [];
  itemsAssistenciaTecnica: [];
  itemsPontoCorte: [],
  itemsRevisaoAtual: [],
  itemsNovaRevisao: [],
  itemsDisposicaoEstoqueAcao: [],
  itemsDisposicaoFornecedorAcao: [],
  itemsDisposicaoEmTransitoAcao: [],
  itemsAprovadores: [
    {
      "Id": "",
      "Title": "",
    }],
  valorItemsTipo: [],
  valorItemsObjetivo: [],
  valorItemsDivisaoImpressora: [],
  valorItemsAprovadores: [],
  valorResponsavelTecnico: any,
  valorResponsavelArea: any,
  valorAreaExecutoraFabrica: any,
  valorAreaExecutoraAT: any,
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


export default class OmpEditarItem extends React.Component<IOmpEditarItemProps, IReactGetItemsState> {

  public constructor(props: IOmpEditarItemProps, state: IReactGetItemsState) {
    super(props);
    this.state = {

      itemsTipo: [],
      itemsObjetivo: [],
      itemsDivisaoImpressora: [],
      itemsProducao: [],
      itemsAssistenciaTecnica: [],
      itemsPontoCorte: [],
      itemsRevisaoAtual: [],
      itemsNovaRevisao: [],
      itemsDisposicaoEstoqueAcao: [],
      itemsDisposicaoFornecedorAcao: [],
      itemsDisposicaoEmTransitoAcao: [],
      itemsAprovadores: [
        {
          "Id": "",
          "Title": "",
        }],
      valorItemsTipo: [],
      valorItemsObjetivo: [],
      valorItemsDivisaoImpressora: [],
      valorItemsAprovadores: [],
      valorResponsavelTecnico: "",
      valorResponsavelArea: "",
      valorAreaExecutoraFabrica: "",
      valorAreaExecutoraAT: "",
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

    };
  }





  public componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);
    _caminho = this.props.context.pageContext.web.serverRelativeUrl;

    var queryParms = new UrlQueryParameterCollection(window.location.href);
    _idOMP = parseInt(queryParms.getValue("DocumentoID"));

    jQuery("#modalCadastrarConjuntos").modal({ backdrop: 'static', keyboard: false });

    document
      .getElementById("btnValidarSalvar")
      .addEventListener("click", (e: Event) => this.validar("Salvar"));

    document
      .getElementById("btnSalvar")
      .addEventListener("click", (e: Event) => this.editar("Salvar"));

    document
      .getElementById("btnSucesso")
      .addEventListener("click", (e: Event) => this.fecharSucesso());

    document
      .getElementById("btnAbrirModalCadastrarConjuntos")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarConjuntos());

    document
      .getElementById("btnAbrirModaSubConjuntos")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarSubConjuntos());

    document
      .getElementById("btnAbrirModaPontoCorte")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarPontoCorte());

    document
      .getElementById("btnAbrirAssistenciaTecnica")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarAssistenciaTecnica());


    jQuery("#conteudoLoading").html(`<br/><br/><img style="height: 80px; width: 80px" src='${_caminho}/SiteAssets/loading.gif'/>
      <br/>Aguarde....<br/><br/>
      Dependendo do tamanho do anexo e a velocidade<br>
       da Internet essa ação pode demorar um pouco. <br>
       Não fechar a janela!<br/><br/>`);

    this.handler();

  }

  public render(): React.ReactElement<IOmpEditarItemProps> {

    return (


      <><div id="container">

        <div id="accordion">


          <div className="card">
            <div className="card-header btn" id="headingInformacoesProduto" data-toggle="collapse" data-target="#collapseInformacoesProduto" aria-expanded="true" aria-controls="collapseInformacoesProduto">
              <h5 className="mb-0 text-info">
                Informações do produto
              </h5>
            </div>
            <div id="collapseInformacoesProduto" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="txtTitulo">Título</label><span className="required"> *</span>
                      <input type="text" className="form-control" id="txtTitulo" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="ddlTipo">Tipo</label><span className="required"> *</span>
                      <select id="ddlTipo" className="form-control" style={{ "width": "280px" }} value={this.state.valorItemsTipo} onChange={(e) => this.onChangeTipo(e.target.value)}>
                        <option value="0" selected>Selecione...</option>
                        {this.state.itemsTipo.map(function (item, key) {
                          return (
                            <option value={item}>{item}</option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="form-group col-md">
                      <label htmlFor="ddlObjetivo">Objetivo</label><span className="required"> *</span>
                      <select id="ddlObjetivo" className="form-control" style={{ "width": "280px" }} value={this.state.valorItemsObjetivo} onChange={(e) => this.onChangeObjetivo(e.target.value)}>
                        <option value="0" selected>Selecione...</option>
                        {this.state.itemsObjetivo.map(function (item, key) {
                          return (
                            <option value={item}>{item}</option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="form-group col-md">
                      <label htmlFor="ddlDivisaoImpressoras">Divisão de impressoras?</label><span className="required"> *</span>
                      <select id="ddlDivisaoImpressoras" className="form-control" style={{ "width": "280px" }} value={this.state.valorItemsDivisaoImpressora} onChange={(e) => this.onChangeDivisaoImpressora(e.target.value)}>
                        <option value="0" selected>Selecione...</option>
                        {this.state.itemsDivisaoImpressora.map(function (item, key) {
                          return (
                            <option value={item}>{item}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>


          <div className="card">
            <div className="card-header btn" id="headingCriteriosImplantacao" data-toggle="collapse" data-target="#collapseCriteriosImplantacao" aria-expanded="true" aria-controls="collapseCriteriosImplantacao">
              <h5 className="mb-0 text-info">
                Critérios de Implantação
              </h5>
            </div>
            <div id="collapseCriteriosImplantacao" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="checkProducao">Produção</label><span className="required"> *</span>
                      {this.state.itemsProducao.map(function (item, key) {

                        return (

                          <div className="form-check">
                            <input className="form-check-input" name='checkProducao' type="checkbox" defaultChecked={_producao.indexOf(item) !== -1} value={item} />
                            <label className="form-check-label">
                              {item}
                            </label>
                          </div>

                        );
                      })}
                    </div>
                    <div className="form-group col-md">
                      <label htmlFor="checkAssitenciaTecnica">Assistência Técnica</label><span className="required"> *</span>
                      {this.state.itemsAssistenciaTecnica.map(function (item, key) {

                        return (

                          <div className="form-check">
                            <input className="form-check-input" name='checkAssitenciaTecnica' type="checkbox" defaultChecked={_assistenciaTecnica.indexOf(item) !== -1} value={item} />
                            <label className="form-check-label">
                              {item}
                            </label>
                          </div>

                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="txtDadosProposta">Observação</label><span className="required"> *</span>
                  <div id='richTextObservacao'>
                    <RichText className="editorRichTex" value=""
                      onChange={(text) => this.onTextChangeObservacao(text)} />
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingProblemaSolucao" data-toggle="collapse" data-target="#collapseProblemaSolucao" aria-expanded="true" aria-controls="collapseInformacoesProduto">
              <h5 className="mb-0 text-info">
                Problema/Solução
              </h5>
            </div>
            <div id="collapseProblemaSolucao" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <label htmlFor="txtDadosProposta">Descrição do problema</label><span className="required"> *</span>
                  <div id='richTextDescricaoProblema'>
                    <RichText className="editorRichTex" value=""
                      onChange={(text) => this.onTextChangeDescricaoProblema(text)} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="txtDadosProposta">Solução encontrada</label><span className="required"> *</span>
                  <div id='richTextSolucaoEncontrada'>
                    <RichText className="editorRichTex" value=""
                      onChange={(text) => this.onTextChangeSolucaoEncontrada(text)} />
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingAlteracaoEstruturaProduto" data-toggle="collapse" data-target="#collapseAlteracaoEstruturaProduto" aria-expanded="true" aria-controls="collapseInformacoesProduto">
              <h5 className="mb-0 text-info">
                Alterações na estrutura do produto
              </h5>
            </div>
            <div id="collapseAlteracaoEstruturaProduto" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <label htmlFor="txtDadosProposta">Alterações</label><span className="required"> *</span>
                  <div id='richTextAlteracoes'>
                    <RichText className="editorRichTex" value=""
                      onChange={(text) => this.onTextChangeAlteracoes(text)} />
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingDocumentos" data-toggle="collapse" data-target="#collapseDocumentos" aria-expanded="true" aria-controls="collapseInformacoesProduto">
              <h5 className="mb-0 text-info">
                Documentos
              </h5>
            </div>
            <div id="collapseDocumentos" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <label htmlFor="txtDadosProposta">Documentos alterados</label><span className="required"> *</span>
                  <div id='richTextDocumentosAlterados'>
                    <RichText className="editorRichTex" value=""
                      onChange={(text) => this.onTextChangeDocumentosAlterados(text)} />
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="txtDocumentosOrigem">Documentos de origem</label><span className="required"> *</span>
                      <input type="text" className="form-control" id="txtDocumentosOrigem" />
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
                <button id='btnAbrirModalCadastrarConjuntos' className="btn btn-secondary btnCustom btn-sm">Adicionar</button>
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


                    </div>
                      <button id='btnAbrirModaSubConjuntos' className="btn btn-secondary btnCustom btn-sm">Adicionar</button>

                    </>
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
                  <button id='btnAbrirModaPontoCorte' className="btn btn-secondary btnCustom btn-sm">Adicionar</button>
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
                  <button id='btnAbrirAssistenciaTecnica' className="btn btn-secondary btnCustom btn-sm">Adicionar</button>
                </div>
              </div>
            </div>
          </div>


          <div className="card">
            <div className="card-header btn" id="headingAprovadores" data-toggle="collapse" data-target="#collapseAprovadores" aria-expanded="true" aria-controls="collapseAprovadores">
              <h5 className="mb-0 text-info">
                Aprovadores
              </h5>
            </div>
            <div id="collapseAprovadores" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="ddlResponsavelTecnico">Responsável Técnico</label><span className="required"> *</span>

                      <select id="ddlResponsavelTecnico" className="form-control" value={this.state.valorResponsavelTecnico} onChange={(e) => this.onChangeResponsavelTecnico(e.target.value)}>
                        <option value="0" selected>Selecione...</option>
                        {this.state.itemsAprovadores.map(function (item, key) {
                          return (
                            <option value={item.Id}>{item.Title}</option>
                          );
                        })}
                      </select>

                    </div>
                    <div className="form-group col-md">
                      <label htmlFor="ddlResponsavelArea">Responsável da área</label><span className="required"> *</span>

                      <select id="ddlResponsavelArea" className="form-control" value={this.state.valorResponsavelArea} onChange={(e) => this.onChangeResponsavelArea(e.target.value)}>
                        <option value="0" selected>Selecione...</option>
                        {this.state.itemsAprovadores.map(function (item, key) {
                          return (
                            <option value={item.Id}>{item.Title}</option>
                          );
                        })}
                      </select>

                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="ddlAreaExecutoraFabrica">Área executora fábrica</label><span className="required"> *</span>

                      <select id="ddlAreaExecutoraFabrica" className="form-control" value={this.state.valorAreaExecutoraFabrica} onChange={(e) => this.onChangeAreaExecutoraFabrica(e.target.value)}>
                        <option value="0" selected>Selecione...</option>
                        {this.state.itemsAprovadores.map(function (item, key) {
                          return (
                            <option value={item.Id}>{item.Title}</option>
                          );
                        })}
                      </select>

                    </div>
                    <div className="form-group col-md">
                      <label htmlFor="ddlAreaExecutoraAT">Área executora AT</label><span className="required"> *</span>

                      <select id="ddlAreaExecutoraAT" className="form-control" value={this.state.valorAreaExecutoraAT} onChange={(e) => this.onChangeAreaExecutoraAT(e.target.value)}>
                        <option value="0" selected>Selecione...</option>
                        {this.state.itemsAprovadores.map(function (item, key) {
                          return (
                            <option value={item.Id}>{item.Title}</option>
                          );
                        })}
                      </select>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>


          <div className="card">
            <div className="card-header btn" id="headingAnexos" data-toggle="collapse" data-target="#collapseAnexos" aria-expanded="true" aria-controls="collapseAnexos">
              <h6 className="mb-0 text-info" >
                Anexos
              </h6>
            </div>
            <div id="collapseAnexos" className="collapse show" aria-labelledby="headingOne" >

              <div className="card-body">

                <div className="form-group">
                  <div className="form-row ">
                    <div className="form-group col-md" >
                      <label htmlFor="txtTitulo">Anexo </label><span className="required"> *</span><br></br>
                      <input className="multi" data-maxsize="1024" type="file" id="input" multiple />
                    </div>

                  </div>
                  <br />
                  <p className='text-info'>Total máximo permitido: 15 MB</p>

                </div>
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

                          <><a id={txtAnexoItem} target='_blank' data-interception="off" href={caminho} title="">{item.FileName}</a><a style={{ "cursor": "pointer" }} onClick={() => this.excluirAnexoItem(`${item.ServerRelativeUrl}`, `${item.FileName}`, `${txtAnexoItem}`, `${btnExcluirAnexoitem}`)} id={btnExcluirAnexoitem}>&nbsp;Excluir</a><br></br></>


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

                          <><a id={idImagem} target='_blank' data-interception="off" href={caminho} title="">{item.Name}</a><a style={{ "cursor": "pointer" }} onClick={() => this.excluirAnexo(`${strRelativeURL}/Anexos/${_idOMP}`, `${item.Name}`, `${idImagem}`, `${idBotao}`)} id={idBotao}>&nbsp;Excluir</a><br></br></>

                        );



                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <br></br>

          <div className="text-right">
            <button id="btnValidarSalvar" className="btn btn-success">Salvar</button>
          </div>

        </div>


      </div>

        <div className="modal fade" id="modalConfirmarSalvar" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente salvar a OMP?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnSalvar" type="button" className="btn btn-primary">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalCarregando" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div id='conteudoLoading' className='carregando'></div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucesso" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                OMP salva com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucesso" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade " id="modalCadastrarConjuntos" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modalCadastrarConjuntos" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Conjuntos - Cadastrar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Código PIE</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Descrição do código PIE</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Código PATS</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Descricão do código PATS</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Revisão atual</label><span className="required"> *</span><br></br>
                    <select id="ddlRevisaoAtual" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsRevisaoAtual.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Versão Atual</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">CS Atual</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Nova revisão</label><span className="required"> *</span><br></br>
                    <select id="ddlRevisaoAtual" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsNovaRevisao.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Versão Nova Revisão</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">CS Nova revisão</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Disposição - Estoque</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Disposição - Estoque (Ação)</label><span className="required"> *</span><br></br>
                    <select id="ddlRevisaoAtual" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsDisposicaoEstoqueAcao.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Disposicão - Fornecedor</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Disposicão - Fornecedor (Ação)</label><span className="required"> *</span><br></br>
                    <select id="ddlRevisaoAtual" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsDisposicaoFornecedorAcao.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Disposicão - Em trânsito</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Disposicão - Em trânsito (Ação)</label><span className="required"> *</span><br></br>
                    <select id="ddlRevisaoAtual" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsDisposicaoEmTransitoAcao.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Histórico de alteracões</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Ponto de Corte</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarSetupBIOS" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalCadastrarSubConjuntos" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Sub-conjuntos - Cadastrar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Itens</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarSetupBIOS" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalCadastrarPontoCorte" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Ponto de corte - Cadastrar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Itens</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarSetupBIOS" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalCadastrarAssistenciaTecnica" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Assistência Técnica - Cadastrar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtItensSetupBIOSCadastrar">Itens</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtItensSetupBIOSCadastrar" />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarSetupBIOS" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>


      </>


    );


  }


  protected async handler() {

    var reactTipo = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Ordem de Modificação de Produto')/fields?$filter=EntityPropertyName eq 'TipoOMP'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactTipo.setState({
          itemsTipo: resultData.d.results[0].Choices.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactObjetivo = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Ordem de Modificação de Produto')/fields?$filter=EntityPropertyName eq 'Objetivo'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactObjetivo.setState({
          itemsObjetivo: resultData.d.results[0].Choices.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactDivisaoImpressora = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Ordem de Modificação de Produto')/fields?$filter=EntityPropertyName eq 'DivisaoImpressoras'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactDivisaoImpressora.setState({
          itemsDivisaoImpressora: resultData.d.results[0].Choices.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactHandlerProducao = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Ordem de Modificação de Produto')/fields?$filter=EntityPropertyName eq 'CIProducao'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactHandlerProducao.setState({
          itemsProducao: resultData.d.results[0].Choices.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactHandlerAssistenciaTecnica = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Ordem de Modificação de Produto')/fields?$filter=EntityPropertyName eq 'CIAssistenciaTecnica'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactHandlerAssistenciaTecnica.setState({
          itemsAssistenciaTecnica: resultData.d.results[0].Choices.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactRevisaoAtual = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Conjuntos e Subconjuntos')/fields?$filter=EntityPropertyName eq 'Atual'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        console.log("resultData atual", resultData);

        reactRevisaoAtual.setState({
          itemsRevisaoAtual: resultData.d.results[0].Choices.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactNovaRevisao = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Conjuntos e Subconjuntos')/fields?$filter=EntityPropertyName eq 'Nova'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        console.log("resultData atual", resultData);

        reactNovaRevisao.setState({
          itemsNovaRevisao: resultData.d.results[0].Choices.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactDisposicaoEstoqueAcao = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Conjuntos e Subconjuntos')/fields?$filter=EntityPropertyName eq 'DisposicaoEstoqueEscolha'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        console.log("resultData atual", resultData);

        reactDisposicaoEstoqueAcao.setState({
          itemsDisposicaoEstoqueAcao: resultData.d.results[0].Choices.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactDisposicaoFornecedorAcao = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Conjuntos e Subconjuntos')/fields?$filter=EntityPropertyName eq 'DisposicaoFornecedorEscolha'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        console.log("resultData atual", resultData);

        reactDisposicaoFornecedorAcao.setState({
          itemsDisposicaoFornecedorAcao: resultData.d.results[0].Choices.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactDisposicaoEmTransitoAcao = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/GetByTitle('Conjuntos e Subconjuntos')/fields?$filter=EntityPropertyName eq 'DisposicaoEmtransitoEscolha'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        console.log("resultData atual", resultData);

        reactDisposicaoEmTransitoAcao.setState({
          itemsDisposicaoEmTransitoAcao: resultData.d.results[0].Choices.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });



    var reactHandlerAprovadores = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/Web/SiteGroups/GetByName('OMP - Aprovadores')/users`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        console.log("result Aprovadores", resultData);
        reactHandlerAprovadores.setState({

          itemsAprovadores: resultData.d.results

        });
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




    this.getOMP();
    this.getAnexos();

  }

  protected getOMP() {

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Ordem de Modificação de Produto')/items?$top=4999&$orderby= ID desc&$select=ID,Title,Numero,TipoOMP,Objetivo,Status,Created,Author/Title,DivisaoImpressoras,CIProducao,CIAssistenciaTecnica,CIObservacao,DescricaoProblema,SolucaoEncontrada,Alteracoes,DocumentosAlterados,DocumentosOrigem,ResponsavelTecnico/ID,ResponsavelTecnico/Title,ResponsavelArea/ID,ResponsavelArea/Title,AreaExecutoraFabrica/ID,AreaExecutoraFabrica/Title,AreaExecutoraAT/ID,AreaExecutoraAT/Title,siteNovoSPOnline,txtResponsavelTecnico,txtResponsavelArea,txtAreaExecutoraFabrica,txtAreaExecutoraAT,PastaCriada&$expand=Author,ResponsavelTecnico,ResponsavelArea,AreaExecutoraFabrica,AreaExecutoraAT&$filter=ID eq ` + _idOMP,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: async (resultData) => {

        console.log("resultData", resultData);

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var numero = resultData.d.results[i].Numero;
            _documentoNumero = numero;

            console.log("_documentoNumero", _documentoNumero);

            var sintese = resultData.d.results[i].Title;
            var tipo = resultData.d.results[i].TipoOMP;
            var objetivo = resultData.d.results[i].Objetivo;
            var divisaoImpressora = resultData.d.results[i].DivisaoImpressoras;
            var documentosOrigem = resultData.d.results[i].DocumentosOrigem;
            _pastaCriada = resultData.d.results[i].PastaCriada;

            console.log("_pastaCriada", _pastaCriada);

            var itemNovo = resultData.d.results[i].siteNovoSPOnline;

            console.log("itemNovo", itemNovo);

            var responsavelArea = "";
            var responsavelTecnico = "";
            var areaExecutoraFabrica = "";
            var areaExecutoraAT = "";

            if (itemNovo == "Sim") {

              responsavelArea = resultData.d.results[i].ResponsavelArea.ID;
              responsavelTecnico = resultData.d.results[i].ResponsavelTecnico.ID;
              areaExecutoraFabrica = resultData.d.results[i].AreaExecutoraFabrica.ID;
              areaExecutoraAT = resultData.d.results[i].AreaExecutoraAT.ID;

            } else {

              responsavelArea = "0";
              responsavelTecnico = "0";
              areaExecutoraFabrica = "0";
              areaExecutoraAT = "0";

            }

            console.log("responsavelArea", responsavelArea);

            this.setState({
              valorItemsTipo: tipo,
              valorItemsObjetivo: objetivo,
              valorItemsDivisaoImpressora: divisaoImpressora,
              valorResponsavelTecnico: responsavelTecnico,
              valorResponsavelArea: responsavelArea,
              valorAreaExecutoraFabrica: areaExecutoraFabrica,
              valorAreaExecutoraAT: areaExecutoraAT,
            });


            if (resultData.d.results[i].CIProducao != null) {

              var arrProducao = resultData.d.results[i].CIProducao.results;
              _producao = arrProducao;

            }

            if (resultData.d.results[i].CIAssistenciaTecnica != null) {

              var arrAssistenciaTecnica = resultData.d.results[i].CIAssistenciaTecnica.results;
              _assistenciaTecnica = arrAssistenciaTecnica;

            }


            var observacoes = resultData.d.results[i].CIObservacao;
            var txtObservacoes = "";

            if (observacoes != null) {

              txtObservacoes = observacoes.replace(/<[\/]{0,1}(div)[^><]*>/g, "");
              console.log("txtObservacoes", txtObservacoes);

              if (txtObservacoes.includes("<font")) {

                txtObservacoes = txtObservacoes.replace("font", "span");
                txtObservacoes = txtObservacoes.replace("font", "span");

              }

              if (txtObservacoes.includes("color")) {

                txtObservacoes = txtObservacoes.replace('color="', 'style="color:');

              }

              txtObservacoes = txtObservacoes.trim();

            }

            jQuery('#richTextObservacao').find('.ql-editor').html(`${txtObservacoes}`);





            var descricaoProblema = resultData.d.results[i].DescricaoProblema;
            var txtDescricaoProblema = "";

            if (descricaoProblema != null) {

              txtDescricaoProblema = descricaoProblema.replace(/<[\/]{0,1}(div)[^><]*>/g, "");
              console.log("txtDescricaoProblema", txtDescricaoProblema);

              if (txtDescricaoProblema.includes("<font")) {

                txtDescricaoProblema = txtDescricaoProblema.replace("font", "span");
                txtDescricaoProblema = txtDescricaoProblema.replace("font", "span");

              }

              if (txtDescricaoProblema.includes("color")) {

                txtDescricaoProblema = txtDescricaoProblema.replace('color="', 'style="color:');

              }

              txtDescricaoProblema = txtDescricaoProblema.trim();

            }

            jQuery('#richTextDescricaoProblema').find('.ql-editor').html(`${txtDescricaoProblema}`);



            var solucaoEncontrada = resultData.d.results[i].SolucaoEncontrada;
            var txtSolucaoEncontrada = "";

            if (solucaoEncontrada != null) {

              txtSolucaoEncontrada = solucaoEncontrada.replace(/<[\/]{0,1}(div)[^><]*>/g, "");
              console.log("txtSolucaoEncontrada", txtSolucaoEncontrada);

              if (txtSolucaoEncontrada.includes("<font")) {

                txtSolucaoEncontrada = txtSolucaoEncontrada.replace("font", "span");
                txtSolucaoEncontrada = txtSolucaoEncontrada.replace("font", "span");

              }

              if (txtSolucaoEncontrada.includes("color")) {

                txtSolucaoEncontrada = txtSolucaoEncontrada.replace('color="', 'style="color:');

              }

              txtSolucaoEncontrada = txtSolucaoEncontrada.trim();

            }

            jQuery('#richTextSolucaoEncontrada').find('.ql-editor').html(`${txtSolucaoEncontrada}`);



            var alteracoes = resultData.d.results[i].SolucaoEncontrada;
            var txtAlteracoes = "";

            if (alteracoes != null) {

              txtAlteracoes = alteracoes.replace(/<[\/]{0,1}(div)[^><]*>/g, "");
              console.log("txtAlteracoes", txtAlteracoes);

              if (txtAlteracoes.includes("<font")) {

                txtAlteracoes = txtAlteracoes.replace("font", "span");
                txtAlteracoes = txtAlteracoes.replace("font", "span");

              }

              if (txtAlteracoes.includes("color")) {

                txtAlteracoes = txtAlteracoes.replace('color="', 'style="color:');

              }

              txtAlteracoes = txtAlteracoes.trim();

            }

            jQuery('#richTextAlteracoes').find('.ql-editor').html(`${txtAlteracoes}`);


            var documentosAlterados = resultData.d.results[i].SolucaoEncontrada;
            var txtDocumentosAlterados = "";

            if (documentosAlterados != null) {

              txtDocumentosAlterados = documentosAlterados.replace(/<[\/]{0,1}(div)[^><]*>/g, "");
              console.log("txtDocumentosAlterados", txtDocumentosAlterados);

              if (txtDocumentosAlterados.includes("<font")) {

                txtDocumentosAlterados = txtDocumentosAlterados.replace("font", "span");
                txtDocumentosAlterados = txtDocumentosAlterados.replace("font", "span");

              }

              if (txtDocumentosAlterados.includes("color")) {

                txtDocumentosAlterados = txtDocumentosAlterados.replace('color="', 'style="color:');

              }

              txtDocumentosAlterados = txtDocumentosAlterados.trim();

            }

            jQuery('#richTextDocumentosAlterados').find('.ql-editor').html(`${txtDocumentosAlterados}`);

            ////////////////
            var status = resultData.d.results[i].Status;

            console.log("sintese", sintese);

            jQuery("#txtTitulo").val(sintese);
            jQuery("#txtDocumentosOrigem").val(documentosOrigem);


          }

        }
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


  async excluirAnexoItem(ServerRelativeUr, name, elemento, elemento2) {

    if (confirm("Deseja realmente excluir o arquivo " + name + "?") == true) {

      var relativeURL = window.location.pathname;
      var url = window.location.pathname;
      var nomePagina = url.substring(url.lastIndexOf('/') + 1);
      var strRelativeURL = relativeURL.replace(`SitePages/${nomePagina}`, "");

      await _web.getFolderByServerRelativeUrl(`${strRelativeURL}/Lists/Cartas de Baixa/Attachments/${_idOMP}`).files.getByName(name).delete()
        .then(async response => {
          jQuery(`#${elemento}`).hide();
          jQuery(`#${elemento2}`).hide();
          alert("Arquivo excluido com sucesso.");
        }).catch(console.error());

    } else {
      return false;
    }
  }

  async excluirAnexo(ServerRelativeUr, name, elemento, elemento2) {


    if (confirm("Deseja realmente excluir o arquivo " + name + "?") == true) {

      //  console.log("ServerRelativeUr", ServerRelativeUr);
      //  console.log("name", name);
      await _web.getFolderByServerRelativeUrl(ServerRelativeUr).files.getByName(name).delete()
        .then(async response => {
          jQuery(`#${elemento}`).hide();
          jQuery(`#${elemento2}`).hide();
          alert("Arquivo excluido com sucesso.");
        }).catch(console.error());

    } else {
      return false;
    }

  }


  protected async validar(opcao) {

    var titulo = $("#txtTitulo").val();
    var tipo = $("#ddlTipo").val();
    var objetivo = $("#ddlObjetivo").val();
    var divisaoImpressoras = $("#ddlDivisaoImpressoras").val();
    var observacao = _observacao;
    var descricaoProblema = _descricaoProblema;
    var solucaoEncontrada = _solucaoEncontrada;
    var alteracoes = _alteracoes;
    var documentosAlterados = _documentosAlterados;
    var documentosOrigem = $("#txtDocumentosOrigem").val();;

    var responsavelTecnico = $("#ddlResponsavelTecnico").val();
    var responsavelArea = $("#ddlResponsavelArea").val();
    var areaExecutoraFabrica = $("#ddlAreaExecutoraFabrica").val();
    var areaExecutoraAT = $("#ddlAreaExecutoraAT").val();

    var arrProducao = [];
    $.each($("input[name='checkProducao']:checked"), function () {
      arrProducao.push($(this).val());
    });

    var arrAssistenciaTecnica = [];
    $.each($("input[name='checkAssitenciaTecnica']:checked"), function () {
      arrAssistenciaTecnica.push($(this).val());
    });

    if (titulo == "") {
      alert("Forneça o título!");
      document.getElementById('headingInformacoesProduto').scrollIntoView();
      return false;
    }

    if (tipo == 0) {
      alert("Escolha o tipo de OMP!");
      document.getElementById('headingInformacoesProduto').scrollIntoView();
      return false;
    }

    if (objetivo == 0) {
      alert("Escolha o objetivo!");
      document.getElementById('headingInformacoesProduto').scrollIntoView();
      return false;
    }

    if (divisaoImpressoras == 0) {
      alert("Escolha se possui divisão de impressoras!");
      document.getElementById('headingInformacoesProduto').scrollIntoView();
      return false;
    }

    if (arrProducao.length == 0) {
      alert("Escolha pelo menos uma opção para Produção!");
      document.getElementById('headingCriteriosImplantacao').scrollIntoView();
      return false;
    }

    if (arrProducao.length == 0) {
      alert("Escolha pelo menos uma opção para Produção!");
      document.getElementById('headingCriteriosImplantacao').scrollIntoView();
      return false;
    }

    if (arrAssistenciaTecnica.length == 0) {
      alert("Escolha pelo menos uma opção para Assistência Técnica!");
      document.getElementById('headingCriteriosImplantacao').scrollIntoView();
      return false;
    }


    if ((observacao == "") || (observacao == "<p><br></p>")) {
      alert("Forneça uma observação!");
      document.getElementById('headingCriteriosImplantacao').scrollIntoView();
      return false;
    }


    if ((descricaoProblema == "") || (descricaoProblema == "<p><br></p>")) {
      alert("Forneça uma descrição para o problema!");
      document.getElementById('headingProblemaSolucao').scrollIntoView();
      return false;
    }

    if ((solucaoEncontrada == "") || (solucaoEncontrada == "<p><br></p>")) {
      alert("Forneça a solução encontrada!");
      document.getElementById('headingProblemaSolucao').scrollIntoView();
      return false;
    }

    if ((alteracoes == "") || (alteracoes == "<p><br></p>")) {
      alert("Forneça as alterações!");
      document.getElementById('headingAlteracaoEstruturaProduto').scrollIntoView();
      return false;
    }

    if ((documentosAlterados == "") || (documentosAlterados == "<p><br></p>")) {
      alert("Forneça os documentos alterados!");
      document.getElementById('headingDocumentos').scrollIntoView();
      return false;
    }

    if (documentosOrigem == "") {
      alert("Forneça o documento de origem!");
      document.getElementById('headingDocumentos').scrollIntoView();
      return false;
    }


    if (responsavelTecnico == 0) {
      alert("Forneça o responsável técnico!");
      document.getElementById('headingAprovadores').scrollIntoView();
      return false;
    }

    if (responsavelArea == 0) {
      alert("Forneça o Responsável da Área!");
      document.getElementById('headingAprovadores').scrollIntoView();
      return false;
    }

    if (areaExecutoraFabrica == 0) {
      alert("Forneça o Responsável da Fábrica!");
      document.getElementById('headingAprovadores').scrollIntoView();
      return false;
    }

    if (areaExecutoraAT == 0) {
      alert("Forneça a Área Executora AT!");
      document.getElementById('headingAprovadores').scrollIntoView();
      return false;
    }


    if (opcao == "Salvar") {
      jQuery("#modalConfirmarSalvar").modal({ backdrop: 'static', keyboard: false });
    }

    else if (opcao == "Salvar") {
      jQuery("#modalConfirmarSalvar").modal({ backdrop: 'static', keyboard: false });
    }


  }

  protected async editar(opcao) {

    jQuery("#modalConfirmarSalvar").modal('hide');
    jQuery("#modalCarregando").modal({ backdrop: 'static', keyboard: false });

    var titulo = $("#txtTitulo").val();
    var tipo = $("#ddlTipo").val();
    var objetivo = $("#ddlObjetivo").val();
    var divisaoImpressoras = $("#ddlDivisaoImpressoras").val();
    var observacao = _observacao;
    var descricaoProblema = _descricaoProblema;
    var solucaoEncontrada = _solucaoEncontrada;
    var alteracoes = _alteracoes;
    var documentosAlterados = _documentosAlterados;
    var documentosOrigem = $("#txtDocumentosOrigem").val();

    var responsavelTecnico = $("#ddlResponsavelTecnico").val();
    var responsavelArea = $("#ddlResponsavelArea").val();
    var areaExecutoraFabrica = $("#ddlAreaExecutoraFabrica").val();
    var areaExecutoraAT = $("#ddlAreaExecutoraAT").val();

    var arrProducao = [];
    $.each($("input[name='checkProducao']:checked"), function () {
      arrProducao.push($(this).val());
    });

    var arrAssistenciaTecnica = [];
    $.each($("input[name='checkAssitenciaTecnica']:checked"), function () {
      arrAssistenciaTecnica.push($(this).val());
    });

    console.log("titulo", titulo);
    console.log("tipo", tipo);
    console.log("objetivo", objetivo);
    console.log("divisaoImpressoras", divisaoImpressoras);
    console.log("arrProducao", arrProducao);
    console.log("arrAssistenciaTecnica", arrAssistenciaTecnica);
    console.log("observacao", observacao);
    console.log("descricaoProblema", descricaoProblema);
    console.log("solucaoEncontrada", solucaoEncontrada);
    console.log("alteracoes", alteracoes);
    console.log("documentosAlterados", documentosAlterados);
    console.log("documentosOrigem", documentosOrigem);
    console.log("responsavelTecnico", responsavelTecnico);
    console.log("responsavelArea", responsavelArea);
    console.log("areaExecutoraFabrica", areaExecutoraFabrica);
    console.log("areaExecutoraAT", areaExecutoraAT);

    await _web.lists
      .getByTitle("Ordem de Modificação de Produto")
      .items.getById(_idOMP).update({
        Title: titulo,
        TipoOMP: tipo,
        Objetivo: objetivo,
        DivisaoImpressoras: divisaoImpressoras,
        CIProducao: { "results": arrProducao },
        CIAssistenciaTecnica: { "results": arrAssistenciaTecnica },
        CIObservacao: observacao,
        DescricaoProblema: descricaoProblema,
        SolucaoEncontrada: solucaoEncontrada,
        Alteracoes: alteracoes,
        DocumentosAlterados: documentosAlterados,
        DocumentosOrigem: documentosOrigem,
        ResponsavelTecnicoId: responsavelTecnico,
        ResponsavelAreaId: responsavelArea,
        AreaExecutoraFabricaId: areaExecutoraFabrica,
        AreaExecutoraATId: areaExecutoraAT,

      })
      .then(async response => {

        this.upload(opcao);

      }).catch(err => {
        console.log("err", err);
      });


  }


  protected upload(opcao) {

    console.log("Entrou no upload");

    var files = (document.querySelector("#input") as HTMLInputElement).files;
    var file = files[0];

    //console.log("files.length", files.length);

    if (files.length != 0) {

      console.log("entrou com arquivo");

      if (_pastaCriada != "Sim") {

        _web.lists.getByTitle("Anexos").rootFolder.folders.add(`${_idOMP}`).then(async data => {

          await _web.lists
            .getByTitle("Ordem de Modificação de Produto")
            .items.getById(_idOMP).update({
              PastaCriada: "Sim",
            })
            .then(async response => {

              for (var i = 0; i < files.length; i++) {

                var nomeArquivo = files[i].name;
                var rplNomeArquivo = nomeArquivo.replace(/[^0123456789.,a-zA-Z]/g, '');

                //alert(rplNomeArquivo);
                //Upload a file to the SharePoint Library
                _web.getFolderByServerRelativeUrl(`${_caminho}/Anexos/${_idOMP}`)
                  //.files.add(files[i].name, files[i], true)
                  .files.add(rplNomeArquivo, files[i], true)
                  .then(async data => {

                    data.file.getItem().then(async item => {
                      var idAnexo = item.ID;

                      if (i == files.length) {
                        console.log("anexou:" + rplNomeArquivo);

                        if (opcao == "Salvar") {

                          $("#modalCarregando").modal('hide');
                          jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });

                        }

                      }

                    })
                  });
              }


            }).catch(err => {
              console.log("err", err);
            });



        }).catch(err => {
          console.log("err", err);
        });

      } else {

        for (var i = 0; i < files.length; i++) {

          var nomeArquivo = files[i].name;
          var rplNomeArquivo = nomeArquivo.replace(/[^0123456789.,a-zA-Z]/g, '');

          //alert(rplNomeArquivo);
          //Upload a file to the SharePoint Library
          _web.getFolderByServerRelativeUrl(`${_caminho}/Anexos/${_idOMP}`)
            //.files.add(files[i].name, files[i], true)
            .files.add(rplNomeArquivo, files[i], true)
            .then(async data => {

              data.file.getItem().then(async item => {
                var idAnexo = item.ID;

                if (i == files.length) {
                  console.log("anexou:" + rplNomeArquivo);

                  if (opcao == "Salvar") {
                    $("#modalCarregando").modal('hide');
                    jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });
                  }


                }

              })
            });
        }

      }

    } else {

      console.log("entrou sem arquivo");

      if (_pastaCriada != "Sim") {

        _web.lists.getByTitle("Anexos").rootFolder.folders.add(`${_idOMP}`).then(async data => {

          await _web.lists
            .getByTitle("Ordem de Modificação de Produto")
            .items.getById(_idOMP).update({
              PastaCriada: "Sim",
            })
            .then(async response => {

              if (opcao == "Salvar") {

                $("#modalCarregando").modal('hide');
                jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });

              }

            }).catch(err => {
              console.log("err", err);
            });

        }).catch(err => {
          console.log("err", err);
        });

      } else {

        if (opcao == "Salvar") {

          $("#modalCarregando").modal('hide');
          jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });


        }

      }

    }

  }

  private onTextChangeObservacao = (newText: string) => {
    _observacao = newText;
    return newText;
  }

  private onTextChangeDescricaoProblema = (newText: string) => {
    _descricaoProblema = newText;
    return newText;
  }

  private onTextChangeSolucaoEncontrada = (newText: string) => {
    _solucaoEncontrada = newText;
    return newText;
  }

  private onTextChangeAlteracoes = (newText: string) => {
    _alteracoes = newText;
    return newText;
  }

  private onTextChangeDocumentosAlterados = (newText: string) => {
    _documentosAlterados = newText;
    return newText;
  }

  private onChangeTipo = (val) => {
    this.setState({
      valorItemsTipo: val,
    });
  }

  private onChangeObjetivo = (val) => {
    this.setState({
      valorItemsObjetivo: val,
    });
  }

  private onChangeDivisaoImpressora = (val) => {
    this.setState({
      valorItemsDivisaoImpressora: val,
    });
  }

  private onChangeResponsavelTecnico = (val) => {
    this.setState({
      valorResponsavelTecnico: val,
    });
  }


  private onChangeResponsavelArea = (val) => {
    this.setState({
      valorResponsavelArea: val,
    });
  }


  private onChangeAreaExecutoraFabrica = (val) => {
    this.setState({
      valorAreaExecutoraFabrica: val,
    });
  }


  private onChangeAreaExecutoraAT = (val) => {
    this.setState({
      valorAreaExecutoraAT: val,
    });
  }

  protected async fecharSucesso() {

    jQuery("#modalSucesso").modal('hide');
    window.location.href = `OMP-Editar.aspx?DocumentoID=` + _idOMP;

  }

  protected abrirModalCadastrarConjuntos() {

    // jQuery("#txtItensSetupBIOSCadastrar").val("");
    //  jQuery('#RichTextObservacaoSetupBIOSCadastrar').find('.ql-editor').html("<p><br></p>");
    jQuery("#modalCadastrarConjuntos").modal({ backdrop: 'static', keyboard: false });

  }

  protected abrirModalCadastrarSubConjuntos() {

    //  jQuery("#txtItensSetupBIOSCadastrar").val("");
    //  jQuery('#RichTextObservacaoSetupBIOSCadastrar').find('.ql-editor').html("<p><br></p>");
    jQuery("#modalCadastrarSubConjuntos").modal({ backdrop: 'static', keyboard: false });

  }

  protected abrirModalCadastrarPontoCorte() {

    //   jQuery("#txtItensSetupBIOSCadastrar").val("");
    //  jQuery('#RichTextObservacaoSetupBIOSCadastrar').find('.ql-editor').html("<p><br></p>");
    jQuery("#modalCadastrarPontoCorte").modal({ backdrop: 'static', keyboard: false });

  }

  protected abrirModalCadastrarAssistenciaTecnica() {

    //  jQuery("#txtItensSetupBIOSCadastrar").val("");
    //  jQuery('#RichTextObservacaoSetupBIOSCadastrar').find('.ql-editor').html("<p><br></p>");
    jQuery("#modalCadastrarAssistenciaTecnica").modal({ backdrop: 'static', keyboard: false });

  }


}
