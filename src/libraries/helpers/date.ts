/* eslint-disable no-bitwise */
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import moment from 'moment';

export const toMomentFromTimestamp = (
  timestamp: number
): moment.Moment | null => {
  if (timestamp <= 0) {
    return null;
  }

  return moment(timestamp / 1000000);
};

export const toDate = (
  date?: google_protobuf_timestamp_pb.Timestamp
): string => {
  if (!date) {
    return '';
  }

  return moment(date.toDate()).format('MMM D, YYYY');
};

export const toTime = (
  date?: google_protobuf_timestamp_pb.Timestamp
): string => {
  if (!date) {
    return '';
  }

  return moment(date.toDate()).format('h:mm A');
};

/**
 * return in format e.g. "a few seconds ago"
 * @param date
 */
export const toTimeElapsed = (
  date: google_protobuf_timestamp_pb.Timestamp | undefined,
  serverTimeOffset: number
): string => {
  if (!date) {
    return '';
  }

  return moment(date.toDate()).add(serverTimeOffset, 'ms').fromNow();
};

/**
 * Return in format "1m 22s"
 * @param date
 */
export const toTimeElapsedShortened = (
  date: google_protobuf_timestamp_pb.Timestamp | undefined,
  serverTimeOffset: number
): string => {
  if (!date) {
    return '';
  }

  const diffInMs = moment().diff(moment(date.toDate())) + serverTimeOffset;
  const diffInS = (diffInMs / 1000) | 0;
  return toHumanReadableSeconds(diffInS);
};

export const toHumanReadableSeconds = (seconds: number): string => {
  const minute = (seconds / 60) | 0;
  const sec = seconds % 60;
  return `${minute > 0 ? `${minute}m ` : ''}${
    sec !== 0 ? `${seconds % 60}s` : ''
  }`;
};
