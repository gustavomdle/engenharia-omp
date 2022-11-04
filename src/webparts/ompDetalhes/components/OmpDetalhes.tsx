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



var _documentoID;
var _url;
var _arrNomeArquivo;
var _arrNomeArquivoAttachmentFiles;

export interface IReactGetItemsState {

  itemsListOMP: [],

}

export default class OmpDetalhes extends React.Component<IOmpDetalhesProps, IReactGetItemsState> {

  public async componentDidMount() {

    var queryParms = new UrlQueryParameterCollection(window.location.href);
    _documentoID = parseInt(queryParms.getValue("DocumentoID"));

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
                      <b>DIPS Nro: <span id='txtNro'></span></b><br></br>
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
                      <div id='conteudoAnexos'></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header btn" id="headingAnexos" data-toggle="collapse" data-target="#collapseAnexos" aria-expanded="true" aria-controls="collapseAnexos">
              <h5 className="mb-0 text-info">
                Conjuntos
              </h5>
            </div>
            <div id="collapseAnexos" className="collapse show" aria-labelledby="headingOne">
              <div className="card-body">

                <div className="form-group border m-10 padding10">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtSintese">Código PIE</label><br></br>
                      <span className="text-info" id='txtSintese'>74.716.00820-7</span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtTipo">Descrição</label><br></br>
                      <span className="text-info" id='txtTipo'>COFRE 1/2" P 1/2" LEVEL 2V1E1 C/ CDP10 DN400 ROHS</span>
                    </div>
                  </div>
                </div>

                <div className="form-group border m-10 padding10">
                  <div className="form-row">
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtSintese">Código PATS</label><br></br>
                      <span className="text-info" id='txtSintese'>4434454</span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtTipo">Descrição</label><br></br>
                      <span className="text-info" id='txtTipo'>COFRE 4545 444454 545454</span>
                    </div>
                  </div>
                </div>

                <div className="form-group border m-10 padding10">
                  <div className="form-row">
                    <div className="form-group col-md border m-1 alinhamentoMeio">
                      <label htmlFor="txtSintese">Atual</label><br></br>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtTipo">Revisão</label><br></br>
                      <span className="text-info" id='txtTipo'>00</span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtSintese">Versão</label><br></br>
                      <span className="text-info" id='txtSintese'>1.0</span>
                    </div>
                    <div className="form-group col-md border m-1">
                      <label htmlFor="txtSintese">CS</label><br></br>
                      <span className="text-info" id='txtSintese'>1234 564</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>



        </div>

        <div className="text-right">
          <button style={{ "margin": "2px" }} id="btnEditarDocumento2" className="btn btn-success">Editar</button><br></br><br></br>
        </div>

        <div className='hidden'>
          <FontAwesomeIcon icon={faFile} />;
        </div>

      </div>











    );


  }


  protected handler() {

    var reactHandlerOMP = this;

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Ordem de Modificação de Produto')/items?$top=4999&$orderby= ID desc&$select=ID,Title,Numero,TipoOMP,Objetivo,Status,Created,Author/Title,DivisaoImpressoras,CIProducao,CIAssistenciaTecnica,CIObservacao,DescricaoProblema,SolucaoEncontrada,Alteracoes,DocumentosAlterados,DocumentosOrigem,ResponsavelTecnico/Title,ResponsavelArea/Title,AreaExecutoraFabrica/Title,AreaExecutoraAT/Title,siteNovoSPOnline,txtResponsavelTecnico,txtResponsavelArea,txtAreaExecutoraFabrica,txtAreaExecutoraAT&$expand=Author,ResponsavelTecnico,ResponsavelArea,AreaExecutoraFabrica,AreaExecutoraAT&$filter=ID eq ` + _documentoID,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        console.log("resultData", resultData);

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var numero = resultData.d.results[i].Numero;
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


  }


  protected getAnexos() {

    var montaAnexo = "";
    var url = `${this.props.siteurl}/_api/web/lists/getByTitle('Ordem de Modificação de Produto')/items('${_documentoID}')/AttachmentFiles`;
    _url = this.props.siteurl;
    console.log("url", url);

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
        success: function (data, status, xhr) {

          var dataresults = data.d.results;

          // _testeGus = data.d.results;

          console.log("dataresults", dataresults);

          for (var i = 0; i < dataresults.length; i++) {

            var nomeArquivo = dataresults[i]["FileName"];

            console.log("nomeArquivo", nomeArquivo);
            // _arrNomeArquivo.push(nomeArquivo);
            // _arrNomeArquivoAttachmentFiles.push(nomeArquivo);

            //  montaAnexo += `<img class='imagensDIPS' src='${_url}/Lists/Documentos/Attachments/${_documentoID}/${nomeArquivo}'></img><br/><br/>`;

            montaAnexo += `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file" class="svg-inline--fa fa-file cinza " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z"></path></svg>
            <a href='${_url}/Lists/Documentos/Attachments/${_documentoID}/${nomeArquivo}'>${nomeArquivo}</a><br>`;


          }


        },
        error: function (xhr, status, error) {
          console.log("Falha anexo");
        }
      }).catch((error: any) => {
        console.log("Erro Anexo do item: ", error);
      });

    console.log("montaAnexo", montaAnexo);

    $("#conteudoAnexos").append(montaAnexo);


  }

}
