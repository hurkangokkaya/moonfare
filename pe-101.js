"use strict";
(() => {
    var V = Object.create;
    var M = Object.defineProperty;
    var q = Object.getOwnPropertyDescriptor;
    var B = Object.getOwnPropertyNames;
    var z = Object.getPrototypeOf,
        L = Object.prototype.hasOwnProperty;
    var N = (o, s) => () => (s || o((s = { exports: {} }).exports, s), s.exports);
    var X = (o, s, r, h) => {
        if ((s && typeof s == "object") || typeof s == "function") for (let u of B(s)) !L.call(o, u) && u !== r && M(o, u, { get: () => s[u], enumerable: !(h = q(s, u)) || h.enumerable });
        return o;
    };
    var Y = (o, s, r) => ((r = o != null ? V(z(o)) : {}), X(s || !o || !o.__esModule ? M(r, "default", { value: o, enumerable: !0 }) : r, o));
    var C = N((T, y) => {
        (function (o, s) {
            typeof define == "function" && define.amd ? define(s) : typeof y == "object" && y.exports ? (y.exports.Dragdealer = s()) : (o.Dragdealer = s());
        })(T, function () {
            var o = function (t, e) {
                (this.options = this.applyDefaults(e || {})),
                    this.bindMethods(),
                    (this.wrapper = this.getWrapperElement(t)),
                    this.wrapper && ((this.handle = this.getHandleElement(this.wrapper, this.options.handleClass)), this.handle && (this.init(), this.bindEventListeners()));
            };
            o.prototype = {
                defaults: { disabled: !1, horizontal: !0, vertical: !1, slide: !0, steps: 0, snap: !1, loose: !1, speed: 0.1, xPrecision: 0, yPrecision: 0, handleClass: "handle", css3: !0, activeClass: "active", tapping: !0 },
                init: function () {
                    this.options.css3 && k(this.handle),
                        (this.value = { prev: [-1, -1], current: [this.options.x || 0, this.options.y || 0], target: [this.options.x || 0, this.options.y || 0] }),
                        (this.offset = { wrapper: [0, 0], mouse: [0, 0], prev: [-999999, -999999], current: [0, 0], target: [0, 0] }),
                        (this.dragStartPosition = { x: 0, y: 0 }),
                        (this.change = [0, 0]),
                        (this.stepRatios = this.calculateStepRatios()),
                        (this.activity = !1),
                        (this.dragging = !1),
                        (this.tapping = !1),
                        this.reflow(),
                        this.options.disabled && this.disable();
                },
                applyDefaults: function (t) {
                    for (var e in this.defaults) t.hasOwnProperty(e) || (t[e] = this.defaults[e]);
                    return t;
                },
                getWrapperElement: function (t) {
                    return typeof t == "string" ? document.getElementById(t) : t;
                },
                getHandleElement: function (t, e) {
                    var i, a, l;
                    if (t.getElementsByClassName) {
                        if (((i = t.getElementsByClassName(e)), i.length > 0)) return i[0];
                    } else for (a = new RegExp("(^|\\s)" + e + "(\\s|$)"), i = t.getElementsByTagName("*"), l = 0; l < i.length; l++) if (a.test(i[l].className)) return i[l];
                },
                calculateStepRatios: function () {
                    var t = [];
                    if (this.options.steps >= 1) for (var e = 0; e <= this.options.steps - 1; e++) this.options.steps > 1 ? (t[e] = e / (this.options.steps - 1)) : (t[e] = 0);
                    return t;
                },
                setWrapperOffset: function () {
                    this.offset.wrapper = p.get(this.wrapper);
                },
                calculateBounds: function () {
                    var t = { top: this.options.top || 0, bottom: -(this.options.bottom || 0) + this.wrapper.offsetHeight, left: this.options.left || 0, right: -(this.options.right || 0) + this.wrapper.offsetWidth };
                    return (t.availWidth = t.right - t.left - this.handle.offsetWidth), (t.availHeight = t.bottom - t.top - this.handle.offsetHeight), t;
                },
                calculateValuePrecision: function () {
                    var t = this.options.xPrecision || Math.abs(this.bounds.availWidth),
                        e = this.options.yPrecision || Math.abs(this.bounds.availHeight);
                    return [t ? 1 / t : 0, e ? 1 / e : 0];
                },
                bindMethods: function () {
                    typeof this.options.customRequestAnimationFrame == "function" ? (this.requestAnimationFrame = s(this.options.customRequestAnimationFrame, window)) : (this.requestAnimationFrame = s(d, window)),
                        typeof this.options.customCancelAnimationFrame == "function" ? (this.cancelAnimationFrame = s(this.options.customCancelAnimationFrame, window)) : (this.cancelAnimationFrame = s(w, window)),
                        (this.animateWithRequestAnimationFrame = s(this.animateWithRequestAnimationFrame, this)),
                        (this.animate = s(this.animate, this)),
                        (this.onHandleMouseDown = s(this.onHandleMouseDown, this)),
                        (this.onHandleTouchStart = s(this.onHandleTouchStart, this)),
                        (this.onDocumentMouseMove = s(this.onDocumentMouseMove, this)),
                        (this.onWrapperTouchMove = s(this.onWrapperTouchMove, this)),
                        (this.onWrapperMouseDown = s(this.onWrapperMouseDown, this)),
                        (this.onWrapperTouchStart = s(this.onWrapperTouchStart, this)),
                        (this.onDocumentMouseUp = s(this.onDocumentMouseUp, this)),
                        (this.onDocumentTouchEnd = s(this.onDocumentTouchEnd, this)),
                        (this.onHandleClick = s(this.onHandleClick, this)),
                        (this.onWindowResize = s(this.onWindowResize, this));
                },
                bindEventListeners: function () {
                    r(this.handle, "mousedown", this.onHandleMouseDown),
                        r(this.handle, "touchstart", this.onHandleTouchStart),
                        r(document, "mousemove", this.onDocumentMouseMove),
                        r(this.wrapper, "touchmove", this.onWrapperTouchMove),
                        r(this.wrapper, "mousedown", this.onWrapperMouseDown),
                        r(this.wrapper, "touchstart", this.onWrapperTouchStart),
                        r(document, "mouseup", this.onDocumentMouseUp),
                        r(document, "touchend", this.onDocumentTouchEnd),
                        r(this.handle, "click", this.onHandleClick),
                        r(window, "resize", this.onWindowResize),
                        this.animate(!1, !0),
                        (this.interval = this.requestAnimationFrame(this.animateWithRequestAnimationFrame));
                },
                unbindEventListeners: function () {
                    h(this.handle, "mousedown", this.onHandleMouseDown),
                        h(this.handle, "touchstart", this.onHandleTouchStart),
                        h(document, "mousemove", this.onDocumentMouseMove),
                        h(this.wrapper, "touchmove", this.onWrapperTouchMove),
                        h(this.wrapper, "mousedown", this.onWrapperMouseDown),
                        h(this.wrapper, "touchstart", this.onWrapperTouchStart),
                        h(document, "mouseup", this.onDocumentMouseUp),
                        h(document, "touchend", this.onDocumentTouchEnd),
                        h(this.handle, "click", this.onHandleClick),
                        h(window, "resize", this.onWindowResize),
                        this.cancelAnimationFrame(this.interval);
                },
                onHandleMouseDown: function (t) {
                    n.refresh(t), u(t), c(t), (this.activity = !1), this.startDrag();
                },
                onHandleTouchStart: function (t) {
                    n.refresh(t), c(t), (this.activity = !1), this.startDrag();
                },
                onDocumentMouseMove: function (t) {
                    (t.clientX - this.dragStartPosition.x === 0 && t.clientY - this.dragStartPosition.y === 0) || (n.refresh(t), this.dragging && ((this.activity = !0), u(t)));
                },
                onWrapperTouchMove: function (t) {
                    if ((n.refresh(t), !this.activity && this.draggingOnDisabledAxis())) {
                        this.dragging && this.stopDrag();
                        return;
                    }
                    u(t), (this.activity = !0);
                },
                onWrapperMouseDown: function (t) {
                    n.refresh(t), u(t), this.startTap();
                },
                onWrapperTouchStart: function (t) {
                    n.refresh(t), u(t), this.startTap();
                },
                onDocumentMouseUp: function (t) {
                    this.stopDrag(), this.stopTap();
                },
                onDocumentTouchEnd: function (t) {
                    this.stopDrag(), this.stopTap();
                },
                onHandleClick: function (t) {
                    this.activity && (u(t), c(t));
                },
                onWindowResize: function (t) {
                    this.reflow();
                },
                enable: function () {
                    (this.disabled = !1), (this.handle.className = this.handle.className.replace(/\s?disabled/g, ""));
                },
                disable: function () {
                    (this.disabled = !0), (this.handle.className += " disabled");
                },
                reflow: function () {
                    this.setWrapperOffset(), (this.bounds = this.calculateBounds()), (this.valuePrecision = this.calculateValuePrecision()), this.updateOffsetFromValue();
                },
                getStep: function () {
                    return [this.getStepNumber(this.value.target[0]), this.getStepNumber(this.value.target[1])];
                },
                getStepWidth: function () {
                    return Math.abs(this.bounds.availWidth / this.options.steps);
                },
                getValue: function () {
                    return this.value.target;
                },
                setStep: function (t, e, i) {
                    this.setValue(this.options.steps && t > 1 ? (t - 1) / (this.options.steps - 1) : 0, this.options.steps && e > 1 ? (e - 1) / (this.options.steps - 1) : 0, i);
                },
                setValue: function (t, e, i) {
                    this.setTargetValue([t, e || 0]), i && (this.groupCopy(this.value.current, this.value.target), this.updateOffsetFromValue(), this.callAnimationCallback());
                },
                startTap: function () {
                    if (!(this.disabled || !this.options.tapping))
                        if (((this.tapping = !0), this.setWrapperOffset(), this.options.snap && this.options.steps)) {
                            var t = (n.x - this.offset.wrapper[0]) / this.bounds.availWidth,
                                e = (n.y - this.offset.wrapper[1]) / this.bounds.availHeight;
                            this.setValue(this.getClosestStep(t), this.getClosestStep(e), !0);
                        } else this.setTargetValueByOffset([n.x - this.offset.wrapper[0] - this.handle.offsetWidth / 2, n.y - this.offset.wrapper[1] - this.handle.offsetHeight / 2]);
                },
                stopTap: function () {
                    this.disabled || !this.tapping || ((this.tapping = !1), this.setTargetValue(this.value.current));
                },
                startDrag: function () {
                    this.disabled ||
                        ((this.dragging = !0),
                        this.setWrapperOffset(),
                        (this.dragStartPosition = { x: n.x, y: n.y }),
                        (this.offset.mouse = [n.x - p.get(this.handle)[0], n.y - p.get(this.handle)[1]]),
                        this.wrapper.className.match(this.options.activeClass) || (this.wrapper.className += " " + this.options.activeClass),
                        this.callDragStartCallback());
                },
                stopDrag: function () {
                    if (!(this.disabled || !this.dragging)) {
                        this.dragging = !1;
                        var t = this.bounds.availWidth === 0 ? 0 : (n.x - this.dragStartPosition.x) / this.bounds.availWidth,
                            e = this.bounds.availHeight === 0 ? 0 : (n.y - this.dragStartPosition.y) / this.bounds.availHeight,
                            i = [t, e],
                            a = this.groupClone(this.value.current);
                        if (this.options.slide) {
                            var l = this.change;
                            (a[0] += l[0] * 4), (a[1] += l[1] * 4);
                        }
                        this.setTargetValue(a), (this.wrapper.className = this.wrapper.className.replace(" " + this.options.activeClass, "")), this.callDragStopCallback(i);
                    }
                },
                callAnimationCallback: function () {
                    var t = this.value.current;
                    this.options.snap && this.options.steps > 1 && (t = this.getClosestSteps(t)),
                        this.groupCompare(t, this.value.prev) || (typeof this.options.animationCallback == "function" && this.options.animationCallback.call(this, t[0], t[1]), this.groupCopy(this.value.prev, t));
                },
                callTargetCallback: function () {
                    typeof this.options.callback == "function" && this.options.callback.call(this, this.value.target[0], this.value.target[1]);
                },
                callDragStartCallback: function () {
                    typeof this.options.dragStartCallback == "function" && this.options.dragStartCallback.call(this, this.value.target[0], this.value.target[1]);
                },
                callDragStopCallback: function (t) {
                    typeof this.options.dragStopCallback == "function" && this.options.dragStopCallback.call(this, this.value.target[0], this.value.target[1], t);
                },
                animateWithRequestAnimationFrame: function (t) {
                    t ? ((this.timeOffset = this.timeStamp ? t - this.timeStamp : 0), (this.timeStamp = t)) : (this.timeOffset = 25), this.animate(), (this.interval = this.requestAnimationFrame(this.animateWithRequestAnimationFrame));
                },
                animate: function (t, e) {
                    if (!(t && !this.dragging)) {
                        if (this.dragging) {
                            var i = this.groupClone(this.value.target),
                                a = [n.x - this.offset.wrapper[0] - this.offset.mouse[0], n.y - this.offset.wrapper[1] - this.offset.mouse[1]];
                            this.setTargetValueByOffset(a, this.options.loose), (this.change = [this.value.target[0] - i[0], this.value.target[1] - i[1]]);
                        }
                        (this.dragging || e) && this.groupCopy(this.value.current, this.value.target), (this.dragging || this.glide() || e) && (this.updateOffsetFromValue(), this.callAnimationCallback());
                    }
                },
                glide: function () {
                    var t = [this.value.target[0] - this.value.current[0], this.value.target[1] - this.value.current[1]];
                    return !t[0] && !t[1]
                        ? !1
                        : (Math.abs(t[0]) > this.valuePrecision[0] || Math.abs(t[1]) > this.valuePrecision[1]
                              ? ((this.value.current[0] += t[0] * Math.min((this.options.speed * this.timeOffset) / 25, 1)), (this.value.current[1] += t[1] * Math.min((this.options.speed * this.timeOffset) / 25, 1)))
                              : this.groupCopy(this.value.current, this.value.target),
                          !0);
                },
                updateOffsetFromValue: function () {
                    this.options.snap ? (this.offset.current = this.getOffsetsByRatios(this.getClosestSteps(this.value.current))) : (this.offset.current = this.getOffsetsByRatios(this.value.current)),
                        this.groupCompare(this.offset.current, this.offset.prev) || (this.renderHandlePosition(), this.groupCopy(this.offset.prev, this.offset.current));
                },
                renderHandlePosition: function () {
                    var t = "";
                    if (this.options.css3 && f.transform) {
                        this.options.horizontal && (t += "translateX(" + this.offset.current[0] + "px)"), this.options.vertical && (t += " translateY(" + this.offset.current[1] + "px)"), (this.handle.style[f.transform] = t);
                        return;
                    }
                    this.options.horizontal && (this.handle.style.left = this.offset.current[0] + "px"), this.options.vertical && (this.handle.style.top = this.offset.current[1] + "px");
                },
                setTargetValue: function (t, e) {
                    var i = e ? this.getLooseValue(t) : this.getProperValue(t);
                    this.groupCopy(this.value.target, i), (this.offset.target = this.getOffsetsByRatios(i)), this.callTargetCallback();
                },
                setTargetValueByOffset: function (t, e) {
                    var i = this.getRatiosByOffsets(t),
                        a = e ? this.getLooseValue(i) : this.getProperValue(i);
                    this.groupCopy(this.value.target, a), (this.offset.target = this.getOffsetsByRatios(a));
                },
                getLooseValue: function (t) {
                    var e = this.getProperValue(t);
                    return [e[0] + (t[0] - e[0]) / 4, e[1] + (t[1] - e[1]) / 4];
                },
                getProperValue: function (t) {
                    var e = this.groupClone(t);
                    return (
                        (e[0] = Math.max(e[0], 0)),
                        (e[1] = Math.max(e[1], 0)),
                        (e[0] = Math.min(e[0], 1)),
                        (e[1] = Math.min(e[1], 1)),
                        ((!this.dragging && !this.tapping) || this.options.snap) && this.options.steps > 1 && (e = this.getClosestSteps(e)),
                        e
                    );
                },
                getRatiosByOffsets: function (t) {
                    return [this.getRatioByOffset(t[0], this.bounds.availWidth, this.bounds.left), this.getRatioByOffset(t[1], this.bounds.availHeight, this.bounds.top)];
                },
                getRatioByOffset: function (t, e, i) {
                    return e ? (t - i) / e : 0;
                },
                getOffsetsByRatios: function (t) {
                    return [this.getOffsetByRatio(t[0], this.bounds.availWidth, this.bounds.left), this.getOffsetByRatio(t[1], this.bounds.availHeight, this.bounds.top)];
                },
                getOffsetByRatio: function (t, e, i) {
                    return Math.round(t * e) + i;
                },
                getStepNumber: function (t) {
                    return this.getClosestStep(t) * (this.options.steps - 1) + 1;
                },
                getClosestSteps: function (t) {
                    return [this.getClosestStep(t[0]), this.getClosestStep(t[1])];
                },
                getClosestStep: function (t) {
                    for (var e = 0, i = 1, a = 0; a <= this.options.steps - 1; a++) Math.abs(this.stepRatios[a] - t) < i && ((i = Math.abs(this.stepRatios[a] - t)), (e = a));
                    return this.stepRatios[e];
                },
                groupCompare: function (t, e) {
                    return t[0] == e[0] && t[1] == e[1];
                },
                groupCopy: function (t, e) {
                    (t[0] = e[0]), (t[1] = e[1]);
                },
                groupClone: function (t) {
                    return [t[0], t[1]];
                },
                draggingOnDisabledAxis: function () {
                    return (!this.options.horizontal && n.xDiff > n.yDiff) || (!this.options.vertical && n.yDiff > n.xDiff);
                },
            };
            var s = function (t, e) {
                    return function () {
                        return t.apply(e, arguments);
                    };
                },
                r = function (t, e, i) {
                    t.addEventListener ? t.addEventListener(e, i, !1) : t.attachEvent && t.attachEvent("on" + e, i);
                },
                h = function (t, e, i) {
                    t.removeEventListener ? t.removeEventListener(e, i, !1) : t.detachEvent && t.detachEvent("on" + e, i);
                },
                u = function (t) {
                    t || (t = window.event), t.preventDefault && t.preventDefault(), (t.returnValue = !1);
                },
                c = function (t) {
                    t || (t = window.event), t.stopPropagation && t.stopPropagation(), (t.cancelBubble = !0);
                },
                n = {
                    x: 0,
                    y: 0,
                    xDiff: 0,
                    yDiff: 0,
                    refresh: function (t) {
                        t || (t = window.event), t.type == "mousemove" ? this.set(t) : t.touches && this.set(t.touches[0]);
                    },
                    set: function (t) {
                        var e = this.x,
                            i = this.y;
                        t.clientX || t.clientY
                            ? ((this.x = t.clientX), (this.y = t.clientY))
                            : (t.pageX || t.pageY) && ((this.x = t.pageX - document.body.scrollLeft - document.documentElement.scrollLeft), (this.y = t.pageY - document.body.scrollTop - document.documentElement.scrollTop)),
                            (this.xDiff = Math.abs(this.x - e)),
                            (this.yDiff = Math.abs(this.y - i));
                    },
                },
                p = {
                    get: function (t) {
                        var e = { left: 0, top: 0 };
                        return t.getBoundingClientRect !== void 0 && (e = t.getBoundingClientRect()), [e.left, e.top];
                    },
                },
                f = { transform: b("transform"), perspective: b("perspective"), backfaceVisibility: b("backfaceVisibility") };
            function b(t) {
                var e = "Webkit Moz ms O".split(" "),
                    i = document.documentElement.style;
                if (i[t] !== void 0) return t;
                t = t.charAt(0).toUpperCase() + t.substr(1);
                for (var a = 0; a < e.length; a++) if (i[e[a] + t] !== void 0) return e[a] + t;
            }
            function k(t) {
                f.backfaceVisibility && f.perspective && ((t.style[f.perspective] = "1000px"), (t.style[f.backfaceVisibility] = "hidden"));
            }
            for (var v = ["webkit", "moz"], d = window.requestAnimationFrame, w = window.cancelAnimationFrame, g = 0; g < v.length && !d; ++g)
                (d = window[v[g] + "RequestAnimationFrame"]), (w = window[v[g] + "CancelAnimationFrame"] || window[v[g] + "CancelRequestAnimationFrame"]);
            return (
                d ||
                    ((d = function (t) {
                        return setTimeout(t, 25);
                    }),
                    (w = clearTimeout)),
                o
            );
        });
    });
    function R(o) {
        let s,
            r = window.outerWidth;
        window.addEventListener("resize", () => {
            let h = window.outerWidth;
            h !== r && (clearTimeout(s), (s = setTimeout(o, 100)), (r = h));
        });
    }
    var $ = Y(C(), 1),
        U = C().Dragdealer;
    function m(o, s, r, h, u) {
        let c = o.offsetWidth,
            n = s.offsetWidth;
        c <= n ? (h.style.display = "none") : (h.style.display = "block"),
            new U(u, {
                speed: 0.1,
                requestAnimationFrame: !0,
                horizontal: !0,
                vertical: !1,
                reflow: !0,
                animationCallback: function (p, f) {
                    (r.style.width = Math.round(p * 100) + "%"), (o.style.marginLeft = -p * (c - n + 32) + "px");
                },
            });
    }
    var S = document.querySelector(".pe-101_grid-4-basics"),
        D = document.querySelector(".pe-101-content-basics"),
        W = document.querySelector(".pe-101-b_drag-line-active"),
        E = document.querySelector(".pe-101-b_drag-component"),
        x = document.querySelector("#pe-101b-drag-tool");
    m(S, D, W, E, x);
    var A = document.querySelector(".pe-101_grid-4-strategies"),
        F = document.querySelector(".pe-101-content-dynamics"),
        H = document.querySelector(".pe-101-s_drag-line-active"),
        O = document.querySelector(".pe-101-s_drag-component"),
        P = document.querySelector("#pe-101s-drag-tool");
    m(A, F, H, O, P);
    var AA = document.querySelector(".pe-101_grid-4-risks"),
        FF = document.querySelector(".pe-101-content-risks"),
        HH = document.querySelector(".pe-101-r_drag-line-active"),
        OO = document.querySelector(".pe-101-r_drag-component"),
        PP = document.querySelector("#pe-101r-drag-tool");
    m(AA, FF, HH, OO, PP);
    var AAA = document.querySelector(".pe-101_grid-4-port"),
        FFF = document.querySelector(".pe-101-content-port"),
        HHH = document.querySelector(".pe-101-p_drag-line-active"),
        OOO = document.querySelector(".pe-101-p_drag-component"),
        PPP = document.querySelector("#pe-101p-drag-tool");
    m(AAA, FFF, HHH, OOO, PPP);
    var AAAA = document.querySelector(".pe-101_grid-4-ex"),
        FFFF = document.querySelector(".pe-101-content-ex"),
        HHHH = document.querySelector(".pe-101-e_drag-line-active"),
        OOOO = document.querySelector(".pe-101-e_drag-component"),
        PPPP = document.querySelector("#pe-101e-drag-tool");
    m(AAAA, FFFF, HHHH, OOOO, PPPP);
    var _ = () => {
        m(S, D, W, E, x), m(A, F, H, O, P), m(AA, FF, HH, OO, PP), m(AAA, FFF, HHH, OOO, PPP),m(AAAA, FFFF, HHHH, OOOO, PPPP);
    };
    R(_);
})();

