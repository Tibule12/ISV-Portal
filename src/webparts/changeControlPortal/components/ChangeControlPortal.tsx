import * as React from 'react';
import styles from './ChangeControlPortal.module.scss';
import { IChangeControlPortalProps } from './IChangeControlPortalProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

interface IChangeRequest {
  Id: number;
  RequestID?: string;
  Title?: string;
  RequestorName?: string;
  RequestorEmail?: string;
  Department?: string;
  Summary?: string;
  Description?: string;
  ChangeType?: string;
  Priority?: string;
  TargetDate?: string;
  Status?: string;
  SubmittedDate?: string;
}

interface IChangeControlPortalState {
  requests: IChangeRequest[];
  loading: boolean;
  error: string | null;
}

export default class ChangeControlPortal extends React.Component<IChangeControlPortalProps, IChangeControlPortalState> {
  constructor(props: IChangeControlPortalProps) {
    super(props);
    this.state = {
      requests: [],
      loading: false,
      error: null
    };
  }

  public componentDidMount(): void {
    if (this.props.context) {
      this.fetchRequests();
    }
  }

  public componentDidUpdate(prevProps: IChangeControlPortalProps): void {
    if ((this.props.listName !== prevProps.listName) ||
        (this.props.context !== prevProps.context) ||
        (this.props.useLocalBackend !== prevProps.useLocalBackend) ||
        (this.props.serverUrl !== prevProps.serverUrl)) {
      if (this.props.context) {
        this.fetchRequests();
      }
    }
  }

  private async fetchRequests(): Promise<void> {
    this.setState({ loading: true, error: null });
    try {
      // If configured to use local backend, fetch from server URL
      if (this.props.useLocalBackend && this.props.serverUrl) {
        const response = await fetch(`${this.props.serverUrl}/api/requests`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const requests: IChangeRequest[] = await response.json();
        this.setState({ requests, loading: false });
        return;
      }

      const siteUrl = this.props.context.pageContext.web.absoluteUrl;
      const listName = this.props.listName || 'ISV Change Requests';
      const encodedList = encodeURIComponent(listName);
      const selectFields = 'Id,RequestID,Title,Status,Priority,Department,SubmittedDate';
      const restUrl = `${siteUrl}/_api/web/lists/GetByTitle('${encodedList}')/items?$select=${selectFields}&$top=100`;

      const response: SPHttpClientResponse = await this.props.context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1, {
        headers: { 'Accept': 'application/json;odata=nometadata' }
      });

      if (!response.ok) {
        throw new Error(`SharePoint REST error: ${response.status}`);
      }
      const json = await response.json();
      const requests: IChangeRequest[] = json.value || [];
      this.setState({ requests, loading: false });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'Failed to fetch requests',
        loading: false
      });
    }
  }

  public render(): React.ReactElement<IChangeControlPortalProps> {
    const { requests, loading, error } = this.state;

    return (
      <div className={styles.changeControlPortal}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Change Control Portal</span>
              <p className={styles.subTitle}>Manage and track change requests</p>
              {this.props.description && (
                <p className={styles.description}>{escape(this.props.description)}</p>
              )}

              {loading && <div>Loading requests...</div>}
              {error && <div style={{ color: 'red' }}>Error: {error}</div>}

              {requests.length > 0 && (
                <div>
                  <h3>Recent Change Requests</h3>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {requests.map(request => (
                      <div key={request.Id} style={{
                        border: '1px solid #ddd',
                        padding: '10px',
                        margin: '5px 0',
                        borderRadius: '4px'
                      }}>
                        <strong>{request.Title}</strong>
                        <div>Request ID: {request.RequestID}</div>
                        <div>Status: {request.Status}</div>
                        <div>Priority: {request.Priority}</div>
                        <div>Department: {request.Department}</div>
                        <div>Submitted: {new Date(request.SubmittedDate).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {requests.length === 0 && !loading && !error && (
                <div>No change requests found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
