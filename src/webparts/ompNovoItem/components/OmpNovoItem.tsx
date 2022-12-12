import * as React from 'react';
import styles from './OmpNovoItem.module.scss';
import { IOmpNovoItemProps } from './IOmpNovoItemProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

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
var _numeroOMP;

export interface IReactGetItemsState {

  itemsTipo: [],
  itemsObjetivo: [],
  itemsDivisaoImpressora: [],
  itemsProducao: [];
  itemsAssistenciaTecnica: [];
  itemsAprovadores: [
    {
      "Id": "",
      "Title": "",
    }],

}

export default class OmpNovoItem extends React.Component<IOmpNovoItemProps, IReactGetItemsState> {

  public constructor(props: IOmpNovoItemProps, state: IReactGetItemsState) {
    super(props);
    this.state = {

      itemsTipo: [],
      itemsObjetivo: [],
      itemsDivisaoImpressora: [],
      itemsProducao: [],
      itemsAssistenciaTecnica: [],
      itemsAprovadores: [
        {
          "Id": "",
          "Title": "",
        }],

    };
  }

  public componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);
    _caminho = this.props.context.pageContext.web.serverRelativeUrl;

    document
      .getElementById("btnValidarSalvar")
      .addEventListener("click", (e: Event) => this.validar());

    document
      .getElementById("btnSalvar")
      .addEventListener("click", (e: Event) => this.salvar());

    document
      .getElementById("btnSucesso")
      .addEventListener("click", (e: Event) => this.fecharSucesso());

    jQuery("#conteudoLoading").html(`<br/><br/><img style="height: 80px; width: 80px" src='${_caminho}/SiteAssets/loading.gif'/>
      <br/>Aguarde....<br/><br/>
      Dependendo do tamanho do anexo e a velocidade<br>
       da Internet essa ação pode demorar um pouco. <br>
       Não fechar a janela!<br/><br/>`);

    this.handler();

  }

  public render(): React.ReactElement<IOmpNovoItemProps> {

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
                      <select id="ddlTipo" className="form-control" style={{ "width": "280px" }}>
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
                      <select id="ddlObjetivo" className="form-control" style={{ "width": "280px" }}>
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
                      <select id="ddlDivisaoImpressoras" className="form-control" style={{ "width": "280px" }}>
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
                            <input className="form-check-input" name='checkProducao' type="checkbox" value={item} />
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
                            <input className="form-check-input" name='checkAssitenciaTecnica' type="checkbox" value={item} />
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
                  <RichText className="editorRichTex" value=""
                    onChange={(text) => this.onTextChangeObservacao(text)} />
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
                  <RichText className="editorRichTex" value=""
                    onChange={(text) => this.onTextChangeDescricaoProblema(text)} />
                </div>

                <div className="form-group">
                  <label htmlFor="txtDadosProposta">Solução encontrada</label><span className="required"> *</span>
                  <RichText className="editorRichTex" value=""
                    onChange={(text) => this.onTextChangeSolucaoEncontrada(text)} />
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
                  <RichText className="editorRichTex" value=""
                    onChange={(text) => this.onTextChangeAlteracoes(text)} />
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
                  <RichText className="editorRichTex" value=""
                    onChange={(text) => this.onTextChangeDocumentosAlterados(text)} />
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

                      <select id="ddlResponsavelTecnico" className="form-control">
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

                      <select id="ddlResponsavelArea" className="form-control">
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

                      <select id="ddlAreaExecutoraFabrica" className="form-control">
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

                      <select id="ddlAreaExecutoraAT" className="form-control">
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

                    <div className="form-group col-md" >

                    </div>

                  </div>
                  <br />
                  <p className='text-info'>Total máximo permitido: 15 MB</p>

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
                <button id="btnSalvar" type="button" className="btn btn-primary">Criar OMP</button>
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
                OMP criada com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucesso" className="btn btn-primary">OK</button>
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


  protected async validar() {

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



    jQuery("#modalConfirmarSalvar").modal({ backdrop: 'static', keyboard: false });

  }

  protected async salvar() {

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

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Controle da numeração')/items?$top=1&$orderby= ID desc&$select=ID,Numeracao&$filter=Tipo_x0020_da_x0020_OMP eq '${tipo}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: async (resultData) => {

        console.log("resultData", resultData);

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var numeracao = 0;

            numeracao = resultData.d.results[i].Numeracao;
            numeracao++;

            var idControle = resultData.d.results[i].ID;

            console.log("numeracao", numeracao);

            await _web.lists
              .getByTitle("Ordem de Modificação de Produto")
              .items.add({
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
                Numero: `${numeracao}`,
                siteNovoSPOnline: "Sim"

              })
              .then(async response => {

                console.log("Gravou OMP!!");
                _idOMP = response.data.ID;
                _numeroOMP = response.data.ID;

                await _web.lists
                  .getByTitle("Controle da numeração")
                  .items.getById(idControle).update({
                    Numeracao: numeracao,
                  })
                  .then(response => {

                    this.upload();

                  })
                  .catch((error: any) => {
                    console.log(error);
                  })

              }).catch(err => {
                console.log("err", err);
              });
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });



  }


  protected upload() {

    console.log("Entrou no upload");

    var files = (document.querySelector("#input") as HTMLInputElement).files;
    var file = files[0];

    //console.log("files.length", files.length);

    if (files.length != 0) {

      console.log("entrou com arquivo");

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
                      $("#modalCarregando").modal('hide');
                      jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false })
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

      //const folderAddResult = _web.folders.add(`${_caminho}/Anexos/${_idProposta}`);
      //console.log("foi");

    } else {

      console.log("entrou sem arquivo");

      _web.lists.getByTitle("Anexos").rootFolder.folders.add(`${_idOMP}`).then(async data => {

        await _web.lists
          .getByTitle("Ordem de Modificação de Produto")
          .items.getById(_idOMP).update({
            PastaCriada: "Sim",
          })
          .then(async response => {

            $("#modalCarregando").modal('hide');
            jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false });

          }).catch(err => {
            console.log("err", err);
          });

      }).catch(err => {
        console.log("err", err);
      });

    }

  }


  protected async fecharSucesso() {

    jQuery("#modalSucesso").modal('hide');
    window.location.href = `OMP-Editar.aspx?DocumentoID=${_idOMP}&DocumentoNumero=${_numeroOMP}`;
  }


}
