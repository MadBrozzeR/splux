import { Splux } from 'splux';

Splux.start(function () {
  const domElement = document.createElement('img');
  const splElement = this.dom(domElement);

  const createComponent = Splux.createComponent<string>();

  const Component = createComponent(function (div) {div});
  const ComponentWithInterface = createComponent(function (div) {div; return 100;});
  const ComponentWithExtra = createComponent(function (div, extra: number) {div; extra;});
  const ComponentWithExtraAndInterface = createComponent(function (div, extra: number) {div; extra; return null});

  const TaggedComponent = createComponent('h1', function (div) {div});
  const TaggedComponentWithInterface = createComponent('h2', function (div) {div; return 100;});
  const TaggedComponentWithExtra = createComponent('h3', function (div, extra: number) {div; extra;});
  const TaggedComponentWithExtraAndInterface = createComponent('main', function (div, extra: number) {div; extra; return null});

  return {
    el1: this.dom('span', { innerHTML: 'asd' }),

    el2: this.dom(domElement, { src: 'no-image' }),
    el3: this.dom(splElement, { src: 'no-image' }),

    el4: this.dom('span', function (span) {span}),
    el5: this.dom('span', function (span) {span; return 'string'}),
    el6: this.dom('span', function (span, extra: number) {span; extra}, 12),
    el7: this.dom('span', function (span, extra: number) {span; extra; return false;}, 12),

    el8: this.dom(domElement, function (element) {element}),
    el9: this.dom(domElement, function (element) {element; return {}}),
    el10: this.dom(splElement, function (element) {element}),
    el11: this.dom(splElement, function (element) {element; return {}}),

    el12: this.dom(domElement, function (element, extra: number) {element; extra}, 2),
    el13: this.dom(domElement, function (element, extra: number) {element; extra; return {}}, 4),
    el14: this.dom(splElement, function (element, extra: number) {element; extra;}, 2),
    el15: this.dom(splElement, function (element, extra: number) {element; extra; return {}}, 4),

    el16: this.dom(Component),
    el17: this.dom(ComponentWithInterface),
    el18: this.dom(ComponentWithExtra, 23),
    el19: this.dom(ComponentWithExtraAndInterface, 23),

    el20: this.dom(TaggedComponent),
    el21: this.dom(TaggedComponentWithInterface),
    el22: this.dom(TaggedComponentWithExtra, 23),
    el23: this.dom(TaggedComponentWithExtraAndInterface, 23),

    spl1: this.use(domElement),
    spl2: this.use(splElement),
  };
}, 'hello');
