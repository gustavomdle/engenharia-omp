import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'OmpListarTodasPorStatusWebPartStrings';
import OmpListarTodasPorStatus from './components/OmpListarTodasPorStatus';
import { IOmpListarTodasPorStatusProps } from './components/IOmpListarTodasPorStatusProps';

export interface IOmpListarTodasPorStatusWebPartProps {
  description: string;
  statusDocumento: string
}

export default class OmpListarTodasPorStatusWebPart extends BaseClientSideWebPart<IOmpListarTodasPorStatusWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IOmpListarTodasPorStatusProps> = React.createElement(
      OmpListarTodasPorStatus,
      {
        description: this.properties.description,
        context: this.context,
        siteurl: this.context.pageContext.web.absoluteUrl,
        statusDocumento: this.properties.statusDocumento,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('statusDocumento', {
                  label: "Status do Documento"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
