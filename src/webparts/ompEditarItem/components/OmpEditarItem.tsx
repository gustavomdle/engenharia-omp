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
import InputMask from 'react-input-mask';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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
var _idConjunto;
var _idPontoCorte;
var _idAssistenciaTecnica;
var _idBITRelacionado;
var _aprovadores = [];
var _aprovadorFuncao = ["Responsável Técnico", "Responsável da Área", "Área executora fábrica", "Área executora AT"];
var _grupos = [];
var _status;

export interface IReactGetItemsState {

  itemsTipo: [],
  itemsObjetivo: [],
  itemsDivisaoImpressora: [],
  itemsProducao: [];
  itemsAssistenciaTecnica: [];
  itemsListaAssistenciaTecnica: [],
  itemsListaBITRelacionado: [],
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
  itemsPIE: [
    {
      "ID": any,
      "Title": any,
      "PIE": any,
    }],
  itemsPATS: [
    {
      "ID": any,
      "Title": any,
      "PATS": any,
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
      "CSAtual": any,
      "Nova": any,
      "VersaoNova": any,
      "CSNova": any,
      "DisposicaoEstoque": any,
      "DisposicaoEstoqueEscolha": any,
      "DisposicaoFornecedor": any,
      "DisposicaoFornecedorEscolha": any,
      "DisposicaoEmtransito": any,
      "DisposicaoEmtransitoEscolha": any,
      "HistoricoAlteracao": any,
      "PontoCorte": any,
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
      "CSAtual": any,
      "Nova": any,
      "VersaoNova": any,
      "CSNova": any,
      "DisposicaoEstoque": any,
      "DisposicaoEstoqueEscolha": any,
      "DisposicaoFornecedor": any,
      "DisposicaoFornecedorEscolha": any,
      "DisposicaoEmtransito": any,
      "DisposicaoEmtransitoEscolha": any,
      "HistoricoAlteracao": any,
      "PontoCorte": any,
    }],
  itemsValorPontoCorteConjuntos: any,
  itemsValorPontoCorteSubConjuntos: any,
  itemsDataPontoCorte: any,
  valorItemsPIEPontoCorteEditar: any,
  valorItemsDataPontoCorteEditar: any,
  valorItemsDataEntregaAssistenciaTecnica: any,
  valorItemsPIEAssistenciaTecnica: any,
  valorItemsPATSAssistenciaTecnica: any,

}

export default class OmpEditarItem extends React.Component<IOmpEditarItemProps, IReactGetItemsState> {



  public constructor(props: IOmpEditarItemProps, state: IReactGetItemsState) {


    super(props);
    this.state = {

      itemsTipo: [],
      itemsObjetivo: [],
      itemsDivisaoImpressora: [],
      itemsProducao: [],
      itemsAssistenciaTecnica: [],
      itemsListaAssistenciaTecnica: [],
      itemsListaBITRelacionado: [],
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
      itemsPIE: [
        {
          "ID": "",
          "Title": "",
          "PIE": "",
        }],
      itemsPATS: [
        {
          "ID": "",
          "Title": "",
          "PATS": "",
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
          "CSAtual": "",
          "Nova": "",
          "VersaoNova": "",
          "CSNova": "",
          "DisposicaoEstoque": "",
          "DisposicaoEstoqueEscolha": "",
          "DisposicaoFornecedor": "",
          "DisposicaoFornecedorEscolha": "",
          "DisposicaoEmtransito": "",
          "DisposicaoEmtransitoEscolha": "",
          "HistoricoAlteracao": "",
          "PontoCorte": "",
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
          "CSAtual": "",
          "Nova": "",
          "VersaoNova": "",
          "CSNova": "",
          "DisposicaoEstoque": "",
          "DisposicaoEstoqueEscolha": "",
          "DisposicaoFornecedor": "",
          "DisposicaoFornecedorEscolha": "",
          "DisposicaoEmtransito": "",
          "DisposicaoEmtransitoEscolha": "",
          "HistoricoAlteracao": "",
          "PontoCorte": "",
        }
      ],
      itemsValorPontoCorteConjuntos: "",
      itemsValorPontoCorteSubConjuntos: "",
      valorItemsPIEPontoCorteEditar: "",
      itemsDataPontoCorte: "",
      valorItemsDataPontoCorteEditar: "",
      valorItemsDataEntregaAssistenciaTecnica: "",
      valorItemsPIEAssistenciaTecnica: "",
      valorItemsPATSAssistenciaTecnica: "",

    };
  }





