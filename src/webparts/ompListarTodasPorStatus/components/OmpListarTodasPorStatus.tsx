import * as React from 'react';
import styles from './OmpListarTodasPorStatus.module.scss';
import { IOmpListarTodasPorStatusProps } from './IOmpListarTodasPorStatusProps';
import { escape } from '@microsoft/sp-lodash-subset';

import * as jQuery from "jquery";
import BootstrapTable from 'react-bootstrap-table-next';
//Import from @pnp/sp    
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import { Web } from "sp-pnp-js";

import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { selectFilter } from 'react-bootstrap-table2-filter';
import { numberFilter } from 'react-bootstrap-table2-filter';
import { Comparator } from 'react-bootstrap-table2-filter';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");

var _web;
var _grupos;

export interface IShowEmployeeStates {
  itemsList: any[],

}

const customFilter = textFilter({
  placeholder: ' ',  // custom the input placeholder
});


const empTablecolumns = [
  {
    dataField: "Numero",
    text: "Numero",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "Title",
    text: "Síntese",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "TipoOMP",
    text: "TipoOMP",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "Objetivo",
    text: "Objetivo",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "Status",
    text: "Status",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    classes: 'text-center',
    filter: customFilter
  },
  {
    dataField: "Created",
    text: "Data de criação",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: customFilter,
    classes: 'text-center',
    formatter: (rowContent, row) => {
      var dataCriacao = new Date(row.Created);
      var dtdataCriacao = ("0" + dataCriacao.getDate()).slice(-2) + '/' + ("0" + (dataCriacao.getMonth() + 1)).slice(-2) + '/' + dataCriacao.getFullYear() + ' ' + ("0" + (dataCriacao.getHours())).slice(-2) + ':' + ("0" + (dataCriacao.getMinutes())).slice(-2);
      return dtdataCriacao;
    }
  },
  {
    dataField: "Author.Title",
    text: "Criado por",
    headerStyle: { backgroundColor: '#bee5eb' },
    sort: true,
    filter: customFilter
  },
  {
    dataField: "",
    text: "",
    headerStyle: { "backgroundColor": "#bee5eb", "width": "130px" },
    formatter: (rowContent, row) => {
      var id = row.ID;
      var status = row.Status
      var urlDetalhes = `OMP-Detalhes.aspx?DocumentoID=` + id;
      var urlEditar = `OMP-Editar.aspx?DocumentoID=` + id;

      return (
        <>
          <a href={urlDetalhes}><button className="btn btn-info btnCustom btn-sm">Exibir</button></a>&nbsp;
          <a href={urlEditar}><button className="btn btn-danger btnCustom btn-sm">Editar</button></a>
        </>
      )


    }
  }
]

const paginationOptions = {
  sizePerPage: 20,
  hideSizePerPage: true,
  hidePageListOnlyOnePage: true
};



export default class OmpListarTodasPorStatus extends React.Component<IOmpListarTodasPorStatusProps, IShowEmployeeStates> {

  constructor(props: IOmpListarTodasPorStatusProps) {
    super(props);
    this.state = {
      itemsList: []
    }
  }

  public async componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);

    console.log("this.props.statusDocumento", this.props.statusDocumento);

    jQuery('#txtCount').html("0");

    var statusDocumento = this.props.statusDocumento;

    await _web.currentUser.get().then(f => {
      console.log("user", f);
      var id = f.Id;

      var grupos = [];

      jQuery.ajax({
        url: `${this.props.siteurl}/_api/web/GetUserById(${id})/Groups`,
        type: "GET",
        headers: { 'Accept': 'application/json; odata=verbose;' },
        async: false,
        success: async function (resultData) {

          console.log("resultDataGrupo", resultData);

          if (resultData.d.results.length > 0) {

            for (var i = 0; i < resultData.d.results.length; i++) {

              grupos.push(resultData.d.results[i].Title);

            }

          }

        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }

      })

      console.log("grupos", grupos);
      _grupos = grupos;
    })

    var reactHandlerDocumentos = this;
    var ano = new Date().getFullYear() ;

    if (statusDocumento == "Todos") var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Ordem de Modificação de Produto')/items?$top=4999&$orderby= ID desc&$select=ID,Title,Numero,TipoOMP,Objetivo,Status,Created,Author/Title&$expand=Author`;
    else if (statusDocumento == "Em elaboração") var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Ordem de Modificação de Produto')/items?$top=4999&$orderby= ID desc&$select=ID,Title,Numero,TipoOMP,Objetivo,Status,Created,Author/Title&$expand=Author&$filter= Status eq 'Em elaboração'`;
    else if (statusDocumento == "Aguardando aprovações") var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Ordem de Modificação de Produto')/items?$top=4999&$orderby= ID desc&$select=ID,Title,Numero,TipoOMP,Objetivo,Status,Created,Author/Title&$expand=Author&$filter= Status eq 'Aguardando aprovações'`;
    else if (statusDocumento == "Cancelada") var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Ordem de Modificação de Produto')/items?$top=4999&$orderby= ID desc&$select=ID,Title,Numero,TipoOMP,Objetivo,Status,Created,Author/Title&$expand=Author&$filter= Status eq 'Cancelada'`;
    else if (statusDocumento == "Fechada") var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Ordem de Modificação de Produto')/items?$top=4999&$orderby= ID desc&$select=ID,Title,Numero,TipoOMP,Objetivo,Status,Created,Author/Title&$expand=Author&$filter=((Modified ge '${ano}-01-01') and (Status eq 'Fechada'))`;

    jQuery.ajax({
      url: url,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        jQuery('#txtCount').html(resultData.d.results.length);
        reactHandlerDocumentos.setState({
          itemsList: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });


  }

  public render(): React.ReactElement<IOmpListarTodasPorStatusProps> {

    

    return (

      <><p>Resultado: <span className="text-info" id="txtCount"></span> proposta(s) encontrada(s)</p>
        <div className={styles.container}>
          <BootstrapTable bootstrap4 responsive condensed hover={true} className="gridTodosItens" id="gridTodosItens" keyField='id' data={this.state.itemsList} columns={empTablecolumns} headerClasses="header-class" pagination={paginationFactory(paginationOptions)} filter={filterFactory()} />
        </div></>

    );


  }
}
