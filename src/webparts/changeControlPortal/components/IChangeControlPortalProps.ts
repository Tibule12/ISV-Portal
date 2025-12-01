import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IChangeControlPortalProps {
  description: string;
  context: WebPartContext; // WebPartContext
  listName?: string; // Optional SharePoint list name for change requests
  useLocalBackend?: boolean; // If true, fetch data from serverUrl instead of SharePoint
  serverUrl?: string; // Local backend server url (e.g., http://localhost:3000)
}
