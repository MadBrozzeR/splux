function Connections (splux) {
  this.splux = splux;
  this.parent;
  this.list; // TODO Consider using more reliable data structure other then array. Linked list might be a good idea.
}
Connections.prototype.add = function (child) {
  if (this.splux.node) {
    this.list || (this.list = []);
    this.list.push(child);
    if (child.connections.parent) {
      child.connections.parent.connections.remove(child);
    }
    child.connections.parent = this.splux;
    this.splux.node.appendChild(child.node);
  }

  return child;
}
Connections.prototype.remove = function (child) {
  if (!this.list) {
    return child;
  }
  var index = this.list.indexOf(child);
  var listener = child.listeners.remove;

  child.clear();
  listener instanceof Function && listener.call(child);
  this.splux.node.removeChild(child.node);

  if (index > -1) {
    this.list.splice(index, 1);
  }

  if (child.connections.parent === this.splux) {
    child.connections.parent = null;
  }

  return child;
};
Connections.prototype.clear = function () {
  if (!this.list) {
    return;
  }

  var item;
  var listener;

  while (this.list[0]) {
    item = this.list.pop();
    listener = item.listeners.remove;

    item.clear();
    listener instanceof Function && listener.call(item);
    this.splux.node.removeChild(item.node);
    item.connections.parent = null;
  }
}
Connections.prototype.iterate = function (callback) {
  if (!this.list) {
    return;
  }

  for (var index = 0 ; index < this.list.length ; ++index) {
    callback(this.list[index]);
  }
};

var DOT_RE = /\./g;

function parseTagNameString (data) {
  var dotPos = data.indexOf('.');

  if (dotPos > -1) {
    return {
      tag: data.substring(0, dotPos),
      params: { className: data.substring(dotPos + 1).split(DOT_RE).join(' '), },
    };
  }

  return {
    tag: data,
  };
}

function Splux (node, host) {
  this.node = node || null;
  this.host = host || {};
  this.listeners = { cast: null, remove: null };
  this.connections = new Connections(this);
}
Splux.prototype.use = function (node) {
  return node instanceof Splux ? node : new Splux(node, this.host);
};

Splux.start = function (callback, host) {
  function listener () {
    window.removeEventListener('load', listener);
    var body = document.getElementsByTagName('body')[0];
    var head = document.getElementsByTagName('head')[0];
    var bodySpl = new Splux(body, host);
    var headSpl = new Splux(head, host);

    callback.call(bodySpl, bodySpl, headSpl);
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
  var element, params, extra, parsed;

  if (arguments[0] instanceof Element) {
    element = arguments[0];
    params = arguments[1];
    extra = arguments[2];
  } else if (arguments[0] instanceof Splux) {
    element = arguments[0];
    params = arguments[1];
    extra = arguments[2];
  } else if (arguments[0] instanceof Function) {
    parsed = parseTagNameString(arguments[0].tag || 'div');
    element = document.createElement(parsed.tag);
    params = arguments[0];
    extra = arguments[1];
  } else {
    parsed = parseTagNameString(arguments[0]);
    element = document.createElement(parsed.tag);
    params = arguments[1];
    extra = arguments[2];
  }

  var elementSpl = this.use(element);

  this.connections.add(elementSpl);

  if (parsed && parsed.params) {
    elementSpl.setParams(parsed.params);
  }

  if (params instanceof Function) {
    var result = params.call(elementSpl, elementSpl, extra);
    return result === undefined ? elementSpl : result;
  }

  if (params instanceof Object) {
    elementSpl.setParams(params);
  }

  return elementSpl;
};

Splux.prototype.remove = function (child) {
  if (child) {
    this.connections.remove(child);
  } else {
    this.connections.parent.remove(this);
  }

  return this;
}
Splux.prototype.clear = function () {
  this.connections.clear();

  return this;
}

Splux.prototype.params = Splux.prototype.setParams = function (params) {
  if (params instanceof Object) {
    spreadParams(params, this.node);
  }

  return this;
}

Splux.prototype.broadcast = function (data) {
  var listener = this.listeners.cast;
  listener instanceof Function && listener.call(this, data);
  this.connections.iterate(function (child) {
    child.broadcast(data);
  });
};
Splux.prototype.tuneIn = function (listener) {
  this.listeners.cast = listener;
};
Splux.prototype.on = function (listeners) {
  for (var key in listeners) {
    this.listeners[key] = listeners[key];
  }

  return this;
}

Splux.createComponent = function () {
  return function (tag, callback) {
    if (typeof arguments[0] === 'string' && arguments[1] instanceof Function) {
      arguments[1].tag = arguments[0];

      return arguments[1];
    } else if (arguments[0] instanceof Function) {
      return arguments[0];
    }
  }
}

export { Splux };
