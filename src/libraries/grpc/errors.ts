export enum ErrorCodes {
  OK = 0,
  CANCELLED,
  UNKNOWN,
  INVALID_ARGUMENT,
  DEADLINE_EXCEEDED,
  NOT_FOUND,
  ALREADY_EXISTS,
  PERMISSION_DENIED,
  UNAUTHENTICATED,
  RESOURCE_EXHAUSTED,
  FAILED_PRECONDITION,
  ABORTED,
  OUT_OF_RANGE,
  UNIMPLEMENTED,
  INTERNAL,
  UNAVAILABLE,
  DATA_LOSS,
}

export const isPermissionDenied = (message: string): boolean =>
  message === 'you do not have permission to make this call';

// nginx-proxy terminated due to idle connections
export const isGRPCStreamTimeout = (code: number, message: string): boolean =>
  code === ErrorCodes.UNKNOWN &&
  (message.startsWith('Response closed without headers') ||
    message.startsWith('Response closed without grpc-status'));
