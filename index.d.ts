type Either<A, B> = A extends undefined | void ? B : A;
type DOMElement = HTMLElementTagNameMap;

declare module 'splux' {
  type ParamsAsObj<TNode extends Element = null> = {
    [key in keyof TNode]?: TNode[key];
  } & {
    [key: string]: string;
  };
  type ParamsAsFunc<TNode extends Element, THost, TReturn, TExtra = void> = TExtra extends void
    ? (this: Splux<TNode, THost>, element: TNode) => TReturn | void
    : (this: Splux<TNode, THost>, element: TNode, extra: TExtra) => TReturn | void;

  type WithTag<K extends keyof DOMElement = 'div'> = { tag?: K };

  class Splux<TElement extends Element, THost = null> {
    node: TElement;
    host: THost;

    static start<THost = null>(callback: (
      this: Splux<HTMLBodyElement, THost>,
      body: HTMLBodyElement,
      head: HTMLHeadElement,
    ) => void, host?: THost): void;

    static createComponent<THost>(): <K extends keyof DOMElement, C extends ParamsAsFunc<DOMElement[K], THost, any, any>>(tag: K, callback: C) => C & WithTag<K>;

    dom<K extends keyof DOMElement>(tag: K, params?: ParamsAsObj<DOMElement[K]>): DOMElement[K];
    dom<E extends Element>(element: E, params?: ParamsAsObj<E>): E;

    dom<K extends keyof DOMElement, TReturn>(tag: K, params: ParamsAsFunc<DOMElement[K], THost, TReturn>): Either<TReturn, DOMElement[K]>;
    dom<K extends keyof DOMElement, TExtra, TReturn>(tag: K, params: ParamsAsFunc<DOMElement[K], THost, TReturn, TExtra>, extra: TExtra): Either<TReturn, DOMElement[K]>;
    dom<E extends Element, TReturn>(element: E, params: ParamsAsFunc<E, THost, TReturn>): Either<TReturn, E>;
    dom<E extends Element, TExtra, TReturn>(element: E, params: ParamsAsFunc<E, THost, TReturn, TExtra>, extra: TExtra): Either<TReturn, E>;

    dom<K extends keyof DOMElement = 'div', TReturn = void>(params: ParamsAsFunc<DOMElement[K], THost, TReturn> & WithTag<K>): Either<TReturn, DOMElement[K]>;
    dom<K extends keyof DOMElement = 'div', TExtra = undefined, TReturn = void>(params: ParamsAsFunc<DOMElement[K], THost, TReturn, TExtra> & WithTag<K>, extra: TExtra): Either<TReturn, DOMElement[K]>;

    use<TNode extends Element = null>(node: TNode): Splux<TNode, THost>;

    setParams(params: ParamsAsObj<TElement>): Splux<TElement, THost>;
  }

  export { Splux };
}
