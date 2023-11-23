declare module 'splux' {
  type Either<A, B, E = undefined | void> = A extends E ? B : A;
  type Elements = HTMLElementTagNameMap;

  type ParamsAsObj<N extends Element = null> = {
    [key in keyof N]?: N[key];
  } & {
    [key: `data-${string}`]: string;
  };
  type ParamsAsFunc<N extends Element, H, I = void, E = void> =
    (element: Splux<N, H>, extra: E) => I;

  type WithTag<K extends keyof Elements = 'div'> = K extends 'div' ? { tag?: K } : { tag: K };

  /**
   * Splux Function Component
   *
   * @typeParam K - node element tagName
   * @typeParam H - splux host
   * @typeParam I - function return type (interface)
   * @typeParam E - external parameters
   */
  type Component<K extends keyof Elements = 'div', H = null, I = void, E = void> =
    ParamsAsFunc<Elements[K], H, I, E> & WithTag<K>;

  interface ComponentCreator<H> {
    <K extends keyof Elements, I, E = void>(tag: K, callback: ParamsAsFunc<Elements[K], H, I, E>): Component<K, H, I, E>;
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

    static start<H = null>(callback: (
      body: Splux<HTMLBodyElement, H>,
      head: Splux<HTMLHeadElement, H>,
    ) => void, host?: H): void;

    static createComponent<H = null>(): ComponentCreator<H>;

    dom<K extends keyof Elements>(tag: K, params?: ParamsAsObj<Elements[K]>): Splux<Elements[K], H>;
    dom<N extends Element>(element: N | Splux<N, H>, params?: ParamsAsObj<N>): Splux<N, H>;

    dom<K extends keyof Elements, I>(tag: K, params: ParamsAsFunc<Elements[K], H, I, void>): Either<I, Splux<Elements[K], H>>;
    dom<K extends keyof Elements, E, I>(tag: K, params: ParamsAsFunc<Elements[K], H, I, E>, extra: E): Either<I, Splux<Elements[K], H>>;
    dom<N extends Element, I>(element: N | Splux<N, H>, params: ParamsAsFunc<N, H, I>): Either<I, Splux<N, H>>;
    dom<N extends Element, E, I>(element: N | Splux<N, H>, params: ParamsAsFunc<N, H, I, E>, extra: E): Either<I, Splux<N, H>>;

    dom<K extends keyof Elements = 'div', I = void>(params: Component<K, H, I>): Either<I, Splux<Elements[K], H>>;
    dom<K extends keyof Elements = 'div', E = undefined, I = void>(params: Component<K, H, I, E>, extra: E): Either<I, Splux<Elements[K], H>>;

    use<N extends Element | null = null>(node: N | Splux<N, H>): Splux<N, H>;

    setParams(params: ParamsAsObj<N>): this;

    remove(child?: Splux<any, H>): this;
    broadcast(data: any): void;
    tuneIn(listener: (data: any) => void): void;
  }

  export { Splux, Component };
}
