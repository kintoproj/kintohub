import { JobStatus } from 'types/service';

/**
 * This state stores the service that is currently browsing on ServiceManage page
 * But this is not the exact GRPC model. this will contain only part of the information we needed
 * (and as GRPC model is an object and serializing it is not convenience for modifying it)
 *
 * What kind of data should put it here?
 * Fields that goes into SidePanel and it will be modified in SidePanel
 * And the changes should reflect outside the SidePanel
 * e.g. CustomDomains
 */
export interface ServiceState {
  serviceName: string;
  domains: string[];
  jobStatusMap: {
    [instanceName: string]: JobStatus;
  };
}
