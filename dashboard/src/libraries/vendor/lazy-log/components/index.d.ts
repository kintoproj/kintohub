import { ReactNode, CSSProperties, Component } from 'react';

export interface WebsocketOptions {
  onOpen?: (e: Event, socket: WebSocket) => void;
  onClose?: (e: CloseEvent) => void;
  onError?: (e: Event) => void;
  formatMessage?: (message: any) => string;
}

export interface LazyLogProps {
  caseInsensitive?: boolean;
  containerStyle?: CSSProperties;
  enableSearch?: boolean;
  extraLines?: number;
  fetchOptions?: RequestInit;
  follow?: boolean;
  formatPart?: (text: string) => ReactNode;
  height?: string | number;
  highlight?: number | number[];
  highlightLineClassName?: string;
  lineClassName?: string;
  loadingComponent?: any;
  onError?: (error: any) => any;
  onHighlight?: (range: Range) => any;
  onLoad?: () => any;
  overscanRowCount?: number;
  rowHeight?: number;
  scrollToLine?: number;
  selectableLines?: boolean;
  stream?: boolean;
  style?: CSSProperties;
  text?: string;
  url?: string;
  websocket?: boolean;
  websocketOptions?: WebsocketOptions;
  width?: string | number;
  onScroll?: ({
    scrollTop: number,
    scrollHeight: number,
    clientHeight: number,
  }) => void;
  loadingText?: string;
}

// eslint-disable-next-line react/prefer-stateless-function
export class LazyLog extends Component<LazyLogProps> {
  static defaultProps: Partial<LazyLogProps>;
}

export default LazyLog;
