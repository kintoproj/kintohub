import { useEffect, useRef } from 'react';
import moment from 'moment';

type OnDataUpdate<T> = (data: T[]) => void

type PushData<T> = (data: T) => void

type Buffer<T> = {
  buffer: T[],
  nextUpdate: moment.Moment
}

// custom hooks
export const useBuffer = <T,>(
  onDataUpdate: OnDataUpdate<T>,
  delayInSeconds: number = 1
): PushData<T> => {
  const bufferRef = useRef<Buffer<T>>({
    buffer: [],
    nextUpdate: moment(),
  });


  useEffect(() => {
    const pushBuffer = setInterval(() => {
      if (bufferRef.current.buffer.length > 0) {
        onDataUpdate(bufferRef.current.buffer);
        bufferRef.current = {
          buffer: [],
          nextUpdate: moment(),
        }
      }
    }, 1000);

    return () => {
      clearInterval(pushBuffer);
    };
  }, []);


  return (data: T) => {
    bufferRef.current.buffer.push(data);
    if (moment().isAfter(bufferRef.current.nextUpdate)) {
      onDataUpdate(bufferRef.current.buffer);
      bufferRef.current = {
        buffer: [],
        nextUpdate: moment().add(delayInSeconds, 'second')
      }
    }
  };
};
