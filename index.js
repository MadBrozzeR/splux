function Splux (node, host) {
  this.node = node || null;
  this.host = host || {};
}
Splux.prototype.use = function (node) {
  return new Splux(node, this.host);
};

Splux.start = function (callback, host) {
  function listener () {
    window.removeEventListener('load', listener);
    var body = document.getElementsByTagName('body')[0];
    var head = document.getElementsByTagName('head')[0];

    callback.call(new Splux(body, host), body, head);
  };

  window.addEventListener('load', listener);
}

function spreadParams (fromObject, toObject) {
  for (var key in fromObject) {
    if (fromObject[key] === undefined || fromObject[key] === null) {
      continue;
    }

    if (fromObject[key].constructor === Object) {
      toObject[key] = toObject[key] || {};

      spreadParams(fromObject[key], toObject[key]);
    } else {
      if (key in toObject) {
        toObject[key] = fromObject[key];
      } else {
        toObject.setAttribute(key, fromObject[key]);
      }
    }
  }
}

Splux.prototype.dom = function () {
  var element, params, extra;

  if (arguments[0] instanceof HTMLElement) {
    element = arguments[0];
    params = arguments[1];
    extra = arguments[2];
  } else if (arguments[0] instanceof Function) {
    element = document.createElement(arguments[0].tag || 'div');
    params = arguments[0];
    extra = arguments[1];
  } else {
    element = document.createElement(arguments[0]);
    params = arguments[1];
    extra = arguments[2];
  }

  if (this.node) {
    this.node.appendChild(element);
  }

  if (params instanceof Function) {
    return params.call(this.use(element), element, extra) || element;
  }

  if (params instanceof Object) {
    spreadParams(params, element);
  }

  return element;
};

Splux.prototype.setParams = function (params) {
  if (params instanceof Object) {
    spreadParams(params, this.node);
  }

  return this;
}

Splux.createComponent = function (tag, callback) {
  callback.tag = tag;

  return callback;
}

export { Splux };