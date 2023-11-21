type Either<A, B> = A extends undefined | void ? B : A;
type DOMElement = HTMLElementTagNameMap;

declare module 'splux' {
  type ParamsAsObj<N extends Element = null> = {
    [key in keyof N]?: N[key];
  } & {
    [key: `data-${string}`]: string;
  };
  type ParamsAsFunc<N extends Element, H, R, E = void> = E extends void
    ? (this: Splux<N, H>, element: N) => R | void
    : (this: Splux<N, H>, element: N, extra: E) => R | void;

  type WithTag<K extends keyof DOMElement = 'div'> = K extends 'div' ? { tag?: K } : { tag: K };

  /**
   * Splux Function Component
   *
   * @typeParam K - node element tagName
   * @typeParam H - splux host
   * @typeParam R - function return type
   * @typeParam E - external parameters
   */
  type Component<K extends keyof DOMElement = 'div', H = null, R = void, E = void> =
    ParamsAsFunc<DOMElement[K], H, R, E> & WithTag<K>;

  interface ComponentCreator<H> {
    <K extends keyof DOMElement, R, E = void>(tag: K, callback: ParamsAsFunc<DOMElement[K], H, R, E>): Component<K, H, R, E>;
    <R, E = void>(callback: ParamsAsFunc<HTMLDivElement, H, R, E>): Component<'div', H, R, E>;
  }

  class Splux<N extends Element, H = null> {
    node: N;
    host: H;

    static start<H = null>(callback: (
      this: Splux<HTMLBodyElement, H>,
      body: HTMLBodyElement,
      head: HTMLHeadElement,
    ) => void, host?: H): void;

    static createComponent<H = null>(): ComponentCreator<H>;

    dom<K extends keyof DOMElement>(tag: K, params?: ParamsAsObj<DOMElement[K]>): DOMElement[K];
    dom<N extends Element>(element: N, params?: ParamsAsObj<N>): N;

    dom<K extends keyof DOMElement, R>(tag: K, params: ParamsAsFunc<DOMElement[K], H, R>): Either<R, DOMElement[K]>;
    dom<K extends keyof DOMElement, E, R>(tag: K, params: ParamsAsFunc<DOMElement[K], H, R, E>, extra: E): Either<R, DOMElement[K]>;
    dom<N extends Element, R>(element: N, params: ParamsAsFunc<N, H, R>): Either<R, N>;
    dom<N extends Element, E, R>(element: N, params: ParamsAsFunc<N, H, R, E>, extra: E): Either<R, E>;

    dom<K extends keyof DOMElement = 'div', R = void>(params: ParamsAsFunc<DOMElement[K], H, R> & WithTag<K>): Either<R, DOMElement[K]>;
    dom<K extends keyof DOMElement = 'div', E = undefined, R = void>(params: ParamsAsFunc<DOMElement[K], H, R, E> & WithTag<K>, extra: E): Either<R, DOMElement[K]>;

    use<N extends Element = null>(node: N): Splux<N, H>;

    setParams(params: ParamsAsObj<N>): Splux<N, H>;
  }

  export { Splux };
}
