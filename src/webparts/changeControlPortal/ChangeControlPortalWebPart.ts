import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ChangeControlPortalWebPartStrings';
import ChangeControlPortal from './components/ChangeControlPortal';
import { IChangeControlPortalProps } from './components/IChangeControlPortalProps';

export interface IChangeControlPortalWebPartProps {
  description: string;
  listName: string;
  useLocalBackend?: boolean;
  serverUrl?: string;
}

export default class ChangeControlPortalWebPart extends BaseClientSideWebPart<IChangeControlPortalWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IChangeControlPortalProps> = React.createElement(
      ChangeControlPortal,
      {
        description: this.properties.description,
        context: this.context,
        listName: this.properties.listName || 'ISV Change Requests',
        useLocalBackend: !!this.properties.useLocalBackend,
        serverUrl: this.properties.serverUrl || 'http://localhost:3000'
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
                PropertyPaneTextField('listName', {
                  label: 'SharePoint List Name (optional)'
                })
                ,
                PropertyPaneTextField('serverUrl', {
                  label: 'Local Backend Server URL (optional)'
                }),
                PropertyPaneToggle('useLocalBackend', {
                  label: 'Use Local Backend (for demo without SharePoint)'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
