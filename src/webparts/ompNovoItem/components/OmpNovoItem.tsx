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

export interface IReactGetItemsState {

  itemsTipo: [],
  itemsObjetivo: [],
  itemsDivisaoImpressora: [],

}

export default class OmpNovoItem extends React.Component<IOmpNovoItemProps, IReactGetItemsState> {

  public constructor(props: IOmpNovoItemProps, state: IReactGetItemsState) {
    super(props);
    this.state = {

      itemsTipo: [],
      itemsObjetivo: [],
      itemsDivisaoImpressora: [],

    };
  }

  public componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);
    _caminho = this.props.context.pageContext.web.serverRelativeUrl;

    this.handler();

  }

  public render(): React.ReactElement<IOmpNovoItemProps> {

    return (


      <div id="container">

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
                      <label htmlFor="txtSSTGira">Título</label><span className="required"> *</span>
                      <input type="text" className="form-control" id="txtTitulo" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-row">
                    <div className="form-group col-md">
                      <label htmlFor="txtSSTGira">Tipo</label><span className="required"> *</span>
                      <select id="ddlSistemaOperacional" className="form-control" style={{ "width": "280px" }} >
                        <option value="0" selected>Selecione...</option>
                        {this.state.itemsTipo.map(function (item, key) {
                          return (
                            <option value={item}>{item}</option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="form-group col-md">
                      <label htmlFor="txtSSTGira">Objetivo</label><span className="required"> *</span>
                      <select id="ddlSistemaOperacional" className="form-control" style={{ "width": "280px" }} >
                        <option value="0" selected>Selecione...</option>
                        {this.state.itemsObjetivo.map(function (item, key) {
                          return (
                            <option value={item}>{item}</option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="form-group col-md">
                      <label htmlFor="txtSSTGira">Divisão de impressoras?</label><span className="required"> *</span>
                      <select id="ddlSistemaOperacional" className="form-control" style={{ "width": "280px" }} >
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

        </div>


      </div>


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

  }
}
