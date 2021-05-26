class Mozart { constructor(t) { return this.name = t, Mozart.index[this.name] = this, this.function_methods = [], this.object_methods = { priv: [], pub: [] }, this }
    add_function_method(t, e) { this.function_methods.push(e), this[t] = e }
    add_object_method(t, e, r) { r ? this.object_methods.priv.push([t, e]) : (this.object_methods.pub.push([t, e]), this[t] = e) }
    parse_object(t, e) { var r = {}; for (var o in t)((t, e, r, o) => { "priv" != r && (e[r] = (e => o.call(this, t, e, r))) })(t, r, o, e); return r }
    acts(t) { var e = this.parse_object(t.priv, (t, e, r) => { var o = this.scoped_selector(); return t[r](o, e) });
        this.add_object_method("act", e, !0), this.add_object_method("acts", e, !0); var r = this.parse_object(t, (t, e, r) => { var o = this.scoped_selector(); return t[r](o, e) });
        this.add_object_method("act", r), this.add_object_method("acts", r) }
    act(t) { return this.acts(t) }
    routes(t) { var e = this.parse_object(t, (t, e, r) => { var o = JSON.parse(JSON.stringify(t[r])); return o.url = t[r].url.interpolate(e), o.data = e, Object.keys(e).forEach(e => { t[r].url.match(e) && delete o.data[e] }), o });
        this.add_object_method("route", e), this.add_object_method("routes", e) }
    route(t) { return this.routes(t) }
    config(t) { this.add_object_method("config", t) }
    events(t) { this.add_function_method("events", t), this.add_function_method("event", t) }
    event(t) { return this.events(t) }
    scoped_selector() { var t = t => { var e = `[data-component~='${this.name}'] ${t}`; if ("function" == typeof jQuery) return $(e); var r = document.querySelectorAll(t); return 1 == r.length ? r[0] : r }; return this.object_methods.pub.concat(this.object_methods.priv).forEach(e => { var r, o;
            [r, o] = e, t[r] = t[r] || {}, Object.keys(o).forEach(e => { t[r][e] = o[e] }) }), t }
    init() { this.function_methods.forEach(t => { t(this.scoped_selector()) }) } }
Mozart.index = {}, Mozart.init = (() => { for (var t in Mozart.index) { Mozart.index[t].init() } }), String.prototype.interpolate = function(t) { return this.replace(/#\{(.+?)\}/g, function(e, r) { var o = t[r]; return "string" == typeof o || "number" == typeof o ? o : e }) };