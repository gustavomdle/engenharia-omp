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
var _temAnexo = false;
var _temConjunto = false;
var _temSubConjunto = false;
var _temPontoCorte = false;
var _temAssistenciaTecnica = false;
var _temBITRelacionado = false;
var _temAprovacoes = false;
var _itemNovo = false;
var _idTarefa;
var _userId;
var _grupos = [];
var _idTarefaAlterar;
var _areaTarefaAlterar;
var _valorAprovadores;
var _valorAprovadoresAntigo;

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
  itemsAprovacoesBKP: [],
  itemsAprovacoes: [],
  itemsListaBITRelacionado: [],
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
  itemsAprovadores: [
    {
      "Id": any,
      "Title": any,
    }],
  valorAprovadores: any,

}


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
      itemsAprovacoesBKP: [],
      itemsAprovacoes: [],
      itemsListaBITRelacionado: [],
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
      itemsAprovadores: [
        {
          "Id": "",
          "Title": "",
        }],
      valorAprovadores: "",
    }

  }

  public async componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);
    var queryParms = new UrlQueryParameterCollection(window.location.href);
    _idOMP = parseInt(queryParms.getValue("DocumentoID"));
    _documentoNumero = parseInt(queryParms.getValue("DocumentoNumero"));

    await _web.currentUser.get().then(f => {
      // console.log("user", f);
      _userId = f.Id;

      console.log("_userId 1", _userId);

    })

    jQuery(`#conteudo_Anexo`).hide();
    jQuery(`#conteudo_SemAnexo`).hide();
    jQuery(`#conteudo_Conjunto`).hide();
    jQuery(`#conteudo_SemConjunto`).hide();
    jQuery(`#conteudo_SubConjunto`).hide();
    jQuery(`#conteudo_SemSubConjunto`).hide();
    jQuery(`#tabelaPontoCorte`).hide();
    jQuery(`#conteudo_SemPontoCorte`).hide();
    jQuery(`#tabelaAssistenciaTecnica`).hide();
    jQuery(`#conteudo_SemAssistenciaTecnica`).hide();
    jQuery(`#tabelaBITRelacionado`).hide();
    jQuery(`#conteudo_SemBITRelacionado`).hide();
    jQuery(`#tabelaAprovacoesBKP`).hide();
    jQuery(`#tabelaAprovacoes`).hide();
    jQuery(`#conteudo_SemAprovacoes`).hide();

    jQuery("#btnConfirmarFechar").hide();
    jQuery("#btnEditar").hide();

    document
      .getElementById("btnEditar")
      .addEventListener("click", (e: Event) => this.editar());

    document
      .getElementById("btnAlterarAprovador")
      .addEventListener("click", (e: Event) => this.alterarAprovador());

    document
      .getElementById("btnAprovarTarefar")
      .addEventListener("click", (e: Event) => this.aprovarTarefa());

    document
      .getElementById("btnConfirmarFechar")
      .addEventListener("click", (e: Event) => this.confirmarFechar());

    document
      .getElementById("btnFechar")
      .addEventListener("click", (e: Event) => this.fechar());

    document
      .getElementById("btnSucessoAprovarTarefa")
      .addEventListener("click", (e: Event) => this.sucessoAprovarTarefa());

    document
      .getElementById("btnSucessoAprovarTarefaAguardarFechamento")
      .addEventListener("click", (e: Event) => this.sucessoRedirecionar());

    document
      .getElementById("btnSucessoFechar")
      .addEventListener("click", (e: Event) => this.sucessoRedirecionar());

    document
      .getElementById("btnVoltar")
      .addEventListener("click", (e: Event) => this.voltar());

    document
      .getElementById("btnSucessoAlterarAprovador")
      .addEventListener("click", (e: Event) => this.sucessoAlterarAprovador());


    await _web.currentUser.get().then(f => {
      // console.log("user", f);
      var id = f.Id;

      var grupos = [];

      jQuery.ajax({
        url: `${this.props.siteurl}/_api/web/GetUserById(${id})/Groups`,
        type: "GET",
        headers: { 'Accept': 'application/json; odata=verbose;' },
        async: false,
        success: async function (resultData) {

          //console.log("resultDataGrupo", resultData);

          if (resultData.d.results.length > 0) {

            for (var i = 0; i < resultData.d.results.length; i++) {

              grupos.push(resultData.d.results[i].Title);

            }

          }

        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText);
        }

      })

      //console.log("grupos", grupos);
      _grupos = grupos;

    })

    this.handler();
    this.getAnexos();

  }



  public render(): React.ReactElement<IOmpDetalhesProps> {

    const tablecolumnsPontoCorte = [
      {
        dataField: "PIE.PIE",
        text: "Código PIE",
        classes: 'text-center',
        headerClasses: 'text-center',
        headerStyle: { "backgroundColor": "#bee5eb" },
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
          var dtdata = ("0" + data.getDate()).slice(-2) + '/' + ("0" + (data.getMonth() + 1)).slice(-2) + '/' + data.getFullYear().toString();
          return dtdata;
        }
      },
      {
        dataField: "Modified",
        text: "Data de modificação",
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

    const tablecolumnsAssistenciaTecnica = [
      {
        dataField: "PIE.PIE",
        text: "Código PIE",
        classes: 'text-center',
        headerClasses: 'text-center',
        headerStyle: { backgroundColor: '#bee5eb' },
        formatter: (rowContent, row) => {

          console.log("row PIE.PIE 2", row.PIE.PIE);

          var pie = row.PIE.PIE;
          console.log("pie", pie);
          var valor = "";
          if (pie != 0) valor = pie;
          return valor;
        }
      },
      {
        dataField: "PATS.PATS",
        text: "Código PATS",
        classes: 'text-center',
        headerClasses: 'text-center',
        headerStyle: { backgroundColor: '#bee5eb' },
        formatter: (rowContent, row) => {
          var pats = row.PATS.PATS;
          console.log("PATS", pats);
          var valor = "";
          if (pats != 0) valor = pats;
          return valor;
        }
      },
      {
        dataField: "Title",
        text: "Observação",
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
          var dtdata = ("0" + data.getDate()).slice(-2) + '/' + ("0" + (data.getMonth() + 1)).slice(-2) + '/' + data.getFullYear().toString();
          return dtdata;
        }
      },
      {
        dataField: "Modified",
        text: "Data de modificação",
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

    const tablecolumnsAprovacoesBKP = [
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

    const tablecolumnsAprovacoes = [
      {
        dataField: "Title",
        text: "Título",
        headerClasses: 'text-center',
        headerStyle: { backgroundColor: '#bee5eb' },
      },
      {
        dataField: "AssignedTo.Title",
        text: "Atribuido a",
        classes: 'text-center',
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
        dataField: "DueDate",
        text: "Data de Conclusão",
        headerClasses: 'text-center',
        headerStyle: { backgroundColor: '#bee5eb' },
        classes: 'text-center',
        formatter: (rowContent, row) => {
          var data = new Date(row.DueDate);
          var dtdata = ("0" + data.getDate()).slice(-2) + '/' + ("0" + (data.getMonth() + 1)).slice(-2) + '/' + data.getFullYear().toString().substr(-2) + ' ' + ("0" + (data.getHours())).slice(-2) + ':' + ("0" + (data.getMinutes())).slice(-2);
          return dtdata;
        }
      },
      {
        dataField: "",
        text: "",
        headerStyle: { "backgroundColor": "#bee5eb", "width": "95px" },
        headerClasses: 'text-center',
        formatter: (rowContent, row) => {

          var id = row.ID;
          var titulo = row.Title;
          var status = row.Status;
          var atribuidoA = row.AssignedTo.ID;

          console.log("_userId 2", _userId);
          console.log("atribuidoA", atribuidoA);

          if (status == "Em Andamento") {

            if (_userId == atribuidoA) {

              if (_grupos.indexOf("OMP - Gerenciar aprovadores") !== -1) {

                return (

                  <><button onClick={() => this.abrirModalAlterarAprovador(id, atribuidoA, titulo)} type="button" className="btn btn-secondary btn-sm btnCustom">Alterar</button><br></br>
                    <button onClick={() => this.confirmarAprovarTarefa(id)} type="button" className="btn btn-success btn-sm btnCustom">Aprovar</button></>

                )

              } else {

                return (
                  <button onClick={() => this.confirmarAprovarTarefa(id)} type="button" className="btn btn-success btn-sm">Aprovar</button>
                )

              }

            } else {

              if (_grupos.indexOf("OMP - Gerenciar aprovadores") !== -1) {

                return (

                  <button onClick={() => this.abrirModalAlterarAprovador(id, atribuidoA, titulo)} type="button" className="btn btn-secondary btn-sm">Alterar</button>

                )

              }


            }



          }

          if ((status == "Em Andamento") && (_userId == atribuidoA)) {




          }

        }
      }
    ]

    const tablecolumnsBITRelacionado = [
      {
        dataField: "Title",
        text: "BIT relacionado",
        classes: 'text-center',
        headerClasses: 'text-center',
        headerStyle: { backgroundColor: '#bee5eb' },
      },
      {
        dataField: "Modified",
        text: "Data de modificação",
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

    return (

      <><div id="container">

        <div id="accordion">

          <div className="card">
            <div className="card-header btn" id="headingInformacoesProduto" data-toggle="collapse" data-target="#collapseInformacoesProduto" aria-expanded="true" aria-controls="collapseInformacoesProduto">
              <h5 className="mb-0 text-info">
                Informações do Produto
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

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingProblemaSolucao" data-toggle="collapse" data-target="#collapseProblemaSolucao" aria-expanded="true" aria-controls="collapseProblemaSolucao">
              <h5 className="mb-0 text-info">
                Problema/Solução
              </h5>
            </div>
            <div id="collapseProblemaSolucao" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

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

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingAlteracoes" data-toggle="collapse" data-target="#collapseAlteracoes" aria-expanded="true" aria-controls="collapseAlteracoes">
              <h5 className="mb-0 text-info">
                Alterações na estrutura do produto
              </h5>
            </div>
            <div id="collapseAlteracoes" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtAlteracoes">Alterações</label><br></br>
                      <span className="text-info" id='txtAlteracoes'></span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingDocumentos" data-toggle="collapse" data-target="#collapseDocumentos" aria-expanded="true" aria-controls="collapseDocumentos">
              <h5 className="mb-0 text-info">
                Documentos
              </h5>
            </div>
            <div id="collapseDocumentos" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

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
                    <div className="form-group col-md">
                      <div id='conteudo_SemAnexo'>Nenhum anexo encontrado</div>
                      <div id='conteudo_Anexo'>
                        {this.state.itemsListAnexosItem.map((item, key) => {

                          _pos++;
                          var txtAnexoItem = "anexoItem" + _pos;
                          var btnExcluirAnexoitem = "btnExcluirAnexoitem" + _pos;

                          var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Anexos')/items('${_idOMP}')/AttachmentFiles`;
                          url = this.props.siteurl;

                          var caminho = `${url}/Lists/Documentos/Attachments/${_idOMP}/${item.FileName}`;

                          return (

                            <><a id={txtAnexoItem} target='_blank' data-interception="off" href={caminho} title="">{item.FileName}</a><br></br></>


                          );



                        })}
                        {this.state.itemsListAnexos.map((item, key) => {

                          _pos++;
                          var txtAnexoItem = "anexoItem" + _pos;
                          var btnExcluirAnexoitem = "btnExcluirAnexoitem" + _pos;

                          //var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Anexos')/items('${_documentoNumero}')/AttachmentFiles`;
                          //url = this.props.siteurl;

                          var caminho = item.ServerRelativeUrl;

                          //   var idBotao = `btnExcluirAnexo2${_pos2}`;
                          var idImagem = `anexo2${_pos2}`;

                          // var relativeURL = window.location.pathname;
                          // var url = window.location.pathname;
                          // var nomePagina = url.substring(url.lastIndexOf('/') + 1);
                          // var strRelativeURL = relativeURL.replace(`SitePages/${nomePagina}`, "");

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
          </div>

          <div className="card">
            <div className="card-header btn" id="headingConjuntos" data-toggle="collapse" data-target="#collapseConjuntos" aria-expanded="true" aria-controls="collapseConjuntos">
              <h5 className="mb-0 text-info">
                Conjuntos
              </h5>
            </div>

            <div id="collapseConjuntos" className="collapse show" aria-labelledby="headingOne">

              <div className="card-body">

                <div id='conteudo_SemConjunto'>Nenhum conjunto encontrado</div>

                <div id='conteudo_Conjunto'>
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
                              <span className="text-info" id='txtTipo'>{item.DisposicaoEstoque}</span>
                            </div>
                            <div className="form-group col-md border m-1">
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
                              <span className="text-info" id='txtTipo'>{item.DisposicaoFornecedor}</span>
                            </div>
                            <div className="form-group col-md border m-1">
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
                              <span className="text-info" id='txtTipo'>{item.DisposicaoEmtransito}</span>
                            </div>
                            <div className="form-group col-md border m-1">
                              <span className="text-info" id='txtSintese'>{item.disposicaoEmtransitoEscolha}</span>
                            </div>
                          </div>
                        </div>


                      </div><br></br></>
                    );

                  })}

                </div>

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

                <div id='conteudo_SemSubConjunto'>Nenhum Sub-conjunto encontrado</div>

                <div id='conteudo_SubConjunto'>

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
                              <span className="text-info" id='txtTipo'>{item.DisposicaoEstoque}</span>
                            </div>
                            <div className="form-group col-md border m-1">
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
                              <span className="text-info" id='txtTipo'>{item.DisposicaoFornecedor}</span>
                            </div>
                            <div className="form-group col-md border m-1">
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
                              <span className="text-info" id='txtTipo'>{item.DisposicaoEmtransito}</span>
                            </div>
                            <div className="form-group col-md border m-1">
                              <span className="text-info" id='txtSintese'>{item.disposicaoEmtransitoEscolha}</span>
                            </div>
                          </div>
                        </div>

                      </div><br></br></>
                    );

                  })}

                </div>

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
                <div id='conteudo_SemPontoCorte'>Nenhum ponto de corte encontrado</div>
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
                <div id='conteudo_SemAssistenciaTecnica'>Nenhuma assistência técnica encontrada</div>
                <div id='tabelaAssistenciaTecnica'>
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensAssistenciaTecnica" keyField='id' data={this.state.itemsAssistenciaTecnica} columns={tablecolumnsAssistenciaTecnica} headerClasses="header-class" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingBITRelacionado" data-toggle="collapse" data-target="#collapseBITRelacionado" aria-expanded="true" aria-controls="collapseBITRelacionado">
              <h5 className="mb-0 text-info">
                BIT relacionado
              </h5>
            </div>
            <div id="collapseBITRelacionado" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">
                <div id='conteudo_SemBITRelacionado'>Nenhum BIT relacionado encontrado</div>
                <div id='tabelaBITRelacionado'>
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensBITRelacionado" keyField='id' data={this.state.itemsListaBITRelacionado} columns={tablecolumnsBITRelacionado} headerClasses="header-class" />
                  <button id='btnAbrirBITRelacionado' className="btn btn-secondary btnCustom btn-sm">Adicionar</button>
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
                <div id='tabelaAprovacoesBKP'>
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensAprovacoes" keyField='id' data={this.state.itemsAprovacoesBKP} columns={tablecolumnsAprovacoesBKP} headerClasses="header-class" />
                </div>
                <div id='tabelaAprovacoes'>
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensAprovacoes" keyField='id' data={this.state.itemsAprovacoes} columns={tablecolumnsAprovacoes} headerClasses="header-class" />
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="text-right">
          <button style={{ "margin": "2px" }} type="submit" id="btnVoltar" className="btn btn-secondary">Voltar</button>
          <button style={{ "margin": "2px" }} id="btnConfirmarFechar" className="btn btn-success">Fechar</button>
          <button style={{ "margin": "2px" }} id="btnEditar" className="btn btn-success">Editar</button>
          <br></br><br></br>
        </div>

      </div>


        <div className="modal fade" id="modalConfirmarAprovarTarefa" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente concluir a tarefa?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnAprovarTarefar" type="button" className="btn btn-primary">Sim</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalConfirmarFechar" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente fechar a OMP?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnFechar" type="button" className="btn btn-primary">Sim</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoAprovarTarefa" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Tarefa concluída com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoAprovarTarefa" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoAprovarTarefaAguardarFechamento" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Tarefa concluída com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoAprovarTarefaAguardarFechamento" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoFechar" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                OMP fechada com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoFechar" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade " id="modalConfirmarAlterarAprovador" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modalCadastrarConjuntos" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alterar Aprovador - <span id="tituloAreAprovadorAlterar"></span></h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="ddlResponsavelTecnico">Aprovador</label><span className="required"> *</span>

                    <select id="ddlAprovador-Alterar" className="form-control" value={this.state.valorAprovadores} onChange={(e) => this.onChangeAprovadores(e.target.value)}>
                      {this.state.itemsAprovadores.map(function (item, key) {
                        return (
                          <option value={item.Id}>{item.Title}</option>
                        );
                      })}
                    </select>

                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtJustificativa-AlterarAprovador">Justificativa</label><span className="required"> *</span><br></br>
                    <textarea id="txtJustificativa-AlterarAprovador" className="form-control" rows={4}></textarea>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnAlterarAprovador" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoAlterarAprovador" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Aprovador alterado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoAlterarAprovador" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>


      </>







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

        var arrProducao = [];
        var arrAssistenciaTecnica = [];

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var numero = resultData.d.results[i].Numero;
            var status = resultData.d.results[i].Status;
            var sintese = resultData.d.results[i].Title;
            var tipo = resultData.d.results[i].TipoOMP;
            var objetivo = resultData.d.results[i].Objetivo;
            var divisaoImpressora = resultData.d.results[i].DivisaoImpressoras;
            var observacao = resultData.d.results[i].CIObservacao;
            var descricaoProblema = resultData.d.results[i].DescricaoProblema;
            var solucaoEncontrada = resultData.d.results[i].SolucaoEncontrada;
            var alteracoes = resultData.d.results[i].Alteracoes;
            var documentosAlterados = resultData.d.results[i].DocumentosAlterados;
            var documentosOrigem = resultData.d.results[i].DocumentosOrigem;
            var itemNovo = resultData.d.results[i].siteNovoSPOnline;
            _itemNovo = itemNovo;

            var tamproducao = resultData.d.results[i].CIProducao.results.length;
            var tamAssistenciaTecnica = resultData.d.results[i].CIAssistenciaTecnica.results.length;

            for (var x = 0; x < tamproducao; x++) {

              arrProducao.push(resultData.d.results[i].CIProducao.results[x]);

            }

            for (var z = 0; z < tamAssistenciaTecnica; z++) {

              arrAssistenciaTecnica.push(resultData.d.results[i].CIAssistenciaTecnica.results[z]);

            }

            console.log("arrProducao", arrProducao);
            console.log("arrAssistenciaTecnica", arrAssistenciaTecnica);

            var vlrProducao = arrProducao.toString();
            var vlrAssistenciaTecnica = arrAssistenciaTecnica.toString();

            if (itemNovo == "Sim") {

              var responsavelTecnico = resultData.d.results[i].ResponsavelTecnico.Title;
              var responsavelArea = resultData.d.results[i].ResponsavelArea.Title;
              var areaExecutoraFabrica = resultData.d.results[i].AreaExecutoraFabrica.Title;
              var areaExecutoraAT = resultData.d.results[i].AreaExecutoraAT.Title;

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
            jQuery("#txtProducao").html(vlrProducao);
            jQuery("#txtAssistenciaTecnica").html(vlrAssistenciaTecnica);
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

            console.log(_grupos);

            if (_grupos.indexOf("OMP - Elaboradores") !== -1) {

              if (status == "Aguardando fechamento") jQuery("#btnConfirmarFechar").show();
              if (status != "Fechada") jQuery("#btnEditar").show();

            }

          }

        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactItemsConjuntos = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Conjuntos e Subconjuntos')/items?$top=50&$filter=OMP/ID eq ${_idOMP} and Conjuntos eq 'Conjunto'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        console.log("resultData conjuntos", resultData);

        if (resultData.d.results.length != 0) _temConjunto = true;

        reactItemsConjuntos.setState({
          itemsConjuntos: resultData.d.results
        });

        if (_temConjunto) {
          jQuery(`#conteudo_Conjunto`).show();
        } else {
          jQuery(`#conteudo_SemConjunto`).show();
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactItemsSubConjuntos = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Conjuntos e Subconjuntos')/items?$top=50&$filter=OMP/ID eq ${_idOMP} and Conjuntos eq 'Subconjunto'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length != 0) _temSubConjunto = true;

        reactItemsSubConjuntos.setState({
          itemsSubConjuntos: resultData.d.results
        });

        if (_temSubConjunto) {
          jQuery(`#conteudo_SubConjunto`).show();
        } else {
          jQuery(`#conteudo_SemSubConjunto`).show();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactItemsPontoCorte = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Ponto de Corte')/items?$top=50&$orderby= Created asc&$select=ID,Title,OMP/ID,PIE/PIE,PIE/ID,Data,Modified,Editor/Title&$expand=OMP,PIE,Editor&$filter=OMP/Numero eq ` + _documentoNumero,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length != 0) _temPontoCorte = true;

        reactItemsPontoCorte.setState({
          itemsPontoCorte: resultData.d.results
        });

        if (_temPontoCorte) {
          jQuery(`#tabelaPontoCorte`).show()
        } else {
          jQuery(`#conteudo_SemPontoCorte`).show()
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactItemsInforAssistenciaTecnica = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Materiais')/items?$top=50&$orderby= Created asc&$select=ID,Title,OMP/ID,PIE/ID,PATS/ID,DataEntrega,Modified,Editor/Title,PIE/PIE,PATS/PATS&$expand=OMP,PIE,PATS,Editor&$filter=OMP/Numero eq ` + _documentoNumero,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length != 0) _temAssistenciaTecnica = true;

        reactItemsInforAssistenciaTecnica.setState({
          itemsAssistenciaTecnica: resultData.d.results
        });

        if (_temAssistenciaTecnica) {
          jQuery(`#tabelaAssistenciaTecnica`).show()
        } else {
          jQuery(`#conteudo_SemAssistenciaTecnica`).show()
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    var reactItemsBITRelacionado = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('BIT relacionado')/items?$top=50&$orderby= Created asc&$select=ID,Title,OMP/ID,Modified,Editor/Title&$expand=OMP,Editor&$filter=OMP/Numero eq ` + _documentoNumero,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length != 0) _temBITRelacionado = true;

        reactItemsBITRelacionado.setState({
          itemsListaBITRelacionado: resultData.d.results
        });

        if (_temBITRelacionado) {
          jQuery(`#tabelaBITRelacionado`).show()
        } else {
          jQuery(`#conteudo_SemBITRelacionado`).show()
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });





    if (_itemNovo) {

      var reactItemsAprovacoes = this;

      jquery.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Tarefas')/items?$top=50&$orderby= Created asc&$select=ID,Title,AssignedTo/ID,AssignedTo/Title,Status,DueDate&$expand=AssignedTo&$filter=NroOMP eq ` + _documentoNumero,
        type: "GET",
        headers: { 'Accept': 'application/json; odata=verbose;' },
        success: function (resultData) {

          console.log("resultData Aprovacoes", resultData);

          if (resultData.d.results.length != 0) jQuery(`#tabelaAprovacoes`).show();

          reactItemsAprovacoes.setState({
            itemsAprovacoes: resultData.d.results
          });

        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText);
        }
      });

    } else {

      var reactItemsAprovacoesBKP = this;

      jquery.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Aprovacoes_BKP02')/items?$top=50&$orderby= Created asc&$select=ID,Title,Atribu_x00ed_da_x0020_a,Status,Data_x0020_de_x0020_Conclus_x00e&$filter=Title eq ` + _documentoNumero,
        type: "GET",
        headers: { 'Accept': 'application/json; odata=verbose;' },
        success: function (resultData) {

          if (resultData.d.results.length != 0) jQuery(`#tabelaAprovacoesBKP`).show();

          reactItemsAprovacoesBKP.setState({
            itemsAprovacoesBKP: resultData.d.results
          });

        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText);
        }
      });



    }


    var reactHandlerAprovadores = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/Web/SiteGroups/GetByName('OMP - Aprovadores')/users?$filter=Title ne 'System Account'`,
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
          "Accept": "application/json;odata=verbose"
        },
        success: async (resultData) => {

          if (resultData.d.results.length != 0) _temAnexo = true;

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

    await _web.getFolderByServerRelativeUrl(`${strRelativeURL}/Anexos/${_documentoNumero}`).files.orderBy('TimeLastModified', true)

      .expand('ListItemAllFields', 'Author').get().then(r => {

        console.log("r", r);

        if (r.length != 0) _temAnexo = true;

        var reactHandler = this;

        reactHandler.setState({
          itemsListAnexos: r
        });

      }).catch((error: any) => {
        console.log("Erro onChangeCliente: ", error);
      });


    if (_temAnexo) {
      jQuery(`#conteudo_Anexo`).show()
    } else {
      jQuery(`#conteudo_SemAnexo`).show()
    }

  }


  protected confirmarAprovarTarefa(id) {

    jQuery("#btnAprovarTarefar").prop("disabled", false);

    _idTarefa = id;
    jQuery("#modalConfirmarAprovarTarefa").modal({ backdrop: 'static', keyboard: false });

  }

  protected abrirModalAlterarAprovador(idItem, idAprovador, area) {

    _idTarefaAlterar = idItem;
    _areaTarefaAlterar = area;
    _valorAprovadores = idAprovador;
    _valorAprovadoresAntigo = idAprovador;

    jQuery('#tituloAreAprovadorAlterar').html(area);

     this.setState({

      valorAprovadores: idAprovador,

    });

    jQuery("#modalConfirmarAlterarAprovador").modal({ backdrop: 'static', keyboard: false });

  }

  protected editar() {
    window.location.href = `OMP-Editar.aspx?DocumentoID=${_idOMP}&DocumentoNumero=${_documentoNumero}`;
  }



  protected async alterarAprovador() {

    jQuery("#btnAlterarAprovador").prop("disabled", true);

    var idTarefa = _idTarefaAlterar;
    var titulo = _documentoNumero;
    var aprovador = _valorAprovadores;
    var area = _areaTarefaAlterar;
    var justificativa = $("#txtJustificativa-AlterarAprovador").val();

    console.log("titulo1", titulo);
    console.log("aprovador1", aprovador);
    console.log("justificativa1", justificativa);
    console.log("area1", area);

    if (_valorAprovadoresAntigo == aprovador) {
      alert("Escolha um aprovador diferente!");
      jQuery("#btnAlterarAprovador").prop("disabled", false);
      return false;
    }

    await _web.lists
      .getByTitle("Tarefas")
      .items.getById(idTarefa).update({
        AssignedToId: aprovador,
      })
      .then(async response => {

        console.log("alterou aprovador");
        console.log("titulo2", titulo);
        console.log("aprovador2", aprovador);
        console.log("justificativa2", justificativa);
        console.log("area2", area);

        //return false;

        await _web.lists
          .getByTitle("Trocar aprovadores")
          .items.add({
            Title: `${titulo}`,
            Novo_x0020_AprovadorId: aprovador,
            Aprovador_x0020_AntigoId: _valorAprovadoresAntigo,
            Justificativa: justificativa,
            AreaAlterada: area
          })
          .then(async response => {

            console.log("gravou no log de aprovadores");
            jQuery("#btnAlterarAprovador").prop("disabled", false);
            jQuery("#modalConfirmarAlterarAprovador").modal('hide');
            jQuery("#modalSucessoAlterarAprovador").modal({ backdrop: 'static', keyboard: false });

          }).catch(err => {
            console.log("err", err);
          });

      }).catch(err => {
        console.log("err", err);
      });


  }

  protected async aprovarTarefa() {

    jQuery("#btnAprovarTarefar").prop("disabled", true);

    await _web.lists
      .getByTitle("Tarefas")
      .items.getById(_idTarefa).update({
        Status: "Concluída",
      })
      .then(async response => {

        jquery.ajax({
          url: `${this.props.siteurl}/_api/web/lists/getbytitle('Tarefas')/items?$top=50&$orderby= Created asc&$select=ID,Title&$filter=NroOMP eq ${_documentoNumero} and Status eq 'Em Andamento'`,
          type: "GET",
          headers: { 'Accept': 'application/json; odata=verbose;' },
          async: false,
          success: async function (resultData) {

            if (resultData.d.results.length != 0) {

              $("#modalConfirmarAprovarTarefa").modal('hide');
              jQuery("#modalSucessoAprovarTarefa").modal({ backdrop: 'static', keyboard: false });

            } else {

              await _web.lists
                .getByTitle("Ordem de Modificação de Produto")
                .items.getById(_idOMP).update({
                  Status: "Aguardando fechamento",
                })
                .then(async response => {

                  $("#modalConfirmarAprovarTarefa").modal('hide');
                  jQuery("#modalSucessoAprovarTarefaAguardarFechamento").modal({ backdrop: 'static', keyboard: false });


                }).catch(err => {
                  console.log("err", err);
                });

            }


          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
          }
        });


      }).catch(err => {
        console.log("err", err);
      });


  }


  protected confirmarFechar() {

    jQuery("#modalConfirmarFechar").modal({ backdrop: 'static', keyboard: false });

  }

  protected async fechar() {

    jQuery("#btnFechar").prop("disabled", true);

    await _web.lists
      .getByTitle("Ordem de Modificação de Produto")
      .items.getById(_idOMP).update({
        Status: "Fechada",
      })
      .then(async response => {

        $("#modalConfirmarFechar").modal('hide');
        jQuery("#modalSucessoFechar").modal({ backdrop: 'static', keyboard: false });


      }).catch(err => {
        console.log("err", err);
      });


  }

  protected async sucessoAprovarTarefa() {

    var reactItemsAprovacoes = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Tarefas')/items?$top=50&$orderby= Created asc&$select=ID,Title,AssignedTo/ID,AssignedTo/Title,Status,DueDate&$expand=AssignedTo&$filter=NroOMP eq ` + _documentoNumero,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        console.log("resultData Aprovacoes", resultData);

        if (resultData.d.results.length != 0) jQuery(`#tabelaAprovacoes`).show();

        reactItemsAprovacoes.setState({
          itemsAprovacoes: resultData.d.results
        });

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    jQuery("#modalSucessoAprovarTarefa").modal('hide');


  }

  protected async sucessoRedirecionar() {

    window.location.href = `OMP-Todas.aspx`;

  }
  protected async sucessoAlterarAprovador() {

    var reactItemsAprovacoes = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Tarefas')/items?$top=50&$orderby= Created asc&$select=ID,Title,AssignedTo/ID,AssignedTo/Title,Status,DueDate&$expand=AssignedTo&$filter=NroOMP eq ` + _documentoNumero,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        console.log("resultData Aprovacoes", resultData);

        if (resultData.d.results.length != 0) jQuery(`#tabelaAprovacoes`).show();

        reactItemsAprovacoes.setState({
          itemsAprovacoes: resultData.d.results
        });

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    jQuery("#modalSucessoAlterarAprovador").modal('hide');


  }

  private onChangeAprovadores = (val) => {

    _valorAprovadores = val;

    this.setState({
      valorAprovadores: val,
    });
  }


  protected voltar() {
    history.back();
  }

}