  public async componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);
    _caminho = this.props.context.pageContext.web.serverRelativeUrl;

    var queryParms = new UrlQueryParameterCollection(window.location.href);
    _idOMP = parseInt(queryParms.getValue("DocumentoID"));
    _documentoNumero = parseInt(queryParms.getValue("DocumentoNumero"));

    //jQuery("#modalCadastrarAssistenciaTecnica").modal({ backdrop: 'static', keyboard: false });

    document
      .getElementById("btnValidarSalvar")
      .addEventListener("click", (e: Event) => this.validar("Salvar"));

    document
      .getElementById("btnValidarEnviarAprovacao")
      .addEventListener("click", (e: Event) => this.validar("Aprovar"));

    document
      .getElementById("btnSalvar")
      .addEventListener("click", (e: Event) => this.editar("Salvar"));

    document
      .getElementById("btnEnviarAprovacao")
      .addEventListener("click", (e: Event) => this.editar("Aprovar"));

    document
      .getElementById("btnSucesso")
      .addEventListener("click", (e: Event) => this.fecharSucesso("Salvar"));

    document
      .getElementById("btnSucessoEnviarAprovacao")
      .addEventListener("click", (e: Event) => this.fecharSucesso("Aprovar"));

    document
      .getElementById("btnAbrirModalCadastrarConjuntos")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarConjuntos("Conjunto"));

    document
      .getElementById("btnAbrirModaCadastrarSubConjuntos")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarConjuntos("Subconjunto"));

    document
      .getElementById("btnAbrirModaPontoCorte")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarPontoCorte());

    document
      .getElementById("btnAbrirAssistenciaTecnica")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarAssistenciaTecnica());

    document
      .getElementById("btnAbrirBITRelacionado")
      .addEventListener("click", (e: Event) => this.abrirModalCadastrarBITRelacionado());

    document
      .getElementById("btnCadastrarConjunto")
      .addEventListener("click", (e: Event) => this.cadastrarConjuntosSubconjuntos("Conjunto"));

    document
      .getElementById("btnCadastrarSubConjunto")
      .addEventListener("click", (e: Event) => this.cadastrarConjuntosSubconjuntos("Subconjunto"));

    document
      .getElementById("btnCadastrarPontoCorte")
      .addEventListener("click", (e: Event) => this.cadastrarPontoCorte());

    document
      .getElementById("btnCadastrarAssistenciaTecnica")
      .addEventListener("click", (e: Event) => this.cadastrarAssistenciaTecnica());

    document
      .getElementById("btnCadastrarBITRelacionado")
      .addEventListener("click", (e: Event) => this.cadastrarBITRelacionado());

    document
      .getElementById("btnEditarBITRelacionado")
      .addEventListener("click", (e: Event) => this.editarBITRelacionado());

    document
      .getElementById("btnEditarAssistenciaTecnica")
      .addEventListener("click", (e: Event) => this.editarAssistenciaTecnica());


    document
      .getElementById("btnEditarPontoCorte")
      .addEventListener("click", (e: Event) => this.editarPontoCorte());


    document
      .getElementById("btnSucessoCadastrarConjunto")
      .addEventListener("click", (e: Event) => this.sucessoConjuntos("Salvar"));

    document
      .getElementById("btnSucessoCadastrarSubConjunto")
      .addEventListener("click", (e: Event) => this.sucessoSubConjuntos("Salvar"));

    document
      .getElementById("btnSucessoExcluirConjunto")
      .addEventListener("click", (e: Event) => this.sucessoConjuntos("Excluir"));

    document
      .getElementById("btnSucessoExcluirSubConjunto")
      .addEventListener("click", (e: Event) => this.sucessoSubConjuntos("Excluir"));

    document
      .getElementById("btnSucessoExcluirPontoCorte")
      .addEventListener("click", (e: Event) => this.sucessoPontoCorte("Excluir"));

    document
      .getElementById("btnSucessoExcluirAssistenciaTecnica")
      .addEventListener("click", (e: Event) => this.sucessoAssistenciaTecnica("Excluir"));

    document
      .getElementById("btnSucessoExcluirBITRelacionado")
      .addEventListener("click", (e: Event) => this.sucessoBITRelacionado("Excluir"));

    document
      .getElementById("btnSucessoCadastrarPontoCorte")
      .addEventListener("click", (e: Event) => this.sucessoPontoCorte("Salvar"));

    document
      .getElementById("btnSucessoCadastrarAssistenciaTecnica")
      .addEventListener("click", (e: Event) => this.sucessoAssistenciaTecnica("Salvar"));

    document
      .getElementById("btnSucessoCadastrarBITRelacionado")
      .addEventListener("click", (e: Event) => this.sucessoBITRelacionado("Salvar"));

    document
      .getElementById("btnSucessoEditarBITRelacionado")
      .addEventListener("click", (e: Event) => this.sucessoBITRelacionado("Editar"));

    document
      .getElementById("btnSucessoEditarAssistenciaTecnica")
      .addEventListener("click", (e: Event) => this.sucessoAssistenciaTecnica("Editar"));

    document
      .getElementById("modalEditarAssistenciaTecnica")
      .addEventListener("click", (e: Event) => this.sucessoAssistenciaTecnica("Editar"));

    document
      .getElementById("btnSucessoEditarPontoCorte")
      .addEventListener("click", (e: Event) => this.sucessoPontoCorte("Editar"));

    document
      .getElementById("btnEditarConjunto")
      .addEventListener("click", (e: Event) => this.editarConjuntosSubconjuntos("Conjunto"));

    document
      .getElementById("btnEditarSubConjunto")
      .addEventListener("click", (e: Event) => this.editarConjuntosSubconjuntos("Subconjunto"));

    document
      .getElementById("btnSucessoEditarConjunto")
      .addEventListener("click", (e: Event) => this.sucessoConjuntos("Editar"));

    document
      .getElementById("btnSucessoEditarSubConjunto")
      .addEventListener("click", (e: Event) => this.sucessoSubConjuntos("Editar"));

    document
      .getElementById("btnVoltar")
      .addEventListener("click", (e: Event) => this.voltar());


    jQuery("#conteudoLoading").html(`<br/><br/><img style="height: 80px; width: 80px" src='${_caminho}/SiteAssets/loading.gif'/>
      <br/>Aguarde....<br/><br/>
      Dependendo do tamanho do anexo e a velocidade<br>
       da Internet essa ação pode demorar um pouco. <br>
       Não fechar a janela!<br/><br/>`);


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

    jQuery("#btnValidarEnviarAprovacao").hide();
    jQuery("#btnValidarSalvar").hide();

    jQuery("#ddlResponsavelTecnico").prop("disabled", true);
    jQuery("#ddlResponsavelArea").prop("disabled", true);
    jQuery("#ddlAreaExecutoraFabrica").prop("disabled", true);
    jQuery("#ddlAreaExecutoraAT").prop("disabled", true);

    this.handler();

  }

  public render(): React.ReactElement<IOmpEditarItemProps> {

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
      {
        dataField: "",
        text: "",
        headerStyle: { "backgroundColor": "#bee5eb", "width": "128px" },
        headerClasses: 'text-center',
        formatter: (rowContent, row) => {

          var id = row.ID;

          return (
            <>
              <button onClick={async () => {

                if (confirm("Deseja realmente excluir o item: " + row.Title + "?") == true) {

                  const list = _web.lists.getByTitle("Ponto de Corte");
                  await list.items.getById(id).recycle()
                    .then(async response => {

                      console.log("Item excluido!");
                      jQuery("#modalSucessoExcluirPontoCorte").modal({ backdrop: 'static', keyboard: false });

                    })
                    .catch((error: any) => {
                      console.log(error);

                    })

                } else {

                  return false.valueOf;
                }

              }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Excluir</button>&nbsp;
              <button onClick={() => {

                jQuery("#txtObservacao-PontoCorte-Editar").val(row.Title);

                var reactCodigoPIEPontoCorteEditar = this;

                var data = new Date(row.Data);
                var formdata = ("0" + data.getDate()).slice(-2) + '/' + ("0" + (data.getMonth() + 1)).slice(-2) + '/' + data.getFullYear();

                _idPontoCorte = row.ID;

                reactCodigoPIEPontoCorteEditar.setState({
                  valorItemsPIEPontoCorteEditar: row.PIE.ID,
                  valorItemsDataPontoCorteEditar: formdata
                });

                jQuery("#dtData-PontoCorte-Editar").val(formdata);
                jQuery("#txtObservacao-PontoCorte-Editar").val(row.Title);

                jQuery("#modalEditarPontoCorte").modal({ backdrop: 'static', keyboard: false })

              }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Editar</button>


            </>
          )

        }
      }

    ]

    const tablecolumnsAssistenciaTecnica = [
      {
        dataField: "PIE.PIE",
        text: "Código PIE",
        classes: 'text-center',
        headerClasses: 'text-center',
        headerStyle: { backgroundColor: '#bee5eb' },
        formatter: (rowContent, row) => {

          var pie = row.PIE.PIE;
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
      {
        dataField: "",
        text: "",
        headerStyle: { "backgroundColor": "#bee5eb", "width": "128px" },
        headerClasses: 'text-center',
        formatter: (rowContent, row) => {

          var id = row.ID;

          return (
            <>
              <button onClick={async () => {

                if (confirm("Deseja realmente excluir o item: " + row.Title + "?") == true) {

                  const list = _web.lists.getByTitle("Materiais");
                  await list.items.getById(id).recycle()
                    .then(async response => {

                      console.log("Item excluido!");
                      jQuery("#modalSucessoExcluirAssistenciaTecnica").modal({ backdrop: 'static', keyboard: false });

                    })
                    .catch((error: any) => {
                      console.log(error);

                    })

                } else {

                  return false.valueOf;
                }

              }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Excluir</button>&nbsp;
              <button onClick={() => {

                jQuery("#txtObservacao-AssistenciaTecnica-Editar").val(row.Title);

                var reactCodigoPIEAssistenciaTecnicaEditar = this;
                _idAssistenciaTecnica = row.ID;

                var data = new Date(row.DataEntrega);
                var formdata = ("0" + data.getDate()).slice(-2) + '/' + ("0" + (data.getMonth() + 1)).slice(-2) + '/' + data.getFullYear();

                reactCodigoPIEAssistenciaTecnicaEditar.setState({
                  valorItemsPIEAssistenciaTecnica: row.PIE.ID,
                  valorItemsPATSAssistenciaTecnica: row.PATS.ID,
                  valorItemsDataEntregaAssistenciaTecnica: formdata
                });

                jQuery("#dtData-PontoCorte-Editar").val(formdata);
                jQuery("#txtObservacao-PontoCorte-Editar").val(row.Title);

                jQuery("#modalEditarAssistenciaTecnica").modal({ backdrop: 'static', keyboard: false })



              }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Editar</button>


            </>
          )

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
      {
        dataField: "",
        text: "",
        headerStyle: { "backgroundColor": "#bee5eb", "width": "128px" },
        headerClasses: 'text-center',
        formatter: (rowContent, row) => {

          var id = row.ID;
          _idBITRelacionado = id;

          return (
            <>
              <button onClick={async () => {

                if (confirm("Deseja realmente excluir o item: " + row.Title + "?") == true) {

                  const list = _web.lists.getByTitle("BIT relacionado");
                  await list.items.getById(id).recycle()
                    .then(async response => {

                      console.log("Item excluido!");
                      jQuery("#modalSucessoExcluirBITRelacionado").modal({ backdrop: 'static', keyboard: false });

                    })
                    .catch((error: any) => {
                      console.log(error);

                    })

                } else {

                  return false.valueOf;
                }

              }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Excluir</button>&nbsp;
              <button onClick={() => {

                jQuery("#txtBITRelacionado-Editar").val(row.Title);
                jQuery("#modalEditarBITRelacionado").modal({ backdrop: 'static', keyboard: false })

              }} className="btn btn-info btnCustom btn-sm btnEdicaoListas">Editar</button>


            </>
          )

        }
      }
    ]

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
                    <div className="form-group col-md">
                      <label htmlFor="txtTitulo">Síntese</label><span className="required"> *</span>
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
                      {this.state.itemsProducao.map((item, key) => {

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
                      <label htmlFor="checkAssitenciaTecnica">Assistência técnica</label>
                      {this.state.itemsAssistenciaTecnica.map((item, key) => {

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
                  <label htmlFor="txtDadosProposta">Observação</label>
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

                {this.state.itemsConjuntos.map((item, key) => {

                  return (
                    <>

                      <div className='textoDireita'>
                        <span title='Excluir' className='cursorPointer btnEdicaoLista' onClick={(e) => this.excluirConjuntoSubconjunto(item.ID, "Conjunto")}><FontAwesomeIcon icon={faTrash} /></span>&nbsp;
                        <span title='Editar' className='cursorPointer btnEdicaoLista' onClick={(e) => this.abrirModalEditarConjuntos(item.ID, item.PIE, item.Title, item.PATS, item.DescricaoPATS, item.Atual, item.VersaoAtual, item.CSAtual, item.Nova, item.VersaoNova, item.CSNova, item.DisposicaoEstoque, item.DisposicaoEstoqueEscolha, item.DisposicaoFornecedor, item.DisposicaoFornecedorEscolha, item.DisposicaoEmtransito, item.DisposicaoEmtransitoEscolha)}><FontAwesomeIcon icon={faEdit} /></span>
                      </div>

                      <div className='padding10 col-md border m-1 bg-light text-dark rounded'>

                        <div>
                          <div className="form-row">
                            <div className="form-group labelConjuntosSubconjutos ">
                              PIE
                            </div>
                            <div className="form-group col-md border m-1">
                              Código<br></br>
                              <span className="text-info" id='txtPIE'>{item.PIE}</span>
                            </div>
                            <div className="form-group col-md border m-1">
                              Descrição<br></br>
                              <span className="text-info" id='txtTitle'>{item.Title}</span>
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
                              <span className="text-info" id='txtPATS'>{item.PATS}</span>
                            </div>
                            <div className="form-group col-md border m-1">
                              Descrição<br></br>
                              <span className="text-info" id='txtDescricaoPATS'>{item.DescricaoPATS}</span>
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
                              <span className="text-info" id='txtAtual'>{item.Atual}</span>
                            </div>
                            <div className="form-group col-md border m-1">
                              Versão<br></br>
                              <span className="text-info" id='txtVersaoAtual'>{item.VersaoAtual}</span>
                            </div>
                            <div className="form-group col-md border m-1">
                              CS<br></br>
                              <span className="text-info" id='txtCSAtual'>{item.CSAtual}</span>
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
                              <span className="text-info" id='txtNova'>{item.Nova}</span>
                            </div>
                            <div className="form-group col-md border m-1">
                              Versão<br></br>
                              <span className="text-info" id='txtVersaoNova'>{item.VersaoNova}</span>
                            </div>
                            <div className="form-group col-md border m-1">
                              CS<br></br>
                              <span className="text-info" id='txtCSNova'>{item.CSNova}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="form-row">
                            <div className="form-group labelConjuntosSubconjutos ">
                              Estoque<br></br>
                            </div>
                            <div className="form-group col-md border m-1">
                              <span className="text-info" id='txtDisposicaoEstoque'>{item.DisposicaoEstoque}</span>
                            </div>
                            <div className="form-group col-md border m-1">
                              <span className="text-info" id='txtDisposicaoEstoqueEscolha'>{item.DisposicaoEstoqueEscolha}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="form-row">
                            <div className="form-group labelConjuntosSubconjutos ">
                              Fornecedor<br></br>
                            </div>
                            <div className="form-group col-md border m-1">
                              <span className="text-info" id='txtDisposicaoFornecedor'>{item.DisposicaoFornecedor}</span>
                            </div>
                            <div className="form-group col-md border m-1">
                              <span className="text-info" id='txtDisposicaoFornecedorEscolha'>{item.DisposicaoFornecedorEscolha}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="form-row">
                            <div className="form-group labelConjuntosSubconjutos ">
                              Em trânsito<br></br>
                            </div>
                            <div className="form-group col-md border m-1">
                              <span className="text-info" id='txtDisposicaoEmtransito'>{item.DisposicaoEmtransito}</span>
                            </div>
                            <div className="form-group col-md border m-1">
                              <span className="text-info" id='txtDisposicaoEmtransitoEscolha'>{item.DisposicaoEmtransitoEscolha}</span>
                            </div>
                          </div>
                        </div>

                      </div></>
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

                {this.state.itemsSubConjuntos.map((item, key) => {

                  return (

                    <>

                      <div className='textoDireita'>
                        <span title='Excluir' className='cursorPointer btnEdicaoLista' onClick={(e) => this.excluirConjuntoSubconjunto(item.ID, "Subconjunto")}><FontAwesomeIcon icon={faTrash} /></span>&nbsp;
                        <span title='Editar' className='cursorPointer btnEdicaoLista' onClick={(e) => this.abrirModalEditarSubConjuntos(item.ID, item.PIE, item.Title, item.PATS, item.DescricaoPATS, item.Atual, item.VersaoAtual, item.CSAtual, item.Nova, item.VersaoNova, item.CSNova, item.DisposicaoEstoque, item.DisposicaoEstoqueEscolha, item.DisposicaoFornecedor, item.DisposicaoFornecedorEscolha, item.DisposicaoEmtransito, item.DisposicaoEmtransitoEscolha)}><FontAwesomeIcon icon={faEdit} /></span>
                      </div>

                      <div className='padding10 col-md border m-1 bg-light text-dark rounded'>

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
                              <span className="text-info" id='txtSintese'>{item.CSAtual}</span>
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
                              <span className="text-info" id='txtSintese'>{item.DisposicaoEstoqueEscolha}</span>
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
                              <span className="text-info" id='txtSintese'>{item.DisposicaoEmtransitoEscolha}</span>
                            </div>
                          </div>
                        </div>

                      </div></>
                  );

                })}
                <button id='btnAbrirModaCadastrarSubConjuntos' className="btn btn-secondary btnCustom btn-sm">Adicionar</button>

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
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensAssistenciaTecnica" keyField='id' data={this.state.itemsListaAssistenciaTecnica} columns={tablecolumnsAssistenciaTecnica} headerClasses="header-class" />
                  <button id='btnAbrirAssistenciaTecnica' className="btn btn-secondary btnCustom btn-sm">Adicionar</button>
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
                <div id='tabelaBITRelacionado'>
                  <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItens" id="gridTodosItensBITRelacionado" keyField='id' data={this.state.itemsListaBITRelacionado} columns={tablecolumnsBITRelacionado} headerClasses="header-class" />
                  <button id='btnAbrirBITRelacionado' className="btn btn-secondary btnCustom btn-sm">Adicionar</button>
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
                      <label htmlFor="ddlResponsavelTecnico">Responsável técnico</label><span className="required"> *</span>

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

                        var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Anexos')/items('${_documentoNumero}')/AttachmentFiles`;
                        url = this.props.siteurl;

                        var caminho = `${url}/Lists/Documentos/Attachments/${_idOMP}/${item.FileName}`;

                        return (

                          <><a id={txtAnexoItem} target='_blank' data-interception="off" href={caminho} title="">{item.FileName}</a><a style={{ "cursor": "pointer" }} onClick={() => this.excluirAnexoItem(`${item.ServerRelativeUrl}`, `${item.FileName}`, `${txtAnexoItem}`, `${btnExcluirAnexoitem}`)} id={btnExcluirAnexoitem}>&nbsp;Excluir</a><br></br></>


                        );



                      })}
                      {this.state.itemsListAnexos.map((item, key) => {

                        _pos2++;
                        //var txtAnexoItem = "anexoItem" + _pos;
                        //var btnExcluirAnexoitem = "btnExcluirAnexoitem" + _pos;

                        //var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Documentos')/items('${_idOMP}')/AttachmentFiles`;
                        //url = this.props.siteurl;

                        var caminho = item.ServerRelativeUrl;

                        var btnExcluirAnexo2 = `btnExcluirAnexo2${_pos2}`;
                        var txtAnexoItem2 = `anexo2${_pos2}`;

                        var relativeURL = window.location.pathname;
                        var url = window.location.pathname;
                        var nomePagina = url.substring(url.lastIndexOf('/') + 1);
                        var strRelativeURL = relativeURL.replace(`SitePages/${nomePagina}`, "");

                        return (

                          <><a id={txtAnexoItem2} target='_blank' data-interception="off" href={caminho} title="">{item.Name}</a><a style={{ "cursor": "pointer" }} onClick={() => this.excluirAnexo(`${strRelativeURL}/Anexos/${_documentoNumero}`, `${item.Name}`, `${txtAnexoItem2}`, `${btnExcluirAnexo2}`)} id={btnExcluirAnexo2}>&nbsp;Excluir</a><br></br></>

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
            <button style={{ "margin": "2px" }} type="submit" id="btnVoltar" className="btn btn-secondary">Voltar</button>
            <button style={{ "margin": "2px" }} id="btnValidarSalvar" className="btn btn-success">Salvar</button>
            <button style={{ "margin": "2px" }} id="btnValidarEnviarAprovacao" className="btn btn-success">Enviar Aprovação</button>
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
                Deseja realmente alterar a OMP?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnSalvar" type="button" className="btn btn-primary">Sim</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalConfirmarEnviarAprovacao" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Deseja realmente enviar para aprovação?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnEnviarAprovacao" type="button" className="btn btn-primary">Sim</button>
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
                OMP alterada com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucesso" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoEnviarAprovacao" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                OMP enviada para aprovação!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoEnviarAprovacao" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoEditarConjunto" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Conjunto alterado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoEditarConjunto" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoEditarSubConjunto" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Sub-Conjunto alterado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoEditarSubConjunto" className="btn btn-primary">OK</button>
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
                    <label htmlFor="txtCodigoPIE">Código PIE</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtCodigoPIE" />
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="txtDescricaoCodigoPIE">Descrição do código PIE</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtDescricaoCodigoPIE" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label htmlFor="txtCodigoPATS">Código PATS</label><br></br>
                    <input type="text" className="form-control" id="txtCodigoPATS" />
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="txtDescricaoCodigoPATS">Descricão do código PATS</label><br></br>
                    <input type="text" className="form-control" id="txtDescricaoCodigoPATS" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="ddlRevisaoAtual">Revisão atual</label><br></br>
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
                    <label htmlFor="txtVersaoAtual">Versão Atual</label><br></br>
                    <input type="text" className="form-control" id="txtVersaoAtual" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtCSAtual">CS Atual</label><br></br>
                    <input type="text" className="form-control" id="txtCSAtual" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="ddlNovaRevisao">Nova revisão</label><br></br>
                    <select id="ddlNovaRevisao" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsNovaRevisao.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtVersaoNovaRevisao">Versão Nova Revisão</label><br></br>
                    <input type="text" className="form-control" id="txtVersaoNovaRevisao" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtCSNovaRevisao">CS Nova revisão</label><br></br>
                    <input type="text" className="form-control" id="txtCSNovaRevisao" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtDisposicaoEstoqueConjuntos">Disposição - Estoque</label><br></br>
                    <input type="text" className="form-control" id="txtDisposicaoEstoqueConjuntos" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlDisposicaoEstoqueAcao">Disposição - Estoque (Ação)</label><br></br>
                    <select id="ddlDisposicaoEstoqueAcao" className="form-control">
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
                    <label htmlFor="txtDisposicaoFornecedorConjuntos">Disposicão - Fornecedor</label><br></br>
                    <input type="text" className="form-control" id="txtDisposicaoFornecedorConjuntos" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlDisposicaoFornecedorAcao">Disposicão - Fornecedor (Ação)</label><br></br>
                    <select id="ddlDisposicaoFornecedorAcao" className="form-control">
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
                    <label htmlFor="txtDisposicaoEmTransitoConjuntos">Disposicão - Em trânsito</label><br></br>
                    <input type="text" className="form-control" id="txtDisposicaoEmTransitoConjuntos" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlDisposicaoEmTransitoAcao">Disposicão - Em trânsito (Ação)</label><br></br>
                    <select id="ddlDisposicaoEmTransitoAcao" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsDisposicaoEmTransitoAcao.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarConjunto" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade " id="modalCadastrarSubConjuntos" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modalCadastrarConjuntos" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Sub-Conjuntos - Cadastrar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label htmlFor="txtCodigoPIE-SubConjuntos">Código PIE</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtCodigoPIE-SubConjuntos" />
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="txtDescricaoCodigoPIE-SubConjuntos">Descrição do código PIE</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtDescricaoCodigoPIE-SubConjuntos" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label htmlFor="txtCodigoPATS-SubConjuntos">Código PATS</label><br></br>
                    <input type="text" className="form-control" id="txtCodigoPATS-SubConjuntos" />
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="txtDescricaoCodigoPATS-SubConjuntos">Descricão do código PATS</label><br></br>
                    <input type="text" className="form-control" id="txtDescricaoCodigoPATS-SubConjuntos" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="ddlRevisaoAtual-SubConjuntos">Revisão atual</label><br></br>
                    <select id="ddlRevisaoAtual-SubConjuntos" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsRevisaoAtual.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtVersaoAtual-SubConjuntos">Versão Atual</label><br></br>
                    <input type="text" className="form-control" id="txtVersaoAtual-SubConjuntos" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtCSAtual-SubConjuntos">CS Atual</label><br></br>
                    <input type="text" className="form-control" id="txtCSAtual-SubConjuntos" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="ddlNovaRevisao-SubConjuntos">Nova revisão</label><br></br>
                    <select id="ddlNovaRevisao-SubConjuntos" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsNovaRevisao.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtVersaoNovaRevisao-SubConjuntos">Versão Nova Revisão</label><br></br>
                    <input type="text" className="form-control" id="txtVersaoNovaRevisao-SubConjuntos" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtCSNovaRevisao-SubConjuntos">CS Nova revisão</label><br></br>
                    <input type="text" className="form-control" id="txtCSNovaRevisao-SubConjuntos" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtDisposicaoEstoque-SubConjuntos">Disposição - Estoque</label><br></br>
                    <input type="text" className="form-control" id="txtDisposicaoEstoque-SubConjuntos" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlDisposicaoEstoqueAcao-SubConjuntos">Disposição - Estoque (Ação)</label><br></br>
                    <select id="ddlDisposicaoEstoqueAcao-SubConjuntos" className="form-control">
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
                    <label htmlFor="txtDisposicaoFornecedor-SubConjuntos">Disposicão - Fornecedor</label><br></br>
                    <input type="text" className="form-control" id="txtDisposicaoFornecedor-SubConjuntos" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlDisposicaoFornecedorAcao-SubConjuntos">Disposicão - Fornecedor (Ação)</label><br></br>
                    <select id="ddlDisposicaoFornecedorAcao-SubConjuntos" className="form-control">
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
                    <label htmlFor="txtDisposicaoEmTransito-SubConjuntos">Disposicão - Em trânsito</label><br></br>
                    <input type="text" className="form-control" id="txtDisposicaoEmTransito-SubConjuntos" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlDisposicaoEmTransitoAcao-SubConjuntos">Disposicão - Em trânsito (Ação)</label><br></br>
                    <select id="ddlDisposicaoEmTransitoAcao-SubConjuntos" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsDisposicaoEmTransitoAcao.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarSubConjunto" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade " id="modalEditarConjunto" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modalCadastrarConjuntos" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Conjuntos - Editar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label htmlFor="txtCodigoPIE-Editar">Código PIE</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtCodigoPIE-Editar" />
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="txtDescricaoCodigoPIE-Editar">Descrição do código PIE</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtDescricaoCodigoPIE-Editar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label htmlFor="txtCodigoPATS-Editar">Código PATS</label><br></br>
                    <input type="text" className="form-control" id="txtCodigoPATS-Editar" />
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="txtDescricaoCodigoPATS-Editar">Descricão do código PATS</label><br></br>
                    <input type="text" className="form-control" id="txtDescricaoCodigoPATS-Editar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="ddlRevisaoAtual-Editar">Revisão atual</label><br></br>
                    <select id="ddlRevisaoAtual-Editar" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsRevisaoAtual.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtVersaoAtual-Editar">Versão Atual</label><br></br>
                    <input type="text" className="form-control" id="txtVersaoAtual-Editar" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtCSAtual-Editar">CS Atual</label><br></br>
                    <input type="text" className="form-control" id="txtCSAtual-Editar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="ddlNovaRevisao-Editar">Nova revisão</label><br></br>
                    <select id="ddlNovaRevisao-Editar" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsNovaRevisao.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtVersaoNovaRevisao-Editar">Versão Nova Revisão</label><br></br>
                    <input type="text" className="form-control" id="txtVersaoNovaRevisao-Editar" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtCSNovaRevisao-Editar">CS Nova revisão</label><br></br>
                    <input type="text" className="form-control" id="txtCSNovaRevisao-Editar" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtDisposicaoEstoque-Editar">Disposição - Estoque</label><br></br>
                    <input type="text" className="form-control" id="txtDisposicaoEstoque-Editar" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlDisposicaoEstoqueAcao-Editar">Disposição - Estoque (Ação)</label><br></br>
                    <select id="ddlDisposicaoEstoqueAcao-Editar" className="form-control">
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
                    <label htmlFor="txtDisposicaoFornecedor-Editar">Disposicão - Fornecedor</label><br></br>
                    <input type="text" className="form-control" id="txtDisposicaoFornecedor-Editar" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlDisposicaoFornecedorAcao-Editar">Disposicão - Fornecedor (Ação)</label><br></br>
                    <select id="ddlDisposicaoFornecedorAcao-Editar" className="form-control">
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
                    <label htmlFor="txtDisposicaoEmTransito-Editar">Disposicão - Em trânsito</label><br></br>
                    <input type="text" className="form-control" id="txtDisposicaoEmTransito-Editar" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlDisposicaoEmTransitoAcao-Editar">Disposicão - Em trânsito (Ação)</label><br></br>
                    <select id="ddlDisposicaoEmTransitoAcao-Editar" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsDisposicaoEmTransitoAcao.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnEditarConjunto" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade " id="modalEditarSubConjunto" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modalLargura700" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Conjuntos - Editar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label htmlFor="txtCodigoPIE-Editar-SubConjuntos">Código PIE</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtCodigoPIE-Editar-SubConjuntos" />
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="txtDescricaoCodigoPIE-Editar-SubConjuntos">Descrição do código PIE</label><span className="required"> *</span><br></br>
                    <input type="text" className="form-control" id="txtDescricaoCodigoPIE-Editar-SubConjuntos" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label htmlFor="txtCodigoPATS-Editar-SubConjuntos">Código PATS</label><br></br>
                    <input type="text" className="form-control" id="txtCodigoPATS-Editar-SubConjuntos" />
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="txtDescricaoCodigoPATS-Editar-SubConjuntos">Descricão do código PATS</label><br></br>
                    <input type="text" className="form-control" id="txtDescricaoCodigoPATS-Editar-SubConjuntos" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="ddlRevisaoAtual-Editar-SubConjuntos">Revisão atual</label><br></br>
                    <select id="ddlRevisaoAtual-Editar-SubConjuntos" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsRevisaoAtual.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtVersaoAtual-Editar-SubConjuntos">Versão Atual</label><br></br>
                    <input type="text" className="form-control" id="txtVersaoAtual-Editar-SubConjuntos" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtCSAtual-Editar-SubConjuntos">CS Atual</label><br></br>
                    <input type="text" className="form-control" id="txtCSAtual-Editar-SubConjuntos" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="ddlNovaRevisao-Editar-SubConjuntos">Nova revisão</label><br></br>
                    <select id="ddlNovaRevisao-Editar-SubConjuntos" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsNovaRevisao.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtVersaoNovaRevisao-Editar-SubConjuntos">Versão Nova Revisão</label><br></br>
                    <input type="text" className="form-control" id="txtVersaoNovaRevisao-Editar-SubConjuntos" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="txtCSNovaRevisao-Editar-SubConjuntos">CS Nova revisão</label><br></br>
                    <input type="text" className="form-control" id="txtCSNovaRevisao-Editar-SubConjuntos" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtDisposicaoEstoque-Editar-SubConjuntos">Disposição - Estoque</label><br></br>
                    <input type="text" className="form-control" id="txtDisposicaoEstoque-Editar-SubConjuntos" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlDisposicaoEstoqueAcao-Editar-SubConjuntos">Disposição - Estoque (Ação)</label><br></br>
                    <select id="ddlDisposicaoEstoqueAcao-Editar-SubConjuntos" className="form-control">
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
                    <label htmlFor="txtDisposicaoFornecedor-Editar-SubConjuntos">Disposicão - Fornecedor</label><br></br>
                    <input type="text" className="form-control" id="txtDisposicaoFornecedor-Editar-SubConjuntos" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlDisposicaoFornecedorAcao-Editar-SubConjuntos">Disposicão - Fornecedor (Ação)</label><br></br>
                    <select id="ddlDisposicaoFornecedorAcao-Editar-SubConjuntos" className="form-control">
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
                    <label htmlFor="txtDisposicaoEmTransito-Editar-SubConjuntos">Disposicão - Em trânsito</label><br></br>
                    <input type="text" className="form-control" id="txtDisposicaoEmTransito-Editar-SubConjuntos" />
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlDisposicaoEmTransitoAcao-Editar-SubConjuntos">Disposicão - Em trânsito (Ação)</label><br></br>
                    <select id="ddlDisposicaoEmTransitoAcao-Editar-SubConjuntos" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsDisposicaoEmTransitoAcao.map(function (item, key) {
                        return (
                          <option value={item}>{item}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnEditarSubConjunto" className="btn btn-success">Salvar</button>
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
                  <div className="form-group col-md-9">
                    <label htmlFor="txtCodigoPIE_PontoCorte">Código PIE</label><span className="required"> *</span><br></br>
                    <select id="ddlCodigoPIE-PontoCorte" className="form-control">
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsPIE.map(function (item, key) {
                        return (
                          <option value={item.ID}>{item.PIE}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="dtData-PontoCorte">Data</label><span className="required"> *</span><br></br>
                    <InputMask mask="99/99/9999" className="form-control" maskChar="_" id="dtData-PontoCorte" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtObservacao-PontoCorte">Observação</label><span className="required"> *</span><br></br>
                    <input maxLength={200} type="text" className="form-control" id="txtObservacao-PontoCorte" />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarPontoCorte" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalEditarPontoCorte" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Ponto de corte - Editar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md-9">
                    <label htmlFor="txtCodigoPIE_PontoCorte">Código PIE</label><span className="required"> *</span><br></br>
                    <select id="ddlCodigoPIE-PontoCorte-Editar" className="form-control" value={this.state.valorItemsPIEPontoCorteEditar} onChange={(e) => this.onChangePIEPontoCorteEditar(e.target.value)}>
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsPIE.map(function (item, key) {
                        return (
                          <option value={item.ID}>{item.PIE}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="dtData-PontoCorte-Editar">Data</label><span className="required"> *</span><br></br>
                    <InputMask mask="99/99/9999" value={this.state.valorItemsDataPontoCorteEditar} className="form-control" maskChar="_" id="dtData-PontoCorte-Editar" onChange={(e) => this.onTextChangeDataPontoCorteEditar(e.target.value)} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtObservacao-PontoCorte-Editar">Observação</label><span className="required"> *</span><br></br>
                    <input maxLength={200} type="text" className="form-control" id="txtObservacao-PontoCorte-Editar" />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnEditarPontoCorte" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalCadastrarAssistenciaTecnica" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modalLargura700" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Assistência Técnica - Cadastrar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md-9">
                    <label htmlFor="txtObservacao-AssistenciaTecnica">Observação</label><span className="required"> *</span><br></br>
                    <input maxLength={200} type="text" className="form-control" id="txtObservacao-AssistenciaTecnica" />
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="dtDataEntrega-AssistenciaTecnica">Data de entrega</label><span className="required"> *</span><br></br>
                    <InputMask mask="99/99/9999" className="form-control" maskChar="_" id="dtDataEntrega-AssistenciaTecnica" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="ddlCodigoPIE-AssistenciaTecnica">Código PIE</label><br></br>
                    <select id="ddlCodigoPIE-AssistenciaTecnica" className="form-control"  >
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsPIE.map(function (item, key) {
                        return (
                          <option value={item.ID}>{item.PIE}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlCodigoPATS-AssistenciaTecnica">Código PATS</label><br></br>
                    <select id="ddlCodigoPATS-AssistenciaTecnica" className="form-control"  >
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsPATS.map(function (item, key) {
                        return (
                          <option value={item.ID}>{item.PATS}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarAssistenciaTecnica" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalCadastrarBITRelacionado" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">BIT Relacionado - Cadastrar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtBITRelacionado">BIT Relacionado</label><span className="required"> *</span><br></br>
                    <input maxLength={200} type="text" className="form-control" id="txtBITRelacionado" />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnCadastrarBITRelacionado" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalEditarBITRelacionado" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">BIT Relacionado - Editar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="txtBITRelacionado-Editar">BIT Relacionado</label><span className="required"> *</span><br></br>
                    <input maxLength={200} type="text" className="form-control" id="txtBITRelacionado-Editar" />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnEditarBITRelacionado" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade" id="modalEditarAssistenciaTecnica" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modalLargura700" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Assistência Técnica - Editar</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="form-row">
                  <div className="form-group col-md-9">
                    <label htmlFor="txtObservacao-AssistenciaTecnica-Editar">Observação</label><span className="required"> *</span><br></br>
                    <input maxLength={200} type="text" className="form-control" id="txtObservacao-AssistenciaTecnica-Editar" />
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="dtDataEntrega-AssistenciaTecnica-Editar">Data de entrega</label><span className="required"> *</span><br></br>
                    <InputMask mask="99/99/9999" className="form-control" maskChar="_" value={this.state.valorItemsDataEntregaAssistenciaTecnica} id="dtDataEntrega-AssistenciaTecnica-Editar" onChange={(e) => this.onTextChangeDataAssistenciaTecnicaEditar(e.target.value)} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md">
                    <label htmlFor="ddlCodigoPIE-AssistenciaTecnica-Editar">Código PIE</label><br></br>
                    <select id="ddlCodigoPIE-AssistenciaTecnica-Editar" value={this.state.valorItemsPIEAssistenciaTecnica} className="form-control" onChange={(e) => this.onChangePIEAssistenciaTecnica(e.target.value)}  >
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsPIE.map(function (item, key) {
                        return (
                          <option value={item.ID}>{item.PIE}</option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="ddlCodigoPATS-AssistenciaTecnica-Editar">Código PATS</label><br></br>
                    <select id="ddlCodigoPATS-AssistenciaTecnica-Editar" value={this.state.valorItemsPATSAssistenciaTecnica} className="form-control" onChange={(e) => this.onChangePATSAssistenciaTecnica(e.target.value)}  >
                      <option value="0" selected>Selecione...</option>
                      {this.state.itemsPATS.map(function (item, key) {
                        return (
                          <option value={item.ID}>{item.PATS}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnEditarAssistenciaTecnica" className="btn btn-success">Salvar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoCadastrarConjunto" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Conjunto cadastrado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoCadastrarConjunto" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoCadastrarSubConjunto" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Sub-Conjunto cadastrado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoCadastrarSubConjunto" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoPontoCorte" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Ponto de corte cadastrado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoCadastrarPontoCorte" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoAssistenciaTecnica" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Assistência técnica cadastrada com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoCadastrarAssistenciaTecnica" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoCadastrarBITRelacionado" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                BIT relacionado cadastrado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoCadastrarBITRelacionado" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoEditarBITRelacionado" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                BIT relacionado alterado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoEditarBITRelacionado" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade" id="modalSucessoEditarAssistenciaTecnica" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Assistência técnica alterada com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoEditarAssistenciaTecnica" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>



        <div className="modal fade" id="modalSucessoEditarPontoCorte" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Ponto de corte editado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoEditarPontoCorte" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade" id="modalSucessoExcluirConjunto" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Conjunto excluido com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoExcluirConjunto" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoExcluirSubConjunto" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                SubConjunto excluido com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoExcluirSubConjunto" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoExcluirPontoCorte" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Ponto de corte excluido com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoExcluirPontoCorte" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoExcluirAssistenciaTecnica" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Assistência técnica excluida com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoExcluirAssistenciaTecnica" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucessoExcluirBITRelacionado" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                BIT relacionado excluido com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucessoExcluirBITRelacionado" className="btn btn-primary">OK</button>
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
      url: `${this.props.siteurl}/_api/Web/SiteGroups/GetByName('OMP - Aprovadores')/users?$filter=Title ne 'System Account'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
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
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Conjuntos e Subconjuntos')/items?$top=50&$filter=OMP/ID eq ${_idOMP} and Conjuntos eq 'Conjunto'`,
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
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Conjuntos e Subconjuntos')/items?$top=50&$filter=OMP/ID eq ${_idOMP} and Conjuntos eq 'Subconjunto'`,
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
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Ponto de Corte')/items?$top=50&$orderby= Created asc&$select=ID,Title,OMP/ID,PIE/PIE,PIE/ID,Data,Modified,Editor/Title&$expand=OMP,PIE,Editor&$filter=OMP/Numero eq ` + _documentoNumero,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
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
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Materiais')/items?$top=50&$orderby= Created asc&$select=ID,Title,OMP/ID,PIE/ID,PATS/ID,DataEntrega,Modified,Editor/Title,PIE/PIE,PATS/PATS&$expand=OMP,PIE,PATS,Editor&$filter=OMP/Numero eq ` + _documentoNumero,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactItemsInforAssistenciaTecnica.setState({
          itemsListaAssistenciaTecnica: resultData.d.results
        });
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

        reactItemsBITRelacionado.setState({
          itemsListaBITRelacionado: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactPIE = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Conjuntos e Subconjuntos')/items?$top=4999&$filter=OMP/ID eq ${_idOMP} and PIE ne null&$orderby= PIE`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactPIE.setState({
          itemsPIE: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    var reactPATS = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Conjuntos e Subconjuntos')/items?$top=4999&$filter=OMP/ID eq ${_idOMP} and PATS ne null&$orderby= PATS`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactPATS.setState({
          itemsPATS: resultData.d.results
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

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var numero = resultData.d.results[i].Numero;
            _documentoNumero = numero;

            var sintese = resultData.d.results[i].Title;
            var tipo = resultData.d.results[i].TipoOMP;
            var objetivo = resultData.d.results[i].Objetivo;
            var divisaoImpressora = resultData.d.results[i].DivisaoImpressoras;
            var documentosOrigem = resultData.d.results[i].DocumentosOrigem;
            _pastaCriada = resultData.d.results[i].PastaCriada;

            var status = resultData.d.results[i].Status;
            _status = status;

            var itemNovo = resultData.d.results[i].siteNovoSPOnline;

            var responsavelArea = "";
            var responsavelTecnico = "";
            var areaExecutoraFabrica = "";
            var areaExecutoraAT = "";

            if (itemNovo == "Sim") {

              responsavelArea = resultData.d.results[i].ResponsavelArea.ID;
              responsavelTecnico = resultData.d.results[i].ResponsavelTecnico.ID;
              areaExecutoraFabrica = resultData.d.results[i].AreaExecutoraFabrica.ID;
              areaExecutoraAT = resultData.d.results[i].AreaExecutoraAT.ID;

              _aprovadores.push(responsavelTecnico);
              _aprovadores.push(responsavelArea);
              _aprovadores.push(areaExecutoraFabrica);
              _aprovadores.push(areaExecutoraAT);

            } else {

              responsavelArea = "0";
              responsavelTecnico = "0";
              areaExecutoraFabrica = "0";
              areaExecutoraAT = "0";

            }

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



            var alteracoes = resultData.d.results[i].Alteracoes;
            var txtAlteracoes = "";

            if (alteracoes != null) {

              txtAlteracoes = alteracoes.replace(/<[\/]{0,1}(div)[^><]*>/g, "");

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


            var documentosAlterados = resultData.d.results[i].DocumentosAlterados;
            var txtDocumentosAlterados = "";

            if (documentosAlterados != null) {

              txtDocumentosAlterados = documentosAlterados.replace(/<[\/]{0,1}(div)[^><]*>/g, "");

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
            jQuery("#txtTitulo").val(sintese);
            jQuery("#txtDocumentosOrigem").val(documentosOrigem);
            jQuery("#txtNro").html(numero);
            jQuery("#txtStatus").html(status);


          }

          console.log("_grupos", _grupos);

          if (_grupos.indexOf("OMP - Elaboradores") !== -1) {

            jQuery("#btnValidarSalvar").show();

            if (status == "Em elaboração") {

              jQuery("#btnValidarEnviarAprovacao").show();

              jQuery("#ddlResponsavelTecnico").prop("disabled", false);
              jQuery("#ddlResponsavelArea").prop("disabled", false);
              jQuery("#ddlAreaExecutoraFabrica").prop("disabled", false);
              jQuery("#ddlAreaExecutoraAT").prop("disabled", false);

            }

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

    await _web.getFolderByServerRelativeUrl(`${strRelativeURL}/Anexos/${_documentoNumero}`).files.orderBy('TimeLastModified', true)

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

      await _web.getFolderByServerRelativeUrl(`${strRelativeURL}/Lists/Documentos/Attachments/${_idOMP}`).files.getByName(name).delete()
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

    var files = (document.querySelector("#input") as HTMLInputElement).files;
    var size: number = 0;

    if (files.length > 0) {

      console.log("files.length", files.length);

      for (var i = 0; i <= files.length - 1; i++) {

        var fsize = files.item(i).size;
        size = size + fsize;

        console.log("fsize", fsize);

      }

      if (size > 15000000) {
        alert("A soma dos arquivos não pode ser maior que 15mega!");
        size = 0;
        return false;
      }

    }


    if (opcao == "Salvar") {
      jQuery("#modalConfirmarSalvar").modal({ backdrop: 'static', keyboard: false });
    }

    else if (opcao == "Aprovar") {
      jQuery("#modalConfirmarEnviarAprovacao").modal({ backdrop: 'static', keyboard: false });
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

    var statusNovo;

    if (opcao == "Salvar") statusNovo = _status;
    else if (opcao == "Aprovar") statusNovo = "Aguardando aprovações";

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
        Status: statusNovo,
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


  protected async upload(opcao): Promise<void> {

    console.log("Entrou no upload");

    var files = (document.querySelector("#input") as HTMLInputElement).files;
    var file = files[0];

    //console.log("files.length", files.length);

    if (files.length != 0) {

      console.log("entrou com arquivo");

      if (_pastaCriada != "Sim") {

        _web.lists.getByTitle("Anexos").rootFolder.folders.add(`${_documentoNumero}`).then(async data => {

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
                _web.getFolderByServerRelativeUrl(`${_caminho}/Anexos/${_documentoNumero}`)
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

                        else if (opcao == "Aprovar") {

                          for (var i = 0; i < _aprovadores.length; i++) {
                            await this.criarTarefa(_aprovadores[i], _aprovadorFuncao[i]);
                          }

                          $("#modalCarregando").modal('hide');
                          jQuery("#modalSucessoEnviarAprovacao").modal({ backdrop: 'static', keyboard: false });

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

        console.log("pasta ja criada");

        for (var i = 0; i < files.length; i++) {

          console.log("i1", i);

          var nomeArquivo = files[i].name;
          var rplNomeArquivo = nomeArquivo.replace(/[^0123456789.,a-zA-Z]/g, '');

          //alert(rplNomeArquivo);
          //Upload a file to the SharePoint Library
          _web.getFolderByServerRelativeUrl(`${_caminho}/Anexos/${_documentoNumero}`)
            //.files.add(files[i].name, files[i], true)
            .files.add(rplNomeArquivo, files[i], true)
            .then(async data => {

              data.file.getItem().then(async item => {
                var idAnexo = item.ID;

                console.log("i2", i);
                console.log("files.length", files.length);

                if (i == files.length) {

                  console.log("anexou:" + rplNomeArquivo);

                  console.log("opcao", opcao);

                  if (opcao == "Salvar") {

                    console.log("entrou no salvar");

                    $("#modalCarregando").modal('hide');
                    jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });

                  }

                  else if (opcao == "Aprovar") {

                    for (var x = 0; x < _aprovadores.length; x++) {
                      await this.criarTarefa(_aprovadores[x], _aprovadorFuncao[x]);
                    }

                    $("#modalCarregando").modal('hide');
                    jQuery("#modalSucessoEnviarAprovacao").modal({ backdrop: 'static', keyboard: false });

                  }


                }

              })
            });
        }

      }

    } else {

      console.log("entrou sem arquivo");

      if (_pastaCriada != "Sim") {

        _web.lists.getByTitle("Anexos").rootFolder.folders.add(`${_documentoNumero}`).then(async data => {

          await _web.lists
            .getByTitle("Ordem de Modificação de Produto")
            .items.getById(_idOMP).update({
              PastaCriada: "Sim",
            })
            .then(async response => {



              if (opcao == "Salvar") {

                console.log("entrou ocpao");
                $("#modalCarregando").modal('hide');
                jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });

              }

              else if (opcao == "Aprovar") {

                for (var i = 0; i < _aprovadores.length; i++) {
                  await this.criarTarefa(_aprovadores[i], _aprovadorFuncao[i]);
                }

                $("#modalCarregando").modal('hide');
                jQuery("#modalSucessoEnviarAprovacao").modal({ backdrop: 'static', keyboard: false });

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

        else if (opcao == "Aprovar") {

          for (var i = 0; i < _aprovadores.length; i++) {
            await this.criarTarefa(_aprovadores[i], _aprovadorFuncao[i]);
          }

          $("#modalCarregando").modal('hide');
          jQuery("#modalSucessoEnviarAprovacao").modal({ backdrop: 'static', keyboard: false });

        }

      }

    }

  }


  protected async cadastrarConjuntosSubconjuntos(tipo) {

    if (tipo == "Conjunto") {

      jQuery("#btnCadastrarConjunto").prop("disabled", true);

      var codigoPIE = $("#txtCodigoPIE").val();
      var descricaoCodigoPIE = $("#txtDescricaoCodigoPIE").val();
      var codigoPATS = $("#txtCodigoPATS").val();
      var descricaoCodigoPATS = $("#txtDescricaoCodigoPATS").val();
      var revisaoAtual = $("#ddlRevisaoAtual").val();
      var versaoAtual = $("#txtVersaoAtual").val();
      var CSAtual = $("#txtCSAtual").val();
      var novaRevisao = $("#ddlNovaRevisao").val();
      var versaoNovaRevisao = $("#txtVersaoNovaRevisao").val();
      var CSNovaRevisao = $("#txtCSNovaRevisao").val();
      var disposicaoEstoque = $("#txtDisposicaoEstoqueConjuntos").val();
      var disposicaoEstoqueAcao = $("#ddlDisposicaoEstoqueAcao").val();
      var disposicaoFornecedor = $("#txtDisposicaoFornecedorConjuntos").val();
      var disposicaoFornecedorAcao = $("#ddlDisposicaoFornecedorAcao").val();
      var disposicaoEmTransito = $("#txtDisposicaoEmTransitoConjuntos").val();
      var disposicaoEmTransitoAcao = $("#ddlDisposicaoEmTransitoAcao").val();
    }

    else if (tipo == "Subconjunto") {


      jQuery("#btnCadastrarSubConjunto").prop("disabled", true);

      var codigoPIE = $("#txtCodigoPIE-SubConjuntos").val();
      var descricaoCodigoPIE = $("#txtDescricaoCodigoPIE-SubConjuntos").val();
      var codigoPATS = $("#txtCodigoPATS-SubConjuntos").val();
      var descricaoCodigoPATS = $("#txtDescricaoCodigoPATS-SubConjuntos").val();
      var revisaoAtual = $("#ddlRevisaoAtual-SubConjuntos").val();
      var versaoAtual = $("#txtVersaoAtual-SubConjuntos").val();
      var CSAtual = $("#txtCSAtual-SubConjuntos").val();
      var novaRevisao = $("#ddlNovaRevisao-SubConjuntos").val();
      var versaoNovaRevisao = $("#txtVersaoNovaRevisao-SubConjuntos").val();
      var CSNovaRevisao = $("#txtCSNovaRevisao-SubConjuntos").val();
      var disposicaoEstoque = $("#txtDisposicaoEstoque-SubConjuntos").val();
      var disposicaoEstoqueAcao = $("#ddlDisposicaoEstoqueAcao-SubConjuntos").val();
      var disposicaoFornecedor = $("#txtDisposicaoFornecedor-SubConjuntos").val();
      var disposicaoFornecedorAcao = $("#ddlDisposicaoFornecedorAcao-SubConjuntos").val();
      var disposicaoEmTransito = $("#txtDisposicaoEmTransito-SubConjuntos").val();
      var disposicaoEmTransitoAcao = $("#ddlDisposicaoEmTransitoAcao-SubConjuntos").val();

    }

    if (novaRevisao == "0") novaRevisao = null;
    if (revisaoAtual == "0") revisaoAtual = null;
    if (disposicaoEstoqueAcao == "0") disposicaoEstoqueAcao = null;
    if (disposicaoFornecedorAcao == "0") disposicaoFornecedorAcao = null;
    if (disposicaoEmTransitoAcao == "0") disposicaoEmTransitoAcao = null;

    if (codigoPIE == "") {
      alert("Forneça o código PIE!");
      jQuery("#btnCadastrarConjunto").prop("disabled", false);
      return false;
    }

    if (descricaoCodigoPIE == "") {
      alert("Forneça a descrição do Código PIE!");
      jQuery("#btnCadastrarConjunto").prop("disabled", false);
      return false;
    }


    await _web.lists
      .getByTitle("Conjuntos e Subconjuntos")
      .items.add({
        OMPId: _idOMP,
        Conjuntos: tipo,
        PIE: codigoPIE,
        Title: descricaoCodigoPIE,
        PATS: codigoPATS,
        DescricaoPATS: descricaoCodigoPATS,
        Atual: revisaoAtual,
        VersaoAtual: versaoAtual,
        CSAtual: CSAtual,
        Nova: novaRevisao,
        VersaoNova: versaoNovaRevisao,
        CSNova: CSNovaRevisao,
        DisposicaoEstoque: disposicaoEstoque,
        DisposicaoEstoqueEscolha: disposicaoEstoqueAcao,
        DisposicaoFornecedor: disposicaoFornecedor,
        DisposicaoFornecedorEscolha: disposicaoFornecedorAcao,
        DisposicaoEmtransito: disposicaoEmTransito,
        DisposicaoEmtransitoEscolha: disposicaoEmTransitoAcao,
      })
      .then(response => {

        console.log("Cadastrou");

        if (tipo == "Conjunto") {

          jQuery("#btnCadastrarConjunto").prop("disabled", false);
          jQuery("#modalCadastrarConjuntos").modal('hide');
          jQuery("#modalSucessoCadastrarConjunto").modal({ backdrop: 'static', keyboard: false });

        }
        else if (tipo == "Subconjunto") {

          jQuery("#btnCadastrarSubConjunto").prop("disabled", false);
          jQuery("#modalCadastrarSubConjuntos").modal('hide');
          jQuery("#modalSucessoCadastrarSubConjunto").modal({ backdrop: 'static', keyboard: false });

        }

      })
      .catch((error: any) => {
        console.log(error);
      })


  }

  protected async cadastrarPontoCorte() {

    jQuery("#btnCadastrarPontoCorte").prop("disabled", true);

    var codigoPIE = $("#ddlCodigoPIE-PontoCorte").val();
    var data = "" + $("#dtData-PontoCorte").val() + "";
    var observacao = $("#txtObservacao-PontoCorte").val();

    if (codigoPIE == "0") {
      alert("Forneça o Código PIE!");
      jQuery("#btnCadastrarPontoCorte").prop("disabled", false);
      return false;
    }

    if (data == "") {
      alert("Forneça uma data!");
      jQuery("#btnCadastrarPontoCorte").prop("disabled", false);
      return false;
    } else {
      var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
      if (data.match(reg)) {
      }
      else {
        alert("Forneça uma data válida!");
        jQuery("#btnCadastrarPontoCorte").prop("disabled", false);
        return false;
      }
    }

    if (observacao == "") {
      alert("Forneça uma observação!");
      jQuery("#btnCadastrarPontoCorte").prop("disabled", false);
      return false;
    }

    var dataDia = data.substring(0, 2);
    var dataMes = data.substring(3, 5);
    var dataAno = data.substring(6, 10);
    var formData = dataAno + "-" + dataMes + "-" + dataDia;

    await _web.lists
      .getByTitle("Ponto de Corte")
      .items.add({
        OMPId: _idOMP,
        PIEId: codigoPIE,
        Data: formData,
        Title: observacao

      })
      .then(response => {

        console.log("Cadastrou");

        jQuery("#btnCadastrarPontoCorte").prop("disabled", false);
        jQuery("#modalCadastrarPontoCorte").modal('hide');
        jQuery("#modalSucessoPontoCorte").modal({ backdrop: 'static', keyboard: false });

      })
      .catch((error: any) => {
        console.log(error);
      })



  }

  protected async cadastrarAssistenciaTecnica() {

    jQuery("#btnCadastrarAssistenciaTecnica").prop("disabled", true);

    var codigoPIE = $("#ddlCodigoPIE-AssistenciaTecnica").val();
    var codigoPATS = $("#ddlCodigoPATS-AssistenciaTecnica").val();
    var observacao = $("#txtObservacao-AssistenciaTecnica").val();
    var dataEntrega = "" + $("#dtDataEntrega-AssistenciaTecnica").val() + "";

    if (codigoPIE == "0") codigoPIE == null;
    if (codigoPATS == "0") codigoPATS == null;

    console.log("codigoPIE", codigoPIE);
    console.log("codigoPATS", codigoPATS);
    console.log("observacao", observacao);
    console.log("dataEntrega", dataEntrega);

    if (observacao == "") {
      alert("Forneça uma observação!");
      jQuery("#btnCadastrarAssistenciaTecnica").prop("disabled", false);
      return false;
    }

    if (dataEntrega == "") {
      alert("Forneça uma data!");
      jQuery("#btnCadastrarAssistenciaTecnica").prop("disabled", false);
      return false;
    } else {
      var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
      if (dataEntrega.match(reg)) {
      }
      else {
        alert("Forneça uma data de entrega válida!");
        jQuery("#btnCadastrarAssistenciaTecnica").prop("disabled", false);
        return false;
      }
    }


    var dataDia = dataEntrega.substring(0, 2);
    var dataMes = dataEntrega.substring(3, 5);
    var dataAno = dataEntrega.substring(6, 10);
    var formData = dataAno + "-" + dataMes + "-" + dataDia;

    await _web.lists
      .getByTitle("Materiais")
      .items.add({
        OMPId: _idOMP,
        PIEId: codigoPIE,
        PATSId: codigoPATS,
        DataEntrega: formData,
        Title: observacao

      })
      .then(response => {

        console.log("Cadastrou");

        jQuery("#btnCadastrarAssistenciaTecnica").prop("disabled", false);
        jQuery("#modalCadastrarAssistenciaTecnica").modal('hide');
        jQuery("#modalSucessoAssistenciaTecnica").modal({ backdrop: 'static', keyboard: false });

      })
      .catch((error: any) => {
        console.log(error);
      })



  }

  protected async cadastrarBITRelacionado() {

    jQuery("#btnCadastrarBITRelacionado").prop("disabled", true);

    var BITRelacionado = $("#txtBITRelacionado").val();

    if (BITRelacionado == "") {
      alert("Forneça um BIT relacionado!");
      jQuery("#btnCadastrarBITRelacionado").prop("disabled", false);
      return false;
    }

    await _web.lists
      .getByTitle("BIT relacionado")
      .items.add({
        OMPId: _idOMP,
        Title: BITRelacionado,
      })
      .then(response => {

        console.log("Cadastrou");

        jQuery("#btnCadastrarBITRelacionado").prop("disabled", false);
        jQuery("#modalCadastrarBITRelacionado").modal('hide');
        jQuery("#modalSucessoCadastrarBITRelacionado").modal({ backdrop: 'static', keyboard: false });

      })
      .catch((error: any) => {
        console.log(error);
      })


  }

  protected async editarBITRelacionado() {

    jQuery("#btnEditarBITRelacionado").prop("disabled", true);

    var BITRelacionado = $("#txtBITRelacionado-Editar").val();

    if (BITRelacionado == "") {
      alert("Forneça um BIT relacionado!");
      jQuery("#btnEditarBITRelacionado").prop("disabled", false);
      return false;
    }

    await _web.lists
      .getByTitle("BIT relacionado")
      .items.getById(_idBITRelacionado).update({
        OMPId: _idOMP,
        Title: BITRelacionado,
      })
      .then(response => {

        console.log("Editou");

        jQuery("#btnEditarBITRelacionado").prop("disabled", false);
        jQuery("#modalEditarBITRelacionado").modal('hide');
        jQuery("#modalSucessoEditarBITRelacionado").modal({ backdrop: 'static', keyboard: false });

      })
      .catch((error: any) => {
        console.log(error);
      })


  }

  protected async editarAssistenciaTecnica() {

    jQuery("#btnEditarAssistenciaTecnica").prop("disabled", true);

    var codigoPIE = $("#ddlCodigoPIE-AssistenciaTecnica-Editar").val();
    var codigoPATS = $("#ddlCodigoPATS-AssistenciaTecnica-Editar").val();
    var observacao = $("#txtObservacao-AssistenciaTecnica-Editar").val();
    var dataEntrega = "" + $("#dtDataEntrega-AssistenciaTecnica-Editar").val() + "";

    if (codigoPIE == "0") codigoPIE == null;
    if (codigoPATS == "0") codigoPATS == null;

    console.log("codigoPIE", codigoPIE);
    console.log("codigoPATS", codigoPATS);
    console.log("observacao", observacao);
    console.log("dataEntrega", dataEntrega);

    if (observacao == "") {
      alert("Forneça uma observação!");
      jQuery("#btnEditarAssistenciaTecnica").prop("disabled", false);
      return false;
    }

    if (dataEntrega == "") {
      alert("Forneça uma data!");
      jQuery("#btnEditarAssistenciaTecnica").prop("disabled", false);
      return false;
    } else {
      var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
      if (dataEntrega.match(reg)) {
      }
      else {
        alert("Forneça uma data de entrega válida!");
        jQuery("#btnEditarAssistenciaTecnica").prop("disabled", false);
        return false;
      }
    }


    var dataDia = dataEntrega.substring(0, 2);
    var dataMes = dataEntrega.substring(3, 5);
    var dataAno = dataEntrega.substring(6, 10);
    var formData = dataAno + "-" + dataMes + "-" + dataDia;

    await _web.lists
      .getByTitle("Materiais")
      .items.getById(_idAssistenciaTecnica).update({
        OMPId: _idOMP,
        PIEId: codigoPIE,
        PATSId: codigoPATS,
        DataEntrega: formData,
        Title: observacao
      })
      .then(response => {

        console.log("Editou");

        jQuery("#btnEditarAssistenciaTecnica").prop("disabled", false);
        jQuery("#modalEditarAssistenciaTecnica").modal('hide');
        jQuery("#modalSucessoEditarAssistenciaTecnica").modal({ backdrop: 'static', keyboard: false });

      })
      .catch((error: any) => {
        console.log(error);
      })



  }

  protected async editarPontoCorte() {

    jQuery("#btnEditarPontoCorte").prop("disabled", true);

    //var codigoPIE = _PIEPontoCorteEditar;
    var codigoPIE = $("#ddlCodigoPIE-PontoCorte-Editar").val();
    var data = "" + $("#dtData-PontoCorte-Editar").val() + "";
    var observacao = $("#txtObservacao-PontoCorte-Editar").val();

    console.log("codigoPIE", codigoPIE);
    console.log("data", data);
    console.log("observacao", observacao);

    if (codigoPIE == "0") {
      alert("Forneça o Código PIE!");
      jQuery("#btnEditarPontoCorte").prop("disabled", false);
      return false;
    }

    if (data == "") {
      alert("Forneça uma data!");
      jQuery("#btnEditarPontoCorte").prop("disabled", false);
      return false;
    } else {
      var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
      if (data.match(reg)) {
      }
      else {
        alert("Forneça uma data válida!");
        jQuery("#btnEditarPontoCorte").prop("disabled", false);
        return false;
      }
    }

    if (observacao == "") {
      alert("Forneça uma observação!");
      jQuery("#btnEditarPontoCorte").prop("disabled", false);
      return false;
    }

    var dataDia = data.substring(0, 2);
    var dataMes = data.substring(3, 5);
    var dataAno = data.substring(6, 10);
    var formData = dataAno + "-" + dataMes + "-" + dataDia;

    console.log("formData", formData);

    await _web.lists
      .getByTitle("Ponto de Corte")
      .items.getById(_idPontoCorte).update({
        OMPId: _idOMP,
        PIEId: codigoPIE,
        Data: formData,
        Title: observacao
      })
      .then(response => {

        console.log("Editou");

        jQuery("#btnEditarPontoCorte").prop("disabled", false);
        jQuery("#modalEditarPontoCorte").modal('hide');
        jQuery("#modalSucessoEditarPontoCorte").modal({ backdrop: 'static', keyboard: false });

      })
      .catch((error: any) => {
        console.log(error);
      })



  }

  protected async editarConjuntosSubconjuntos(tipo) {

    if (tipo == "Conjunto") {

      jQuery("#btnEditarConjunto").prop("disabled", true);

      var codigoPIE = $("#txtCodigoPIE-Editar").val();
      var descricaoCodigoPIE = $("#txtDescricaoCodigoPIE-Editar").val();
      var codigoPATS = $("#txtCodigoPATS-Editar").val();
      var descricaoCodigoPATS = $("#txtDescricaoCodigoPATS-Editar").val();
      var revisaoAtual = $("#ddlRevisaoAtual-Editar").val();
      var versaoAtual = $("#txtVersaoAtual-Editar").val();
      var CSAtual = $("#txtCSAtual-Editar").val();
      var novaRevisao = $("#ddlNovaRevisao-Editar").val();
      var versaoNovaRevisao = $("#txtVersaoNovaRevisao-Editar").val();
      var CSNovaRevisao = $("#txtCSNovaRevisao-Editar").val();
      var disposicaoEstoque = $("#txtDisposicaoEstoque-Editar").val();
      var disposicaoEstoqueAcao = $("#ddlDisposicaoEstoqueAcao-Editar").val();
      var disposicaoFornecedor = $("#txtDisposicaoFornecedor-Editar").val();
      var disposicaoFornecedorAcao = $("#ddlDisposicaoFornecedorAcao-Editar").val();
      var disposicaoEmTransito = $("#txtDisposicaoEmTransito-Editar").val();
      var disposicaoEmTransitoAcao = $("#ddlDisposicaoEmTransitoAcao-Editar").val();

    }

    else if (tipo == "Subconjunto") {

      jQuery("#btnEditarSubConjunto").prop("disabled", true);

      var codigoPIE = $("#txtCodigoPIE-Editar-SubConjuntos").val();
      var descricaoCodigoPIE = $("#txtDescricaoCodigoPIE-Editar-SubConjuntos").val();
      var codigoPATS = $("#txtCodigoPATS-Editar-SubConjuntos").val();
      var descricaoCodigoPATS = $("#txtDescricaoCodigoPATS-Editar-SubConjuntos").val();
      var revisaoAtual = $("#ddlRevisaoAtual-Editar-SubConjuntos").val();
      var versaoAtual = $("#txtVersaoAtual-Editar-SubConjuntos").val();
      var CSAtual = $("#txtCSAtual-Editar-SubConjuntos").val();
      var novaRevisao = $("#ddlNovaRevisao-Editar-SubConjuntos").val();
      var versaoNovaRevisao = $("#txtVersaoNovaRevisao-Editar-SubConjuntos").val();
      var CSNovaRevisao = $("#txtCSNovaRevisao-Editar-SubConjuntos").val();
      var disposicaoEstoque = $("#txtDisposicaoEstoque-Editar-SubConjuntos").val();
      var disposicaoEstoqueAcao = $("#ddlDisposicaoEstoqueAcao-Editar-SubConjuntos").val();
      var disposicaoFornecedor = $("#txtDisposicaoFornecedor-Editar-SubConjuntos").val();
      var disposicaoFornecedorAcao = $("#ddlDisposicaoFornecedorAcao-Editar-SubConjuntos").val();
      var disposicaoEmTransito = $("#txtDisposicaoEmTransito-Editar-SubConjuntos").val();
      var disposicaoEmTransitoAcao = $("#ddlDisposicaoEmTransitoAcao-Editar-SubConjuntos").val();

    }

    if (novaRevisao == "0") novaRevisao = null;
    if (revisaoAtual == "0") revisaoAtual = null;
    if (disposicaoEstoqueAcao == "0") disposicaoEstoqueAcao = null;
    if (disposicaoFornecedorAcao == "0") disposicaoFornecedorAcao = null;
    if (disposicaoEmTransitoAcao == "0") disposicaoEmTransitoAcao = null;

    if (codigoPIE == "") {
      alert("Forneça o código PIE!");
      jQuery("#btnCadastrarConjunto").prop("disabled", false);
      return false;
    }

    if (descricaoCodigoPIE == "") {
      alert("Forneça a descrição do Código PIE!");
      jQuery("#btnCadastrarConjunto").prop("disabled", false);
      return false;
    }

    await _web.lists
      .getByTitle("	Conjuntos e Subconjuntos")
      .items.getById(_idConjunto).update({
        PIE: codigoPIE,
        Title: descricaoCodigoPIE,
        PATS: codigoPATS,
        DescricaoPATS: descricaoCodigoPATS,
        Atual: revisaoAtual,
        VersaoAtual: versaoAtual,
        CSAtual: CSAtual,
        Nova: novaRevisao,
        VersaoNova: versaoNovaRevisao,
        CSNova: CSNovaRevisao,
        DisposicaoEstoque: disposicaoEstoque,
        DisposicaoEstoqueEscolha: disposicaoEstoqueAcao,
        DisposicaoFornecedor: disposicaoFornecedor,
        DisposicaoFornecedorEscolha: disposicaoFornecedorAcao,
        DisposicaoEmtransito: disposicaoEmTransito,
        DisposicaoEmtransitoEscolha: disposicaoEmTransitoAcao,
      })
      .then(response => {

        console.log("Editou");

        if (tipo == "Conjunto") {

          jQuery("#btnEditarConjunto").prop("disabled", false);
          jQuery("#modalEditarConjunto").modal('hide');
          jQuery("#modalSucessoEditarConjunto").modal({ backdrop: 'static', keyboard: false });

        }

        else if (tipo == "Subconjunto") {

          jQuery("#btnEditarSubConjunto").prop("disabled", false);
          jQuery("#modalEditarSubConjunto").modal('hide');
          jQuery("#modalSucessoEditarSubConjunto").modal({ backdrop: 'static', keyboard: false });

        }

      })
      .catch((error: any) => {
        console.log(error);
      })


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

  private onChangePIEPontoCorteEditar = (val) => {

    this.setState({
      valorItemsPIEPontoCorteEditar: val,
    });
  }

  private onChangePIEAssistenciaTecnica = (val) => {

    this.setState({
      valorItemsPIEAssistenciaTecnica: val,
    });
  }

  private onChangePATSAssistenciaTecnica = (val) => {

    this.setState({
      valorItemsPATSAssistenciaTecnica: val,
    });
  }

  private onTextChangeDataPontoCorteEditar = (val) => {

    this.setState({
      valorItemsDataPontoCorteEditar: val,
    });

  }

  private onTextChangeDataAssistenciaTecnicaEditar = (val) => {

    this.setState({
      valorItemsDataEntregaAssistenciaTecnica: val,
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

  protected async fecharSucesso(opcao) {

    jQuery("#modalSucesso").modal('hide');

    if (opcao == "Salvar") {

      window.location.href = `OMP-Editar.aspx?DocumentoID=${_idOMP}&DocumentoNumero=${_documentoNumero}`;

    }

    else if (opcao == "Aprovar") {

      window.location.href = `OMP-Todas.aspx`;

    }
  }

  protected async sucessoConjuntos(opcao) {

    var reactItemsConjuntos = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Conjuntos e Subconjuntos')/items?$top=50&$filter=OMP/ID eq ${_idOMP} and Conjuntos eq 'Conjunto'`,
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

    var reactPIE = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Conjuntos e Subconjuntos')/items?$top=4999&$filter=OMP/ID eq ${_idOMP} and PIE ne null&$orderby= PIE`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactPIE.setState({
          itemsPIE: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });

    if (opcao == "Salvar") jQuery("#modalSucessoCadastrarConjunto").modal('hide');
    if (opcao == "Excluir") jQuery("#modalSucessoExcluirConjunto").modal('hide');
    if (opcao == "Editar") jQuery("#modalSucessoEditarConjunto").modal('hide');

  }

  protected async sucessoSubConjuntos(opcao) {

    var reactItemsSubConjuntos = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Conjuntos e Subconjuntos')/items?$top=50&$filter=OMP/ID eq ${_idOMP} and Conjuntos eq 'Subconjunto'`,
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

    var reactPIE = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Conjuntos e Subconjuntos')/items?$top=4999&$filter=OMP/ID eq ${_idOMP} and PIE ne null&$orderby= PIE`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactPIE.setState({
          itemsPIE: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    if (opcao == "Salvar") jQuery("#modalSucessoCadastrarSubConjunto").modal('hide');
    if (opcao == "Excluir") jQuery("#modalSucessoExcluirSubConjunto").modal('hide');
    if (opcao == "Editar") jQuery("#modalSucessoEditarSubConjunto").modal('hide');

  }

  protected async sucessoPontoCorte(opcao) {

    var reactItemsPontoCorte = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Ponto de Corte')/items?$top=50&$orderby= Created asc&$select=ID,Title,OMP/ID,PIE/PIE,PIE/ID,Data,Modified,Editor/Title&$expand=OMP,PIE,Editor&$filter=OMP/Numero eq ` + _documentoNumero,
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


    if (opcao == "Salvar") jQuery("#modalSucessoPontoCorte").modal('hide');
    if (opcao == "Excluir") jQuery("#modalSucessoExcluirPontoCorte").modal('hide');
    if (opcao == "Editar") jQuery("#modalSucessoEditarPontoCorte").modal('hide');

  }

  protected async sucessoAssistenciaTecnica(opcao) {

    var reactItemsInforAssistenciaTecnica = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Materiais')/items?$top=50&$orderby= Created asc&$select=ID,Title,OMP/ID,PIE/ID,PATS/ID,DataEntrega,Modified,Editor/Title,PIE/PIE,PATS/PATS&$expand=OMP,PIE,PATS,Editor&$filter=OMP/Numero eq ` + _documentoNumero,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        console.log("resultData assistencia tecnica", resultData);
        reactItemsInforAssistenciaTecnica.setState({
          itemsListaAssistenciaTecnica: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    if (opcao == "Salvar") jQuery("#modalSucessoAssistenciaTecnica").modal('hide');
    if (opcao == "Excluir") jQuery("#modalSucessoExcluirAssistenciaTecnica").modal('hide');
    if (opcao == "Editar") jQuery("#modalSucessoEditarAssistenciaTecnica").modal('hide');

  }


  protected async sucessoBITRelacionado(opcao) {

    var reactItemsBITRelacionado = this;

    jquery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('BIT relacionado')/items?$top=50&$orderby= Created asc&$select=ID,Title,OMP/ID,Modified,Editor/Title&$expand=OMP,Editor&$filter=OMP/Numero eq ` + _documentoNumero,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        console.log("resultData assistencia tecnica", resultData);
        reactItemsBITRelacionado.setState({
          itemsListaBITRelacionado: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


    if (opcao == "Salvar") jQuery("#modalSucessoCadastrarBITRelacionado").modal('hide');
    if (opcao == "Excluir") jQuery("#modalSucessoExcluirBITRelacionado").modal('hide');
    if (opcao == "Editar") jQuery("#modalSucessoEditarBITRelacionado").modal('hide');

  }







  protected abrirModalCadastrarConjuntos(tipo) {

    // jQuery("#txtItensSetupBIOSCadastrar").val("");
    //  jQuery('#RichTextObservacaoSetupBIOSCadastrar').find('.ql-editor').html("<p><br></p>");

    if (tipo == "Conjunto") {

      jQuery("#txtCodigoPIE").val("");
      jQuery("#txtDescricaoCodigoPIE").val("");
      jQuery("#txtCodigoPATS").val("");
      jQuery("#txtDescricaoCodigoPATS").val("");
      jQuery("#ddlRevisaoAtual").val("0");
      jQuery("#txtVersaoAtual").val("");
      jQuery("#txtCSAtual").val("");
      jQuery("#ddlNovaRevisao").val("0");
      jQuery("#txtVersaoNovaRevisao").val("");
      jQuery("#txtCSNovaRevisao").val("");
      jQuery("#txtDisposicaoEstoque").val("");
      jQuery("#ddlDisposicaoEstoqueAcao").val("0");
      jQuery("#txtDisposicaoFornecedor").val("");
      jQuery("#ddlDisposicaoFornecedorAcao").val("0");
      jQuery("#txtDisposicaoEmTransito").val("");
      jQuery("#ddlDisposicaoEmTransitoAcao").val("0");
      jQuery("#txtHistoricoAlteracoes").val("");
      jQuery("#dtPontoCorte-label").val("");

      jQuery("#modalCadastrarConjuntos").modal({ backdrop: 'static', keyboard: false });

    }

    else if (tipo == "Subconjunto") {

      jQuery("#txtCodigoPIE-SubConjuntos").val("");
      jQuery("#txtDescricaoCodigoPIE-SubConjuntos").val("");
      jQuery("#txtCodigoPATS-SubConjuntos").val("");
      jQuery("#txtDescricaoCodigoPATS-SubConjuntos").val("");
      jQuery("#ddlRevisaoAtual-SubConjuntos").val("0");
      jQuery("#txtVersaoAtual-SubConjuntos").val("");
      jQuery("#txtCSAtual-SubConjuntos").val("");
      jQuery("#ddlNovaRevisao-SubConjuntos").val("0");
      jQuery("#txtVersaoNovaRevisao-SubConjuntos").val("");
      jQuery("#txtCSNovaRevisao-SubConjuntos").val("");
      jQuery("#txtDisposicaoEstoque-SubConjuntos").val("");
      jQuery("#ddlDisposicaoEstoqueAcao-SubConjuntos").val("0");
      jQuery("#txtDisposicaoFornecedor-SubConjuntos").val("");
      jQuery("#ddlDisposicaoFornecedorAcao-SubConjuntos").val("0");
      jQuery("#txtDisposicaoEmTransito-SubConjuntos").val("");
      jQuery("#ddlDisposicaoEmTransitoAcao-SubConjuntos").val("0");
      jQuery("#txtHistoricoAlteracoes-SubConjuntos").val("");
      jQuery("#dtPontoCorte-label-SubConjuntos").val("");

      jQuery("#modalCadastrarSubConjuntos").modal({ backdrop: 'static', keyboard: false });


    }

  }


  protected async excluirConjuntoSubconjunto(id, tipo) {

    var frase = "";

    if (tipo == "Conjunto") frase = "Deseja realmente excluir o conjunto?";
    else if (tipo == "Subconjunto") frase = "Deseja realmente excluir o Sub-Conjunto?";

    if (confirm(`${frase}`) == true) {

      const list = _web.lists.getByTitle("Conjuntos e Subconjuntos");
      await list.items.getById(id).recycle()
        .then(async response => {

          console.log("Item excluido!");
          if (tipo == "Conjunto") jQuery("#modalSucessoExcluirConjunto").modal({ backdrop: 'static', keyboard: false });
          else if (tipo == "Subconjunto") jQuery("#modalSucessoExcluirSubConjunto").modal({ backdrop: 'static', keyboard: false });


        })
        .catch((error: any) => {
          console.log(error);

        })


    } else {

      return false;
    }

  }

  protected async abrirModalEditarConjuntos(ID, PIE, Title, PATS, DescricaoPATS, Atual, VersaoAtual, CSAtual, Nova, VersaoNova, CSNova, DisposicaoEstoque, DisposicaoEstoqueEscolha, DisposicaoFornecedor, DisposicaoFornecedorEscolha, DisposicaoEmtransito, DisposicaoEmtransitoEscolha) {

    _idConjunto = ID;
    jQuery("#txtCodigoPIE-Editar").val(PIE);
    jQuery("#txtDescricaoCodigoPIE-Editar").val(Title);
    jQuery("#txtCodigoPATS-Editar").val(PATS);
    jQuery("#txtDescricaoCodigoPATS-Editar").val(DescricaoPATS);

    jQuery("#txtVersaoAtual-Editar").val(VersaoAtual);
    jQuery("#txtCSAtual-Editar").val(CSAtual);

    jQuery("#txtVersaoNovaRevisao-Editar").val(VersaoNova);
    jQuery("#txtCSNovaRevisao-Editar").val(CSNova);
    jQuery("#txtDisposicaoEstoque-Editar").val(DisposicaoEstoque);
    jQuery("#txtDisposicaoFornecedor-Editar").val(DisposicaoFornecedor);
    jQuery("#txtDisposicaoEmTransito-Editar").val(DisposicaoEmtransito);

    if (Atual != null) {
      jQuery("#ddlRevisaoAtual-Editar").val(Atual);
    }
    else {
      jQuery("#ddlRevisaoAtual-Editar").val("0");
    }

    if (Nova != null) {
      jQuery("#ddlNovaRevisao-Editar").val(Nova);
    }
    else {
      jQuery("#ddlNovaRevisao-Editar").val("0");
    }


    if (DisposicaoEstoqueEscolha != null) {
      jQuery("#ddlDisposicaoEstoqueAcao-Editar").val(DisposicaoEstoqueEscolha);
    }
    else {
      jQuery("#ddlDisposicaoEstoqueAcao-Editar").val("0");
    }

    if (DisposicaoFornecedorEscolha != null) {
      jQuery("#ddlDisposicaoFornecedorAcao-Editar").val(DisposicaoFornecedorEscolha);
    }
    else {
      jQuery("#ddlDisposicaoFornecedorAcao-Editar").val("0");
    }

    if (DisposicaoEmtransitoEscolha != null) {
      jQuery("#ddlDisposicaoEmTransitoAcao-Editar").val(DisposicaoEmtransitoEscolha);
    }
    else {
      jQuery("#ddlDisposicaoEmTransitoAcao-Editar").val("0");
    }

    // console.log("PontoCorte", PontoCorte);

    // var reactPontoCorte = this;
    // var dtPontoCorte = null;

    // if (PontoCorte != null) {

    //   var dataPontoCorteDia = PontoCorte.substring(0, 2);
    //   var dataPontoCorteMes = PontoCorte.substring(3, 5);
    //   var dataPontoCorteAno = PontoCorte.substring(6, 10);
    //   var formPontoCorte = dataPontoCorteAno + "/" + dataPontoCorteMes + "/" + dataPontoCorteDia;

    //   dtPontoCorte = new Date(formPontoCorte);

    // }

    // reactPontoCorte.setState({
    //   itemsValorPontoCorteConjuntos: dtPontoCorte
    // });


    jQuery("#modalEditarConjunto").modal({ backdrop: 'static', keyboard: false });

  }

  protected async abrirModalEditarSubConjuntos(ID, PIE, Title, PATS, DescricaoPATS, Atual, VersaoAtual, CSAtual, Nova, VersaoNova, CSNova, DisposicaoEstoque, DisposicaoEstoqueEscolha, DisposicaoFornecedor, DisposicaoFornecedorEscolha, DisposicaoEmtransito, DisposicaoEmtransitoEscolha) {

    _idConjunto = ID;

    jQuery("#txtCodigoPIE-Editar-SubConjuntos").val(PIE);
    jQuery("#txtDescricaoCodigoPIE-Editar-SubConjuntos").val(Title);
    jQuery("#txtCodigoPATS-Editar-SubConjuntos").val(PATS);
    jQuery("#txtDescricaoCodigoPATS-Editar-SubConjuntos").val(DescricaoPATS);
    jQuery("#txtVersaoAtual-Editar-SubConjuntos").val(VersaoAtual);
    jQuery("#txtCSAtual-Editar-SubConjuntos").val(CSAtual);
    jQuery("#txtVersaoNovaRevisao-Editar-SubConjuntos").val(VersaoNova);
    jQuery("#txtCSNovaRevisao-Editar-SubConjuntos").val(CSNova);
    jQuery("#txtDisposicaoEstoque-Editar-SubConjuntos").val(DisposicaoEstoque);
    jQuery("#txtDisposicaoFornecedor-Editar-SubConjuntos").val(DisposicaoFornecedor);
    jQuery("#txtDisposicaoEmTransito-Editar-SubConjuntos").val(DisposicaoEmtransito);

    if (Atual != null) {
      jQuery("#ddlRevisaoAtual-Editar-SubConjuntos").val(Atual);
    }
    else {
      jQuery("#ddlRevisaoAtual-Editar-SubConjuntos").val("0");
    }

    if (Nova != null) {
      jQuery("#ddlNovaRevisao-Editar-SubConjuntos").val(Nova);
    }
    else {
      jQuery("#ddlNovaRevisao-Editar-SubConjuntos").val("0");
    }


    if (DisposicaoEstoqueEscolha != null) {
      jQuery("#ddlDisposicaoEstoqueAcao-Editar-SubConjuntos").val(DisposicaoEstoqueEscolha);
    }
    else {
      jQuery("#ddlDisposicaoEstoqueAcao-Editar-SubConjuntos").val("0");
    }

    if (DisposicaoFornecedorEscolha != null) {
      jQuery("#ddlDisposicaoFornecedorAcao-Editar-SubConjuntos").val(DisposicaoFornecedorEscolha);
    }
    else {
      jQuery("#ddlDisposicaoFornecedorAcao-Editar-SubConjuntos").val("0");
    }

    if (DisposicaoEmtransitoEscolha != null) {
      jQuery("#ddlDisposicaoEmTransitoAcao-Editar-SubConjuntos").val(DisposicaoEmtransitoEscolha);
    }
    else {
      jQuery("#ddlDisposicaoEmTransitoAcao-Editar-SubConjuntos").val("0");
    }

    // console.log("PontoCorte", PontoCorte);

    // var reactPontoCorte = this;
    // var dtPontoCorte = null;

    // if (PontoCorte != null) {

    //   var dataPontoCorteDia = PontoCorte.substring(0, 2);
    //   var dataPontoCorteMes = PontoCorte.substring(3, 5);
    //   var dataPontoCorteAno = PontoCorte.substring(6, 10);
    //   var formPontoCorte = dataPontoCorteAno + "/" + dataPontoCorteMes + "/" + dataPontoCorteDia;

    //   dtPontoCorte = new Date(formPontoCorte);

    // }

    // reactPontoCorte.setState({
    //   itemsValorPontoCorteSubConjuntos: dtPontoCorte
    // });


    jQuery("#modalEditarSubConjunto").modal({ backdrop: 'static', keyboard: false });

  }

  protected criarTarefa(aprovador, funcao): Promise<number> {
    return new Promise<number>(resolve => {
      setTimeout(async () => {

        console.log("Entrou na criação da tarefa");
        console.log("_numeroOMP", _documentoNumero);
        console.log("aprovador", aprovador);

        var nroAprovador = parseInt(aprovador);

        resolve(

          await _web.lists
            .getByTitle("Tarefas")
            .items.add({
              Title: `${funcao}`,
              AssignedToId: nroAprovador,
              Status: "Em Andamento",
              NroOMP: `${_documentoNumero}`
            })
            .then(async response => {
              console.log(`criou tarefa pra o aprovador"${aprovador}"!!`);
            })
            .catch((error: any) => {
              console.log(error);
            })
        );
      }, 1500);
    });
  }

  protected abrirModalCadastrarPontoCorte() {

    $("#ddlCodigoPIE-PontoCorte").val("0");
    $("#dtData-PontoCorte").val("");
    $("#txtObservacao-PontoCorte").val("");
    jQuery("#modalCadastrarPontoCorte").modal({ backdrop: 'static', keyboard: false });

  }

  protected abrirModalCadastrarAssistenciaTecnica() {

    $("#txtObservacao-AssistenciaTecnica").val("");
    $("#dtDataEntrega-AssistenciaTecnica").val("");
    $("#ddlCodigoPIE-AssistenciaTecnica").val("0");
    $("#ddlCodigoPATS-AssistenciaTecnica").val("0");
    jQuery("#modalCadastrarAssistenciaTecnica").modal({ backdrop: 'static', keyboard: false });

  }

  protected abrirModalCadastrarBITRelacionado() {

    $("#txtBITRelacionado").val("");
    jQuery("#modalCadastrarBITRelacionado").modal({ backdrop: 'static', keyboard: false });

  }

  private onFormatDate = (date: Date): string => {
    //return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
  };

  protected voltar() {
    history.back();
  }




}
