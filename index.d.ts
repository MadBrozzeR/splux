declare module 'splux' {
  type Either<A, B, E = undefined | void> = A extends E ? B : A;
  type Elements = HTMLElementTagNameMap;
  type TagName = keyof Elements;
  type TagExtended<K extends TagName> = K | `${K}.${string}`;

  type ParamsAsObj<N extends Element> = {
    [key in keyof N]?: N[key];
  } & {
    [key: `data-${string}`]: string;
  };
  type ParamsAsFunc<N extends Element, H, I = void, E = void> =
    (this: Splux<N, H>, element: Splux<N, H>, extra: E) => I;

  type WithTag<K extends TagName = 'div'> = K extends 'div' ? { tag?: K } : { tag: K };

  /**
   * Splux Function Component
   *
   * @typeParam K - node element tagName
   * @typeParam H - splux host
   * @typeParam I - function return type (interface)
   * @typeParam E - external parameters
   */
  type Component<K extends TagName = 'div', H = null, I = void, E = void> =
    ParamsAsFunc<Elements[K], H, I, E> & WithTag<K>;

  interface ComponentCreator<H> {
    <K extends TagName, I, E = void>(tag: TagExtended<K>, callback: ParamsAsFunc<Elements[K], H, I, E>): Component<K, H, I, E>;
    <I, E = void>(callback: ParamsAsFunc<HTMLDivElement, H, I, E>): Component<'div', H, I, E>;
  }

  class Connections<H, S extends Splux<any, H>, P extends Splux<any, H>> {
    splux: S;
    parent: P;
    list: Array<Splux<any, H>>;

    add<S extends Splux<any, H>>(child: S): S;
    remove<S extends Splux<any, H>>(child: S): S;
    iterate(child: Splux<any, H>): void;
  }

  class Splux<N extends Element | null = null, H = null> {
    node: N;
    host: H;
    listener: ((data: any) => void) | null;
    connections: Connections<H, this, Splux<any, H>>;

    constructor(node?: N, host?: H);

    static start<H = null>(callback: (
      this: Splux<HTMLBodyElement, H>,
      body: Splux<HTMLBodyElement, H>,
      head: Splux<HTMLHeadElement, H>,
    ) => void, host?: H): void;

    static createComponent<H = null>(): <K extends TagName, I, E = void>(tag: TagExtended<K>, params: ParamsAsFunc<Elements[K], H, I, E>) => Component<K, H, I, E>;

    dom<K extends TagName>(tag: TagExtended<K>): Splux<Elements[K], H>;
    dom<K extends TagName, I = void>(tag: TagExtended<K>, params: ParamsAsFunc<Elements[K], H, I, void>): Either<I, Splux<Elements[K], H>>;
    dom<K extends TagName, E = undefined, I = void>(tag: TagExtended<K>, params: ParamsAsFunc<Elements[K], H, I, E>, extra: E): Either<I, Splux<Elements[K], H>>;

    dom<N extends Element>(element: N | Splux<N, H>): Splux<N, H>;
    dom<N extends Element, I = void>(element: N | Splux<N, H>, params: ParamsAsFunc<N, H, I>): Either<I, Splux<N, H>>;
    dom<N extends Element, E = undefined, I = void>(element: N | Splux<N, H>, params: ParamsAsFunc<N, H, I, E>, extra: E): Either<I, Splux<N, H>>;

    dom<K extends TagName = 'div', I = void>(params: Component<K, H, I>): Either<I, Splux<Elements[K], H>>;
    dom<K extends TagName = 'div', E = undefined, I = void>(params: Component<K, H, I, E>, extra: E): Either<I, Splux<Elements[K], H>>;

    use<N extends Element | null = null>(node: N | Splux<N, H>): Splux<N, H>;

    setParams(params: ParamsAsObj<N>): this;
    params(params: ParamsAsObj<N>): this;

    remove(child?: Splux<any, H>): this;
    clear(): this;
    broadcast(data: any): void;
    tuneIn(listener: (data: any) => void): void;
  }

  export { Splux, Component, ComponentCreator, ParamsAsFunc, TagName };
}
