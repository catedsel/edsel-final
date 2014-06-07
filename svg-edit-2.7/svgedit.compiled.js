svgedit = {
    NS: {
        HTML: "http://www.w3.org/1999/xhtml",
        MATH: "http://www.w3.org/1998/Math/MathML",
        SE: "http://svg-edit.googlecode.com",
        SVG: "http://www.w3.org/2000/svg",
        XLINK: "http://www.w3.org/1999/xlink",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/"
    }
};
svgedit.getReverseNS = function() {
    var a = {};
    $.each(this.NS, function(I, o) {
        a[o] = I.toLowerCase()
    });
    return a
};
(function() {
    var a = jQuery.fn.attr;
    jQuery.fn.attr = function(I, o) {
        var c, i = this.length;
        if (!i) return a.apply(this, arguments);
        for (c = 0; c < i; ++c) {
            var s = this[c];
            if (s.namespaceURI === "http://www.w3.org/2000/svg") {
                if (o !== undefined) s.setAttribute(I, o);
                else if ($.isArray(I)) {
                    i = I.length;
                    for (var e = {}; i--;) {
                        var g = I[i];
                        if ((c = s.getAttribute(g)) || c === "0") c = isNaN(c) ? c : c - 0;
                        e[g] = c
                    }
                    return e
                }
                if (typeof I === "object")
                    for (e in I) s.setAttribute(e, I[e]);
                else {
                    if ((c = s.getAttribute(I)) || c === "0") c = isNaN(c) ? c : c - 0;
                    return c
                }
            } else return a.apply(this,
                arguments)
        }
        return this
    }
})();
jQuery && function() {
    var a = $(window),
        I = $(document);
    $.extend($.fn, {
        contextMenu: function(o, c) {
            if (o.menu == undefined) return false;
            if (o.inSpeed == undefined) o.inSpeed = 150;
            if (o.outSpeed == undefined) o.outSpeed = 75;
            if (o.inSpeed == 0) o.inSpeed = -1;
            if (o.outSpeed == 0) o.outSpeed = -1;
            $(this).each(function() {
                var i = $(this),
                    s = $(i).offset(),
                    e = $("#" + o.menu);
                e.addClass("contextMenu");
                $(this).bind("mousedown", function(g) {
                    $(this).mouseup(function(q) {
                        var w = $(this);
                        w.unbind("mouseup");
                        if (g.button === 2 || o.allowLeft || g.ctrlKey && svgedit.browser.isMac()) {
                            q.stopPropagation();
                            $(".contextMenu").hide();
                            if (i.hasClass("disabled")) return false;
                            var D = q.pageX,
                                u = q.pageY;
                            q = a.width() - e.width();
                            var A = a.height() - e.height();
                            if (D > q - 15) D = q - 15;
                            if (u > A - 30) u = A - 30;
                            I.unbind("click");
                            e.css({
                                top: u,
                                left: D
                            }).fadeIn(o.inSpeed);
                            e.find("A").mouseover(function() {
                                e.find("LI.hover").removeClass("hover");
                                $(this).parent().addClass("hover")
                            }).mouseout(function() {
                                e.find("LI.hover").removeClass("hover")
                            });
                            I.keypress(function(p) {
                                switch (p.keyCode) {
                                    case 38:
                                        if (e.find("LI.hover").length) {
                                            e.find("LI.hover").removeClass("hover").prevAll("LI:not(.disabled)").eq(0).addClass("hover");
                                            e.find("LI.hover").length || e.find("LI:last").addClass("hover")
                                        } else e.find("LI:last").addClass("hover");
                                        break;
                                    case 40:
                                        if (e.find("LI.hover").length == 0) e.find("LI:first").addClass("hover");
                                        else {
                                            e.find("LI.hover").removeClass("hover").nextAll("LI:not(.disabled)").eq(0).addClass("hover");
                                            e.find("LI.hover").length || e.find("LI:first").addClass("hover")
                                        }
                                        break;
                                    case 13:
                                        e.find("LI.hover A").trigger("click");
                                        break;
                                    case 27:
                                        I.trigger("click")
                                }
                            });
                            e.find("A").unbind("mouseup");
                            e.find("LI:not(.disabled) A").mouseup(function() {
                                I.unbind("click").unbind("keypress");
                                $(".contextMenu").hide();
                                c && c($(this).attr("href").substr(1), $(w), {
                                    x: D - s.left,
                                    y: u - s.top,
                                    docX: D,
                                    docY: u
                                });
                                return false
                            });
                            setTimeout(function() {
                                I.click(function() {
                                    I.unbind("click").unbind("keypress");
                                    e.fadeOut(o.outSpeed);
                                    return false
                                })
                            }, 0)
                        }
                    })
                });
                if ($.browser.mozilla) $("#" + o.menu).each(function() {
                    $(this).css({
                        MozUserSelect: "none"
                    })
                });
                else $.browser.msie ? $("#" + o.menu).each(function() {
                    $(this).bind("selectstart.disableTextSelect", function() {
                        return false
                    })
                }) : $("#" + o.menu).each(function() {
                    $(this).bind("mousedown.disableTextSelect",
                        function() {
                            return false
                        })
                });
                $(i).add($("UL.contextMenu")).bind("contextmenu", function() {
                    return false
                })
            });
            return $(this)
        },
        disableContextMenuItems: function(o) {
            if (o == undefined) {
                $(this).find("LI").addClass("disabled");
                return $(this)
            }
            $(this).each(function() {
                if (o != undefined)
                    for (var c = o.split(","), i = 0; i < c.length; i++) $(this).find('A[href="' + c[i] + '"]').parent().addClass("disabled")
            });
            return $(this)
        },
        enableContextMenuItems: function(o) {
            if (o == undefined) {
                $(this).find("LI.disabled").removeClass("disabled");
                return $(this)
            }
            $(this).each(function() {
                if (o !=
                    undefined)
                    for (var c = o.split(","), i = 0; i < c.length; i++) $(this).find('A[href="' + c[i] + '"]').parent().removeClass("disabled")
            });
            return $(this)
        },
        disableContextMenu: function() {
            $(this).each(function() {
                $(this).addClass("disabled")
            });
            return $(this)
        },
        enableContextMenu: function() {
            $(this).each(function() {
                $(this).removeClass("disabled")
            });
            return $(this)
        },
        destroyContextMenu: function() {
            $(this).each(function() {
                $(this).unbind("mousedown").unbind("mouseup")
            });
            return $(this)
        }
    })
}(jQuery);
(function() {
    if (!svgedit.browser) svgedit.browser = {};
    var a = svgedit.NS,
        I = !! document.createElementNS && !! document.createElementNS(a.SVG, "svg").createSVGRect;
    svgedit.browser.supportsSvg = function() {
        return I
    };
    if (svgedit.browser.supportsSvg()) {
        var o = navigator.userAgent,
            c = document.createElementNS(a.SVG, "svg"),
            i = !! window.opera,
            s = o.indexOf("AppleWebKit") >= 0,
            e = o.indexOf("Gecko/") >= 0,
            g = o.indexOf("MSIE") >= 0,
            q = o.indexOf("Chrome/") >= 0,
            w = o.indexOf("Windows") >= 0,
            D = o.indexOf("Macintosh") >= 0,
            u = "ontouchstart" in window,
            A = !! c.querySelector,
            p = !! document.evaluate,
            v = function() {
                var ea = document.createElementNS(a.SVG, "path");
                ea.setAttribute("d", "M0,0 10,10");
                var ka = ea.pathSegList;
                ea = ea.createSVGPathSegLinetoAbs(5, 5);
                try {
                    ka.replaceItem(ea, 0);
                    return true
                } catch (Ia) {}
                return false
            }(),
            t = function() {
                var ea = document.createElementNS(a.SVG, "path");
                ea.setAttribute("d", "M0,0 10,10");
                var ka = ea.pathSegList;
                ea = ea.createSVGPathSegLinetoAbs(5, 5);
                try {
                    ka.insertItemBefore(ea, 0);
                    return true
                } catch (Ia) {}
                return false
            }(),
            m = function() {
                var ea = document.createElementNS(a.SVG,
                    "svg"),
                    ka = document.createElementNS(a.SVG, "svg");
                document.documentElement.appendChild(ea);
                ka.setAttribute("x", 5);
                ea.appendChild(ka);
                var Ia = document.createElementNS(a.SVG, "text");
                Ia.textContent = "a";
                ka.appendChild(Ia);
                ka = Ia.getStartPositionOfChar(0).x;
                document.documentElement.removeChild(ea);
                return ka === 0
            }(),
            L = function() {
                var ea = document.createElementNS(a.SVG, "svg");
                document.documentElement.appendChild(ea);
                var ka = document.createElementNS(a.SVG, "path");
                ka.setAttribute("d", "M0,0 C0,0 10,10 10,0");
                ea.appendChild(ka);
                ka = ka.getBBox();
                document.documentElement.removeChild(ea);
                return ka.height > 4 && ka.height < 5
            }(),
            R = function() {
                var ea = document.createElementNS(a.SVG, "svg");
                document.documentElement.appendChild(ea);
                var ka = document.createElementNS(a.SVG, "path");
                ka.setAttribute("d", "M0,0 10,0");
                var Ia = document.createElementNS(a.SVG, "path");
                Ia.setAttribute("d", "M5,0 15,0");
                var Ba = document.createElementNS(a.SVG, "g");
                Ba.appendChild(ka);
                Ba.appendChild(Ia);
                ea.appendChild(Ba);
                ka = Ba.getBBox();
                document.documentElement.removeChild(ea);
                return ka.width == 15
            }(),
            da = function() {
                var ea = document.createElementNS(a.SVG, "rect");
                ea.setAttribute("x", 0.1);
                (ea = ea.cloneNode(false).getAttribute("x").indexOf(",") == -1) || $.alert('NOTE: This version of Opera is known to contain bugs in SVG-edit.\nPlease upgrade to the <a href="http://opera.com">latest version</a> in which the problems have been fixed.');
                return ea
            }(),
            qa = function() {
                var ea = document.createElementNS(a.SVG, "rect");
                ea.setAttribute("style", "vector-effect:non-scaling-stroke");
                return ea.style.vectorEffect ===
                    "non-scaling-stroke"
            }(),
            fa = function() {
                var ea = document.createElementNS(a.SVG, "rect").transform.baseVal,
                    ka = c.createSVGTransform();
                ea.appendItem(ka);
                return ea.getItem(0) == ka
            }();
        svgedit.browser.isOpera = function() {
            return i
        };
        svgedit.browser.isWebkit = function() {
            return s
        };
        svgedit.browser.isGecko = function() {
            return e
        };
        svgedit.browser.isIE = function() {
            return g
        };
        svgedit.browser.isChrome = function() {
            return q
        };
        svgedit.browser.isWindows = function() {
            return w
        };
        svgedit.browser.isMac = function() {
            return D
        };
        svgedit.browser.isTouch =
            function() {
                return u
        };
        svgedit.browser.supportsSelectors = function() {
            return A
        };
        svgedit.browser.supportsXpath = function() {
            return p
        };
        svgedit.browser.supportsPathReplaceItem = function() {
            return v
        };
        svgedit.browser.supportsPathInsertItemBefore = function() {
            return t
        };
        svgedit.browser.supportsPathBBox = function() {
            return L
        };
        svgedit.browser.supportsHVLineContainerBBox = function() {
            return R
        };
        svgedit.browser.supportsGoodTextCharPos = function() {
            return m
        };
        svgedit.browser.supportsEditableText = function() {
            return i
        };
        svgedit.browser.supportsGoodDecimals =
            function() {
                return da
        };
        svgedit.browser.supportsNonScalingStroke = function() {
            return qa
        };
        svgedit.browser.supportsNativeTransformLists = function() {
            return fa
        }
    } else window.location = "browser-not-supported.html"
})();
(function() {
    if (!svgedit.transformlist) svgedit.transformlist = {};
    var a = document.createElementNS(svgedit.NS.SVG, "svg"),
        I = {};
    svgedit.transformlist.SVGTransformList = function(o) {
        this._elem = o || null;
        this._xforms = [];
        this._update = function() {
            var c = "";
            a.createSVGMatrix();
            var i;
            for (i = 0; i < this.numberOfItems; ++i) {
                var s = this._list.getItem(i);
                c = c;
                s = s;
                var e = s.matrix,
                    g = "";
                switch (s.type) {
                    case 1:
                        g = "matrix(" + [e.a, e.b, e.c, e.d, e.e, e.f].join(",") + ")";
                        break;
                    case 2:
                        g = "translate(" + e.e + "," + e.f + ")";
                        break;
                    case 3:
                        g = e.a == e.d ? "scale(" +
                            e.a + ")" : "scale(" + e.a + "," + e.d + ")";
                        break;
                    case 4:
                        var q = 0;
                        g = 0;
                        if (s.angle != 0) {
                            q = 1 - e.a;
                            g = (q * e.f + e.b * e.e) / (q * q + e.b * e.b);
                            q = (e.e - e.b * g) / q
                        }
                        g = "rotate(" + s.angle + " " + q + "," + g + ")"
                }
                c = c + (g + " ")
            }
            this._elem.setAttribute("transform", c)
        };
        this._list = this;
        this._init = function() {
            var c = this._elem.getAttribute("transform");
            if (c)
                for (var i = /\s*((scale|matrix|rotate|translate)\s*\(.*?\))\s*,?\s*/, s = true; s;) {
                    s = c.match(i);
                    c = c.replace(i, "");
                    if (s && s[1]) {
                        var e = s[1].split(/\s*\(/),
                            g = e[0];
                        e = e[1].match(/\s*(.*?)\s*\)/);
                        e[1] = e[1].replace(/(\d)-/g,
                            "$1 -");
                        var q = e[1].split(/[, ]+/),
                            w = "abcdef".split(""),
                            D = a.createSVGMatrix();
                        $.each(q, function(p, v) {
                            q[p] = parseFloat(v);
                            if (g == "matrix") D[w[p]] = q[p]
                        });
                        e = a.createSVGTransform();
                        var u = "set" + g.charAt(0).toUpperCase() + g.slice(1),
                            A = g == "matrix" ? [D] : q;
                        if (g == "scale" && A.length == 1) A.push(A[0]);
                        else if (g == "translate" && A.length == 1) A.push(0);
                        else g == "rotate" && A.length == 1 && A.push(0, 0);
                        e[u].apply(e, A);
                        this._list.appendItem(e)
                    }
                }
        };
        this._removeFromOtherLists = function(c) {
            if (c) {
                var i = false,
                    s;
                for (s in I) {
                    var e = I[s],
                        g, q;
                    g = 0;
                    for (q = e._xforms.length; g < q; ++g)
                        if (e._xforms[g] == c) {
                            i = true;
                            e.removeItem(g);
                            break
                        }
                    if (i) break
                }
            }
        };
        this.numberOfItems = 0;
        this.clear = function() {
            this.numberOfItems = 0;
            this._xforms = []
        };
        this.initialize = function(c) {
            this.numberOfItems = 1;
            this._removeFromOtherLists(c);
            this._xforms = [c]
        };
        this.getItem = function(c) {
            if (c < this.numberOfItems && c >= 0) return this._xforms[c];
            throw {
                code: 1
            };
        };
        this.insertItemBefore = function(c, i) {
            var s = null;
            if (i >= 0)
                if (i < this.numberOfItems) {
                    this._removeFromOtherLists(c);
                    s = Array(this.numberOfItems +
                        1);
                    var e;
                    for (e = 0; e < i; ++e) s[e] = this._xforms[e];
                    s[e] = c;
                    var g;
                    for (g = e + 1; e < this.numberOfItems; ++g, ++e) s[g] = this._xforms[e];
                    this.numberOfItems++;
                    this._xforms = s;
                    s = c;
                    this._list._update()
                } else s = this._list.appendItem(c);
            return s
        };
        this.replaceItem = function(c, i) {
            var s = null;
            if (i < this.numberOfItems && i >= 0) {
                this._removeFromOtherLists(c);
                s = this._xforms[i] = c;
                this._list._update()
            }
            return s
        };
        this.removeItem = function(c) {
            if (c < this.numberOfItems && c >= 0) {
                var i = this._xforms[c],
                    s = Array(this.numberOfItems - 1),
                    e;
                for (e = 0; e < c; ++e) s[e] =
                    this._xforms[e];
                for (c = e; c < this.numberOfItems - 1; ++c, ++e) s[c] = this._xforms[e + 1];
                this.numberOfItems--;
                this._xforms = s;
                this._list._update();
                return i
            }
            throw {
                code: 1
            };
        };
        this.appendItem = function(c) {
            this._removeFromOtherLists(c);
            this._xforms.push(c);
            this.numberOfItems++;
            this._list._update();
            return c
        }
    };
    svgedit.transformlist.resetListMap = function() {
        I = {}
    };
    svgedit.transformlist.removeElementFromListMap = function(o) {
        o.id && I[o.id] && delete I[o.id]
    };
    svgedit.transformlist.getTransformList = function(o) {
        if (!svgedit.browser.supportsNativeTransformLists()) {
            var c =
                o.id || "temp",
                i = I[c];
            if (!i || c === "temp") {
                I[c] = new svgedit.transformlist.SVGTransformList(o);
                I[c]._init();
                i = I[c]
            }
            return i
        }
        if (o.transform) return o.transform.baseVal;
        if (o.gradientTransform) return o.gradientTransform.baseVal;
        if (o.patternTransform) return o.patternTransform.baseVal;
        return null
    }
})();
(function() {
    if (!svgedit.math) svgedit.math = {};
    var a = document.createElementNS(svgedit.NS.SVG, "svg");
    svgedit.math.transformPoint = function(I, o, c) {
        return {
            x: c.a * I + c.c * o + c.e,
            y: c.b * I + c.d * o + c.f
        }
    };
    svgedit.math.isIdentity = function(I) {
        return I.a === 1 && I.b === 0 && I.c === 0 && I.d === 1 && I.e === 0 && I.f === 0
    };
    svgedit.math.matrixMultiply = function() {
        for (var I = arguments, o = I.length, c = I[o - 1]; o-- > 1;) c = I[o - 1].multiply(c);
        if (Math.abs(c.a) < 1.0E-14) c.a = 0;
        if (Math.abs(c.b) < 1.0E-14) c.b = 0;
        if (Math.abs(c.c) < 1.0E-14) c.c = 0;
        if (Math.abs(c.d) <
            1.0E-14) c.d = 0;
        if (Math.abs(c.e) < 1.0E-14) c.e = 0;
        if (Math.abs(c.f) < 1.0E-14) c.f = 0;
        return c
    };
    svgedit.math.hasMatrixTransform = function(I) {
        if (!I) return false;
        for (var o = I.numberOfItems; o--;) {
            var c = I.getItem(o);
            if (c.type == 1 && !svgedit.math.isIdentity(c.matrix)) return true
        }
        return false
    };
    svgedit.math.transformBox = function(I, o, c, i, s) {
        var e = svgedit.math.transformPoint,
            g = e(I, o, s),
            q = e(I + c, o, s),
            w = e(I, o + i, s);
        I = e(I + c, o + i, s);
        o = Math.min(g.x, q.x, w.x, I.x);
        c = Math.min(g.y, q.y, w.y, I.y);
        return {
            tl: g,
            tr: q,
            bl: w,
            br: I,
            aabox: {
                x: o,
                y: c,
                width: Math.max(g.x, q.x, w.x, I.x) - o,
                height: Math.max(g.y, q.y, w.y, I.y) - c
            }
        }
    };
    svgedit.math.transformListToTransform = function(I, o, c) {
        if (I == null) return a.createSVGTransformFromMatrix(a.createSVGMatrix());
        o = o || 0;
        c = c || I.numberOfItems - 1;
        o = parseInt(o, 10);
        c = parseInt(c, 10);
        if (o > c) {
            var i = c;
            c = o;
            o = i
        }
        i = a.createSVGMatrix();
        for (o = o; o <= c; ++o) {
            var s = o >= 0 && o < I.numberOfItems ? I.getItem(o).matrix : a.createSVGMatrix();
            i = svgedit.math.matrixMultiply(i, s)
        }
        return a.createSVGTransformFromMatrix(i)
    };
    svgedit.math.getMatrix = function(I) {
        I =
            svgedit.transformlist.getTransformList(I);
        return svgedit.math.transformListToTransform(I).matrix
    };
    svgedit.math.snapToAngle = function(I, o, c, i) {
        var s = Math.PI / 4;
        c = c - I;
        var e = i - o;
        i = Math.sqrt(c * c + e * e);
        s = Math.round(Math.atan2(e, c) / s) * s;
        return {
            x: I + i * Math.cos(s),
            y: o + i * Math.sin(s),
            a: s
        }
    };
    svgedit.math.rectsIntersect = function(I, o) {
        return o.x < I.x + I.width && o.x + o.width > I.x && o.y < I.y + I.height && o.y + o.height > I.y
    }
})();
(function() {
    if (!svgedit.units) svgedit.units = {};
    var a = svgedit.NS,
        I = ["x", "x1", "cx", "rx", "width"],
        o = ["y", "y1", "cy", "ry", "height"],
        c = ["r", "radius"].concat(I, o),
        i, s = {};
    svgedit.units.init = function(g) {
        i = g;
        g = document.createElementNS(a.SVG, "svg");
        document.body.appendChild(g);
        var q = document.createElementNS(a.SVG, "rect");
        q.setAttribute("width", "1em");
        q.setAttribute("height", "1ex");
        q.setAttribute("x", "1in");
        g.appendChild(q);
        q = q.getBBox();
        document.body.removeChild(g);
        g = q.x;
        s = {
            em: q.width,
            ex: q.height,
            "in": g,
            cm: g / 2.54,
            mm: g / 25.4,
            pt: g / 72,
            pc: g / 6,
            px: 1,
            "%": 0
        }
    };
    svgedit.units.getTypeMap = function() {
        return s
    };
    svgedit.units.shortFloat = function(g) {
        var q = i.getRoundDigits();
        if (!isNaN(g)) return +(+g).toFixed(q);
        if ($.isArray(g)) return svgedit.units.shortFloat(g[0]) + "," + svgedit.units.shortFloat(g[1]);
        return parseFloat(g).toFixed(q) - 0
    };
    svgedit.units.convertUnit = function(g, q) {
        q = q || i.getBaseUnit();
        return svgedit.units.shortFloat(g / s[q])
    };
    svgedit.units.setUnitAttr = function(g, q, w) {
        g.setAttribute(q, w)
    };
    var e = {
        line: ["x1", "x2", "y1",
            "y2"
        ],
        circle: ["cx", "cy", "r"],
        ellipse: ["cx", "cy", "rx", "ry"],
        foreignObject: ["x", "y", "width", "height"],
        rect: ["x", "y", "width", "height"],
        image: ["x", "y", "width", "height"],
        use: ["x", "y", "width", "height"],
        text: ["x", "y"]
    };
    svgedit.units.convertAttrs = function(g) {
        var q = g.tagName,
            w = i.getBaseUnit();
        if (q = e[q]) {
            var D = q.length,
                u;
            for (u = 0; u < D; u++) {
                var A = q[u],
                    p = g.getAttribute(A);
                if (p) isNaN(p) || g.setAttribute(A, p / s[w] + w)
            }
        }
    };
    svgedit.units.convertToNum = function(g, q) {
        if (!isNaN(q)) return q - 0;
        var w;
        if (q.substr(-1) === "%") {
            w =
                q.substr(0, q.length - 1) / 100;
            var D = i.getWidth(),
                u = i.getHeight();
            if (I.indexOf(g) >= 0) return w * D;
            if (o.indexOf(g) >= 0) return w * u;
            return w * Math.sqrt(D * D + u * u) / Math.sqrt(2)
        }
        D = q.substr(-2);
        w = q.substr(0, q.length - 2);
        return w * s[D]
    };
    svgedit.units.isValidUnit = function(g, q, w) {
        var D = false;
        if (c.indexOf(g) >= 0)
            if (isNaN(q)) {
                q = q.toLowerCase();
                $.each(s, function(p) {
                    if (!D)
                        if (RegExp("^-?[\\d\\.]+" + p + "$").test(q)) D = true
                })
            } else D = true;
            else if (g == "id") {
            g = false;
            try {
                var u = i.getElement(q);
                g = u == null || u === w
            } catch (A) {}
            return g
        }
        return D =
            true
    }
})();
(function() {
    function a(g) {
        if (svgedit.browser.supportsHVLineContainerBBox()) try {
            return g.getBBox()
        } catch (q) {}
        var w = $.data(g, "ref"),
            D = null,
            u;
        if (w) {
            u = $(w).children().clone().attr("visibility", "hidden");
            $(e).append(u);
            D = u.filter("line, path")
        } else D = $(g).find("line, path");
        var A = false;
        if (D.length) {
            D.each(function() {
                var p = this.getBBox();
                if (!p.width || !p.height) A = true
            });
            if (A) {
                g = w ? u : $(g).children();
                g = getStrokedBBox(g)
            } else g = g.getBBox()
        } else g = g.getBBox();
        w && u.remove();
        return g
    }
    if (!svgedit.utilities) svgedit.utilities = {};
    var I = svgedit.NS,
        o = "a,circle,ellipse,foreignObject,g,image,line,path,polygon,polyline,rect,svg,text,tspan,use".split(","),
        c = null,
        i = null,
        s = null,
        e = null;
    svgedit.utilities.init = function(g) {
        c = g;
        i = g.getDOMDocument();
        s = g.getDOMContainer();
        e = g.getSVGRoot()
    };
    svgedit.utilities.toXml = function(g) {
        return g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/, "&#x27;")
    };
    svgedit.utilities.fromXml = function(g) {
        return $("<p/>").html(g).text()
    };
    svgedit.utilities.encode64 =
        function(g) {
            g = svgedit.utilities.encodeUTF8(g);
            if (window.btoa) return window.btoa(g);
            var q = Array(Math.floor((g.length + 2) / 3) * 4),
                w, D, u, A, p, v, t = 0,
                m = 0;
            do {
                w = g.charCodeAt(t++);
                D = g.charCodeAt(t++);
                u = g.charCodeAt(t++);
                A = w >> 2;
                w = (w & 3) << 4 | D >> 4;
                p = (D & 15) << 2 | u >> 6;
                v = u & 63;
                if (isNaN(D)) p = v = 64;
                else if (isNaN(u)) v = 64;
                q[m++] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(A);
                q[m++] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(w);
                q[m++] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(p);
                q[m++] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(v)
            } while (t < g.length);
            return q.join("")
    };
    svgedit.utilities.decode64 = function(g) {
        if (window.atob) return window.atob(g);
        var q = "",
            w, D, u = "",
            A, p = "",
            v = 0;
        g = g.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do {
            w = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(g.charAt(v++));
            D = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(g.charAt(v++));
            A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(g.charAt(v++));
            p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(g.charAt(v++));
            w = w << 2 | D >> 4;
            D = (D & 15) << 4 | A >> 2;
            u = (A & 3) << 6 | p;
            q += String.fromCharCode(w);
            if (A != 64) q += String.fromCharCode(D);
            if (p != 64) q += String.fromCharCode(u)
        } while (v < g.length);
        return unescape(q)
    };
    svgedit.utilities.encodeUTF8 = function(g) {
        if (g === null || typeof g === "undefined") return "";
        g = String(g);
        var q = "",
            w, D, u = 0;
        w = D = 0;
        u = g.length;
        var A;
        for (A = 0; A < u; A++) {
            var p = g.charCodeAt(A),
                v = null;
            if (p < 128) D++;
            else if (p > 127 && p < 2048) v = String.fromCharCode(p >>
                6 | 192, p & 63 | 128);
            else if ((p & 63488) != 55296) v = String.fromCharCode(p >> 12 | 224, p >> 6 & 63 | 128, p & 63 | 128);
            else {
                if ((p & 64512) != 55296) throw new RangeError("Unmatched trail surrogate at " + A);
                v = g.charCodeAt(++A);
                if ((v & 64512) != 56320) throw new RangeError("Unmatched lead surrogate at " + (A - 1));
                p = ((p & 1023) << 10) + (v & 1023) + 65536;
                v = String.fromCharCode(p >> 18 | 240, p >> 12 & 63 | 128, p >> 6 & 63 | 128, p & 63 | 128)
            } if (v !== null) {
                if (D > w) q += g.slice(w, D);
                q += v;
                w = D = A + 1
            }
        }
        if (D > w) q += g.slice(w, u);
        return q
    };
    svgedit.utilities.convertToXMLReferences = function(g) {
        var q,
            w = "";
        for (q = 0; q < g.length; q++) {
            var D = g.charCodeAt(q);
            if (D < 128) w += g[q];
            else if (D > 127) w += "&#" + D + ";"
        }
        return w
    };
    svgedit.utilities.text2xml = function(g) {
        if (g.indexOf("<svg:svg") >= 0) g = g.replace(/<(\/?)svg:/g, "<$1").replace("xmlns:svg", "xmlns");
        var q, w;
        try {
            w = window.DOMParser ? new DOMParser : new ActiveXObject("Microsoft.XMLDOM");
            w.async = false
        } catch (D) {
            throw Error("XML Parser could not be instantiated");
        }
        try {
            q = w.loadXML ? w.loadXML(g) ? w : false : w.parseFromString(g, "text/xml")
        } catch (u) {
            throw Error("Error parsing XML string");
        }
        return q
    };
    svgedit.utilities.bboxToObj = function(g) {
        return {
            x: g.x,
            y: g.y,
            width: g.width,
            height: g.height
        }
    };
    svgedit.utilities.walkTree = function(g, q) {
        if (g && g.nodeType == 1) {
            q(g);
            for (var w = g.childNodes.length; w--;) svgedit.utilities.walkTree(g.childNodes.item(w), q)
        }
    };
    svgedit.utilities.walkTreePost = function(g, q) {
        if (g && g.nodeType == 1) {
            for (var w = g.childNodes.length; w--;) svgedit.utilities.walkTree(g.childNodes.item(w), q);
            q(g)
        }
    };
    svgedit.utilities.getUrlFromAttr = function(g) {
        if (g) {
            if (g.indexOf('url("') === 0) return g.substring(5,
                g.indexOf('"', 6));
            if (g.indexOf("url('") === 0) return g.substring(5, g.indexOf("'", 6));
            if (g.indexOf("url(") === 0) return g.substring(4, g.indexOf(")"))
        }
        return null
    };
    svgedit.utilities.getHref = function(g) {
        return g.getAttributeNS(I.XLINK, "href")
    };
    svgedit.utilities.setHref = function(g, q) {
        g.setAttributeNS(I.XLINK, "xlink:href", q)
    };
    svgedit.utilities.findDefs = function() {
        var g = c.getSVGContent(),
            q = g.getElementsByTagNameNS(I.SVG, "defs");
        if (q.length > 0) q = q[0];
        else {
            q = g.ownerDocument.createElementNS(I.SVG, "defs");
            g.firstChild ?
                g.insertBefore(q, g.firstChild.nextSibling) : g.appendChild(q)
        }
        return q
    };
    svgedit.utilities.getPathBBox = function(g) {
        var q = g.pathSegList,
            w = q.numberOfItems;
        g = [
            [],
            []
        ];
        var D = q.getItem(0),
            u = [D.x, D.y];
        for (D = 0; D < w; D++) {
            var A = q.getItem(D);
            if (typeof A.x !== "undefined") {
                g[0].push(u[0]);
                g[1].push(u[1]);
                if (A.x1) {
                    var p = [A.x1, A.y1],
                        v = [A.x2, A.y2],
                        t = [A.x, A.y],
                        m;
                    for (m = 0; m < 2; m++) {
                        A = function(fa) {
                            return Math.pow(1 - fa, 3) * u[m] + 3 * Math.pow(1 - fa, 2) * fa * p[m] + 3 * (1 - fa) * Math.pow(fa, 2) * v[m] + Math.pow(fa, 3) * t[m]
                        };
                        var L = 6 * u[m] - 12 * p[m] +
                            6 * v[m],
                            R = -3 * u[m] + 9 * p[m] - 9 * v[m] + 3 * t[m],
                            da = 3 * p[m] - 3 * u[m];
                        if (R == 0) {
                            if (L != 0) {
                                L = -da / L;
                                0 < L && L < 1 && g[m].push(A(L))
                            }
                        } else {
                            da = Math.pow(L, 2) - 4 * da * R;
                            if (!(da < 0)) {
                                var qa = (-L + Math.sqrt(da)) / (2 * R);
                                0 < qa && qa < 1 && g[m].push(A(qa));
                                L = (-L - Math.sqrt(da)) / (2 * R);
                                0 < L && L < 1 && g[m].push(A(L))
                            }
                        }
                    }
                    u = t
                } else {
                    g[0].push(A.x);
                    g[1].push(A.y)
                }
            }
        }
        q = Math.min.apply(null, g[0]);
        w = Math.max.apply(null, g[0]) - q;
        D = Math.min.apply(null, g[1]);
        g = Math.max.apply(null, g[1]) - D;
        return {
            x: q,
            y: D,
            width: w,
            height: g
        }
    };
    svgedit.utilities.getBBox = function(g) {
        var q = g ||
            c.geSelectedElements()[0];
        if (g.nodeType != 1) return null;
        g = null;
        var w = q.nodeName;
        switch (w) {
            case "text":
                if (q.textContent === "") {
                    q.textContent = "a";
                    g = q.getBBox();
                    q.textContent = ""
                } else try {
                    g = q.getBBox()
                } catch (D) {}
                break;
            case "path":
                if (svgedit.browser.supportsPathBBox()) try {
                    g = q.getBBox()
                } catch (u) {} else g = svgedit.utilities.getPathBBox(q);
                break;
            case "g":
            case "a":
                g = a(q);
                break;
            default:
                if (w === "use") g = a(q, true);
                if (w === "use" || w === "foreignObject" && svgedit.browser.isWebkit()) {
                    g || (g = q.getBBox());
                    w = {};
                    w.width = g.width;
                    w.height = g.height;
                    w.x = g.x + parseFloat(q.getAttribute("x") || 0);
                    w.y = g.y + parseFloat(q.getAttribute("y") || 0);
                    g = w
                } else if (~o.indexOf(w)) try {
                    g = q.getBBox()
                } catch (A) {
                    q = $(q).closest("foreignObject");
                    if (q.length) try {
                        g = q[0].getBBox()
                    } catch (p) {
                        g = null
                    } else g = null
                }
        }
        if (g) g = svgedit.utilities.bboxToObj(g);
        return g
    };
    svgedit.utilities.getRotationAngle = function(g, q) {
        var w = g || c.getSelectedElements()[0];
        w = svgedit.transformlist.getTransformList(w);
        if (!w) return 0;
        var D = w.numberOfItems,
            u;
        for (u = 0; u < D; ++u) {
            var A = w.getItem(u);
            if (A.type == 4) return q ? A.angle * Math.PI / 180 : A.angle
        }
        return 0
    };
    svgedit.utilities.getRefElem = function(g) {
        return svgedit.utilities.getElem(svgedit.utilities.getUrlFromAttr(g).substr(1))
    };
    svgedit.utilities.getElem = svgedit.browser.supportsSelectors() ? function(g) {
        return e.querySelector("#" + g)
    } : svgedit.browser.supportsXpath() ? function(g) {
        return i.evaluate('svg:svg[@id="svgroot"]//svg:*[@id="' + g + '"]', s, function() {
            return svgedit.NS.SVG
        }, 9, null).singleNodeValue
    } : function(g) {
        return $(e).find("[id=" + g + "]")[0]
    };
    svgedit.utilities.assignAttributes = function(g, q, w, D) {
        w || (w = 0);
        svgedit.browser.isOpera() || e.suspendRedraw(w);
        for (var u in q)
            if (w = u.substr(0, 4) === "xml:" ? I.XML : u.substr(0, 6) === "xlink:" ? I.XLINK : null) g.setAttributeNS(w, u, q[u]);
            else D ? svgedit.units.setUnitAttr(g, u, q[u]) : g.setAttribute(u, q[u]);
        svgedit.browser.isOpera() || e.unsuspendRedraw(null)
    };
    svgedit.utilities.cleanupElement = function(g) {
        var q = e.suspendRedraw(60),
            w = {
                "fill-opacity": 1,
                "stop-opacity": 1,
                opacity: 1,
                stroke: "none",
                "stroke-dasharray": "none",
                "stroke-linejoin": "miter",
                "stroke-linecap": "butt",
                "stroke-opacity": 1,
                "stroke-width": 1,
                rx: 0,
                ry: 0
            }, D;
        for (D in w) {
            var u = w[D];
            g.getAttribute(D) == u && g.removeAttribute(D)
        }
        e.unsuspendRedraw(q)
    };
    svgedit.utilities.snapToGrid = function(g) {
        var q = c.getSnappingStep(),
            w = c.getBaseUnit();
        if (w !== "px") q *= svgedit.units.getTypeMap()[w];
        return g = Math.round(g / q) * q
    };
    svgedit.utilities.preg_quote = function(g, q) {
        return String(g).replace(RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\" + (q || "") + "-]", "g"), "\\$&")
    }
})();
(function() {
    if (!svgedit.sanitize) svgedit.sanitize = {};
    var a = svgedit.NS,
        I = svgedit.getReverseNS(),
        o = {
            a: ["class", "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "id", "mask", "opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "xlink:href", "xlink:title"],
            circle: ["class", "clip-path", "clip-rule", "cx", "cy", "fill", "fill-opacity", "fill-rule", "filter", "id", "mask",
                "opacity", "r", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"
            ],
            clipPath: ["class", "clipPathUnits", "id"],
            defs: [],
            style: ["type"],
            desc: [],
            ellipse: ["class", "clip-path", "clip-rule", "cx", "cy", "fill", "fill-opacity", "fill-rule", "filter", "id", "mask", "opacity", "requiredFeatures", "rx", "ry", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin",
                "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"
            ],
            feGaussianBlur: ["class", "color-interpolation-filters", "id", "requiredFeatures", "stdDeviation"],
            filter: ["class", "color-interpolation-filters", "filterRes", "filterUnits", "height", "id", "primitiveUnits", "requiredFeatures", "width", "x", "xlink:href", "y"],
            foreignObject: ["class", "font-size", "height", "id", "opacity", "requiredFeatures", "style", "transform", "width", "x", "y"],
            g: ["class", "clip-path", "clip-rule", "id", "display",
                "fill", "fill-opacity", "fill-rule", "filter", "mask", "opacity", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "font-family", "font-size", "font-style", "font-weight", "text-anchor"
            ],
            image: ["class", "clip-path", "clip-rule", "filter", "height", "id", "mask", "opacity", "requiredFeatures", "style", "systemLanguage", "transform", "width", "x", "xlink:href", "xlink:title", "y"],
            line: ["class",
                "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "id", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "x1", "x2", "y1", "y2"
            ],
            linearGradient: ["class", "id", "gradientTransform", "gradientUnits", "requiredFeatures", "spreadMethod", "systemLanguage", "x1", "x2", "xlink:href", "y1", "y2"],
            marker: ["id",
                "class", "markerHeight", "markerUnits", "markerWidth", "orient", "preserveAspectRatio", "refX", "refY", "systemLanguage", "viewBox"
            ],
            mask: ["class", "height", "id", "maskContentUnits", "maskUnits", "width", "x", "y"],
            metadata: ["class", "id"],
            path: ["class", "clip-path", "clip-rule", "d", "fill", "fill-opacity", "fill-rule", "filter", "id", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity",
                "stroke-width", "style", "systemLanguage", "transform"
            ],
            pattern: ["class", "height", "id", "patternContentUnits", "patternTransform", "patternUnits", "requiredFeatures", "style", "systemLanguage", "viewBox", "width", "x", "xlink:href", "y"],
            polygon: ["class", "clip-path", "clip-rule", "id", "fill", "fill-opacity", "fill-rule", "filter", "id", "class", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "points", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit",
                "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"
            ],
            polyline: ["class", "clip-path", "clip-rule", "id", "fill", "fill-opacity", "fill-rule", "filter", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "points", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform"],
            radialGradient: ["class", "cx", "cy", "fx", "fy", "gradientTransform", "gradientUnits", "id",
                "r", "requiredFeatures", "spreadMethod", "systemLanguage", "xlink:href"
            ],
            rect: ["class", "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "height", "id", "mask", "opacity", "requiredFeatures", "rx", "ry", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "width", "x", "y"],
            stop: ["class", "id", "offset", "requiredFeatures", "stop-color", "stop-opacity", "style", "systemLanguage"],
            svg: ["class",
                "clip-path", "clip-rule", "filter", "id", "height", "mask", "preserveAspectRatio", "requiredFeatures", "style", "systemLanguage", "viewBox", "width", "x", "xmlns", "xmlns:se", "xmlns:xlink", "y"
            ],
            "switch": ["class", "id", "requiredFeatures", "systemLanguage"],
            symbol: ["class", "fill", "fill-opacity", "fill-rule", "filter", "font-family", "font-size", "font-style", "font-weight", "id", "opacity", "preserveAspectRatio", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit",
                "stroke-opacity", "stroke-width", "style", "systemLanguage", "transform", "viewBox"
            ],
            text: ["class", "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "font-family", "font-size", "font-style", "font-weight", "id", "mask", "opacity", "requiredFeatures", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "text-anchor", "transform", "x", "xml:space", "y"],
            textPath: ["class", "id", "method", "requiredFeatures",
                "spacing", "startOffset", "style", "systemLanguage", "transform", "xlink:href"
            ],
            title: [],
            tspan: ["class", "clip-path", "clip-rule", "dx", "dy", "fill", "fill-opacity", "fill-rule", "filter", "font-family", "font-size", "font-style", "font-weight", "id", "mask", "opacity", "requiredFeatures", "rotate", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "systemLanguage", "text-anchor", "textLength", "transform", "x", "xml:space", "y"],
            use: ["class",
                "clip-path", "clip-rule", "fill", "fill-opacity", "fill-rule", "filter", "height", "id", "mask", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "style", "transform", "width", "x", "xlink:href", "y"
            ],
            annotation: ["encoding"],
            "annotation-xml": ["encoding"],
            maction: ["actiontype", "other", "selection"],
            math: ["class", "id", "display", "xmlns"],
            menclose: ["notation"],
            merror: [],
            mfrac: ["linethickness"],
            mi: ["mathvariant"],
            mmultiscripts: [],
            mn: [],
            mo: ["fence", "lspace", "maxsize", "minsize", "rspace", "stretchy"],
            mover: [],
            mpadded: ["lspace", "width", "height", "depth", "voffset"],
            mphantom: [],
            mprescripts: [],
            mroot: [],
            mrow: ["xlink:href", "xlink:type", "xmlns:xlink"],
            mspace: ["depth", "height", "width"],
            msqrt: [],
            mstyle: ["displaystyle", "mathbackground", "mathcolor", "mathvariant", "scriptlevel"],
            msub: [],
            msubsup: [],
            msup: [],
            mtable: ["align", "columnalign", "columnlines", "columnspacing", "displaystyle", "equalcolumns", "equalrows", "frame", "rowalign", "rowlines", "rowspacing",
                "width"
            ],
            mtd: ["columnalign", "columnspan", "rowalign", "rowspan"],
            mtext: [],
            mtr: ["columnalign", "rowalign"],
            munder: [],
            munderover: [],
            none: [],
            semantics: []
        }, c = {};
    $.each(o, function(i, s) {
        var e = {};
        $.each(s, function(g, q) {
            if (q.indexOf(":") >= 0) {
                var w = q.split(":");
                e[w[1]] = a[w[0].toUpperCase()]
            } else e[q] = q == "xmlns" ? a.XMLNS : null
        });
        c[i] = e
    });
    svgedit.sanitize.sanitizeSvg = function(i) {
        if (i.nodeType == 3) {
            i.nodeValue = i.nodeValue.replace(/^\s+|\s+$/g, "");
            i.nodeValue.length === 0 && i.parentNode.removeChild(i)
        }
        if (i.nodeType == 1) {
            var s =
                i.parentNode;
            if (i.ownerDocument && s) {
                var e = o[i.nodeName],
                    g = c[i.nodeName],
                    q;
                if (typeof e !== "undefined") {
                    var w = [];
                    for (q = i.attributes.length; q--;) {
                        var D = i.attributes.item(q),
                            u = D.nodeName,
                            A = D.localName,
                            p = D.namespaceURI;
                        if (!(g.hasOwnProperty(A) && p == g[A] && p != a.XMLNS) && !(p == a.XMLNS && I[D.nodeValue])) {
                            u.indexOf("se:") === 0 && w.push([u, D.nodeValue]);
                            i.removeAttributeNS(p, A)
                        }
                        if (svgedit.browser.isGecko()) switch (u) {
                            case "transform":
                            case "gradientTransform":
                            case "patternTransform":
                                A = D.nodeValue.replace(/(\d)-/g, "$1 -");
                                i.setAttribute(u, A)
                        }
                        if (u == "style") {
                            D = D.nodeValue.split(";");
                            for (u = D.length; u--;) {
                                p = D[u].split(":");
                                A = $.trim(p[0]);
                                p = $.trim(p[1]);
                                e.indexOf(A) >= 0 && i.setAttribute(A, p)
                            }
                            i.removeAttribute("style")
                        }
                    }
                    $.each(w, function(v, t) {
                        i.setAttributeNS(a.SE, t[0], t[1])
                    });
                    if ((q = svgedit.utilities.getHref(i)) && ["filter", "linearGradient", "pattern", "radialGradient", "textPath", "use"].indexOf(i.nodeName) >= 0)
                        if (q[0] != "#") {
                            svgedit.utilities.setHref(i, "");
                            i.removeAttributeNS(a.XLINK, "href")
                        }
                    if (i.nodeName == "use" && !svgedit.utilities.getHref(i)) s.removeChild(i);
                    else {
                        $.each(["clip-path", "fill", "filter", "marker-end", "marker-mid", "marker-start", "mask", "stroke"], function(v, t) {
                            var m = i.getAttribute(t);
                            if (m)
                                if ((m = svgedit.utilities.getUrlFromAttr(m)) && m[0] !== "#") {
                                    i.setAttribute(t, "");
                                    i.removeAttribute(t)
                                }
                        });
                        for (q = i.childNodes.length; q--;) svgedit.sanitize.sanitizeSvg(i.childNodes.item(q))
                    }
                } else {
                    for (e = []; i.hasChildNodes();) e.push(s.insertBefore(i.firstChild, i));
                    s.removeChild(i);
                    for (q = e.length; q--;) svgedit.sanitize.sanitizeSvg(e[q])
                }
            }
        }
    }
})();
(function() {
    if (!svgedit.history) svgedit.history = {};
    svgedit.history.HistoryEventTypes = {
        BEFORE_APPLY: "before_apply",
        AFTER_APPLY: "after_apply",
        BEFORE_UNAPPLY: "before_unapply",
        AFTER_UNAPPLY: "after_unapply"
    };
    svgedit.history.MoveElementCommand = function(a, I, o, c) {
        this.elem = a;
        this.text = c ? "Move " + a.tagName + " to " + c : "Move " + a.tagName;
        this.oldNextSibling = I;
        this.oldParent = o;
        this.newNextSibling = a.nextSibling;
        this.newParent = a.parentNode
    };
    svgedit.history.MoveElementCommand.type = function() {
        return "svgedit.history.MoveElementCommand"
    };
    svgedit.history.MoveElementCommand.prototype.type = svgedit.history.MoveElementCommand.type;
    svgedit.history.MoveElementCommand.prototype.getText = function() {
        return this.text
    };
    svgedit.history.MoveElementCommand.prototype.apply = function(a) {
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_APPLY, this);
        this.elem = this.newParent.insertBefore(this.elem, this.newNextSibling);
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_APPLY, this)
    };
    svgedit.history.MoveElementCommand.prototype.unapply =
        function(a) {
            a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_UNAPPLY, this);
            this.elem = this.oldParent.insertBefore(this.elem, this.oldNextSibling);
            a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_UNAPPLY, this)
    };
    svgedit.history.MoveElementCommand.prototype.elements = function() {
        return [this.elem]
    };
    svgedit.history.InsertElementCommand = function(a, I) {
        this.elem = a;
        this.text = I || "Create " + a.tagName;
        this.parent = a.parentNode;
        this.nextSibling = this.elem.nextSibling
    };
    svgedit.history.InsertElementCommand.type =
        function() {
            return "svgedit.history.InsertElementCommand"
    };
    svgedit.history.InsertElementCommand.prototype.type = svgedit.history.InsertElementCommand.type;
    svgedit.history.InsertElementCommand.prototype.getText = function() {
        return this.text
    };
    svgedit.history.InsertElementCommand.prototype.apply = function(a) {
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_APPLY, this);
        this.elem = this.parent.insertBefore(this.elem, this.nextSibling);
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_APPLY,
            this)
    };
    svgedit.history.InsertElementCommand.prototype.unapply = function(a) {
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_UNAPPLY, this);
        this.parent = this.elem.parentNode;
        this.elem = this.elem.parentNode.removeChild(this.elem);
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_UNAPPLY, this)
    };
    svgedit.history.InsertElementCommand.prototype.elements = function() {
        return [this.elem]
    };
    svgedit.history.RemoveElementCommand = function(a, I, o, c) {
        this.elem = a;
        this.text = c || "Delete " + a.tagName;
        this.nextSibling = I;
        this.parent = o;
        svgedit.transformlist.removeElementFromListMap(a)
    };
    svgedit.history.RemoveElementCommand.type = function() {
        return "svgedit.history.RemoveElementCommand"
    };
    svgedit.history.RemoveElementCommand.prototype.type = svgedit.history.RemoveElementCommand.type;
    svgedit.history.RemoveElementCommand.prototype.getText = function() {
        return this.text
    };
    svgedit.history.RemoveElementCommand.prototype.apply = function(a) {
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_APPLY, this);
        svgedit.transformlist.removeElementFromListMap(this.elem);
        this.parent = this.elem.parentNode;
        this.elem = this.parent.removeChild(this.elem);
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_APPLY, this)
    };
    svgedit.history.RemoveElementCommand.prototype.unapply = function(a) {
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_UNAPPLY, this);
        svgedit.transformlist.removeElementFromListMap(this.elem);
        this.nextSibling == null && window.console && console.log("Error: reference element was lost");
        this.parent.insertBefore(this.elem, this.nextSibling);
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_UNAPPLY, this)
    };
    svgedit.history.RemoveElementCommand.prototype.elements = function() {
        return [this.elem]
    };
    svgedit.history.ChangeElementCommand = function(a, I, o) {
        this.elem = a;
        this.text = o ? "Change " + a.tagName + " " + o : "Change " + a.tagName;
        this.newValues = {};
        this.oldValues = I;
        for (var c in I) this.newValues[c] = c == "#text" ? a.textContent : c == "#href" ? svgedit.utilities.getHref(a) : a.getAttribute(c)
    };
    svgedit.history.ChangeElementCommand.type =
        function() {
            return "svgedit.history.ChangeElementCommand"
    };
    svgedit.history.ChangeElementCommand.prototype.type = svgedit.history.ChangeElementCommand.type;
    svgedit.history.ChangeElementCommand.prototype.getText = function() {
        return this.text
    };
    svgedit.history.ChangeElementCommand.prototype.apply = function(a) {
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_APPLY, this);
        var I = false,
            o;
        for (o in this.newValues) {
            if (this.newValues[o])
                if (o == "#text") this.elem.textContent = this.newValues[o];
                else o == "#href" ?
                    svgedit.utilities.setHref(this.elem, this.newValues[o]) : this.elem.setAttribute(o, this.newValues[o]);
                else if (o == "#text") this.elem.textContent = "";
            else {
                this.elem.setAttribute(o, "");
                this.elem.removeAttribute(o)
            } if (o == "transform") I = true
        }
        if (!I)
            if (I = svgedit.utilities.getRotationAngle(this.elem)) {
                o = elem.getBBox();
                I = ["rotate(", I, " ", o.x + o.width / 2, ",", o.y + o.height / 2, ")"].join("");
                I != elem.getAttribute("transform") && elem.setAttribute("transform", I)
            }
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_APPLY,
            this);
        return true
    };
    svgedit.history.ChangeElementCommand.prototype.unapply = function(a) {
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_UNAPPLY, this);
        var I = false,
            o;
        for (o in this.oldValues) {
            if (this.oldValues[o])
                if (o == "#text") this.elem.textContent = this.oldValues[o];
                else o == "#href" ? svgedit.utilities.setHref(this.elem, this.oldValues[o]) : this.elem.setAttribute(o, this.oldValues[o]);
                else if (o == "#text") this.elem.textContent = "";
            else this.elem.removeAttribute(o); if (o == "transform") I = true
        }
        if (!I)
            if (I =
                svgedit.utilities.getRotationAngle(this.elem)) {
                o = elem.getBBox();
                I = ["rotate(", I, " ", o.x + o.width / 2, ",", o.y + o.height / 2, ")"].join("");
                I != elem.getAttribute("transform") && elem.setAttribute("transform", I)
            }
        svgedit.transformlist.removeElementFromListMap(this.elem);
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_UNAPPLY, this);
        return true
    };
    svgedit.history.ChangeElementCommand.prototype.elements = function() {
        return [this.elem]
    };
    svgedit.history.BatchCommand = function(a) {
        this.text = a || "Batch Command";
        this.stack = []
    };
    svgedit.history.BatchCommand.type = function() {
        return "svgedit.history.BatchCommand"
    };
    svgedit.history.BatchCommand.prototype.type = svgedit.history.BatchCommand.type;
    svgedit.history.BatchCommand.prototype.getText = function() {
        return this.text
    };
    svgedit.history.BatchCommand.prototype.apply = function(a) {
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_APPLY, this);
        var I, o = this.stack.length;
        for (I = 0; I < o; ++I) this.stack[I].apply(a);
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_APPLY,
            this)
    };
    svgedit.history.BatchCommand.prototype.unapply = function(a) {
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.BEFORE_UNAPPLY, this);
        var I;
        for (I = this.stack.length - 1; I >= 0; I--) this.stack[I].unapply(a);
        a && a.handleHistoryEvent(svgedit.history.HistoryEventTypes.AFTER_UNAPPLY, this)
    };
    svgedit.history.BatchCommand.prototype.elements = function() {
        for (var a = [], I = this.stack.length; I--;)
            for (var o = this.stack[I].elements(), c = o.length; c--;) a.indexOf(o[c]) == -1 && a.push(o[c]);
        return a
    };
    svgedit.history.BatchCommand.prototype.addSubCommand =
        function(a) {
            this.stack.push(a)
    };
    svgedit.history.BatchCommand.prototype.isEmpty = function() {
        return this.stack.length === 0
    };
    svgedit.history.UndoManager = function(a) {
        this.handler_ = a || null;
        this.undoStackPointer = 0;
        this.undoStack = [];
        this.undoChangeStackPointer = -1;
        this.undoableChangeStack = []
    };
    svgedit.history.UndoManager.prototype.resetUndoStack = function() {
        this.undoStack = [];
        this.undoStackPointer = 0
    };
    svgedit.history.UndoManager.prototype.getUndoStackSize = function() {
        return this.undoStackPointer
    };
    svgedit.history.UndoManager.prototype.getRedoStackSize =
        function() {
            return this.undoStack.length - this.undoStackPointer
    };
    svgedit.history.UndoManager.prototype.getNextUndoCommandText = function() {
        return this.undoStackPointer > 0 ? this.undoStack[this.undoStackPointer - 1].getText() : ""
    };
    svgedit.history.UndoManager.prototype.getNextRedoCommandText = function() {
        return this.undoStackPointer < this.undoStack.length ? this.undoStack[this.undoStackPointer].getText() : ""
    };
    svgedit.history.UndoManager.prototype.undo = function() {
        this.undoStackPointer > 0 && this.undoStack[--this.undoStackPointer].unapply(this.handler_)
    };
    svgedit.history.UndoManager.prototype.redo = function() {
        this.undoStackPointer < this.undoStack.length && this.undoStack.length > 0 && this.undoStack[this.undoStackPointer++].apply(this.handler_)
    };
    svgedit.history.UndoManager.prototype.addCommandToHistory = function(a) {
        if (this.undoStackPointer < this.undoStack.length && this.undoStack.length > 0) this.undoStack = this.undoStack.splice(0, this.undoStackPointer);
        this.undoStack.push(a);
        this.undoStackPointer = this.undoStack.length
    };
    svgedit.history.UndoManager.prototype.beginUndoableChange =
        function(a, I) {
            for (var o = ++this.undoChangeStackPointer, c = I.length, i = Array(c), s = Array(c); c--;) {
                var e = I[c];
                if (e != null) {
                    s[c] = e;
                    i[c] = e.getAttribute(a)
                }
            }
            this.undoableChangeStack[o] = {
                attrName: a,
                oldValues: i,
                elements: s
            }
    };
    svgedit.history.UndoManager.prototype.finishUndoableChange = function() {
        for (var a = this.undoChangeStackPointer--, I = this.undoableChangeStack[a], o = I.elements.length, c = I.attrName, i = new svgedit.history.BatchCommand("Change " + c); o--;) {
            var s = I.elements[o];
            if (s != null) {
                var e = {};
                e[c] = I.oldValues[o];
                e[c] !=
                    s.getAttribute(c) && i.addSubCommand(new svgedit.history.ChangeElementCommand(s, e, c))
            }
        }
        this.undoableChangeStack[a] = null;
        return i
    }
})();
var svgedit = svgedit || {};
(function() {
    if (!svgedit.coords) svgedit.coords = {};
    var a = [0, "z", "M", "m", "L", "l", "C", "c", "Q", "q", "A", "a", "H", "h", "V", "v", "S", "s", "T", "t"],
        I = null;
    svgedit.coords.init = function(o) {
        I = o
    };
    svgedit.coords.remapElement = function(o, c, i) {
        var s, e, g = function(v, t) {
                return svgedit.math.transformPoint(v, t, i)
            }, q = I.getGridSnapping() && o.parentNode.parentNode.localName === "svg",
            w = function() {
                var v;
                if (q)
                    for (v in c) c[v] = svgedit.utilities.snapToGrid(c[v]);
                svgedit.utilities.assignAttributes(o, c, 1E3, true)
            }, D = svgedit.utilities.getBBox(o);
        for (s = 0; s < 2; s++) {
            e = s === 0 ? "fill" : "stroke";
            var u = o.getAttribute(e);
            if (u && u.indexOf("url(") === 0)
                if (i.a < 0 || i.d < 0) {
                    u = svgedit.utilities.getRefElem(u).cloneNode(true);
                    if (i.a < 0) {
                        var A = u.getAttribute("x1"),
                            p = u.getAttribute("x2");
                        u.setAttribute("x1", -(A - 1));
                        u.setAttribute("x2", -(p - 1))
                    }
                    if (i.d < 0) {
                        A = u.getAttribute("y1");
                        p = u.getAttribute("y2");
                        u.setAttribute("y1", -(A - 1));
                        u.setAttribute("y2", -(p - 1))
                    }
                    u.id = I.getDrawing().getNextId();
                    svgedit.utilities.findDefs().appendChild(u);
                    o.setAttribute(e, "url(#" + u.id + ")")
                }
        }
        s =
            o.tagName;
        if (s === "g" || s === "text" || s == "tspan" || s === "use")
            if (i.a == 1 && i.b == 0 && i.c == 0 && i.d == 1 && (i.e != 0 || i.f != 0)) {
                e = svgedit.math.transformListToTransform(o).matrix;
                e = svgedit.math.matrixMultiply(e.inverse(), i, e);
                c.x = parseFloat(c.x) + e.e;
                c.y = parseFloat(c.y) + e.f
            } else {
                e = svgedit.transformlist.getTransformList(o);
                u = svgroot.createSVGTransform();
                u.setMatrix(svgedit.math.matrixMultiply(svgedit.math.transformListToTransform(e).matrix, i));
                e.clear();
                e.appendItem(u)
            }
        switch (s) {
            case "foreignObject":
            case "rect":
            case "image":
                if (s ===
                    "image" && (i.a < 0 || i.d < 0)) {
                    e = svgedit.transformlist.getTransformList(o);
                    u = svgroot.createSVGTransform();
                    u.setMatrix(svgedit.math.matrixMultiply(svgedit.math.transformListToTransform(e).matrix, i));
                    e.clear();
                    e.appendItem(u)
                } else {
                    u = g(c.x, c.y);
                    c.width = i.a * c.width;
                    c.height = i.d * c.height;
                    c.x = u.x + Math.min(0, c.width);
                    c.y = u.y + Math.min(0, c.height);
                    c.width = Math.abs(c.width);
                    c.height = Math.abs(c.height)
                }
                w();
                break;
            case "ellipse":
                g = g(c.cx, c.cy);
                c.cx = g.x;
                c.cy = g.y;
                c.rx = i.a * c.rx;
                c.ry = i.d * c.ry;
                c.rx = Math.abs(c.rx);
                c.ry = Math.abs(c.ry);
                w();
                break;
            case "circle":
                g = g(c.cx, c.cy);
                c.cx = g.x;
                c.cy = g.y;
                g = svgedit.math.transformBox(D.x, D.y, D.width, D.height, i);
                c.r = Math.min((g.tr.x - g.tl.x) / 2, (g.bl.y - g.tl.y) / 2);
                if (c.r) c.r = Math.abs(c.r);
                w();
                break;
            case "line":
                u = g(c.x1, c.y1);
                A = g(c.x2, c.y2);
                c.x1 = u.x;
                c.y1 = u.y;
                c.x2 = A.x;
                c.y2 = A.y;
            case "text":
            case "tspan":
            case "use":
                w();
                break;
            case "g":
                (g = $(o).data("gsvg")) && svgedit.utilities.assignAttributes(g, c, 1E3, true);
                break;
            case "polyline":
            case "polygon":
                w = c.points.length;
                for (s = 0; s < w; ++s) {
                    e = c.points[s];
                    e = g(e.x, e.y);
                    c.points[s].x = e.x;
                    c.points[s].y = e.y
                }
                w = c.points.length;
                g = "";
                for (s = 0; s < w; ++s) {
                    e = c.points[s];
                    g += e.x + "," + e.y + " "
                }
                o.setAttribute("points", g);
                break;
            case "path":
                e = o.pathSegList;
                w = e.numberOfItems;
                c.d = [];
                for (s = 0; s < w; ++s) {
                    D = e.getItem(s);
                    c.d[s] = {
                        type: D.pathSegType,
                        x: D.x,
                        y: D.y,
                        x1: D.x1,
                        y1: D.y1,
                        x2: D.x2,
                        y2: D.y2,
                        r1: D.r1,
                        r2: D.r2,
                        angle: D.angle,
                        largeArcFlag: D.largeArcFlag,
                        sweepFlag: D.sweepFlag
                    }
                }
                w = c.d.length;
                s = c.d[0];
                p = g(s.x, s.y);
                c.d[0].x = p.x;
                c.d[0].y = p.y;
                for (s = 1; s < w; ++s) {
                    D = c.d[s];
                    e = D.type;
                    if (e % 2 == 0) {
                        e = g(D.x != undefined ?
                            D.x : p.x, D.y != undefined ? D.y : p.y);
                        u = g(D.x1, D.y1);
                        A = g(D.x2, D.y2);
                        D.x = e.x;
                        D.y = e.y;
                        D.x1 = u.x;
                        D.y1 = u.y;
                        D.x2 = A.x;
                        D.y2 = A.y
                    } else {
                        D.x = i.a * D.x;
                        D.y = i.d * D.y;
                        D.x1 = i.a * D.x1;
                        D.y1 = i.d * D.y1;
                        D.x2 = i.a * D.x2;
                        D.y2 = i.d * D.y2
                    }
                    D.r1 = i.a * D.r1;
                    D.r2 = i.d * D.r2
                }
                g = "";
                w = c.d.length;
                for (s = 0; s < w; ++s) {
                    D = c.d[s];
                    e = D.type;
                    g += a[e];
                    switch (e) {
                        case 13:
                        case 12:
                            g += D.x + " ";
                            break;
                        case 15:
                        case 14:
                            g += D.y + " ";
                            break;
                        case 3:
                        case 5:
                        case 19:
                        case 2:
                        case 4:
                        case 18:
                            g += D.x + "," + D.y + " ";
                            break;
                        case 7:
                        case 6:
                            g += D.x1 + "," + D.y1 + " " + D.x2 + "," + D.y2 + " " + D.x + "," + D.y + " ";
                            break;
                        case 9:
                        case 8:
                            g += D.x1 + "," + D.y1 + " " + D.x + "," + D.y + " ";
                            break;
                        case 11:
                        case 10:
                            g += D.r1 + "," + D.r2 + " " + D.angle + " " + +D.largeArcFlag + " " + +D.sweepFlag + " " + D.x + "," + D.y + " ";
                            break;
                        case 17:
                        case 16:
                            g += D.x2 + "," + D.y2 + " " + D.x + "," + D.y + " "
                    }
                }
                o.setAttribute("d", g)
        }
    }
})();
svgedit = svgedit || {};
(function() {
    if (!svgedit.recalculate) svgedit.recalculate = {};
    var a = svgedit.NS,
        I;
    svgedit.recalculate.init = function(o) {
        I = o
    };
    svgedit.recalculate.updateClipPath = function(o, c, i) {
        o = getRefElem(o).firstChild;
        var s = svgedit.transformlist.getTransformList(o),
            e = I.getSVGRoot().createSVGTransform();
        e.setTranslate(c, i);
        s.appendItem(e);
        svgedit.recalculate.recalculateDimensions(o)
    };
    svgedit.recalculate.recalculateDimensions = function(o) {
        if (o == null) return null;
        if (o.nodeName == "svg" && navigator.userAgent.indexOf("Firefox/20") >= 0) return null;
        var c = I.getSVGRoot(),
            i = svgedit.transformlist.getTransformList(o),
            s;
        if (i && i.numberOfItems > 0) {
            for (s = i.numberOfItems; s--;) {
                var e = i.getItem(s);
                if (e.type === 0) i.removeItem(s);
                else if (e.type === 1) svgedit.math.isIdentity(e.matrix) && i.removeItem(s);
                else e.type === 4 && e.angle === 0 && i.removeItem(s)
            }
            if (i.numberOfItems === 1 && svgedit.utilities.getRotationAngle(o)) return null
        }
        if (!i || i.numberOfItems == 0) {
            o.setAttribute("transform", "");
            o.removeAttribute("transform");
            return null
        }
        if (i) {
            s = i.numberOfItems;
            for (var g = []; s--;) {
                e =
                    i.getItem(s);
                if (e.type === 1) g.push([e.matrix, s]);
                else if (g.length) g = []
            }
            if (g.length === 2) {
                s = c.createSVGTransformFromMatrix(svgedit.math.matrixMultiply(g[1][0], g[0][0]));
                i.removeItem(g[0][1]);
                i.removeItem(g[1][1]);
                i.insertItemBefore(s, g[1][1])
            }
            s = i.numberOfItems;
            if (s >= 2 && i.getItem(s - 2).type === 1 && i.getItem(s - 1).type === 2) {
                g = c.createSVGTransform();
                e = svgedit.math.matrixMultiply(i.getItem(s - 2).matrix, i.getItem(s - 1).matrix);
                g.setMatrix(e);
                i.removeItem(s - 2);
                i.removeItem(s - 2);
                i.appendItem(g)
            }
        }
        switch (o.tagName) {
            case "line":
            case "polyline":
            case "polygon":
            case "path":
                break;
            default:
                if (i.numberOfItems === 1 && i.getItem(0).type === 1 || i.numberOfItems === 2 && i.getItem(0).type === 1 && i.getItem(0).type === 4) return null
        }
        var q = $(o).data("gsvg");
        s = new svgedit.history.BatchCommand("Transform");
        var w = {}, D = null;
        e = [];
        switch (o.tagName) {
            case "line":
                e = ["x1", "y1", "x2", "y2"];
                break;
            case "circle":
                e = ["cx", "cy", "r"];
                break;
            case "ellipse":
                e = ["cx", "cy", "rx", "ry"];
                break;
            case "foreignObject":
            case "rect":
            case "image":
                e = ["width", "height", "x", "y"];
                break;
            case "use":
            case "text":
            case "tspan":
                e = ["x", "y"];
                break;
            case "polygon":
            case "polyline":
                D = {};
                D.points = o.getAttribute("points");
                g = o.points;
                var u = g.numberOfItems;
                w.points = Array(u);
                var A;
                for (A = 0; A < u; ++A) {
                    var p = g.getItem(A);
                    w.points[A] = {
                        x: p.x,
                        y: p.y
                    }
                }
                break;
            case "path":
                D = {};
                D.d = o.getAttribute("d");
                w.d = o.getAttribute("d")
        }
        if (e.length) {
            w = $(o).attr(e);
            $.each(w, function(ta, pb) {
                w[ta] = svgedit.units.convertToNum(ta, pb)
            })
        } else if (q) w = {
            x: $(q).attr("x") || 0,
            y: $(q).attr("y") || 0
        };
        if (D == null) {
            D = $.extend(true, {}, w);
            $.each(D, function(ta, pb) {
                D[ta] = svgedit.units.convertToNum(ta,
                    pb)
            })
        }
        D.transform = I.getStartTransform() || "";
        if (o.tagName == "g" && !q || o.tagName == "a") {
            g = svgedit.utilities.getBBox(o);
            var v = {
                x: g.x + g.width / 2,
                y: g.y + g.height / 2
            }, t = svgedit.math.transformPoint(g.x + g.width / 2, g.y + g.height / 2, svgedit.math.transformListToTransform(i).matrix);
            e = c.createSVGMatrix();
            if (g = svgedit.utilities.getRotationAngle(o)) {
                A = g * Math.PI / 180;
                u = Math.abs(A) > 1.0E-10 ? Math.sin(A) / (1 - Math.cos(A)) : 2 / A;
                for (A = 0; A < i.numberOfItems; ++A) {
                    e = i.getItem(A);
                    if (e.type == 4) {
                        e = e.matrix;
                        v.y = (u * e.e + e.f) / 2;
                        v.x = (e.e - u * e.f) /
                            2;
                        i.removeItem(A);
                        break
                    }
                }
            }
            A = e = q = 0;
            var m = i.numberOfItems;
            if (m) var L = i.getItem(0).matrix;
            if (m >= 3 && i.getItem(m - 2).type == 3 && i.getItem(m - 3).type == 2 && i.getItem(m - 1).type == 2) {
                A = 3;
                var R = i.getItem(m - 3).matrix,
                    da = i.getItem(m - 2).matrix,
                    qa = i.getItem(m - 1).matrix;
                u = o.childNodes;
                for (p = u.length; p--;) {
                    var fa = u.item(p);
                    e = q = 0;
                    if (fa.nodeType == 1) {
                        var ea = svgedit.transformlist.getTransformList(fa);
                        if (ea) {
                            e = svgedit.math.transformListToTransform(ea).matrix;
                            q = svgedit.utilities.getRotationAngle(fa);
                            var ka = I.getStartTransform(),
                                Ia = [];
                            I.setStartTransform(fa.getAttribute("transform"));
                            if (q || svgedit.math.hasMatrixTransform(ea)) {
                                var Ba = c.createSVGTransform();
                                Ba.setMatrix(svgedit.math.matrixMultiply(R, da, qa, e));
                                ea.clear();
                                ea.appendItem(Ba);
                                Ia.push(Ba)
                            } else {
                                q = svgedit.math.matrixMultiply(e.inverse(), qa, e);
                                Ba = c.createSVGMatrix();
                                Ba.e = -q.e;
                                Ba.f = -q.f;
                                e = svgedit.math.matrixMultiply(Ba.inverse(), e.inverse(), R, da, qa, e, q.inverse());
                                var Lb = c.createSVGTransform(),
                                    kb = c.createSVGTransform(),
                                    ib = c.createSVGTransform();
                                Lb.setTranslate(q.e, q.f);
                                kb.setScale(e.a, e.d);
                                ib.setTranslate(Ba.e, Ba.f);
                                ea.appendItem(ib);
                                ea.appendItem(kb);
                                ea.appendItem(Lb);
                                Ia.push(ib);
                                Ia.push(kb);
                                Ia.push(Lb)
                            }
                            s.addSubCommand(svgedit.recalculate.recalculateDimensions(fa));
                            I.setStartTransform(ka)
                        }
                    }
                }
                i.removeItem(m - 1);
                i.removeItem(m - 2);
                i.removeItem(m - 3)
            } else if (m >= 3 && i.getItem(m - 1).type == 1) {
                A = 3;
                e = svgedit.math.transformListToTransform(i).matrix;
                Ba = c.createSVGTransform();
                Ba.setMatrix(e);
                i.clear();
                i.appendItem(Ba)
            } else if ((m == 1 || m > 1 && i.getItem(1).type != 3) && i.getItem(0).type ==
                2) {
                A = 2;
                q = svgedit.math.transformListToTransform(i).matrix;
                i.removeItem(0);
                e = svgedit.math.transformListToTransform(i).matrix.inverse();
                e = svgedit.math.matrixMultiply(e, q);
                q = e.e;
                e = e.f;
                if (q != 0 || e != 0) {
                    u = o.childNodes;
                    p = u.length;
                    for (m = []; p--;) {
                        fa = u.item(p);
                        if (fa.nodeType == 1) {
                            if (fa.getAttribute("clip-path")) {
                                ka = fa.getAttribute("clip-path");
                                if (m.indexOf(ka) === -1) {
                                    svgedit.recalculate.updateClipPath(ka, q, e);
                                    m.push(ka)
                                }
                            }
                            ka = I.getStartTransform();
                            I.setStartTransform(fa.getAttribute("transform"));
                            if (ea = svgedit.transformlist.getTransformList(fa)) {
                                R =
                                    c.createSVGTransform();
                                R.setTranslate(q, e);
                                ea.numberOfItems ? ea.insertItemBefore(R, 0) : ea.appendItem(R);
                                s.addSubCommand(svgedit.recalculate.recalculateDimensions(fa));
                                ea = o.getElementsByTagNameNS(a.SVG, "use");
                                fa = "#" + fa.id;
                                for (R = ea.length; R--;) {
                                    da = ea.item(R);
                                    if (fa == svgedit.utilities.getHref(da)) {
                                        qa = c.createSVGTransform();
                                        qa.setTranslate(-q, -e);
                                        svgedit.transformlist.getTransformList(da).insertItemBefore(qa, 0);
                                        s.addSubCommand(svgedit.recalculate.recalculateDimensions(da))
                                    }
                                }
                                I.setStartTransform(ka)
                            }
                        }
                    }
                    m = [];
                    I.setStartTransform(ka)
                }
            } else if (m == 1 && i.getItem(0).type == 1 && !g) {
                A = 1;
                e = i.getItem(0).matrix;
                u = o.childNodes;
                for (p = u.length; p--;) {
                    fa = u.item(p);
                    if (fa.nodeType == 1) {
                        ka = I.getStartTransform();
                        I.setStartTransform(fa.getAttribute("transform"));
                        if (ea = svgedit.transformlist.getTransformList(fa)) {
                            q = svgedit.math.matrixMultiply(e, svgedit.math.transformListToTransform(ea).matrix);
                            m = c.createSVGTransform();
                            m.setMatrix(q);
                            ea.clear();
                            ea.appendItem(m, 0);
                            s.addSubCommand(svgedit.recalculate.recalculateDimensions(fa));
                            I.setStartTransform(ka);
                            ka = fa.getAttribute("stroke-width");
                            fa.getAttribute("stroke") !== "none" && !isNaN(ka) && fa.setAttribute("stroke-width", ka * ((Math.abs(q.a) + Math.abs(q.d)) / 2))
                        }
                    }
                }
                i.clear()
            } else {
                if (g) {
                    c = c.createSVGTransform();
                    c.setRotate(g, t.x, t.y);
                    i.numberOfItems ? i.insertItemBefore(c, 0) : i.appendItem(c)
                }
                i.numberOfItems == 0 && o.removeAttribute("transform");
                return null
            } if (A == 2) {
                if (g) {
                    t = {
                        x: v.x + L.e,
                        y: v.y + L.f
                    };
                    c = c.createSVGTransform();
                    c.setRotate(g, t.x, t.y);
                    i.numberOfItems ? i.insertItemBefore(c, 0) : i.appendItem(c)
                }
            } else if (A == 3) {
                e =
                    svgedit.math.transformListToTransform(i).matrix;
                L = c.createSVGTransform();
                L.setRotate(g, v.x, v.y);
                L = L.matrix;
                v = c.createSVGTransform();
                v.setRotate(g, t.x, t.y);
                t = v.matrix.inverse();
                ka = e.inverse();
                t = svgedit.math.matrixMultiply(ka, t, L, e);
                q = t.e;
                e = t.f;
                if (q != 0 || e != 0) {
                    u = o.childNodes;
                    for (p = u.length; p--;) {
                        fa = u.item(p);
                        if (fa.nodeType == 1) {
                            ka = I.getStartTransform();
                            I.setStartTransform(fa.getAttribute("transform"));
                            ea = svgedit.transformlist.getTransformList(fa);
                            R = c.createSVGTransform();
                            R.setTranslate(q, e);
                            ea.numberOfItems ?
                                ea.insertItemBefore(R, 0) : ea.appendItem(R);
                            s.addSubCommand(svgedit.recalculate.recalculateDimensions(fa));
                            I.setStartTransform(ka)
                        }
                    }
                }
                if (g) i.numberOfItems ? i.insertItemBefore(v, 0) : i.appendItem(v)
            }
        } else {
            g = svgedit.utilities.getBBox(o);
            if (!g && o.tagName != "path") return null;
            e = c.createSVGMatrix();
            if (q = svgedit.utilities.getRotationAngle(o)) {
                v = {
                    x: g.x + g.width / 2,
                    y: g.y + g.height / 2
                };
                t = svgedit.math.transformPoint(g.x + g.width / 2, g.y + g.height / 2, svgedit.math.transformListToTransform(i).matrix);
                A = q * Math.PI / 180;
                u = Math.abs(A) >
                    1.0E-10 ? Math.sin(A) / (1 - Math.cos(A)) : 2 / A;
                for (A = 0; A < i.numberOfItems; ++A) {
                    e = i.getItem(A);
                    if (e.type == 4) {
                        e = e.matrix;
                        v.y = (u * e.e + e.f) / 2;
                        v.x = (e.e - u * e.f) / 2;
                        i.removeItem(A);
                        break
                    }
                }
            }
            A = 0;
            m = i.numberOfItems;
            if (!svgedit.browser.isWebkit())
                if ((L = o.getAttribute("fill")) && L.indexOf("url(") === 0) {
                    L = getRefElem(L);
                    ka = "pattern";
                    if (L.tagName !== ka) ka = "gradient";
                    if (L.getAttribute(ka + "Units") === "userSpaceOnUse") {
                        e = svgedit.math.transformListToTransform(i).matrix;
                        g = svgedit.transformlist.getTransformList(L);
                        g = svgedit.math.transformListToTransform(g).matrix;
                        e = svgedit.math.matrixMultiply(e, g);
                        g = "matrix(" + [e.a, e.b, e.c, e.d, e.e, e.f].join(",") + ")";
                        L.setAttribute(ka + "Transform", g)
                    }
                }
            if (m >= 3 && i.getItem(m - 2).type == 3 && i.getItem(m - 3).type == 2 && i.getItem(m - 1).type == 2) {
                A = 3;
                e = svgedit.math.transformListToTransform(i, m - 3, m - 1).matrix;
                i.removeItem(m - 1);
                i.removeItem(m - 2);
                i.removeItem(m - 3)
            } else if (m == 4 && i.getItem(m - 1).type == 1) {
                A = 3;
                e = svgedit.math.transformListToTransform(i).matrix;
                Ba = c.createSVGTransform();
                Ba.setMatrix(e);
                i.clear();
                i.appendItem(Ba);
                e = c.createSVGMatrix()
            } else if ((m ==
                1 || m > 1 && i.getItem(1).type != 3) && i.getItem(0).type == 2) {
                A = 2;
                L = i.getItem(0).matrix;
                ka = svgedit.math.transformListToTransform(i, 1).matrix;
                g = ka.inverse();
                e = svgedit.math.matrixMultiply(g, L, ka);
                i.removeItem(0)
            } else if (m == 1 && i.getItem(0).type == 1 && !q) {
                e = svgedit.math.transformListToTransform(i).matrix;
                switch (o.tagName) {
                    case "line":
                        w = $(o).attr(["x1", "y1", "x2", "y2"]);
                    case "polyline":
                    case "polygon":
                        w.points = o.getAttribute("points");
                        if (w.points) {
                            g = o.points;
                            u = g.numberOfItems;
                            w.points = Array(u);
                            for (A = 0; A < u; ++A) {
                                p = g.getItem(A);
                                w.points[A] = {
                                    x: p.x,
                                    y: p.y
                                }
                            }
                        }
                    case "path":
                        w.d = o.getAttribute("d");
                        A = 1;
                        i.clear()
                }
            } else {
                A = 4;
                if (q) {
                    c = c.createSVGTransform();
                    c.setRotate(q, t.x, t.y);
                    i.numberOfItems ? i.insertItemBefore(c, 0) : i.appendItem(c)
                }
                i.numberOfItems == 0 && o.removeAttribute("transform");
                return null
            } if (A == 1 || A == 2 || A == 3) svgedit.coords.remapElement(o, w, e);
            if (A == 2) {
                if (q) {
                    svgedit.math.hasMatrixTransform(i) || (t = {
                        x: v.x + e.e,
                        y: v.y + e.f
                    });
                    c = c.createSVGTransform();
                    c.setRotate(q, t.x, t.y);
                    i.numberOfItems ? i.insertItemBefore(c, 0) : i.appendItem(c)
                }
                if (o.tagName ==
                    "text") {
                    u = o.childNodes;
                    for (p = u.length; p--;) {
                        fa = u.item(p);
                        if (fa.tagName == "tspan") {
                            c = {
                                x: $(fa).attr("x") || 0,
                                y: $(fa).attr("y") || 0
                            };
                            svgedit.coords.remapElement(fa, c, e)
                        }
                    }
                }
            } else if (A == 3 && q) {
                e = svgedit.math.transformListToTransform(i).matrix;
                L = c.createSVGTransform();
                L.setRotate(q, v.x, v.y);
                L = L.matrix;
                v = c.createSVGTransform();
                v.setRotate(q, t.x, t.y);
                t = v.matrix.inverse();
                ka = e.inverse();
                t = svgedit.math.matrixMultiply(ka, t, L, e);
                svgedit.coords.remapElement(o, w, t);
                if (q) i.numberOfItems ? i.insertItemBefore(v, 0) : i.appendItem(v)
            }
        }
        i.numberOfItems ==
            0 && o.removeAttribute("transform");
        s.addSubCommand(new svgedit.history.ChangeElementCommand(o, D));
        return s
    }
})();
(function() {
    if (!svgedit.select) svgedit.select = {};
    var a, I, o, c = svgedit.browser.isTouch() ? 10 : 4;
    svgedit.select.Selector = function(i, s) {
        this.id = i;
        this.selectedElement = s;
        this.locked = true;
        this.selectorGroup = a.createSVGElement({
            element: "g",
            attr: {
                id: "selectorGroup" + this.id
            }
        });
        this.selectorRect = this.selectorGroup.appendChild(a.createSVGElement({
            element: "path",
            attr: {
                id: "selectedBox" + this.id,
                fill: "none",
                stroke: "#22C",
                "stroke-width": "1",
                "stroke-dasharray": "5,5",
                style: "pointer-events:none"
            }
        }));
        this.gripCoords = {
            nw: null,
            n: null,
            ne: null,
            e: null,
            se: null,
            s: null,
            sw: null,
            w: null
        };
        this.reset(this.selectedElement)
    };
    svgedit.select.Selector.prototype.reset = function(i) {
        this.locked = true;
        this.selectedElement = i;
        this.resize();
        this.selectorGroup.setAttribute("display", "inline")
    };
    svgedit.select.Selector.prototype.updateGripCursors = function(i) {
        var s, e = [];
        i = Math.round(i / 45);
        if (i < 0) i += 8;
        for (s in o.selectorGrips) e.push(s);
        for (; i > 0;) {
            e.push(e.shift());
            i--
        }
        i = 0;
        for (s in o.selectorGrips) {
            o.selectorGrips[s].setAttribute("style", "cursor:" + e[i] +
                "-resize");
            i++
        }
    };
    svgedit.select.Selector.prototype.showGrips = function(i) {
        o.selectorGripsGroup.setAttribute("display", i ? "inline" : "none");
        var s = this.selectedElement;
        this.hasGrips = i;
        if (s && i) {
            this.selectorGroup.appendChild(o.selectorGripsGroup);
            this.updateGripCursors(svgedit.utilities.getRotationAngle(s))
        }
    };
    svgedit.select.Selector.prototype.resize = function() {
        var i = this.selectorRect,
            s = o,
            e = s.selectorGrips,
            g = this.selectedElement,
            q = g.getAttribute("stroke-width"),
            w = a.currentZoom(),
            D = 1 / w;
        if (g.getAttribute("stroke") !==
            "none" && !isNaN(q)) D += q / 2;
        var u = g.tagName;
        if (u === "text") D += 2 / w;
        q = svgedit.transformlist.getTransformList(g);
        q = svgedit.math.transformListToTransform(q).matrix;
        q.e *= w;
        q.f *= w;
        var A = svgedit.utilities.getBBox(g);
        if (u === "g" && !$.data(g, "gsvg"))
            if (u = a.getStrokedBBox(g.childNodes)) A = u;
        u = A.x;
        var p = A.y,
            v = A.width;
        A = A.height;
        D *= w;
        w = svgedit.math.transformBox(u * w, p * w, v * w, A * w, q);
        q = w.aabox;
        u = q.x - D;
        p = q.y - D;
        v = q.width + D * 2;
        var t = q.height + D * 2;
        q = u + v / 2;
        A = p + t / 2;
        if (g = svgedit.utilities.getRotationAngle(g)) {
            u = a.svgRoot().createSVGTransform();
            u.setRotate(-g, q, A);
            u = u.matrix;
            w.tl = svgedit.math.transformPoint(w.tl.x, w.tl.y, u);
            w.tr = svgedit.math.transformPoint(w.tr.x, w.tr.y, u);
            w.bl = svgedit.math.transformPoint(w.bl.x, w.bl.y, u);
            w.br = svgedit.math.transformPoint(w.br.x, w.br.y, u);
            u = w.tl;
            v = u.x;
            t = u.y;
            var m = u.x,
                L = u.y;
            u = Math.min;
            p = Math.max;
            v = u(v, u(w.tr.x, u(w.bl.x, w.br.x))) - D;
            t = u(t, u(w.tr.y, u(w.bl.y, w.br.y))) - D;
            m = p(m, p(w.tr.x, p(w.bl.x, w.br.x))) + D;
            L = p(L, p(w.tr.y, p(w.bl.y, w.br.y))) + D;
            u = v;
            p = t;
            v = m - v;
            t = L - t
        }
        D = a.svgRoot().suspendRedraw(100);
        i.setAttribute("d",
            "M" + u + "," + p + " L" + (u + v) + "," + p + " " + (u + v) + "," + (p + t) + " " + u + "," + (p + t) + "z");
        this.selectorGroup.setAttribute("transform", g ? "rotate(" + [g, q, A].join(",") + ")" : "");
        this.gripCoords = {
            nw: [u, p],
            ne: [u + v, p],
            sw: [u, p + t],
            se: [u + v, p + t],
            n: [u + v / 2, p],
            w: [u, p + t / 2],
            e: [u + v, p + t / 2],
            s: [u + v / 2, p + t]
        };
        for (var R in this.gripCoords) {
            i = this.gripCoords[R];
            e[R].setAttribute("cx", i[0]);
            e[R].setAttribute("cy", i[1])
        }
        s.rotateGripConnector.setAttribute("x1", u + v / 2);
        s.rotateGripConnector.setAttribute("y1", p);
        s.rotateGripConnector.setAttribute("x2",
            u + v / 2);
        s.rotateGripConnector.setAttribute("y2", p - c * 5);
        s.rotateGrip.setAttribute("cx", u + v / 2);
        s.rotateGrip.setAttribute("cy", p - c * 5);
        a.svgRoot().unsuspendRedraw(D)
    };
    svgedit.select.SelectorManager = function() {
        this.rubberBandBox = this.selectorParentGroup = null;
        this.selectors = [];
        this.selectorMap = {};
        this.selectorGrips = {
            nw: null,
            n: null,
            ne: null,
            e: null,
            se: null,
            s: null,
            sw: null,
            w: null
        };
        this.rotateGrip = this.rotateGripConnector = this.selectorGripsGroup = null;
        this.initGroup()
    };
    svgedit.select.SelectorManager.prototype.initGroup =
        function() {
            this.selectorParentGroup && this.selectorParentGroup.parentNode && this.selectorParentGroup.parentNode.removeChild(this.selectorParentGroup);
            this.selectorParentGroup = a.createSVGElement({
                element: "g",
                attr: {
                    id: "selectorParentGroup"
                }
            });
            this.selectorGripsGroup = a.createSVGElement({
                element: "g",
                attr: {
                    display: "none"
                }
            });
            this.selectorParentGroup.appendChild(this.selectorGripsGroup);
            a.svgRoot().appendChild(this.selectorParentGroup);
            this.selectorMap = {};
            this.selectors = [];
            this.rubberBandBox = null;
            for (var i in this.selectorGrips) {
                var s =
                    a.createSVGElement({
                        element: "circle",
                        attr: {
                            id: "selectorGrip_resize_" + i,
                            fill: "#22C",
                            r: c,
                            style: "cursor:" + i + "-resize",
                            "stroke-width": 2,
                            "pointer-events": "all"
                        }
                    });
                $.data(s, "dir", i);
                $.data(s, "type", "resize");
                this.selectorGrips[i] = this.selectorGripsGroup.appendChild(s)
            }
            this.rotateGripConnector = this.selectorGripsGroup.appendChild(a.createSVGElement({
                element: "line",
                attr: {
                    id: "selectorGrip_rotateconnector",
                    stroke: "#22C",
                    "stroke-width": "1"
                }
            }));
            this.rotateGrip = this.selectorGripsGroup.appendChild(a.createSVGElement({
                element: "circle",
                attr: {
                    id: "selectorGrip_rotate",
                    fill: "lime",
                    r: c,
                    stroke: "#22C",
                    "stroke-width": 2,
                    style: "cursor:url(" + I.imgPath + "rotate.png) 12 12, auto;"
                }
            }));
            $.data(this.rotateGrip, "type", "rotate");
            if (!$("#canvasBackground").length) {
                i = I.dimensions;
                i = a.createSVGElement({
                    element: "svg",
                    attr: {
                        id: "canvasBackground",
                        width: i[0],
                        height: i[1],
                        x: 0,
                        y: 0,
                        overflow: svgedit.browser.isWebkit() ? "none" : "visible",
                        style: "pointer-events:none"
                    }
                });
                s = a.createSVGElement({
                    element: "rect",
                    attr: {
                        width: "100%",
                        height: "100%",
                        x: 0,
                        y: 0,
                        "stroke-width": 1,
                        stroke: "#000",
                        fill: "#FFF",
                        style: "pointer-events:none"
                    }
                });
                i.appendChild(s);
                a.svgRoot().insertBefore(i, a.svgContent())
            }
    };
    svgedit.select.SelectorManager.prototype.requestSelector = function(i) {
        if (i == null) return null;
        var s, e = this.selectors.length;
        if (typeof this.selectorMap[i.id] == "object") {
            this.selectorMap[i.id].locked = true;
            return this.selectorMap[i.id]
        }
        for (s = 0; s < e; ++s)
            if (this.selectors[s] && !this.selectors[s].locked) {
                this.selectors[s].locked = true;
                this.selectors[s].reset(i);
                this.selectorMap[i.id] = this.selectors[s];
                return this.selectors[s]
            }
        this.selectors[e] = new svgedit.select.Selector(e, i);
        this.selectorParentGroup.appendChild(this.selectors[e].selectorGroup);
        this.selectorMap[i.id] = this.selectors[e];
        return this.selectors[e]
    };
    svgedit.select.SelectorManager.prototype.releaseSelector = function(i) {
        if (i != null) {
            var s, e = this.selectors.length,
                g = this.selectorMap[i.id];
            for (s = 0; s < e; ++s)
                if (this.selectors[s] && this.selectors[s] == g) {
                    g.locked == false && console.log("WARNING! selector was released but was already unlocked");
                    delete this.selectorMap[i.id];
                    g.locked = false;
                    g.selectedElement = null;
                    g.showGrips(false);
                    try {
                        g.selectorGroup.setAttribute("display", "none")
                    } catch (q) {}
                    break
                }
        }
    };
    svgedit.select.SelectorManager.prototype.getRubberBandBox = function() {
        if (!this.rubberBandBox) this.rubberBandBox = this.selectorParentGroup.appendChild(a.createSVGElement({
            element: "rect",
            attr: {
                id: "selectorRubberBand",
                fill: "#22C",
                "fill-opacity": 0.15,
                stroke: "#22C",
                "stroke-width": 0.5,
                display: "none",
                style: "pointer-events:none"
            }
        }));
        return this.rubberBandBox
    };
    svgedit.select.init = function(i,
        s) {
        I = i;
        a = s;
        o = new svgedit.select.SelectorManager
    };
    svgedit.select.getSelectorManager = function() {
        return o
    }
})();
(function() {
    if (!svgedit.draw) svgedit.draw = {};
    var a = svgedit.NS,
        I = "a,circle,ellipse,foreignObject,g,image,line,path,polygon,polyline,rect,svg,text,tspan,use".split(","),
        o = {
            LET_DOCUMENT_DECIDE: 0,
            ALWAYS_RANDOMIZE: 1,
            NEVER_RANDOMIZE: 2
        }, c = o.LET_DOCUMENT_DECIDE;
    svgedit.draw.Layer = function(i, s) {
        this.name_ = i;
        this.group_ = s
    };
    svgedit.draw.Layer.prototype.getName = function() {
        return this.name_
    };
    svgedit.draw.Layer.prototype.getGroup = function() {
        return this.group_
    };
    svgedit.draw.randomizeIds = function(i, s) {
        c = i === false ?
            o.NEVER_RANDOMIZE : o.ALWAYS_RANDOMIZE;
        if (c == o.ALWAYS_RANDOMIZE && !s.getNonce()) s.setNonce(Math.floor(Math.random() * 100001));
        else c == o.NEVER_RANDOMIZE && s.getNonce() && s.clearNonce()
    };
    svgedit.draw.Drawing = function(i, s) {
        if (!i || !i.tagName || !i.namespaceURI || i.tagName != "svg" || i.namespaceURI != a.SVG) throw "Error: svgedit.draw.Drawing instance initialized without a <svg> element";
        this.svgElem_ = i;
        this.obj_num = 0;
        this.idPrefix = s || "svg_";
        this.releasedNums = [];
        this.all_layers = [];
        this.current_layer = null;
        this.nonce_ =
            "";
        var e = this.svgElem_.getAttributeNS(a.SE, "nonce");
        if (e && c != o.NEVER_RANDOMIZE) this.nonce_ = e;
        else c == o.ALWAYS_RANDOMIZE && this.setNonce(Math.floor(Math.random() * 100001))
    };
    svgedit.draw.Drawing.prototype.getElem_ = function(i) {
        if (this.svgElem_.querySelector) return this.svgElem_.querySelector("#" + i);
        return $(this.svgElem_).find("[id=" + i + "]")[0]
    };
    svgedit.draw.Drawing.prototype.getSvgElem = function() {
        return this.svgElem_
    };
    svgedit.draw.Drawing.prototype.getNonce = function() {
        return this.nonce_
    };
    svgedit.draw.Drawing.prototype.setNonce =
        function(i) {
            this.svgElem_.setAttributeNS(a.XMLNS, "xmlns:se", a.SE);
            this.svgElem_.setAttributeNS(a.SE, "se:nonce", i);
            this.nonce_ = i
    };
    svgedit.draw.Drawing.prototype.clearNonce = function() {
        this.nonce_ = ""
    };
    svgedit.draw.Drawing.prototype.getId = function() {
        return this.nonce_ ? this.idPrefix + this.nonce_ + "_" + this.obj_num : this.idPrefix + this.obj_num
    };
    svgedit.draw.Drawing.prototype.getNextId = function() {
        var i = this.obj_num,
            s = false;
        if (this.releasedNums.length > 0) {
            this.obj_num = this.releasedNums.pop();
            s = true
        } else this.obj_num++;
        for (var e = this.getId(); this.getElem_(e);) {
            if (s) {
                this.obj_num = i;
                s = false
            }
            this.obj_num++;
            e = this.getId()
        }
        if (s) this.obj_num = i;
        return e
    };
    svgedit.draw.Drawing.prototype.releaseId = function(i) {
        var s = this.idPrefix + (this.nonce_ ? this.nonce_ + "_" : "");
        if (typeof i !== "string" || i.indexOf(s) !== 0) return false;
        i = parseInt(i.substr(s.length), 10);
        if (typeof i !== "number" || i <= 0 || this.releasedNums.indexOf(i) != -1) return false;
        this.releasedNums.push(i);
        return true
    };
    svgedit.draw.Drawing.prototype.getNumLayers = function() {
        return this.all_layers.length
    };
    svgedit.draw.Drawing.prototype.hasLayer = function(i) {
        var s;
        for (s = 0; s < this.getNumLayers(); s++)
            if (this.all_layers[s][0] == i) return true;
        return false
    };
    svgedit.draw.Drawing.prototype.getLayerName = function(i) {
        if (i >= 0 && i < this.getNumLayers()) return this.all_layers[i][0];
        return ""
    };
    svgedit.draw.Drawing.prototype.getCurrentLayer = function() {
        return this.current_layer
    };
    svgedit.draw.Drawing.prototype.getCurrentLayerName = function() {
        var i;
        for (i = 0; i < this.getNumLayers(); ++i)
            if (this.all_layers[i][1] == this.current_layer) return this.getLayerName(i);
        return ""
    };
    svgedit.draw.Drawing.prototype.setCurrentLayer = function(i) {
        var s;
        for (s = 0; s < this.getNumLayers(); ++s)
            if (i == this.getLayerName(s)) {
                if (this.current_layer != this.all_layers[s][1]) {
                    this.current_layer.setAttribute("style", "pointer-events:none");
                    this.current_layer = this.all_layers[s][1];
                    this.current_layer.setAttribute("style", "pointer-events:all")
                }
                return true
            }
        return false
    };
    svgedit.draw.Drawing.prototype.deleteCurrentLayer = function() {
        if (this.current_layer && this.getNumLayers() > 1) {
            var i = this.current_layer.parentNode.removeChild(this.current_layer);
            this.identifyLayers();
            return i
        }
        return null
    };
    svgedit.draw.Drawing.prototype.identifyLayers = function() {
        this.all_layers = [];
        var i = this.svgElem_.childNodes.length,
            s = [],
            e = [],
            g = null,
            q = false,
            w;
        for (w = 0; w < i; ++w) {
            var D = this.svgElem_.childNodes.item(w);
            if (D && D.nodeType == 1)
                if (D.tagName == "g") {
                    q = true;
                    var u = $("title", D).text();
                    if (!u && svgedit.browser.isOpera() && D.querySelectorAll) u = $(D.querySelectorAll("title")).text();
                    if (u) {
                        e.push(u);
                        this.all_layers.push([u, D]);
                        g = D;
                        svgedit.utilities.walkTree(D, function(A) {
                            A.setAttribute("style",
                                "pointer-events:inherit")
                        });
                        g.setAttribute("style", "pointer-events:none")
                    } else s.push(D)
                } else if (~I.indexOf(D.nodeName)) {
                svgedit.utilities.getBBox(D);
                s.push(D)
            }
        }
        i = this.svgElem_.ownerDocument;
        if (s.length > 0 || !q) {
            for (w = 1; e.indexOf("Layer " + w) >= 0;) w++;
            e = "Layer " + w;
            g = i.createElementNS(a.SVG, "g");
            q = i.createElementNS(a.SVG, "title");
            q.textContent = e;
            g.appendChild(q);
            for (q = 0; q < s.length; ++q) g.appendChild(s[q]);
            this.svgElem_.appendChild(g);
            this.all_layers.push([e, g])
        }
        svgedit.utilities.walkTree(g, function(A) {
            A.setAttribute("style",
                "pointer-events:inherit")
        });
        this.current_layer = g;
        this.current_layer.setAttribute("style", "pointer-events:all")
    };
    svgedit.draw.Drawing.prototype.createLayer = function(i) {
        var s = this.svgElem_.ownerDocument,
            e = s.createElementNS(a.SVG, "g");
        s = s.createElementNS(a.SVG, "title");
        s.textContent = i;
        e.appendChild(s);
        this.svgElem_.appendChild(e);
        this.identifyLayers();
        return e
    };
    svgedit.draw.Drawing.prototype.getLayerVisibility = function(i) {
        var s = null,
            e;
        for (e = 0; e < this.getNumLayers(); ++e)
            if (this.getLayerName(e) == i) {
                s = this.all_layers[e][1];
                break
            }
        if (!s) return false;
        return s.getAttribute("display") !== "none"
    };
    svgedit.draw.Drawing.prototype.setLayerVisibility = function(i, s) {
        if (typeof s !== "boolean") return null;
        var e = null,
            g;
        for (g = 0; g < this.getNumLayers(); ++g)
            if (this.getLayerName(g) == i) {
                e = this.all_layers[g][1];
                break
            }
        if (!e) return null;
        e.getAttribute("display");
        e.setAttribute("display", s ? "inline" : "none");
        return e
    };
    svgedit.draw.Drawing.prototype.getLayerOpacity = function(i) {
        var s;
        for (s = 0; s < this.getNumLayers(); ++s)
            if (this.getLayerName(s) == i) {
                (i =
                    this.all_layers[s][1].getAttribute("opacity")) || (i = "1.0");
                return parseFloat(i)
            }
        return null
    };
    svgedit.draw.Drawing.prototype.setLayerOpacity = function(i, s) {
        if (!(typeof s !== "number" || s < 0 || s > 1)) {
            var e;
            for (e = 0; e < this.getNumLayers(); ++e)
                if (this.getLayerName(e) == i) {
                    this.all_layers[e][1].setAttribute("opacity", s);
                    break
                }
        }
    }
})();
(function() {
    if (!svgedit.path) svgedit.path = {};
    var a = svgedit.NS,
        I = {
            pathNodeTooltip: "Drag node to move it. Double-click node to change segment type",
            pathCtrlPtTooltip: "Drag control point to adjust curve properties"
        }, o = {
            2: ["x", "y"],
            4: ["x", "y"],
            6: ["x", "y", "x1", "y1", "x2", "y2"],
            8: ["x", "y", "x1", "y1"],
            10: ["x", "y", "r1", "r2", "angle", "largeArcFlag", "sweepFlag"],
            12: ["x"],
            14: ["y"],
            16: ["x", "y", "x2", "y2"],
            18: ["x", "y"]
        }, c = [],
        i = true,
        s = {};
    svgedit.path.setLinkControlPoints = function(p) {
        i = p
    };
    var e = svgedit.path.path = null;
    svgedit.path.init = function(p) {
        e = p;
        c = [0, "ClosePath"];
        $.each(["Moveto", "Lineto", "CurvetoCubic", "CurvetoQuadratic", "Arc", "LinetoHorizontal", "LinetoVertical", "CurvetoCubicSmooth", "CurvetoQuadraticSmooth"], function(v, t) {
            c.push(t + "Abs");
            c.push(t + "Rel")
        })
    };
    svgedit.path.insertItemBefore = function(p, v, t) {
        p = p.pathSegList;
        if (svgedit.browser.supportsPathInsertItemBefore()) p.insertItemBefore(v, t);
        else {
            var m = p.numberOfItems,
                L = [],
                R;
            for (R = 0; R < m; R++) {
                var da = p.getItem(R);
                L.push(da)
            }
            p.clear();
            for (R = 0; R < m; R++) {
                R == t &&
                    p.appendItem(v);
                p.appendItem(L[R])
            }
        }
    };
    svgedit.path.ptObjToArr = function(p, v) {
        var t = o[p],
            m = t.length,
            L, R = [];
        for (L = 0; L < m; L++) R[L] = v[t[L]];
        return R
    };
    svgedit.path.getGripPt = function(p, v) {
        var t = {
            x: v ? v.x : p.item.x,
            y: v ? v.y : p.item.y
        }, m = p.path;
        if (m.matrix) t = svgedit.math.transformPoint(t.x, t.y, m.matrix);
        t.x *= e.getCurrentZoom();
        t.y *= e.getCurrentZoom();
        return t
    };
    svgedit.path.getPointFromGrip = function(p, v) {
        var t = {
            x: p.x,
            y: p.y
        };
        if (v.matrix) {
            p = svgedit.math.transformPoint(t.x, t.y, v.imatrix);
            t.x = p.x;
            t.y = p.y
        }
        t.x /= e.getCurrentZoom();
        t.y /= e.getCurrentZoom();
        return t
    };
    svgedit.path.addPointGrip = function(p, v, t) {
        var m = svgedit.path.getGripContainer(),
            L = svgedit.utilities.getElem("pathpointgrip_" + p);
        if (!L) {
            L = document.createElementNS(a.SVG, "circle");
            svgedit.utilities.assignAttributes(L, {
                id: "pathpointgrip_" + p,
                display: "none",
                r: 4,
                fill: "#0FF",
                stroke: "#00F",
                "stroke-width": 2,
                cursor: "move",
                style: "pointer-events:all",
                "xlink:title": I.pathNodeTooltip
            });
            L = m.appendChild(L);
            $("#pathpointgrip_" + p).dblclick(function() {
                svgedit.path.path && svgedit.path.path.setSegType()
            })
        }
        v &&
            t && svgedit.utilities.assignAttributes(L, {
                cx: v,
                cy: t,
                display: "inline"
            });
        return L
    };
    svgedit.path.getGripContainer = function() {
        var p = svgedit.utilities.getElem("pathpointgrip_container");
        if (!p) {
            p = svgedit.utilities.getElem("selectorParentGroup").appendChild(document.createElementNS(a.SVG, "g"));
            p.id = "pathpointgrip_container"
        }
        return p
    };
    svgedit.path.addCtrlGrip = function(p) {
        var v = svgedit.utilities.getElem("ctrlpointgrip_" + p);
        if (v) return v;
        v = document.createElementNS(a.SVG, "circle");
        svgedit.utilities.assignAttributes(v, {
            id: "ctrlpointgrip_" + p,
            display: "none",
            r: 4,
            fill: "#0FF",
            stroke: "#55F",
            "stroke-width": 1,
            cursor: "move",
            style: "pointer-events:all",
            "xlink:title": I.pathCtrlPtTooltip
        });
        svgedit.path.getGripContainer().appendChild(v);
        return v
    };
    svgedit.path.getCtrlLine = function(p) {
        var v = svgedit.utilities.getElem("ctrlLine_" + p);
        if (v) return v;
        v = document.createElementNS(a.SVG, "line");
        svgedit.utilities.assignAttributes(v, {
            id: "ctrlLine_" + p,
            stroke: "#555",
            "stroke-width": 1,
            style: "pointer-events:none"
        });
        svgedit.path.getGripContainer().appendChild(v);
        return v
    };
    svgedit.path.getPointGrip = function(p, v) {
        var t = svgedit.path.addPointGrip(p.index);
        if (v) {
            var m = svgedit.path.getGripPt(p);
            svgedit.utilities.assignAttributes(t, {
                cx: m.x,
                cy: m.y,
                display: "inline"
            })
        }
        return t
    };
    svgedit.path.getControlPoints = function(p) {
        var v = p.item,
            t = p.index;
        if (!("x1" in v) || !("x2" in v)) return null;
        var m = {};
        svgedit.path.getGripContainer();
        var L = [svgedit.path.path.segs[t - 1].item, v],
            R;
        for (R = 1; R < 3; R++) {
            var da = t + "c" + R,
                qa = m["c" + R + "_line"] = svgedit.path.getCtrlLine(da),
                fa = svgedit.path.getGripPt(p, {
                    x: v["x" + R],
                    y: v["y" + R]
                }),
                ea = svgedit.path.getGripPt(p, {
                    x: L[R - 1].x,
                    y: L[R - 1].y
                });
            svgedit.utilities.assignAttributes(qa, {
                x1: fa.x,
                y1: fa.y,
                x2: ea.x,
                y2: ea.y,
                display: "inline"
            });
            m["c" + R + "_line"] = qa;
            da = m["c" + R] = svgedit.path.addCtrlGrip(da);
            svgedit.utilities.assignAttributes(da, {
                cx: fa.x,
                cy: fa.y,
                display: "inline"
            });
            m["c" + R] = da
        }
        return m
    };
    svgedit.path.replacePathSeg = function(p, v, t, m) {
        m = m || svgedit.path.path.elem;
        p = m["createSVGPathSeg" + c[p]].apply(m, t);
        if (svgedit.browser.supportsPathReplaceItem()) m.pathSegList.replaceItem(p,
            v);
        else {
            t = m.pathSegList;
            m = t.numberOfItems;
            var L = [],
                R;
            for (R = 0; R < m; R++) {
                var da = t.getItem(R);
                L.push(da)
            }
            t.clear();
            for (R = 0; R < m; R++) R == v ? t.appendItem(p) : t.appendItem(L[R])
        }
    };
    svgedit.path.getSegSelector = function(p, v) {
        var t = p.index,
            m = svgedit.utilities.getElem("segline_" + t);
        if (!m) {
            var L = svgedit.path.getGripContainer();
            m = document.createElementNS(a.SVG, "path");
            svgedit.utilities.assignAttributes(m, {
                id: "segline_" + t,
                display: "none",
                fill: "none",
                stroke: "#0FF",
                "stroke-width": 2,
                style: "pointer-events:none",
                d: "M0,0 0,0"
            });
            L.appendChild(m)
        }
        if (v) {
            t = p.prev;
            if (!t) {
                m.setAttribute("display", "none");
                return m
            }
            t = svgedit.path.getGripPt(t);
            svgedit.path.replacePathSeg(2, 0, [t.x, t.y], m);
            L = svgedit.path.ptObjToArr(p.type, p.item, true);
            var R;
            for (R = 0; R < L.length; R += 2) {
                t = svgedit.path.getGripPt(p, {
                    x: L[R],
                    y: L[R + 1]
                });
                L[R] = t.x;
                L[R + 1] = t.y
            }
            svgedit.path.replacePathSeg(p.type, 1, L, m)
        }
        return m
    };
    svgedit.path.smoothControlPoints = function(p, v, t) {
        var m = p.x - t.x,
            L = p.y - t.y,
            R = v.x - t.x,
            da = v.y - t.y;
        if ((m != 0 || L != 0) && (R != 0 || da != 0)) {
            p = Math.atan2(L, m);
            v = Math.atan2(da,
                R);
            m = Math.sqrt(m * m + L * L);
            R = Math.sqrt(R * R + da * da);
            L = e.getSVGRoot().createSVGPoint();
            da = e.getSVGRoot().createSVGPoint();
            if (p < 0) p += 2 * Math.PI;
            if (v < 0) v += 2 * Math.PI;
            var qa = Math.abs(p - v),
                fa = Math.abs(Math.PI - qa) / 2;
            if (p - v > 0) {
                p = qa < Math.PI ? p + fa : p - fa;
                v = qa < Math.PI ? v - fa : v + fa
            } else {
                p = qa < Math.PI ? p - fa : p + fa;
                v = qa < Math.PI ? v + fa : v - fa
            }
            L.x = m * Math.cos(p) + t.x;
            L.y = m * Math.sin(p) + t.y;
            da.x = R * Math.cos(v) + t.x;
            da.y = R * Math.sin(v) + t.y;
            return [L, da]
        }
    };
    svgedit.path.Segment = function(p, v) {
        this.selected = false;
        this.index = p;
        this.item = v;
        this.type =
            v.pathSegType;
        this.ctrlpts = [];
        this.segsel = this.ptgrip = null
    };
    svgedit.path.Segment.prototype.showCtrlPts = function(p) {
        for (var v in this.ctrlpts)
            if (this.ctrlpts.hasOwnProperty(v)) this.ctrlpts[v].setAttribute("display", p ? "inline" : "none")
    };
    svgedit.path.Segment.prototype.selectCtrls = function(p) {
        $("#ctrlpointgrip_" + this.index + "c1, #ctrlpointgrip_" + this.index + "c2").attr("fill", p ? "#0FF" : "#EEE")
    };
    svgedit.path.Segment.prototype.show = function(p) {
        if (this.ptgrip) {
            this.ptgrip.setAttribute("display", p ? "inline" : "none");
            this.segsel.setAttribute("display", p ? "inline" : "none");
            this.showCtrlPts(p)
        }
    };
    svgedit.path.Segment.prototype.select = function(p) {
        if (this.ptgrip) {
            this.ptgrip.setAttribute("stroke", p ? "#0FF" : "#00F");
            this.segsel.setAttribute("display", p ? "inline" : "none");
            this.ctrlpts && this.selectCtrls(p);
            this.selected = p
        }
    };
    svgedit.path.Segment.prototype.addGrip = function() {
        this.ptgrip = svgedit.path.getPointGrip(this, true);
        this.ctrlpts = svgedit.path.getControlPoints(this, true);
        this.segsel = svgedit.path.getSegSelector(this, true)
    };
    svgedit.path.Segment.prototype.update = function(p) {
        if (this.ptgrip) {
            var v = svgedit.path.getGripPt(this);
            svgedit.utilities.assignAttributes(this.ptgrip, {
                cx: v.x,
                cy: v.y
            });
            svgedit.path.getSegSelector(this, true);
            if (this.ctrlpts) {
                if (p) {
                    this.item = svgedit.path.path.elem.pathSegList.getItem(this.index);
                    this.type = this.item.pathSegType
                }
                svgedit.path.getControlPoints(this)
            }
        }
    };
    svgedit.path.Segment.prototype.move = function(p, v) {
        var t;
        t = this.item;
        t = this.ctrlpts ? [t.x += p, t.y += v, t.x1, t.y1, t.x2 += p, t.y2 += v] : [t.x += p, t.y +=
            v
        ];
        svgedit.path.replacePathSeg(this.type, this.index, t);
        if (this.next && this.next.ctrlpts) {
            t = this.next.item;
            t = [t.x, t.y, t.x1 += p, t.y1 += v, t.x2, t.y2];
            svgedit.path.replacePathSeg(this.next.type, this.next.index, t)
        }
        if (this.mate) {
            t = this.mate.item;
            t = [t.x += p, t.y += v];
            svgedit.path.replacePathSeg(this.mate.type, this.mate.index, t)
        }
        this.update(true);
        this.next && this.next.update(true)
    };
    svgedit.path.Segment.prototype.setLinked = function(p) {
        var v, t, m;
        if (p == 2) {
            t = 1;
            v = this.next;
            if (!v) return;
            m = this.item
        } else {
            t = 2;
            v = this.prev;
            if (!v) return;
            m = v.item
        }
        var L = v.item;
        L["x" + t] = m.x + (m.x - this.item["x" + p]);
        L["y" + t] = m.y + (m.y - this.item["y" + p]);
        svgedit.path.replacePathSeg(v.type, v.index, [L.x, L.y, L.x1, L.y1, L.x2, L.y2]);
        v.update(true)
    };
    svgedit.path.Segment.prototype.moveCtrl = function(p, v, t) {
        var m = this.item;
        m["x" + p] += v;
        m["y" + p] += t;
        svgedit.path.replacePathSeg(this.type, this.index, [m.x, m.y, m.x1, m.y1, m.x2, m.y2]);
        this.update(true)
    };
    svgedit.path.Segment.prototype.setType = function(p, v) {
        svgedit.path.replacePathSeg(p, this.index, v);
        this.type = p;
        this.item = svgedit.path.path.elem.pathSegList.getItem(this.index);
        this.showCtrlPts(p === 6);
        this.ctrlpts = svgedit.path.getControlPoints(this);
        this.update(true)
    };
    svgedit.path.Path = function(p) {
        if (!p || p.tagName !== "path") throw "svgedit.path.Path constructed without a <path> element";
        this.elem = p;
        this.segs = [];
        this.selected_pts = [];
        svgedit.path.path = this;
        this.init()
    };
    svgedit.path.Path.prototype.init = function() {
        $(svgedit.path.getGripContainer()).find("*").attr("display", "none");
        var p = this.elem.pathSegList,
            v = p.numberOfItems;
        this.segs = [];
        this.selected_pts = [];
        this.first_seg = null;
        var t;
        for (t = 0; t < v; t++) {
            var m = p.getItem(t);
            m = new svgedit.path.Segment(t, m);
            m.path = this;
            this.segs.push(m)
        }
        p = this.segs;
        m = null;
        for (t = 0; t < v; t++) {
            var L = p[t],
                R = t + 1 >= v ? null : p[t + 1],
                da = t - 1 < 0 ? null : p[t - 1];
            if (L.type === 2) {
                if (da && da.type !== 1) {
                    R = p[m];
                    R.next = p[m + 1];
                    R.next.prev = R;
                    R.addGrip()
                }
                m = t
            } else if (R && R.type === 1) {
                L.next = p[m + 1];
                L.next.prev = L;
                L.mate = p[m];
                L.addGrip();
                if (this.first_seg == null) this.first_seg = L
            } else if (R) {
                if (L.type !== 1) {
                    L.addGrip();
                    if (R && R.type !==
                        2) {
                        L.next = R;
                        L.next.prev = L
                    }
                }
            } else if (L.type !== 1) {
                R = p[m];
                R.next = p[m + 1];
                R.next.prev = R;
                R.addGrip();
                L.addGrip();
                if (!this.first_seg) this.first_seg = p[m]
            }
        }
        return this
    };
    svgedit.path.Path.prototype.eachSeg = function(p) {
        var v, t = this.segs.length;
        for (v = 0; v < t; v++)
            if (p.call(this.segs[v], v) === false) break
    };
    svgedit.path.Path.prototype.addSeg = function(p) {
        var v = this.segs[p];
        if (v.prev) {
            var t = v.prev,
                m, L, R;
            switch (v.item.pathSegType) {
                case 4:
                    L = (v.item.x + t.item.x) / 2;
                    R = (v.item.y + t.item.y) / 2;
                    m = this.elem.createSVGPathSegLinetoAbs(L,
                        R);
                    break;
                case 6:
                    m = (t.item.x + v.item.x1) / 2;
                    var da = (v.item.x1 + v.item.x2) / 2,
                        qa = (v.item.x2 + v.item.x) / 2,
                        fa = (m + da) / 2;
                    da = (da + qa) / 2;
                    L = (fa + da) / 2;
                    var ea = (t.item.y + v.item.y1) / 2,
                        ka = (v.item.y1 + v.item.y2) / 2;
                    t = (v.item.y2 + v.item.y) / 2;
                    var Ia = (ea + ka) / 2;
                    ka = (ka + t) / 2;
                    R = (Ia + ka) / 2;
                    m = this.elem.createSVGPathSegCurvetoCubicAbs(L, R, m, ea, fa, Ia);
                    svgedit.path.replacePathSeg(v.type, p, [v.item.x, v.item.y, da, ka, qa, t])
            }
            svgedit.path.insertItemBefore(this.elem, m, p)
        }
    };
    svgedit.path.Path.prototype.deleteSeg = function(p) {
        var v = this.segs[p],
            t = this.elem.pathSegList;
        v.show(false);
        var m = v.next,
            L;
        if (v.mate) {
            L = [m.item.x, m.item.y];
            svgedit.path.replacePathSeg(2, m.index, L);
            svgedit.path.replacePathSeg(4, v.index, L);
            t.removeItem(v.mate.index)
        } else {
            if (!v.prev) {
                L = [m.item.x, m.item.y];
                svgedit.path.replacePathSeg(2, v.next.index, L)
            }
            t.removeItem(p)
        }
    };
    svgedit.path.Path.prototype.subpathIsClosed = function(p) {
        var v = false;
        svgedit.path.path.eachSeg(function(t) {
            if (t <= p) return true;
            if (this.type === 2) return false;
            if (this.type === 1) {
                v = true;
                return false
            }
        });
        return v
    };
    svgedit.path.Path.prototype.removePtFromSelection = function(p) {
        var v = this.selected_pts.indexOf(p);
        if (v != -1) {
            this.segs[p].select(false);
            this.selected_pts.splice(v, 1)
        }
    };
    svgedit.path.Path.prototype.clearSelection = function() {
        this.eachSeg(function() {
            this.select(false)
        });
        this.selected_pts = []
    };
    svgedit.path.Path.prototype.storeD = function() {
        this.last_d = this.elem.getAttribute("d")
    };
    svgedit.path.Path.prototype.show = function(p) {
        this.eachSeg(function() {
            this.show(p)
        });
        p && this.selectPt(this.first_seg.index);
        return this
    };
    svgedit.path.Path.prototype.movePts = function(p, v) {
        for (var t = this.selected_pts.length; t--;) this.segs[this.selected_pts[t]].move(p, v)
    };
    svgedit.path.Path.prototype.moveCtrl = function(p, v) {
        var t = this.segs[this.selected_pts[0]];
        t.moveCtrl(this.dragctrl, p, v);
        i && t.setLinked(this.dragctrl)
    };
    svgedit.path.Path.prototype.setSegType = function(p) {
        this.storeD();
        for (var v = this.selected_pts.length, t; v--;) {
            var m = this.segs[this.selected_pts[v]],
                L = m.prev;
            if (L) {
                if (!p) {
                    t = "Toggle Path Segment Type";
                    p = m.type == 6 ? 4 : 6
                }
                p = Number(p);
                var R = m.item.x,
                    da = m.item.y,
                    qa = L.item.x;
                L = L.item.y;
                var fa;
                switch (p) {
                    case 6:
                        if (m.olditem) {
                            qa = m.olditem;
                            fa = [R, da, qa.x1, qa.y1, qa.x2, qa.y2]
                        } else {
                            fa = R - qa;
                            var ea = da - L;
                            fa = [R, da, qa + fa / 3, L + ea / 3, R - fa / 3, da - ea / 3]
                        }
                        break;
                    case 4:
                        fa = [R, da];
                        m.olditem = m.item
                }
                m.setType(p, fa)
            }
        }
        svgedit.path.path.endChanges(t)
    };
    svgedit.path.Path.prototype.selectPt = function(p, v) {
        this.clearSelection();
        p == null && this.eachSeg(function(t) {
            if (this.prev) p = t
        });
        this.addPtsToSelection(p);
        if (v) {
            this.dragctrl = v;
            i && this.segs[p].setLinked(v)
        }
    };
    svgedit.path.Path.prototype.update =
        function() {
            var p = this.elem;
            if (svgedit.utilities.getRotationAngle(p)) {
                this.matrix = svgedit.math.getMatrix(p);
                this.imatrix = this.matrix.inverse()
            } else this.imatrix = this.matrix = null;
            this.eachSeg(function(v) {
                this.item = p.pathSegList.getItem(v);
                this.update()
            });
            return this
    };
    svgedit.path.getPath_ = function(p) {
        var v = s[p.id];
        v || (v = s[p.id] = new svgedit.path.Path(p));
        return v
    };
    svgedit.path.removePath_ = function(p) {
        p in s && delete s[p]
    };
    var g, q, w, D, u, A = function(p, v) {
            var t = p - w,
                m = v - D,
                L = Math.sqrt(t * t + m * m);
            m = Math.atan2(m,
                t) + u;
            t = L * Math.cos(m) + w;
            m = L * Math.sin(m) + D;
            t -= g;
            m -= q;
            L = Math.sqrt(t * t + m * m);
            m = Math.atan2(m, t) - u;
            return {
                x: L * Math.cos(m) + g,
                y: L * Math.sin(m) + q
            }
        };
    svgedit.path.recalcRotatedPath = function() {
        var p = svgedit.path.path.elem;
        if (u = svgedit.utilities.getRotationAngle(p, true)) {
            var v = svgedit.utilities.getBBox(p),
                t = svgedit.path.path.oldbbox;
            w = t.x + t.width / 2;
            D = t.y + t.height / 2;
            g = v.x + v.width / 2;
            q = v.y + v.height / 2;
            t = g - w;
            var m = q - D;
            v = Math.sqrt(t * t + m * m);
            t = Math.atan2(m, t) + u;
            g = v * Math.cos(t) + w;
            q = v * Math.sin(t) + D;
            v = p.pathSegList;
            for (t =
                v.numberOfItems; t;) {
                t -= 1;
                var L = v.getItem(t);
                m = L.pathSegType;
                if (m != 1) {
                    var R = A(L.x, L.y);
                    R = [R.x, R.y];
                    if (L.x1 != null && L.x2 != null) {
                        var da = A(L.x1, L.y1);
                        L = A(L.x2, L.y2);
                        R.splice(R.length, 0, da.x, da.y, L.x, L.y)
                    }
                    svgedit.path.replacePathSeg(m, t, R)
                }
            }
            svgedit.utilities.getBBox(p);
            v = svgroot.createSVGTransform();
            p = svgedit.transformlist.getTransformList(p);
            v.setRotate(u * 180 / Math.PI, g, q);
            p.replaceItem(v, 0)
        }
    };
    svgedit.path.clearData = function() {
        s = {}
    }
})();
(function() {
    if (!window.console) {
        window.console = {};
        window.console.log = function() {};
        window.console.dir = function() {}
    }
    if (window.opera) {
        window.console.log = function(a) {
            opera.postError(a)
        };
        window.console.dir = function() {}
    }
})();
$.SvgCanvas = function(a, I) {
    function o(b, f) {
        var d, r = svgedit.utilities.getBBox(b);
        for (d = 0; d < 2; d++) {
            var j = d === 0 ? "fill" : "stroke",
                E = b.getAttribute(j);
            if (E && E.indexOf("url(") === 0) {
                E = svgedit.utilities.getRefElem(E);
                if (E.tagName === "linearGradient") {
                    var n = E.getAttribute("x1") || 0,
                        z = E.getAttribute("y1") || 0,
                        B = E.getAttribute("x2") || 1,
                        G = E.getAttribute("y2") || 0;
                    n = r.width * n + r.x;
                    z = r.height * z + r.y;
                    B = r.width * B + r.x;
                    G = r.height * G + r.y;
                    n = svgedit.math.transformPoint(n, z, f);
                    G = svgedit.math.transformPoint(B, G, f);
                    B = {};
                    B.x1 = (n.x -
                        r.x) / r.width;
                    B.y1 = (n.y - r.y) / r.height;
                    B.x2 = (G.x - r.x) / r.width;
                    B.y2 = (G.y - r.y) / r.height;
                    E = E.cloneNode(true);
                    $(E).attr(B);
                    E.id = Ga();
                    svgedit.utilities.findDefs().appendChild(E);
                    b.setAttribute(j, "url(#" + E.id + ")")
                }
            }
        }
    }
    var c = svgedit.NS,
        i = {
            show_outside_canvas: true,
            selectNew: true,
            dimensions: [640, 480]
        };
    I && $.extend(i, I);
    var s = i.dimensions,
        e = this,
        g = a.ownerDocument,
        q = g.importNode(svgedit.utilities.text2xml('<svg id="svgroot" xmlns="' + c.SVG + '" xlinkns="' + c.XLINK + '" width="' + s[0] + '" height="' + s[1] + '" x="' + s[0] + '" y="' +
            s[1] + '" overflow="visible"><defs><filter id="canvashadow" filterUnits="objectBoundingBox"><feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/><feOffset in="blur" dx="5" dy="5" result="offsetBlur"/><feMerge><feMergeNode in="offsetBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>').documentElement, true);
    a.appendChild(q);
    var w = g.createElementNS(c.SVG, "svg");
    (e.clearSvgContentElement = function() {
        for (; w.firstChild;) w.removeChild(w.firstChild);
        $(w).attr({
            id: "svgcontent",
            width: s[0],
            height: s[1],
            x: s[0],
            y: s[1],
            overflow: i.show_outside_canvas ? "visible" : "hidden",
            xmlns: c.SVG,
            "xmlns:se": c.SE,
            "xmlns:xlink": c.XLINK
        }).appendTo(q);
        var b = g.createComment(" Created with SVG-edit - http://svg-edit.googlecode.com/ ");
        w.appendChild(b)
    })();
    var D = "svg_";
    e.setIdPrefix = function(b) {
        D = b
    };
    e.current_drawing_ = new svgedit.draw.Drawing(w, D);
    var u = e.getCurrentDrawing = function() {
        return e.current_drawing_
    }, A = 1,
        p = null,
        v = {
            shape: {
                fill: (i.initFill.color == "none" ? "" : "#") + i.initFill.color,
                fill_paint: null,
                fill_opacity: i.initFill.opacity,
                stroke: "#" + i.initStroke.color,
                stroke_paint: null,
                stroke_opacity: i.initStroke.opacity,
                stroke_width: i.initStroke.width,
                stroke_dasharray: "none",
                stroke_linejoin: "miter",
                stroke_linecap: "butt",
                opacity: i.initOpacity
            }
        };
    v.text = $.extend(true, {}, v.shape);
    $.extend(v.text, {
        fill: "#000000",
        stroke_width: 0,
        font_size: 24,
        font_family: "serif"
    });
    var t = v.shape,
        m = Array(1),
        L = this.addSvgElementFromJson = function(b) {
            var f = svgedit.utilities.getElem(b.attr.id),
                d = u().getCurrentLayer();
            if (f && b.element !=
                f.tagName) {
                d.removeChild(f);
                f = null
            }
            if (!f) {
                f = g.createElementNS(c.SVG, b.element);
                if (d)(p || d).appendChild(f)
            }
            b.curStyles && svgedit.utilities.assignAttributes(f, {
                fill: t.fill,
                stroke: t.stroke,
                "stroke-width": t.stroke_width,
                "stroke-dasharray": t.stroke_dasharray,
                "stroke-linejoin": t.stroke_linejoin,
                "stroke-linecap": t.stroke_linecap,
                "stroke-opacity": t.stroke_opacity,
                "fill-opacity": t.fill_opacity,
                opacity: t.opacity / 2,
                style: "pointer-events:inherit"
            }, 100);
            svgedit.utilities.assignAttributes(f, b.attr, 100);
            svgedit.utilities.cleanupElement(f);
            return f
        };
    e.getTransformList = svgedit.transformlist.getTransformList;
    var R = svgedit.math.transformPoint,
        da = e.matrixMultiply = svgedit.math.matrixMultiply,
        qa = e.hasMatrixTransform = svgedit.math.hasMatrixTransform,
        fa = e.transformListToTransform = svgedit.math.transformListToTransform;
    svgedit.units.init({
        getBaseUnit: function() {
            return i.baseUnit
        },
        getElement: svgedit.utilities.getElem,
        getHeight: function() {
            return w.getAttribute("height") / A
        },
        getWidth: function() {
            return w.getAttribute("width") / A
        },
        getRoundDigits: function() {
            return Ma.round_digits
        }
    });
    e.convertToNum = svgedit.units.convertToNum;
    svgedit.utilities.init({
        getDOMDocument: function() {
            return g
        },
        getDOMContainer: function() {
            return a
        },
        getSVGRoot: function() {
            return q
        },
        getSelectedElements: function() {
            return m
        },
        getSVGContent: function() {
            return w
        },
        getBaseUnit: function() {
            return i.baseUnit
        },
        getStepSize: function() {
            return i.stepSize
        }
    });
    var ea = e.findDefs = svgedit.utilities.findDefs,
        ka = e.getUrlFromAttr = svgedit.utilities.getUrlFromAttr,
        Ia = e.getHref = svgedit.utilities.getHref,
        Ba = e.setHref = svgedit.utilities.setHref,
        Lb = svgedit.utilities.getPathBBox;
    e.getBBox = svgedit.utilities.getBBox;
    e.getRotationAngle = svgedit.utilities.getRotationAngle;
    var kb = e.getElem = svgedit.utilities.getElem;
    e.getRefElem = svgedit.utilities.getRefElem;
    var ib = e.assignAttributes = svgedit.utilities.assignAttributes,
        ta = this.cleanupElement = svgedit.utilities.cleanupElement;
    svgedit.coords.init({
        getDrawing: function() {
            return u()
        },
        getGridSnapping: function() {
            return i.gridSnapping
        }
    });
    var pb = this.remapElement = svgedit.coords.remapElement;
    svgedit.recalculate.init({
        getSVGRoot: function() {
            return q
        },
        getStartTransform: function() {
            return lb
        },
        setStartTransform: function(b) {
            lb = b
        }
    });
    var Mb = this.recalculateDimensions = svgedit.recalculate.recalculateDimensions,
        ab = svgedit.getReverseNS(),
        Nb = e.sanitizeSvg = svgedit.sanitize.sanitizeSvg,
        Ab = svgedit.history.MoveElementCommand,
        bb = svgedit.history.InsertElementCommand,
        Wa = svgedit.history.RemoveElementCommand,
        jb = svgedit.history.ChangeElementCommand,
        Xb = svgedit.history.BatchCommand;
    e.undoMgr = new svgedit.history.UndoManager({
        handleHistoryEvent: function(b, f) {
            var d = svgedit.history.HistoryEventTypes;
            if (b == d.BEFORE_UNAPPLY || b == d.BEFORE_APPLY) e.clearSelection();
            else if (b == d.AFTER_APPLY || b == d.AFTER_UNAPPLY) {
                var r = f.elements();
                e.pathActions.clear();
                ma("changed", r);
                r = f.type();
                d = b == d.AFTER_APPLY;
                if (r == Ab.type())(d ? f.newParent : f.oldParent) == w && e.identifyLayers();
                else if (r == bb.type() || r == Wa.type()) {
                    f.parent == w && e.identifyLayers();
                    if (r == bb.type()) d && Bb(f.elem);
                    else d || Bb(f.elem);
                    f.elem.tagName === "use" && Cb(f.elem)
                } else if (r == jb.type()) {
                    f.elem.tagName == "title" && f.elem.parentNode.parentNode == w && e.identifyLayers();
                    d = d ? f.newValues : f.oldValues;
                    d.stdDeviation && e.setBlurOffsets(f.elem.parentNode, d.stdDeviation)
                }
            }
        }
    });
    var Y = function(b) {
        e.undoMgr.addCommandToHistory(b)
    };
    svgedit.select.init(i, {
        createSVGElement: function(b) {
            return e.addSvgElementFromJson(b)
        },
        svgRoot: function() {
            return q
        },
        svgContent: function() {
            return w
        },
        currentZoom: function() {
            return A
        },
        getStrokedBBox: function(b) {
            return e.getStrokedBBox([b])
        }
    });
    var va = this.selectorManager = svgedit.select.getSelectorManager();
    svgedit.path.init({
        getCurrentZoom: function() {
            return A
        },
        getSVGRoot: function() {
            return q
        }
    });
    var qb = {
        exportNoBlur: "Blurred elements will appear as un-blurred",
        exportNoforeignObject: "foreignObject elements will not appear",
        exportNoDashArray: "Strokes will appear filled",
        exportNoText: "Text may not appear as expected"
    }, Ob = ["clip-path", "fill", "filter", "marker-end", "marker-mid", "marker-start", "mask", "stroke"],
        Db = $.data,
        ub = document.createElementNS(c.SVG, "animate");
    $(ub).attr({
        attributeName: "opacity",
        begin: "indefinite",
        dur: 1,
        fill: "freeze"
    }).appendTo(q);
    var Bb = function(b) {
        var f,
            d = $(b).attr(Ob);
        for (f in d) {
            var r = d[f];
            if (r && r.indexOf("url(") === 0) {
                r = svgedit.utilities.getUrlFromAttr(r).substr(1);
                if (!kb(r)) {
                    svgedit.utilities.findDefs().appendChild(Eb[r]);
                    delete Eb[r]
                }
            }
        }
        f = b.getElementsByTagName("*");
        if (f.length) {
            b = 0;
            for (l = f.length; b < l; b++) Bb(f[b])
        }
    }, Na = {}, mb = i.imgPath + "logo.png",
        oa = [],
        Ma = {
            round_digits: 5
        }, ya = false,
        lb = null,
        ua = "select",
        db = "none",
        Fb = {}, Sa = v.text,
        Ta = t,
        Ua = null,
        Ca = null,
        rb = [],
        vb = {}, Oa = null,
        Eb = {};
    e.clipBoard = [];
    var nb = this.runExtensions = function(b, f, d) {
        var r = d ? [] : false;
        $.each(vb, function(j, E) {
            if (E && b in E)
                if (d) r.push(E[b](f));
                else r = E[b](f)
        });
        return r
    };
    this.addExtension = function(b, f) {
        var d;
        if (b in vb) console.log('Cannot add extension "' + b + '", an extension by that name already exists"');
        else {
            d = $.isFunction(f) ? f($.extend(e.getPrivateMethods(), {
                svgroot: q,
                svgcontent: w,
                nonce: u().getNonce(),
                selectorManager: va
            })) : f;
            vb[b] = d;
            ma("extension_added", d)
        }
    };
    var Gb = this.round = function(b) {
        return parseInt(b * A, 10) / A
    }, eb = this.getIntersectionList = function(b) {
            if (Ca == null) return null;
            var f = p || u().getCurrentLayer();
            rb.length || (rb = cb(f));
            var d = null;
            try {
                d = f.getIntersectionList(b, null)
            } catch (r) {}
            if (d == null || typeof d.item != "function") {
                d = [];
                if (b) b = b;
                else {
                    b = Ca.getBBox();
                    var j;
                    f = {};
                    for (j in b) f[j] = b[j] / A;
                    b = f
                }
                for (j = rb.length; j--;) b.width && svgedit.math.rectsIntersect(b, rb[j].bbox) && d.push(rb[j].elem)
            }
            return d
        };
    getStrokedBBox = this.getStrokedBBox = function(b) {
        b || (b = sb());
        if (!b.length) return false;
        var f = function(G) {
            try {
                var K = svgedit.utilities.getBBox(G),
                    C = svgedit.utilities.getRotationAngle(G);
                if (C && C % 90 || svgedit.math.hasMatrixTransform(svgedit.transformlist.getTransformList(G))) {
                    C = false;
                    if (["ellipse", "path", "line", "polyline", "polygon"].indexOf(G.tagName) >= 0) K = C = e.convertToPath(G, true);
                    else if (G.tagName == "rect") {
                        var O = G.getAttribute("rx"),
                            T = G.getAttribute("ry");
                        if (O || T) K = C = e.convertToPath(G, true)
                    }
                    if (!C) {
                        var V = G.cloneNode(true),
                            X = document.createElementNS(c.SVG, "g"),
                            ca = G.parentNode;
                        ca.appendChild(X);
                        X.appendChild(V);
                        K = svgedit.utilities.bboxToObj(X.getBBox());
                        ca.removeChild(X)
                    }
                }
                return K
            } catch (S) {
                console.log(G,
                    S);
                return null
            }
        }, d;
        $.each(b, function() {
            if (!d)
                if (this.parentNode) d = f(this)
        });
        if (d == null) return null;
        var r = d.x + d.width,
            j = d.y + d.height,
            E = d.x,
            n = d.y,
            z = function(G) {
                var K = G.getAttribute("stroke-width"),
                    C = 0;
                if (G.getAttribute("stroke") != "none" && !isNaN(K)) C += K / 2;
                return C
            }, B = [];
        $.each(b, function(G, K) {
            var C = f(K);
            if (C) {
                var O = z(K);
                E = Math.min(E, C.x - O);
                n = Math.min(n, C.y - O);
                B.push(C)
            }
        });
        d.x = E;
        d.y = n;
        $.each(b, function(G, K) {
            var C = B[G];
            if (C && K.nodeType == 1) {
                var O = z(K);
                r = Math.max(r, C.x + C.width + O);
                j = Math.max(j, C.y + C.height +
                    O)
            }
        });
        d.width = r - E;
        d.height = j - n;
        return d
    };
    var sb = this.getVisibleElements = function(b) {
        b || (b = $(w).children());
        var f = [];
        $(b).children().each(function(d, r) {
            try {
                r.getBBox() && f.push(r)
            } catch (j) {}
        });
        return f.reverse()
    }, cb = this.getVisibleElementsAndBBoxes = function(b) {
            b || (b = $(w).children());
            var f = [];
            $(b).children().each(function(d, r) {
                try {
                    r.getBBox() && f.push({
                        elem: r,
                        bbox: getStrokedBBox([r])
                    })
                } catch (j) {}
            });
            return f.reverse()
        }, Pb = this.groupSvgElem = function(b) {
            var f = document.createElementNS(c.SVG, "g");
            b.parentNode.replaceChild(f,
                b);
            $(f).append(b).data("gsvg", b)[0].id = Ga()
        }, ob = function(b) {
            var f = document.createElementNS(b.namespaceURI, b.nodeName);
            $.each(b.attributes, function(r, j) {
                j.localName != "-moz-math-font-style" && f.setAttributeNS(j.namespaceURI, j.nodeName, j.nodeValue)
            });
            f.removeAttribute("id");
            f.id = Ga();
            if (svgedit.browser.isWebkit() && b.nodeName == "path") {
                var d = ra.convertPath(b);
                f.setAttribute("d", d)
            }
            $.each(b.childNodes, function(r, j) {
                switch (j.nodeType) {
                    case 1:
                        f.appendChild(ob(j));
                        break;
                    case 3:
                        f.textContent = j.nodeValue
                }
            });
            if ($(b).data("gsvg")) $(f).data("gsvg", f.firstChild);
            else if ($(b).data("symbol")) {
                b = $(b).data("symbol");
                $(f).data("ref", b).data("symbol", b)
            } else f.tagName == "image" && wb(f);
            return f
        }, Ya, Ga, ma, La, ra;
    (function(b) {
        var f = {};
        Ya = b.getId = function() {
            return u().getId()
        };
        Ga = b.getNextId = function() {
            return u().getNextId()
        };
        ma = b.call = function(d, r) {
            if (f[d]) return f[d](this, r)
        };
        b.bind = function(d, r) {
            var j = f[d];
            f[d] = r;
            return j
        }
    })(e);
    this.prepareSvg = function(b) {
        this.sanitizeSvg(b.documentElement);
        var f, d, r = b.getElementsByTagNameNS(c.SVG,
                "path");
        b = 0;
        for (d = r.length; b < d; ++b) {
            f = r[b];
            f.setAttribute("d", ra.convertPath(f));
            ra.fixEnd(f)
        }
    };
    var Hb = function(b) {
        if (!svgedit.browser.isGecko()) return b;
        var f = b.cloneNode(true);
        b.parentNode.insertBefore(f, b);
        b.parentNode.removeChild(b);
        va.releaseSelector(b);
        m[0] = f;
        va.requestSelector(f).showGrips(true);
        return f
    };
    this.setRotationAngle = function(b, f) {
        b = parseFloat(b);
        var d = m[0],
            r = d.getAttribute("transform"),
            j = svgedit.utilities.getBBox(d),
            E = j.x + j.width / 2,
            n = j.y + j.height / 2;
        j = svgedit.transformlist.getTransformList(d);
        j.numberOfItems > 0 && j.getItem(0).type == 4 && j.removeItem(0);
        if (b != 0) {
            E = svgedit.math.transformPoint(E, n, svgedit.math.transformListToTransform(j).matrix);
            n = q.createSVGTransform();
            n.setRotate(b, E.x, E.y);
            j.numberOfItems ? j.insertItemBefore(n, 0) : j.appendItem(n)
        } else j.numberOfItems == 0 && d.removeAttribute("transform"); if (!f) {
            j = d.getAttribute("transform");
            d.setAttribute("transform", r);
            Va("transform", j, m);
            ma("changed", m)
        }
        svgedit.utilities.getElem("pathpointgrip_container");
        d = va.requestSelector(m[0]);
        d.resize();
        d.updateGripCursors(b)
    };
    var Qb = this.recalculateAllSelectedDimensions = function() {
        for (var b = new svgedit.history.BatchCommand(db == "none" ? "position" : "size"), f = m.length; f--;) {
            var d = svgedit.recalculate.recalculateDimensions(m[f]);
            d && b.addSubCommand(d)
        }
        if (!b.isEmpty()) {
            Y(b);
            ma("changed", m)
        }
    }, gc = [0, "z", "M", "m", "L", "l", "C", "c", "Q", "q", "A", "a", "H", "h", "V", "v", "S", "s", "T", "t"],
        Yb = function(b) {
            console.log([b.a, b.b, b.c, b.d, b.e, b.f])
        }, fb = null,
        za = this.clearSelection = function(b) {
            if (m[0] != null) {
                var f, d, r = m.length;
                for (f = 0; f < r; ++f) {
                    d = m[f];
                    if (d == null) break;
                    va.releaseSelector(d);
                    m[f] = null
                }
            }
            b || ma("selected", m)
        }, gb = this.addToSelection = function(b, f) {
            if (b.length != 0) {
                for (var d = 0; d < m.length;) {
                    if (m[d] == null) break;
                    ++d
                }
                for (var r = b.length; r--;) {
                    var j = b[r];
                    if (j && svgedit.utilities.getBBox(j)) {
                        if (j.tagName === "a" && j.childNodes.length === 1) j = j.firstChild;
                        if (m.indexOf(j) == -1) {
                            m[d] = j;
                            d++;
                            j = va.requestSelector(j);
                            m.length > 1 && j.showGrips(false)
                        }
                    }
                }
                ma("selected", m);
                f || m.length == 1 ? va.requestSelector(m[0]).showGrips(true) : va.requestSelector(m[0]).showGrips(false);
                for (m.sort(function(E, n) {
                    if (E && n && E.compareDocumentPosition) return 3 - (n.compareDocumentPosition(E) & 6);
                    if (E == null) return 1
                }); m[0] == null;) m.shift(0)
            }
        }, Za = this.selectOnly = function(b, f) {
            za(true);
            gb(b, f)
        };
    this.removeFromSelection = function(b) {
        if (m[0] != null)
            if (b.length != 0) {
                var f, d = 0,
                    r = Array(m.length),
                    j = m.length;
                for (f = 0; f < j; ++f) {
                    var E = m[f];
                    if (E)
                        if (b.indexOf(E) == -1) {
                            r[d] = E;
                            d++
                        } else va.releaseSelector(E)
                }
                m = r
            }
    };
    this.selectAllInCurrentLayer = function() {
        var b = u().getCurrentLayer();
        if (b) {
            ua = "select";
            Za($(p || b).children())
        }
    };
    var Ib = this.getMouseTarget = function(b) {
        if (b == null) return null;
        b = b.target;
        if (b.correspondingUseElement) b = b.correspondingUseElement;
        if ([c.MATH, c.HTML].indexOf(b.namespaceURI) >= 0 && b.id != "svgcanvas")
            for (; b.nodeName != "foreignObject";) {
                b = b.parentNode;
                if (!b) return q
            }
        var f = u().getCurrentLayer();
        if ([q, a, w, f].indexOf(b) >= 0) return q;
        if ($(b).closest("#selectorParentGroup").length) return va.selectorParentGroup;
        for (; b.parentNode !== (p || f);) b = b.parentNode;
        return b
    };
    (function() {
        var b = null,
            f = null,
            d = null,
            r = null,
            j = null,
            E = {}, n = {
                minx: null,
                miny: null,
                maxx: null,
                maxy: null
            }, z = 0,
            B = {
                x: 0,
                y: 0
            }, G = {
                x: 0,
                y: 0
            }, K = {
                x: 0,
                y: 0
            }, C = {
                x: 0,
                y: 0
            }, O, T, V = {
                x: 0,
                y: 0
            }, X = {
                x: 0,
                y: 0
            }, ca = function(S) {
                var M = {
                    x: 0,
                    y: 0
                }, J = B,
                    N = G,
                    P = K,
                    aa = C,
                    ha = 1 / 6,
                    pa = S * S,
                    Aa = pa * S,
                    ba = [
                        [-1, 3, -3, 1],
                        [3, -6, 3, 0],
                        [-3, 0, 3, 0],
                        [1, 4, 1, 0]
                    ];
                M.x = ha * ((J.x * ba[0][0] + N.x * ba[0][1] + P.x * ba[0][2] + aa.x * ba[0][3]) * Aa + (J.x * ba[1][0] + N.x * ba[1][1] + P.x * ba[1][2] + aa.x * ba[1][3]) * pa + (J.x * ba[2][0] + N.x * ba[2][1] + P.x * ba[2][2] + aa.x * ba[2][3]) * S + (J.x * ba[3][0] + N.x * ba[3][1] + P.x * ba[3][2] + aa.x * ba[3][3]));
                M.y = ha * ((J.y * ba[0][0] +
                    N.y * ba[0][1] + P.y * ba[0][2] + aa.y * ba[0][3]) * Aa + (J.y * ba[1][0] + N.y * ba[1][1] + P.y * ba[1][2] + aa.y * ba[1][3]) * pa + (J.y * ba[2][0] + N.y * ba[2][1] + P.y * ba[2][2] + aa.y * ba[2][3]) * S + (J.y * ba[3][0] + N.y * ba[3][1] + P.y * ba[3][2] + aa.y * ba[3][3]));
                return {
                    x: M.x,
                    y: M.y
                }
            };
        $(a).mousedown(function(S) {
            if (!(e.spaceKey || S.button === 1)) {
                var M = S.button === 2;
                S.altKey && svgCanvas.cloneSelectedElements(0, 0);
                fb = $("#svgcontent g")[0].getScreenCTM().inverse();
                var J = svgedit.math.transformPoint(S.pageX, S.pageY, fb),
                    N = J.x * A,
                    P = J.y * A;
                S.preventDefault();
                if (M) {
                    ua =
                        "select";
                    Oa = J
                }
                J = N / A;
                P = P / A;
                var aa = Ib(S);
                if (aa.tagName === "a" && aa.childNodes.length === 1) aa = aa.firstChild;
                r = f = N = J;
                var ha = P;
                j = d = P;
                if (i.gridSnapping) {
                    J = svgedit.utilities.snapToGrid(J);
                    P = svgedit.utilities.snapToGrid(P);
                    f = svgedit.utilities.snapToGrid(f);
                    d = svgedit.utilities.snapToGrid(d)
                }
                if (aa == va.selectorParentGroup && m[0] != null) {
                    aa = S.target;
                    var pa = Db(aa, "type");
                    if (pa == "rotate") ua = "rotate";
                    else if (pa == "resize") {
                        ua = "resize";
                        db = Db(aa, "dir")
                    }
                    aa = m[0]
                }
                lb = aa.getAttribute("transform");
                var Aa;
                pa = svgedit.transformlist.getTransformList(aa);
                switch (ua) {
                    case "select":
                        ya = true;
                        db = "none";
                        if (M) ya = false;
                        if (aa != q) {
                            if (m.indexOf(aa) == -1) {
                                S.shiftKey || za(true);
                                gb([aa]);
                                Ua = aa;
                                ra.clear()
                            }
                            if (!M)
                                for (M = 0; M < m.length; ++M)
                                    if (m[M] != null) {
                                        Aa = svgedit.transformlist.getTransformList(m[M]);
                                        Aa.numberOfItems ? Aa.insertItemBefore(q.createSVGTransform(), 0) : Aa.appendItem(q.createSVGTransform())
                                    }
                        } else if (!M) {
                            za();
                            ua = "multiselect";
                            if (Ca == null) Ca = va.getRubberBandBox();
                            r *= A;
                            j *= A;
                            svgedit.utilities.assignAttributes(Ca, {
                                x: r,
                                y: j,
                                width: 0,
                                height: 0,
                                display: "inline"
                            }, 100)
                        }
                        break;
                    case "zoom":
                        ya = true;
                        if (Ca == null) Ca = va.getRubberBandBox();
                        svgedit.utilities.assignAttributes(Ca, {
                            x: N * A,
                            y: N * A,
                            width: 0,
                            height: 0,
                            display: "inline"
                        }, 100);
                        break;
                    case "resize":
                        ya = true;
                        f = J;
                        d = P;
                        E = svgedit.utilities.getBBox($("#selectedBox0")[0]);
                        var ba = {};
                        $.each(E, function(wa, Da) {
                            ba[wa] = Da / A
                        });
                        E = ba;
                        M = svgedit.utilities.getRotationAngle(aa) ? 1 : 0;
                        if (svgedit.math.hasMatrixTransform(pa)) {
                            pa.insertItemBefore(q.createSVGTransform(), M);
                            pa.insertItemBefore(q.createSVGTransform(), M);
                            pa.insertItemBefore(q.createSVGTransform(),
                                M)
                        } else {
                            pa.appendItem(q.createSVGTransform());
                            pa.appendItem(q.createSVGTransform());
                            pa.appendItem(q.createSVGTransform());
                            if (svgedit.browser.supportsNonScalingStroke()) {
                                if (J = svgedit.browser.isWebkit()) Aa = function(wa) {
                                    var Da = wa.getAttributeNS(null, "stroke");
                                    wa.removeAttributeNS(null, "stroke");
                                    setTimeout(function() {
                                        wa.setAttributeNS(null, "stroke", Da)
                                    }, 0)
                                };
                                aa.style.vectorEffect = "non-scaling-stroke";
                                J && Aa(aa);
                                P = aa.getElementsByTagName("*");
                                N = P.length;
                                for (M = 0; M < N; M++) {
                                    P[M].style.vectorEffect = "non-scaling-stroke";
                                    J && Aa(P[M])
                                }
                            }
                        }
                        break;
                    case "fhellipse":
                    case "fhrect":
                    case "fhpath":
                        K.x = N;
                        K.y = ha;
                        ya = true;
                        b = N + "," + ha + " ";
                        Aa = t.stroke_width == 0 ? 1 : t.stroke_width;
                        L({
                            element: "polyline",
                            curStyles: true,
                            attr: {
                                points: b,
                                id: Ga(),
                                fill: "none",
                                opacity: t.opacity / 2,
                                "stroke-linecap": "round",
                                style: "pointer-events:none"
                            }
                        });
                        n.minx = N;
                        n.maxx = N;
                        n.miny = ha;
                        n.maxy = ha;
                        break;
                    case "image":
                        ya = true;
                        Aa = L({
                            element: "image",
                            attr: {
                                x: J,
                                y: P,
                                width: 0,
                                height: 0,
                                id: Ga(),
                                opacity: t.opacity / 2,
                                style: "pointer-events:inherit"
                            }
                        });
                        Ba(Aa, mb);
                        wb(Aa);
                        break;
                    case "square":
                    case "rect":
                        ya =
                            true;
                        f = J;
                        d = P;
                        L({
                            element: "rect",
                            curStyles: true,
                            attr: {
                                x: J,
                                y: P,
                                width: 0,
                                height: 0,
                                id: Ga(),
                                opacity: t.opacity / 2
                            }
                        });
                        break;
                    case "line":
                        ya = true;
                        Aa = t.stroke_width == 0 ? 1 : t.stroke_width;
                        L({
                            element: "line",
                            curStyles: true,
                            attr: {
                                x1: J,
                                y1: P,
                                x2: J,
                                y2: P,
                                id: Ga(),
                                stroke: t.stroke,
                                "stroke-width": Aa,
                                "stroke-dasharray": t.stroke_dasharray,
                                "stroke-linejoin": t.stroke_linejoin,
                                "stroke-linecap": t.stroke_linecap,
                                "stroke-opacity": t.stroke_opacity,
                                fill: "none",
                                opacity: t.opacity / 2,
                                style: "pointer-events:none"
                            }
                        });
                        break;
                    case "circle":
                        ya =
                            true;
                        L({
                            element: "circle",
                            curStyles: true,
                            attr: {
                                cx: J,
                                cy: P,
                                r: 0,
                                id: Ga(),
                                opacity: t.opacity / 2
                            }
                        });
                        break;
                    case "ellipse":
                        ya = true;
                        L({
                            element: "ellipse",
                            curStyles: true,
                            attr: {
                                cx: J,
                                cy: P,
                                rx: 0,
                                ry: 0,
                                id: Ga(),
                                opacity: t.opacity / 2
                            }
                        });
                        break;
                    case "text":
                        ya = true;
                        L({
                            element: "text",
                            curStyles: true,
                            attr: {
                                x: J,
                                y: P,
                                id: Ga(),
                                fill: Sa.fill,
                                "stroke-width": Sa.stroke_width,
                                "font-size": Sa.font_size,
                                "font-family": Sa.font_family,
                                "text-anchor": "middle",
                                "xml:space": "preserve",
                                opacity: t.opacity
                            }
                        });
                        break;
                    case "path":
                    case "pathedit":
                        f *= A;
                        d *=
                            A;
                        ra.mouseDown(S, aa, f, d);
                        ya = true;
                        break;
                    case "textedit":
                        f *= A;
                        d *= A;
                        La.mouseDown(S, aa, f, d);
                        ya = true;
                        break;
                    case "rotate":
                        ya = true;
                        e.undoMgr.beginUndoableChange("transform", m)
                }
                S = nb("mouseDown", {
                    event: S,
                    start_x: f,
                    start_y: d,
                    selectedElements: m
                }, true);
                $.each(S, function(wa, Da) {
                    if (Da && Da.started) ya = true
                })
            }
        }).mousemove(function(S) {
            if (ya)
                if (!(S.button === 1 || e.spaceKey)) {
                    var M, J, N, P, aa, ha = m[0],
                        pa = svgedit.math.transformPoint(S.pageX, S.pageY, fb),
                        Aa = pa.x * A;
                    pa = pa.y * A;
                    var ba = svgedit.utilities.getElem(Ya());
                    x = J = Aa / A;
                    y =
                        P = pa / A;
                    if (i.gridSnapping) {
                        x = svgedit.utilities.snapToGrid(x);
                        y = svgedit.utilities.snapToGrid(y)
                    }
                    S.preventDefault();
                    switch (ua) {
                        case "select":
                            if (m[0] !== null) {
                                J = x - f;
                                N = y - d;
                                if (i.gridSnapping) {
                                    J = svgedit.utilities.snapToGrid(J);
                                    N = svgedit.utilities.snapToGrid(N)
                                }
                                if (S.shiftKey) {
                                    M = svgedit.math.snapToAngle(f, d, x, y);
                                    x = M.x;
                                    y = M.y
                                }
                                if (J != 0 || N != 0) {
                                    P = m.length;
                                    for (M = 0; M < P; ++M) {
                                        ha = m[M];
                                        if (ha == null) break;
                                        var wa = q.createSVGTransform();
                                        ba = svgedit.transformlist.getTransformList(ha);
                                        wa.setTranslate(J, N);
                                        ba.numberOfItems ? ba.replaceItem(wa,
                                            0) : ba.appendItem(wa);
                                        va.requestSelector(ha).resize()
                                    }
                                    ma("transition", m)
                                }
                            }
                            break;
                        case "multiselect":
                            J *= A;
                            P *= A;
                            svgedit.utilities.assignAttributes(Ca, {
                                x: Math.min(r, J),
                                y: Math.min(j, P),
                                width: Math.abs(J - r),
                                height: Math.abs(P - j)
                            }, 100);
                            ba = [];
                            J = [];
                            wa = eb();
                            P = m.length;
                            for (M = 0; M < P; ++M) {
                                N = wa.indexOf(m[M]);
                                if (N == -1) ba.push(m[M]);
                                else wa[N] = null
                            }
                            P = wa.length;
                            for (M = 0; M < P; ++M) wa[M] && J.push(wa[M]);
                            ba.length > 0 && e.removeFromSelection(ba);
                            J.length > 0 && gb(J);
                            break;
                        case "resize":
                            ba = svgedit.transformlist.getTransformList(ha);
                            N = (M = svgedit.math.hasMatrixTransform(ba)) ? E : svgedit.utilities.getBBox(ha);
                            P = N.x;
                            wa = N.y;
                            var Da = N.width,
                                $a = N.height;
                            J = x - f;
                            N = y - d;
                            if (i.gridSnapping) {
                                J = svgedit.utilities.snapToGrid(J);
                                N = svgedit.utilities.snapToGrid(N);
                                $a = svgedit.utilities.snapToGrid($a);
                                Da = svgedit.utilities.snapToGrid(Da)
                            }
                            if (aa = svgedit.utilities.getRotationAngle(ha)) {
                                var hb = Math.sqrt(J * J + N * N);
                                N = Math.atan2(N, J) - aa * Math.PI / 180;
                                J = hb * Math.cos(N);
                                N = hb * Math.sin(N)
                            }
                            if (db.indexOf("n") == -1 && db.indexOf("s") == -1) N = 0;
                            if (db.indexOf("e") == -1 && db.indexOf("w") == -1) J = 0;
                            var Jb = hb = 0,
                                Rb = $a ? ($a + N) / $a : 1,
                                Kb = Da ? (Da + J) / Da : 1;
                            if (db.indexOf("n") >= 0) {
                                Rb = $a ? ($a - N) / $a : 1;
                                Jb = $a
                            }
                            if (db.indexOf("w") >= 0) {
                                Kb = Da ? (Da - J) / Da : 1;
                                hb = Da
                            }
                            J = q.createSVGTransform();
                            N = q.createSVGTransform();
                            Da = q.createSVGTransform();
                            if (i.gridSnapping) {
                                P = svgedit.utilities.snapToGrid(P);
                                hb = svgedit.utilities.snapToGrid(hb);
                                wa = svgedit.utilities.snapToGrid(wa);
                                Jb = svgedit.utilities.snapToGrid(Jb)
                            }
                            J.setTranslate(-(P + hb), -(wa + Jb));
                            if (S.shiftKey)
                                if (Kb == 1) Kb = Rb;
                                else Rb = Kb;
                            N.setScale(Kb, Rb);
                            Da.setTranslate(P + hb, wa +
                                Jb);
                            if (M) {
                                M = aa ? 1 : 0;
                                ba.replaceItem(J, 2 + M);
                                ba.replaceItem(N, 1 + M);
                                ba.replaceItem(Da, Number(M))
                            } else {
                                M = ba.numberOfItems;
                                ba.replaceItem(Da, M - 3);
                                ba.replaceItem(N, M - 2);
                                ba.replaceItem(J, M - 1)
                            }
                            va.requestSelector(ha).resize();
                            ma("transition", m);
                            break;
                        case "zoom":
                            J *= A;
                            P *= A;
                            svgedit.utilities.assignAttributes(Ca, {
                                x: Math.min(r * A, J),
                                y: Math.min(j * A, P),
                                width: Math.abs(J - r * A),
                                height: Math.abs(P - j * A)
                            }, 100);
                            break;
                        case "text":
                            svgedit.utilities.assignAttributes(ba, {
                                x: x,
                                y: y
                            }, 1E3);
                            break;
                        case "line":
                            P = null;
                            window.opera || q.suspendRedraw(1E3);
                            if (i.gridSnapping) {
                                x = svgedit.utilities.snapToGrid(x);
                                y = svgedit.utilities.snapToGrid(y)
                            }
                            J = x;
                            M = y;
                            if (S.shiftKey) {
                                M = svgedit.math.snapToAngle(f, d, J, M);
                                J = M.x;
                                M = M.y
                            }
                            ba.setAttributeNS(null, "x2", J);
                            ba.setAttributeNS(null, "y2", M);
                            window.opera || q.unsuspendRedraw(P);
                            break;
                        case "foreignObject":
                        case "square":
                        case "rect":
                        case "image":
                            J = Math.abs(x - f);
                            M = Math.abs(y - d);
                            if (ua == "square" || S.shiftKey) {
                                J = M = Math.max(J, M);
                                P = f < x ? f : f - J;
                                wa = d < y ? d : d - M
                            } else {
                                P = Math.min(f, x);
                                wa = Math.min(d, y)
                            } if (i.gridSnapping) {
                                J = svgedit.utilities.snapToGrid(J);
                                M = svgedit.utilities.snapToGrid(M);
                                P = svgedit.utilities.snapToGrid(P);
                                wa = svgedit.utilities.snapToGrid(wa)
                            }
                            svgedit.utilities.assignAttributes(ba, {
                                width: J,
                                height: M,
                                x: P,
                                y: wa
                            }, 1E3);
                            break;
                        case "circle":
                            M = $(ba).attr(["cx", "cy"]);
                            J = M.cx;
                            M = M.cy;
                            J = Math.sqrt((x - J) * (x - J) + (y - M) * (y - M));
                            if (i.gridSnapping) J = svgedit.utilities.snapToGrid(J);
                            ba.setAttributeNS(null, "r", J);
                            break;
                        case "ellipse":
                            M = $(ba).attr(["cx", "cy"]);
                            J = M.cx;
                            M = M.cy;
                            P = null;
                            window.opera || q.suspendRedraw(1E3);
                            if (i.gridSnapping) {
                                x = svgedit.utilities.snapToGrid(x);
                                J = svgedit.utilities.snapToGrid(J);
                                y = svgedit.utilities.snapToGrid(y);
                                M = svgedit.utilities.snapToGrid(M)
                            }
                            ba.setAttributeNS(null, "rx", Math.abs(x - J));
                            ba.setAttributeNS(null, "ry", Math.abs(S.shiftKey ? x - J : y - M));
                            window.opera || q.unsuspendRedraw(P);
                            break;
                        case "fhellipse":
                        case "fhrect":
                            n.minx = Math.min(J, n.minx);
                            n.maxx = Math.max(J, n.maxx);
                            n.miny = Math.min(P, n.miny);
                            n.maxy = Math.max(P, n.maxy);
                        case "fhpath":
                            C.x = J;
                            C.y = P;
                            if (B.x && B.y)
                                for (M = 0; M < 9; M++) {
                                    O = M / 10;
                                    T = (M + 1) / 10;
                                    X = V = ca(T);
                                    V = ca(O);
                                    z += Math.sqrt((X.x - V.x) * (X.x - V.x) +
                                        (X.y - V.y) * (X.y - V.y));
                                    if (z > 0.8) {
                                        b += +V.x + "," + V.y + " ";
                                        ba.setAttributeNS(null, "points", b);
                                        z -= 0.8
                                    }
                                }
                            B = {
                                x: G.x,
                                y: G.y
                            };
                            G = {
                                x: K.x,
                                y: K.y
                            };
                            K = {
                                x: C.x,
                                y: C.y
                            };
                            break;
                        case "path":
                        case "pathedit":
                            x *= A;
                            y *= A;
                            if (i.gridSnapping) {
                                x = svgedit.utilities.snapToGrid(x);
                                y = svgedit.utilities.snapToGrid(y);
                                f = svgedit.utilities.snapToGrid(f);
                                d = svgedit.utilities.snapToGrid(d)
                            }
                            if (S.shiftKey) {
                                if (M = svgedit.path.path) {
                                    ba = M.dragging ? M.dragging[0] : f;
                                    M = M.dragging ? M.dragging[1] : d
                                } else {
                                    ba = f;
                                    M = d
                                }
                                M = svgedit.math.snapToAngle(ba, M, x, y);
                                x = M.x;
                                y = M.y
                            }
                            if (Ca &&
                                Ca.getAttribute("display") !== "none") {
                                J *= A;
                                P *= A;
                                svgedit.utilities.assignAttributes(Ca, {
                                    x: Math.min(r * A, J),
                                    y: Math.min(j * A, P),
                                    width: Math.abs(J - r * A),
                                    height: Math.abs(P - j * A)
                                }, 100)
                            }
                            ra.mouseMove(x, y);
                            break;
                        case "textedit":
                            x *= A;
                            y *= A;
                            La.mouseMove(Aa, pa);
                            break;
                        case "rotate":
                            N = svgedit.utilities.getBBox(ha);
                            J = N.x + N.width / 2;
                            M = N.y + N.height / 2;
                            ba = svgedit.math.getMatrix(ha);
                            ba = svgedit.math.transformPoint(J, M, ba);
                            J = ba.x;
                            M = ba.y;
                            aa = (Math.atan2(M - y, J - x) * (180 / Math.PI) - 90) % 360;
                            if (i.gridSnapping) aa = svgedit.utilities.snapToGrid(aa);
                            if (S.shiftKey) aa = Math.round(aa / 45) * 45;
                            e.setRotationAngle(aa < -180 ? 360 + aa : aa, true);
                            ma("transition", m)
                    }
                    nb("mouseMove", {
                        event: S,
                        mouse_x: Aa,
                        mouse_y: pa,
                        selected: ha
                    })
                }
        }).click(function(S) {
            S.preventDefault();
            return false
        }).dblclick(function(S) {
            var M = S.target.parentNode;
            if (M !== p) {
                var J = Ib(S),
                    N = J.tagName;
                if (N === "text" && ua !== "textedit") {
                    S = svgedit.math.transformPoint(S.pageX, S.pageY, fb);
                    La.select(J, S.x, S.y)
                }
                if ((N === "g" || N === "a") && svgedit.utilities.getRotationAngle(J)) {
                    tb(J);
                    J = m[0];
                    za(true)
                }
                p && Sb();
                M.tagName !==
                    "g" && M.tagName !== "a" || M === u().getCurrentLayer() || J === va.selectorParentGroup || hc(J)
            }
        }).mouseup(function(S) {
            if (S.button !== 2) {
                var M = Ua;
                Ua = null;
                if (ya) {
                    var J = svgedit.math.transformPoint(S.pageX, S.pageY, fb),
                        N = J.x * A;
                    J = J.y * A;
                    var P = N / A,
                        aa = J / A,
                        ha = svgedit.utilities.getElem(Ya()),
                        pa = false;
                    ya = false;
                    switch (ua) {
                        case "resize":
                        case "multiselect":
                            if (Ca != null) {
                                Ca.setAttribute("display", "none");
                                rb = []
                            }
                            ua = "select";
                        case "select":
                            if (m[0] != null) {
                                if (m[1] == null) {
                                    N = m[0];
                                    switch (N.tagName) {
                                        case "g":
                                        case "use":
                                        case "image":
                                        case "foreignObject":
                                            break;
                                        default:
                                            Ta.fill = N.getAttribute("fill");
                                            Ta.fill_opacity = N.getAttribute("fill-opacity");
                                            Ta.stroke = N.getAttribute("stroke");
                                            Ta.stroke_opacity = N.getAttribute("stroke-opacity");
                                            Ta.stroke_width = N.getAttribute("stroke-width");
                                            Ta.stroke_dasharray = N.getAttribute("stroke-dasharray");
                                            Ta.stroke_linejoin = N.getAttribute("stroke-linejoin");
                                            Ta.stroke_linecap = N.getAttribute("stroke-linecap")
                                    }
                                    if (N.tagName == "text") {
                                        Sa.font_size = N.getAttribute("font-size");
                                        Sa.font_family = N.getAttribute("font-family")
                                    }
                                    va.requestSelector(N).showGrips(true)
                                }
                                Qb();
                                if (P != r || aa != j) {
                                    N = m.length;
                                    for (S = 0; S < N; ++S) {
                                        if (m[S] == null) break;
                                        m[S].firstChild || va.requestSelector(m[S]).resize()
                                    }
                                } else {
                                    N = S.target;
                                    if (m[0].nodeName === "path" && m[1] == null) ra.select(m[0]);
                                    else S.shiftKey && M != N && e.removeFromSelection([N])
                                } if (svgedit.browser.supportsNonScalingStroke())
                                    if (S = m[0]) {
                                        S.removeAttribute("style");
                                        svgedit.utilities.walkTree(S, function(wa) {
                                            wa.removeAttribute("style")
                                        })
                                    }
                            }
                            return;
                        case "zoom":
                            Ca != null && Ca.setAttribute("display", "none");
                            ma("zoomed", {
                                x: Math.min(r, P),
                                y: Math.min(j, aa),
                                width: Math.abs(P - r),
                                height: Math.abs(aa - j),
                                factor: S.shiftKey ? 0.5 : 2
                            });
                            return;
                        case "fhpath":
                            z = 0;
                            B = {
                                x: 0,
                                y: 0
                            };
                            G = {
                                x: 0,
                                y: 0
                            };
                            K = {
                                x: 0,
                                y: 0
                            };
                            C = {
                                x: 0,
                                y: 0
                            };
                            M = ha.getAttribute("points");
                            P = M.indexOf(",");
                            if (pa = P >= 0 ? M.indexOf(",", P + 1) >= 0 : M.indexOf(" ", M.indexOf(" ") + 1) >= 0) ha = ra.smoothPolylineIntoPath(ha);
                            break;
                        case "line":
                            M = $(ha).attr(["x1", "x2", "y1", "y2"]);
                            pa = M.x1 != M.x2 || M.y1 != M.y2;
                            break;
                        case "foreignObject":
                        case "square":
                        case "rect":
                        case "image":
                            M = $(ha).attr(["width", "height"]);
                            pa = M.width != 0 || M.height != 0 || ua === "image";
                            break;
                        case "circle":
                            pa = ha.getAttribute("r") != 0;
                            break;
                        case "ellipse":
                            M = $(ha).attr(["rx", "ry"]);
                            pa = M.rx != null || M.ry != null;
                            break;
                        case "fhellipse":
                            if (n.maxx - n.minx > 0 && n.maxy - n.miny > 0) {
                                ha = L({
                                    element: "ellipse",
                                    curStyles: true,
                                    attr: {
                                        cx: (n.minx + n.maxx) / 2,
                                        cy: (n.miny + n.maxy) / 2,
                                        rx: (n.maxx - n.minx) / 2,
                                        ry: (n.maxy - n.miny) / 2,
                                        id: Ya()
                                    }
                                });
                                ma("changed", [ha]);
                                pa = true
                            }
                            break;
                        case "fhrect":
                            if (n.maxx - n.minx > 0 && n.maxy - n.miny > 0) {
                                ha = L({
                                    element: "rect",
                                    curStyles: true,
                                    attr: {
                                        x: n.minx,
                                        y: n.miny,
                                        width: n.maxx - n.minx,
                                        height: n.maxy - n.miny,
                                        id: Ya()
                                    }
                                });
                                ma("changed", [ha]);
                                pa = true
                            }
                            break;
                        case "text":
                            pa = true;
                            Za([ha]);
                            La.start(ha);
                            break;
                        case "path":
                            ha = null;
                            ya = true;
                            M = ra.mouseUp(S, ha, N, J);
                            ha = M.element;
                            pa = M.keep;
                            break;
                        case "pathedit":
                            pa = true;
                            ha = null;
                            ra.mouseUp(S);
                            break;
                        case "textedit":
                            pa = false;
                            ha = null;
                            La.mouseUp(S, N, J);
                            break;
                        case "rotate":
                            pa = true;
                            ha = null;
                            ua = "select";
                            M = e.undoMgr.finishUndoableChange();
                            M.isEmpty() || Y(M);
                            Qb();
                            ma("changed", m)
                    }
                    N = nb("mouseUp", {
                        event: S,
                        mouse_x: N,
                        mouse_y: J
                    }, true);
                    $.each(N, function(wa, Da) {
                        if (Da) {
                            pa = Da.keep || pa;
                            ha = Da.element;
                            ya = Da.started || ya
                        }
                    });
                    if (!pa && ha != null) {
                        u().releaseId(Ya());
                        ha.parentNode.removeChild(ha);
                        ha = null;
                        for (N = S.target; N.parentNode.parentNode.tagName == "g";) N = N.parentNode;
                        if ((ua != "path" || !drawn_path) && N.parentNode.id != "selectorParentGroup" && N.id != "svgcanvas" && N.id != "svgroot") {
                            e.setMode("select");
                            Za([N], true)
                        }
                    } else if (ha != null) {
                        e.addedNew = true;
                        S = 0.2;
                        var Aa;
                        if (ub.beginElement && ha.getAttribute("opacity") != t.opacity) {
                            Aa = $(ub).clone().attr({
                                to: t.opacity,
                                dur: S
                            }).appendTo(ha);
                            try {
                                Aa[0].beginElement()
                            } catch (ba) {}
                        } else S =
                            0;
                        setTimeout(function() {
                            Aa && Aa.remove();
                            ha.setAttribute("opacity", t.opacity);
                            ha.setAttribute("style", "pointer-events:inherit");
                            ta(ha);
                            if (ua === "path") ra.toEditMode(ha);
                            else i.selectNew && Za([ha], true);
                            Y(new svgedit.history.InsertElementCommand(ha));
                            ma("changed", [ha])
                        }, S * 1E3)
                    }
                    lb = null
                }
            }
        });
        $(a).bind("mousewheel DOMMouseScroll", function(S) {
            S.preventDefault();
            S = S.originalEvent;
            fb = $("#svgcontent g")[0].getScreenCTM().inverse();
            var M = svgedit.math.transformPoint(S.pageX, S.pageY, fb);
            M = {
                x: M.x,
                y: M.y,
                width: 0,
                height: 0
            };
            if (S = S.wheelDelta ? S.wheelDelta : S.detail ? -S.detail : 0) {
                M.factor = Math.max(0.75, Math.min(4 / 3, S));
                ma("zoomed", M)
            }
        })
    })();
    var wb = function(b) {
        $(b).click(function(f) {
            f.preventDefault()
        })
    };
    La = e.textActions = function() {
        function b(J) {
            var N = G.value === "";
            $(G).focus();
            if (!arguments.length)
                if (N) J = 0;
                else {
                    if (G.selectionEnd !== G.selectionStart) return;
                    J = G.selectionEnd
                }
            var P;
            P = T[J];
            N || G.setSelectionRange(J, J);
            K = svgedit.utilities.getElem("text_cursor");
            if (!K) {
                K = document.createElementNS(c.SVG, "line");
                svgedit.utilities.assignAttributes(K, {
                    id: "text_cursor",
                    stroke: "#333",
                    "stroke-width": 1
                });
                K = svgedit.utilities.getElem("selectorParentGroup").appendChild(K)
            }
            O || (O = setInterval(function() {
                var aa = K.getAttribute("display") === "none";
                K.setAttribute("display", aa ? "inline" : "none")
            }, 600));
            N = E(P.x, V.y);
            P = E(P.x, V.y + V.height);
            svgedit.utilities.assignAttributes(K, {
                x1: N.x,
                y1: N.y,
                x2: P.x,
                y2: P.y,
                visibility: "visible",
                display: "inline"
            });
            C && C.setAttribute("d", "")
        }

        function f(J, N, P) {
            if (J === N) b(N);
            else {
                P || G.setSelectionRange(J, N);
                C = svgedit.utilities.getElem("text_selectblock");
                if (!C) {
                    C = document.createElementNS(c.SVG, "path");
                    svgedit.utilities.assignAttributes(C, {
                        id: "text_selectblock",
                        fill: "green",
                        opacity: 0.5,
                        style: "pointer-events:none"
                    });
                    svgedit.utilities.getElem("selectorParentGroup").appendChild(C)
                }
                J = T[J];
                var aa = T[N];
                K.setAttribute("visibility", "hidden");
                N = E(J.x, V.y);
                P = E(J.x + (aa.x - J.x), V.y);
                var ha = E(J.x, V.y + V.height);
                J = E(J.x + (aa.x - J.x), V.y + V.height);
                svgedit.utilities.assignAttributes(C, {
                    d: "M" + N.x + "," + N.y + " L" + P.x + "," + P.y + " " + J.x + "," + J.y + " " + ha.x + "," + ha.y + "z",
                    display: "inline"
                })
            }
        }

        function d(J, N) {
            var P = q.createSVGPoint();
            P.x = J;
            P.y = N;
            if (T.length == 1) return 0;
            P = B.getCharNumAtPosition(P);
            if (P < 0) {
                P = T.length - 2;
                if (J <= T[0].x) P = 0
            } else if (P >= T.length - 2) P = T.length - 2;
            var aa = T[P];
            J > aa.x + aa.width / 2 && P++;
            return P
        }

        function r(J, N, P) {
            var aa = G.selectionStart;
            J = d(J, N);
            f(Math.min(aa, J), Math.max(aa, J), !P)
        }

        function j(J, N) {
            var P = {
                x: J,
                y: N
            };
            P.x /= A;
            P.y /= A;
            if (X) {
                var aa = svgedit.math.transformPoint(P.x, P.y, X.inverse());
                P.x = aa.x;
                P.y = aa.y
            }
            return P
        }

        function E(J, N) {
            var P = {
                x: J,
                y: N
            };
            if (X) {
                var aa = svgedit.math.transformPoint(P.x,
                    P.y, X);
                P.x = aa.x;
                P.y = aa.y
            }
            P.x *= A;
            P.y *= A;
            return P
        }

        function n(J) {
            f(0, B.textContent.length);
            $(this).unbind(J)
        }

        function z(J) {
            if (M && B) {
                var N = svgedit.math.transformPoint(J.pageX, J.pageY, fb);
                N = j(N.x * A, N.y * A);
                N = d(N.x, N.y);
                var P = B.textContent,
                    aa = P.substr(0, N).replace(/[a-z0-9]+$/i, "").length;
                P = P.substr(N).match(/^[a-z0-9]+/i);
                f(aa, (P ? P[0].length : 0) + N);
                $(J.target).click(n);
                setTimeout(function() {
                    $(J.target).unbind("click", n)
                }, 300)
            }
        }
        var B, G, K, C, O, T = [],
            V, X, ca, S, M;
        return {
            select: function(J, N, P) {
                B = J;
                La.toEditMode(N,
                    P)
            },
            start: function(J) {
                B = J;
                La.toEditMode()
            },
            mouseDown: function(J, N, P, aa) {
                J = j(P, aa);
                G.focus();
                b(d(J.x, J.y));
                ca = P;
                S = aa
            },
            mouseMove: function(J, N) {
                var P = j(J, N);
                r(P.x, P.y)
            },
            mouseUp: function(J, N, P) {
                var aa = j(N, P);
                r(aa.x, aa.y, true);
                J.target !== B && N < ca + 2 && N > ca - 2 && P < S + 2 && P > S - 2 && La.toSelectMode(true)
            },
            setCursor: b,
            toEditMode: function(J, N) {
                M = false;
                ua = "textedit";
                va.requestSelector(B).showGrips(false);
                va.requestSelector(B);
                La.init();
                $(B).css("cursor", "text");
                if (arguments.length) {
                    var P = j(J, N);
                    b(d(P.x, P.y))
                } else b();
                setTimeout(function() {
                    M = true
                }, 300)
            },
            toSelectMode: function(J) {
                ua = "select";
                clearInterval(O);
                O = null;
                C && $(C).attr("display", "none");
                K && $(K).attr("visibility", "hidden");
                $(B).css("cursor", "move");
                if (J) {
                    za();
                    $(B).css("cursor", "move");
                    ma("selected", [B]);
                    gb([B], true)
                }
                B && !B.textContent.length && e.deleteSelectedElements();
                $(G).blur();
                B = false
            },
            setInputElem: function(J) {
                G = J
            },
            clear: function() {
                ua == "textedit" && La.toSelectMode()
            },
            init: function() {
                if (B) {
                    var J, N;
                    if (!B.parentNode) {
                        B = m[0];
                        va.requestSelector(B).showGrips(false)
                    }
                    var P =
                        B.textContent.length;
                    J = B.getAttribute("transform");
                    V = svgedit.utilities.getBBox(B);
                    X = J ? svgedit.math.getMatrix(B) : null;
                    T = Array(P);
                    G.focus();
                    $(B).unbind("dblclick", z).dblclick(z);
                    P || (N = {
                        x: V.x + V.width / 2,
                        width: 0
                    });
                    for (J = 0; J < P; J++) {
                        var aa = B.getStartPositionOfChar(J);
                        N = B.getEndPositionOfChar(J);
                        if (!svgedit.browser.supportsGoodTextCharPos()) {
                            var ha = e.contentW * A;
                            aa.x -= ha;
                            N.x -= ha;
                            aa.x /= A;
                            N.x /= A
                        }
                        T[J] = {
                            x: aa.x,
                            y: V.y,
                            width: N.x - aa.x,
                            height: V.height
                        }
                    }
                    T.push({
                        x: N.x,
                        width: 0
                    });
                    f(G.selectionStart, G.selectionEnd, true)
                }
            }
        }
    }();
    ra = e.pathActions = function() {
        var b = false,
            f, d, r;
        svgedit.path.Path.prototype.endChanges = function(n) {
            if (svgedit.browser.isWebkit()) {
                var z = this.elem;
                z.setAttribute("d", ra.convertPath(z))
            }
            n = new svgedit.history.ChangeElementCommand(this.elem, {
                d: this.last_d
            }, n);
            Y(n);
            ma("changed", [this.elem])
        };
        svgedit.path.Path.prototype.addPtsToSelection = function(n) {
            var z, B;
            $.isArray(n) || (n = [n]);
            for (z = 0; z < n.length; z++) {
                var G = n[z];
                B = this.segs[G];
                B.ptgrip && this.selected_pts.indexOf(G) == -1 && G >= 0 && this.selected_pts.push(G)
            }
            this.selected_pts.sort();
            z = this.selected_pts.length;
            for (n = Array(z); z--;) {
                B = this.segs[this.selected_pts[z]];
                B.select(true);
                n[z] = B.ptgrip
            }
            ra.canDeleteNodes = true;
            ra.closed_subpath = this.subpathIsClosed(this.selected_pts[0]);
            ma("selected", n)
        };
        var j = f = null,
            E = false;
        return {
            mouseDown: function(n, z, B, G) {
                var K;
                if (ua === "path") {
                    mouse_x = B;
                    mouse_y = G;
                    G = mouse_x / A;
                    z = mouse_y / A;
                    B = svgedit.utilities.getElem("path_stretch_line");
                    d = [G, z];
                    if (i.gridSnapping) {
                        G = svgedit.utilities.snapToGrid(G);
                        z = svgedit.utilities.snapToGrid(z);
                        mouse_x = svgedit.utilities.snapToGrid(mouse_x);
                        mouse_y = svgedit.utilities.snapToGrid(mouse_y)
                    }
                    if (!B) {
                        B = document.createElementNS(c.SVG, "path");
                        svgedit.utilities.assignAttributes(B, {
                            id: "path_stretch_line",
                            stroke: "#22C",
                            "stroke-width": "0.5",
                            fill: "none"
                        });
                        B = svgedit.utilities.getElem("selectorParentGroup").appendChild(B)
                    }
                    B.setAttribute("display", "inline");
                    var C = null;
                    if (j) {
                        C = j.pathSegList;
                        var O = C.numberOfItems;
                        K = 6 / A;
                        for (var T = false; O;) {
                            O--;
                            var V = C.getItem(O),
                                X = V.x;
                            V = V.y;
                            if (G >= X - K && G <= X + K && z >= V - K && z <= V + K) {
                                T = true;
                                break
                            }
                        }
                        K = Ya();
                        svgedit.path.removePath_(K);
                        K = svgedit.utilities.getElem(K);
                        X = C.numberOfItems;
                        if (T) {
                            if (O <= 1 && X >= 2) {
                                G = C.getItem(0).x;
                                z = C.getItem(0).y;
                                n = B.pathSegList.getItem(1);
                                n = n.pathSegType === 4 ? j.createSVGPathSegLinetoAbs(G, z) : j.createSVGPathSegCurvetoCubicAbs(G, z, n.x1 / A, n.y1 / A, G, z);
                                G = j.createSVGPathSegClosePath();
                                C.appendItem(n);
                                C.appendItem(G)
                            } else if (X < 3) return C = false;
                            $(B).remove();
                            element = K;
                            j = null;
                            ya = false;
                            if (b) {
                                svgedit.path.path.matrix && svgedit.coords.remapElement(K, {}, svgedit.path.path.matrix.inverse());
                                B = K.getAttribute("d");
                                n = $(svgedit.path.path.elem).attr("d");
                                $(svgedit.path.path.elem).attr("d", n + B);
                                $(K).remove();
                                svgedit.path.path.matrix && svgedit.path.recalcRotatedPath();
                                svgedit.path.path.init();
                                ra.toEditMode(svgedit.path.path.elem);
                                svgedit.path.path.selectPt();
                                return false
                            }
                        } else {
                            if (!$.contains(a, Ib(n))) {
                                console.log("Clicked outside canvas");
                                return false
                            }
                            C = j.pathSegList.numberOfItems;
                            O = j.pathSegList.getItem(C - 1);
                            K = O.x;
                            O = O.y;
                            if (n.shiftKey) {
                                n = svgedit.math.snapToAngle(K, O, G, z);
                                G = n.x;
                                z = n.y
                            }
                            n = B.pathSegList.getItem(1);
                            n = n.pathSegType === 4 ? j.createSVGPathSegLinetoAbs(Gb(G),
                                Gb(z)) : j.createSVGPathSegCurvetoCubicAbs(Gb(G), Gb(z), n.x1 / A, n.y1 / A, n.x2 / A, n.y2 / A);
                            j.pathSegList.appendItem(n);
                            G *= A;
                            z *= A;
                            B.setAttribute("d", ["M", G, z, G, z].join(" "));
                            B = C;
                            if (b) B += svgedit.path.path.segs.length;
                            svgedit.path.addPointGrip(B, G, z)
                        }
                    } else {
                        d_attr = "M" + G + "," + z + " ";
                        j = L({
                            element: "path",
                            curStyles: true,
                            attr: {
                                d: d_attr,
                                id: Ga(),
                                opacity: t.opacity / 2
                            }
                        });
                        B.setAttribute("d", ["M", mouse_x, mouse_y, mouse_x, mouse_y].join(" "));
                        B = b ? svgedit.path.path.segs.length : 0;
                        svgedit.path.addPointGrip(B, mouse_x, mouse_y)
                    }
                } else if (svgedit.path.path) {
                    svgedit.path.path.storeD();
                    K = n.target.id;
                    if (K.substr(0, 14) == "pathpointgrip_") {
                        z = svgedit.path.path.cur_pt = parseInt(K.substr(14));
                        svgedit.path.path.dragging = [B, G];
                        C = svgedit.path.path.segs[z];
                        if (n.shiftKey) C.selected ? svgedit.path.path.removePtFromSelection(z) : svgedit.path.path.addPtsToSelection(z);
                        else {
                            if (svgedit.path.path.selected_pts.length <= 1 || !C.selected) svgedit.path.path.clearSelection();
                            svgedit.path.path.addPtsToSelection(z)
                        }
                    } else if (K.indexOf("ctrlpointgrip_") == 0) {
                        svgedit.path.path.dragging = [B, G];
                        n = K.split("_")[1].split("c");
                        z = Number(n[0]);
                        svgedit.path.path.selectPt(z, Number(n[1]))
                    }
                    if (!svgedit.path.path.dragging) {
                        if (Ca == null) Ca = va.getRubberBandBox();
                        svgedit.utilities.assignAttributes(Ca, {
                            x: B * A,
                            y: G * A,
                            width: 0,
                            height: 0,
                            display: "inline"
                        }, 100)
                    }
                }
            },
            mouseMove: function(n, z) {
                E = true;
                if (ua === "path") {
                    if (j) {
                        var B = j.pathSegList,
                            G = B.numberOfItems - 1;
                        if (d) {
                            var K = svgedit.path.addCtrlGrip("1c1"),
                                C = svgedit.path.addCtrlGrip("0c2");
                            K.setAttribute("cx", n);
                            K.setAttribute("cy", z);
                            K.setAttribute("display", "inline");
                            K = d[0];
                            var O = d[1];
                            B.getItem(G);
                            var T = K + (K - n / A),
                                V = O + (O - z / A);
                            C.setAttribute("cx", T * A);
                            C.setAttribute("cy", V * A);
                            C.setAttribute("display", "inline");
                            C = svgedit.path.getCtrlLine(1);
                            svgedit.utilities.assignAttributes(C, {
                                x1: n,
                                y1: z,
                                x2: T * A,
                                y2: V * A,
                                display: "inline"
                            });
                            if (G === 0) r = [n, z];
                            else {
                                B = B.getItem(G - 1);
                                C = B.x;
                                var X = B.y;
                                if (B.pathSegType === 6) {
                                    C += C - B.x2;
                                    X += X - B.y2
                                } else if (r) {
                                    C = r[0] / A;
                                    X = r[1] / A
                                }
                                svgedit.path.replacePathSeg(6, G, [K, O, C, X, T, V], j)
                            }
                        } else if (K = svgedit.utilities.getElem("path_stretch_line")) {
                            G = B.getItem(G);
                            if (G.pathSegType === 6) svgedit.path.replacePathSeg(6,
                                1, [n, z, (G.x + (G.x - G.x2)) * A, (G.y + (G.y - G.y2)) * A, n, z], K);
                            else r ? svgedit.path.replacePathSeg(6, 1, [n, z, r[0], r[1], n, z], K) : svgedit.path.replacePathSeg(4, 1, [n, z], K)
                        }
                    }
                } else if (svgedit.path.path.dragging) {
                    K = svgedit.path.getPointFromGrip({
                        x: svgedit.path.path.dragging[0],
                        y: svgedit.path.path.dragging[1]
                    }, svgedit.path.path);
                    O = svgedit.path.getPointFromGrip({
                        x: n,
                        y: z
                    }, svgedit.path.path);
                    G = O.x - K.x;
                    K = O.y - K.y;
                    svgedit.path.path.dragging = [n, z];
                    svgedit.path.path.dragctrl ? svgedit.path.path.moveCtrl(G, K) : svgedit.path.path.movePts(G,
                        K)
                } else {
                    svgedit.path.path.selected_pts = [];
                    svgedit.path.path.eachSeg(function() {
                        if (this.next || this.prev) {
                            var ca = Ca.getBBox(),
                                S = svgedit.path.getGripPt(this);
                            ca = svgedit.math.rectsIntersect(ca, {
                                x: S.x,
                                y: S.y,
                                width: 0,
                                height: 0
                            });
                            this.select(ca);
                            ca && svgedit.path.path.selected_pts.push(this.index)
                        }
                    })
                }
            },
            mouseUp: function(n, z) {
                if (ua === "path") {
                    d = null;
                    if (!j) {
                        z = svgedit.utilities.getElem(Ya());
                        ya = false;
                        r = null
                    }
                    return {
                        keep: true,
                        element: z
                    }
                }
                if (svgedit.path.path.dragging) {
                    var B = svgedit.path.path.cur_pt;
                    svgedit.path.path.dragging =
                        false;
                    svgedit.path.path.dragctrl = false;
                    svgedit.path.path.update();
                    E && svgedit.path.path.endChanges("Move path point(s)");
                    !n.shiftKey && !E && svgedit.path.path.selectPt(B)
                } else if (Ca && Ca.getAttribute("display") != "none") {
                    Ca.setAttribute("display", "none");
                    Ca.getAttribute("width") <= 2 && Ca.getAttribute("height") <= 2 && ra.toSelectMode(n.target)
                } else ra.toSelectMode(n.target);
                E = false
            },
            toEditMode: function(n) {
                svgedit.path.path = svgedit.path.getPath_(n);
                ua = "pathedit";
                za();
                svgedit.path.path.show(true).update();
                svgedit.path.path.oldbbox =
                    svgedit.utilities.getBBox(svgedit.path.path.elem);
                b = false
            },
            toSelectMode: function(n) {
                var z = n == svgedit.path.path.elem;
                ua = "select";
                svgedit.path.path.show(false);
                f = false;
                za();
                svgedit.path.path.matrix && svgedit.path.recalcRotatedPath();
                if (z) {
                    ma("selected", [n]);
                    gb([n], true)
                }
            },
            addSubPath: function(n) {
                if (n) {
                    ua = "path";
                    b = true
                } else {
                    ra.clear(true);
                    ra.toEditMode(svgedit.path.path.elem)
                }
            },
            select: function(n) {
                if (f === n) {
                    ra.toEditMode(n);
                    ua = "pathedit"
                } else f = n
            },
            reorient: function() {
                var n = m[0];
                if (n)
                    if (svgedit.utilities.getRotationAngle(n) !=
                        0) {
                        var z = new svgedit.history.BatchCommand("Reorient path"),
                            B = {
                                d: n.getAttribute("d"),
                                transform: n.getAttribute("transform")
                            };
                        z.addSubCommand(new svgedit.history.ChangeElementCommand(n, B));
                        za();
                        this.resetOrientation(n);
                        Y(z);
                        svgedit.path.getPath_(n).show(false).matrix = null;
                        this.clear();
                        gb([n], true);
                        ma("changed", m)
                    }
            },
            clear: function() {
                f = null;
                if (j) {
                    var n = svgedit.utilities.getElem(Ya());
                    $(svgedit.utilities.getElem("path_stretch_line")).remove();
                    $(n).remove();
                    $(svgedit.utilities.getElem("pathpointgrip_container")).find("*").attr("display",
                        "none");
                    j = r = null;
                    ya = false
                } else ua == "pathedit" && this.toSelectMode();
                svgedit.path.path && svgedit.path.path.init().show(false)
            },
            resetOrientation: function(n) {
                if (n == null || n.nodeName != "path") return false;
                var z = svgedit.transformlist.getTransformList(n),
                    B = svgedit.math.transformListToTransform(z).matrix;
                z.clear();
                n.removeAttribute("transform");
                z = n.pathSegList;
                var G = z.numberOfItems,
                    K;
                for (K = 0; K < G; ++K) {
                    var C = z.getItem(K),
                        O = C.pathSegType;
                    if (O != 1) {
                        var T = [];
                        $.each(["", 1, 2], function(V, X) {
                            var ca = C["x" + X],
                                S = C["y" + X];
                            if (ca !== undefined && S !== undefined) {
                                ca = svgedit.math.transformPoint(ca, S, B);
                                T.splice(T.length, 0, ca.x, ca.y)
                            }
                        });
                        svgedit.path.replacePathSeg(O, K, T, n)
                    }
                }
                o(n, B)
            },
            zoomChange: function() {
                ua == "pathedit" && svgedit.path.path.update()
            },
            getNodePoint: function() {
                var n = svgedit.path.path.segs[svgedit.path.path.selected_pts.length ? svgedit.path.path.selected_pts[0] : 1];
                return {
                    x: n.item.x,
                    y: n.item.y,
                    type: n.type
                }
            },
            linkControlPoints: function(n) {
                svgedit.path.setLinkControlPoints(n)
            },
            clonePathNode: function() {
                svgedit.path.path.storeD();
                for (var n = svgedit.path.path.selected_pts, z = n.length, B = []; z--;) {
                    var G = n[z];
                    svgedit.path.path.addSeg(G);
                    B.push(G + z);
                    B.push(G + z + 1)
                }
                svgedit.path.path.init().addPtsToSelection(B);
                svgedit.path.path.endChanges("Clone path node(s)")
            },
            opencloseSubPath: function() {
                var n = svgedit.path.path.selected_pts;
                if (n.length === 1) {
                    var z = svgedit.path.path.elem,
                        B = z.pathSegList,
                        G = n[0],
                        K = null,
                        C = null;
                    svgedit.path.path.eachSeg(function(X) {
                        if (this.type === 2 && X <= G) C = this.item;
                        if (X <= G) return true;
                        if (this.type === 2) {
                            K = X;
                            return false
                        }
                        if (this.type ===
                            1) return K = false
                    });
                    if (K == null) K = svgedit.path.path.segs.length - 1;
                    if (K !== false) {
                        var O = z.createSVGPathSegLinetoAbs(C.x, C.y),
                            T = z.createSVGPathSegClosePath();
                        if (K == svgedit.path.path.segs.length - 1) {
                            B.appendItem(O);
                            B.appendItem(T)
                        } else {
                            svgedit.path.insertItemBefore(z, T, K);
                            svgedit.path.insertItemBefore(z, O, K)
                        }
                        svgedit.path.path.init().selectPt(K + 1)
                    } else if (svgedit.path.path.segs[G].mate) {
                        B.removeItem(G);
                        B.removeItem(G);
                        svgedit.path.path.init().selectPt(G - 1)
                    } else {
                        for (n = 0; n < B.numberOfItems; n++) {
                            var V = B.getItem(n);
                            if (V.pathSegType === 2) O = n;
                            else if (n === G) B.removeItem(O);
                            else if (V.pathSegType === 1 && G < n) {
                                T = n - 1;
                                B.removeItem(n);
                                break
                            }
                        }
                        for (n = G - O - 1; n--;) svgedit.path.insertItemBefore(z, B.getItem(O), T);
                        z = B.getItem(O);
                        svgedit.path.replacePathSeg(2, O, [z.x, z.y]);
                        n = G;
                        svgedit.path.path.init().selectPt(0)
                    }
                }
            },
            deletePathNode: function() {
                if (ra.canDeleteNodes) {
                    svgedit.path.path.storeD();
                    for (var n = svgedit.path.path.selected_pts, z = n.length; z--;) svgedit.path.path.deleteSeg(n[z]);
                    var B = function() {
                        var G = svgedit.path.path.elem.pathSegList,
                            K = G.numberOfItems,
                            C = function(V, X) {
                                for (; X--;) G.removeItem(V)
                            };
                        if (K <= 1) return true;
                        for (; K--;) {
                            var O = G.getItem(K);
                            if (O.pathSegType === 1) {
                                O = G.getItem(K - 1);
                                var T = G.getItem(K - 2);
                                if (O.pathSegType === 2) {
                                    C(K - 1, 2);
                                    B();
                                    break
                                } else if (T.pathSegType === 2) {
                                    C(K - 2, 3);
                                    B();
                                    break
                                }
                            } else if (O.pathSegType === 2)
                                if (K > 0) {
                                    O = G.getItem(K - 1).pathSegType;
                                    if (O === 2) {
                                        C(K - 1, 1);
                                        B();
                                        break
                                    } else if (O === 1 && G.numberOfItems - 1 === K) {
                                        C(K, 1);
                                        B();
                                        break
                                    }
                                }
                        }
                        return false
                    };
                    B();
                    if (svgedit.path.path.elem.pathSegList.numberOfItems <= 1) {
                        ra.toSelectMode(svgedit.path.path.elem);
                        e.deleteSelectedElements()
                    } else {
                        svgedit.path.path.init();
                        svgedit.path.path.clearSelection();
                        if (window.opera) {
                            n = $(svgedit.path.path.elem);
                            n.attr("d", n.attr("d"))
                        }
                        svgedit.path.path.endChanges("Delete path node(s)")
                    }
                }
            },
            smoothPolylineIntoPath: function(n) {
                var z = n.points,
                    B = z.numberOfItems;
                if (B >= 4) {
                    var G = z.getItem(0),
                        K = null,
                        C = [];
                    C.push(["M", G.x, ",", G.y, " C"].join(""));
                    for (n = 1; n <= B - 4; n += 3) {
                        var O = z.getItem(n),
                            T = z.getItem(n + 1),
                            V = z.getItem(n + 2);
                        if (K)
                            if ((G = svgedit.path.smoothControlPoints(K, O, G)) && G.length ==
                                2) {
                                O = C[C.length - 1].split(",");
                                O[2] = G[0].x;
                                O[3] = G[0].y;
                                C[C.length - 1] = O.join(",");
                                O = G[1]
                            }
                        C.push([O.x, O.y, T.x, T.y, V.x, V.y].join(","));
                        G = V;
                        K = T
                    }
                    for (C.push("L"); n < B;) {
                        T = z.getItem(n);
                        C.push([T.x, T.y].join(","));
                        n++
                    }
                    C = C.join(" ");
                    n = L({
                        element: "path",
                        curStyles: true,
                        attr: {
                            id: Ya(),
                            d: C,
                            fill: "none"
                        }
                    })
                }
                return n
            },
            setSegType: function(n) {
                svgedit.path.path.setSegType(n)
            },
            moveNode: function(n, z) {
                var B = svgedit.path.path.selected_pts;
                if (B.length) {
                    svgedit.path.path.storeD();
                    B = svgedit.path.path.segs[B[0]];
                    var G = {
                        x: 0,
                        y: 0
                    };
                    G[n] = z - B.item[n];
                    B.move(G.x, G.y);
                    svgedit.path.path.endChanges("Move path point")
                }
            },
            fixEnd: function(n) {
                var z = n.pathSegList,
                    B = z.numberOfItems,
                    G, K;
                for (G = 0; G < B; ++G) {
                    var C = z.getItem(G);
                    if (C.pathSegType === 2) K = C;
                    if (C.pathSegType === 1) {
                        C = z.getItem(G - 1);
                        if (C.x != K.x || C.y != K.y) {
                            z = n.createSVGPathSegLinetoAbs(K.x, K.y);
                            svgedit.path.insertItemBefore(n, z, G);
                            ra.fixEnd(n);
                            break
                        }
                    }
                }
                svgedit.browser.isWebkit() && n.setAttribute("d", ra.convertPath(n))
            },
            convertPath: function(n, z) {
                var B, G = n.pathSegList,
                    K = G.numberOfItems,
                    C = 0,
                    O = 0,
                    T = "",
                    V = null;
                for (B = 0; B < K; ++B) {
                    var X = G.getItem(B),
                        ca = X.x || 0,
                        S = X.y || 0,
                        M = X.x1 || 0,
                        J = X.y1 || 0,
                        N = X.x2 || 0,
                        P = X.y2 || 0,
                        aa = X.pathSegType,
                        ha = gc[aa]["to" + (z ? "Lower" : "Upper") + "Case"](),
                        pa = function(Aa, ba, wa) {
                            ba = ba ? " " + ba.join(" ") : "";
                            wa = wa ? " " + svgedit.units.shortFloat(wa) : "";
                            $.each(Aa, function(Da, $a) {
                                Aa[Da] = svgedit.units.shortFloat($a)
                            });
                            T += ha + Aa.join(" ") + ba + wa
                        };
                    switch (aa) {
                        case 1:
                            T += "z";
                            break;
                        case 12:
                            ca -= C;
                        case 13:
                            if (z) {
                                C += ca;
                                ha = "l"
                            } else {
                                ca += C;
                                C = ca;
                                ha = "L"
                            }
                            pa([
                                [ca, O]
                            ]);
                            break;
                        case 14:
                            S -= O;
                        case 15:
                            if (z) {
                                O += S;
                                ha =
                                    "l"
                            } else {
                                S += O;
                                O = S;
                                ha = "L"
                            }
                            pa([
                                [C, S]
                            ]);
                            break;
                        case 2:
                        case 4:
                        case 18:
                            ca -= C;
                            S -= O;
                        case 5:
                        case 3:
                            if (V && G.getItem(B - 1).pathSegType === 1 && !z) {
                                C = V[0];
                                O = V[1]
                            }
                        case 19:
                            if (z) {
                                C += ca;
                                O += S
                            } else {
                                ca += C;
                                S += O;
                                C = ca;
                                O = S
                            } if (aa === 3) V = [C, O];
                            pa([
                                [ca, S]
                            ]);
                            break;
                        case 6:
                            ca -= C;
                            M -= C;
                            N -= C;
                            S -= O;
                            J -= O;
                            P -= O;
                        case 7:
                            if (z) {
                                C += ca;
                                O += S
                            } else {
                                ca += C;
                                M += C;
                                N += C;
                                S += O;
                                J += O;
                                P += O;
                                C = ca;
                                O = S
                            }
                            pa([
                                [M, J],
                                [N, P],
                                [ca, S]
                            ]);
                            break;
                        case 8:
                            ca -= C;
                            M -= C;
                            S -= O;
                            J -= O;
                        case 9:
                            if (z) {
                                C += ca;
                                O += S
                            } else {
                                ca += C;
                                M += C;
                                S += O;
                                J += O;
                                C = ca;
                                O = S
                            }
                            pa([
                                [M, J],
                                [ca, S]
                            ]);
                            break;
                        case 10:
                            ca -= C;
                            S -= O;
                        case 11:
                            if (z) {
                                C += ca;
                                O += S
                            } else {
                                ca += C;
                                S += O;
                                C = ca;
                                O = S
                            }
                            pa([
                                [X.r1, X.r2]
                            ], [X.angle, X.largeArcFlag ? 1 : 0, X.sweepFlag ? 1 : 0], [ca, S]);
                            break;
                        case 16:
                            ca -= C;
                            N -= C;
                            S -= O;
                            P -= O;
                        case 17:
                            if (z) {
                                C += ca;
                                O += S
                            } else {
                                ca += C;
                                N += C;
                                S += O;
                                P += O;
                                C = ca;
                                O = S
                            }
                            pa([
                                [N, P],
                                [ca, S]
                            ])
                    }
                }
                return T
            }
        }
    }();
    var Tb = this.removeUnusedDefElems = function() {
        var b = w.getElementsByTagNameNS(c.SVG, "defs");
        if (!b || !b.length) return 0;
        var f = [],
            d = 0,
            r = ["fill", "stroke", "filter", "marker-start", "marker-mid", "marker-end"],
            j = r.length,
            E = w.getElementsByTagNameNS(c.SVG, "*"),
            n = E.length,
            z, B;
        for (z = 0; z < n; z++) {
            var G = E[z];
            for (B = 0; B < j; B++) {
                var K = svgedit.utilities.getUrlFromAttr(G.getAttribute(r[B]));
                K && f.push(K.substr(1))
            }(B = Ia(G)) && B.indexOf("#") === 0 && f.push(B.substr(1))
        }
        b = $(b).find("linearGradient, radialGradient, filter, marker, svg, symbol");
        for (z = b.length; z--;) {
            r = b[z];
            j = r.id;
            if (f.indexOf(j) < 0) {
                Eb[j] = r;
                r.parentNode.removeChild(r);
                d++
            }
        }
        return d
    };
    this.svgCanvasToString = function() {
        for (; Tb() > 0;);
        ra.clear(true);
        $.each(w.childNodes, function(d, r) {
            d && r.nodeType === 8 && r.data.indexOf("Created with") >=
                0 && w.insertBefore(r, w.firstChild)
        });
        if (p) {
            Sb();
            Za([p])
        }
        var b = [];
        $(w).find("g:data(gsvg)").each(function() {
            var d = this.attributes,
                r = d.length,
                j;
            for (j = 0; j < r; j++)
                if (d[j].nodeName == "id" || d[j].nodeName == "style") r--;
            if (r <= 0) {
                d = this.firstChild;
                b.push(d);
                $(this).replaceWith(d)
            }
        });
        var f = this.svgToString(w, 0);
        b.length && $(b).each(function() {
            Pb(this)
        });
        return f
    };
    this.svgToString = function(b, f) {
        var d = [],
            r = svgedit.utilities.toXml,
            j = i.baseUnit,
            E = RegExp("^-?[\\d\\.]+" + j + "$");
        if (b) {
            ta(b);
            var n = b.attributes,
                z, B, G = b.childNodes;
            for (B = 0; B < f; B++) d.push(" ");
            d.push("<");
            d.push(b.nodeName);
            if (b.id === "svgcontent") {
                B = xb();
                if (j !== "px") {
                    B.w = svgedit.units.convertUnit(B.w, j) + j;
                    B.h = svgedit.units.convertUnit(B.h, j) + j
                }
                d.push(' width="' + B.w + '" height="' + B.h + '" xmlns="' + c.SVG + '"');
                var K = {};
                $(b).find("*").andSelf().each(function() {
                    var V = this.namespaceURI;
                    if (V && !K[V] && ab[V] && ab[V] !== "xmlns" && ab[V] !== "xml") {
                        K[V] = true;
                        d.push(" xmlns:" + ab[V] + '="' + V + '"')
                    }
                    $.each(this.attributes, function(X, ca) {
                        var S = ca.namespaceURI;
                        if (S && !K[S] && ab[S] !== "xmlns" &&
                            ab[S] !== "xml") {
                            K[S] = true;
                            d.push(" xmlns:" + ab[S] + '="' + S + '"')
                        }
                    })
                });
                B = n.length;
                for (j = ["width", "height", "xmlns", "x", "y", "viewBox", "id", "overflow"]; B--;) {
                    z = n.item(B);
                    var C = r(z.nodeValue);
                    if (z.nodeName.indexOf("xmlns:") !== 0)
                        if (C != "" && j.indexOf(z.localName) == -1)
                            if (!z.namespaceURI || ab[z.namespaceURI]) {
                                d.push(" ");
                                d.push(z.nodeName);
                                d.push('="');
                                d.push(C);
                                d.push('"')
                            }
                }
            } else {
                if (b.nodeName === "defs" && !b.firstChild) return;
                var O = ["-moz-math-font-style", "_moz-math-font-style"];
                for (B = n.length - 1; B >= 0; B--) {
                    z = n.item(B);
                    C = r(z.nodeValue);
                    if (!(O.indexOf(z.localName) >= 0))
                        if (C != "")
                            if (C.indexOf("pointer-events") !== 0)
                                if (!(z.localName === "class" && C.indexOf("se_") === 0)) {
                                    d.push(" ");
                                    if (z.localName === "d") C = ra.convertPath(b, true);
                                    if (isNaN(C)) {
                                        if (E.test(C)) C = svgedit.units.shortFloat(C) + j
                                    } else C = svgedit.units.shortFloat(C); if (Ma.apply && b.nodeName === "image" && z.localName === "href" && Ma.images && Ma.images === "embed") {
                                        var T = Na[C];
                                        if (T) C = T
                                    }
                                    if (!z.namespaceURI || z.namespaceURI == c.SVG || ab[z.namespaceURI]) {
                                        d.push(z.nodeName);
                                        d.push('="');
                                        d.push(C);
                                        d.push('"')
                                    }
                                }
                }
            } if (b.hasChildNodes()) {
                d.push(">");
                f++;
                n = false;
                for (B = 0; B < G.length; B++) {
                    j = G.item(B);
                    switch (j.nodeType) {
                        case 1:
                            d.push("\n");
                            d.push(this.svgToString(G.item(B), f));
                            break;
                        case 3:
                            j = j.nodeValue.replace(/^\s+|\s+$/g, "");
                            if (j != "") {
                                n = true;
                                d.push(String(r(j)))
                            }
                            break;
                        case 4:
                            d.push("\n");
                            d.push(Array(f + 1).join(" "));
                            d.push("<![CDATA[");
                            d.push(j.nodeValue);
                            d.push("]]\>");
                            break;
                        case 8:
                            d.push("\n");
                            d.push(Array(f + 1).join(" "));
                            d.push("<!--");
                            d.push(j.data);
                            d.push("--\>")
                    }
                }
                f--;
                if (!n) {
                    d.push("\n");
                    for (B =
                        0; B < f; B++) d.push(" ")
                }
                d.push("</");
                d.push(b.nodeName);
                d.push(">")
            } else d.push("/>")
        }
        return d.join("")
    };
    this.embedImage = function(b, f) {
        $(new Image).load(function() {
            var d = document.createElement("canvas");
            d.width = this.width;
            d.height = this.height;
            d.getContext("2d").drawImage(this, 0, 0);
            try {
                var r = ";svgedit_url=" + encodeURIComponent(b);
                r = d.toDataURL().replace(";base64", r + ";base64");
                Na[b] = r
            } catch (j) {
                Na[b] = false
            }
            mb = b;
            f && f(Na[b])
        }).attr("src", b)
    };
    this.setGoodImage = function(b) {
        mb = b
    };
    this.open = function() {};
    this.save =
        function(b) {
            za();
            b && $.extend(Ma, b);
            Ma.apply = true;
            b = this.svgCanvasToString();
            ma("saved", b)
    };
    this.rasterExport = function(b, f) {
        var d = "image/" + b.toLowerCase();
        za();
        var r = [],
            j = {
                feGaussianBlur: qb.exportNoBlur,
                foreignObject: qb.exportNoforeignObject,
                "[stroke-dasharray]": qb.exportNoDashArray
            }, E = $(w);
        if (!("font" in $("<canvas>")[0].getContext("2d"))) j.text = qb.exportNoText;
        $.each(j, function(n, z) {
            E.find(n).length && r.push(z)
        });
        j = this.svgCanvasToString();
        ma("exported", {
            svg: j,
            issues: r,
            type: b,
            mimeType: d,
            quality: f
        })
    };
    this.getSvgString = function() {
        Ma.apply = false;
        return this.svgCanvasToString()
    };
    this.randomizeIds = function(b) {
        arguments.length > 0 && b == false ? svgedit.draw.randomizeIds(false, u()) : svgedit.draw.randomizeIds(true, u())
    };
    var Ub = this.uniquifyElems = function(b) {
        var f = {}, d = ["filter", "linearGradient", "pattern", "radialGradient", "symbol", "textPath", "use"];
        svgedit.utilities.walkTree(b, function(z) {
            if (z.nodeType == 1) {
                if (z.id) {
                    z.id in f || (f[z.id] = {
                        elem: null,
                        attrs: [],
                        hrefs: []
                    });
                    f[z.id].elem = z
                }
                $.each(Ob, function(G, K) {
                    var C =
                        z.getAttributeNode(K);
                    if (C) {
                        var O = svgedit.utilities.getUrlFromAttr(C.value);
                        if (O = O ? O.substr(1) : null) {
                            O in f || (f[O] = {
                                elem: null,
                                attrs: [],
                                hrefs: []
                            });
                            f[O].attrs.push(C)
                        }
                    }
                });
                var B = svgedit.utilities.getHref(z);
                if (B && d.indexOf(z.nodeName) >= 0)
                    if (B = B.substr(1)) {
                        B in f || (f[B] = {
                            elem: null,
                            attrs: [],
                            hrefs: []
                        });
                        f[B].hrefs.push(z)
                    }
            }
        });
        for (var r in f)
            if (r) {
                var j = f[r].elem;
                if (j) {
                    b = Ga();
                    j.id = b;
                    j = f[r].attrs;
                    for (var E = j.length; E--;) {
                        var n = j[E];
                        n.ownerElement.setAttribute(n.name, "url(#" + b + ")")
                    }
                    j = f[r].hrefs;
                    for (E = j.length; E--;) svgedit.utilities.setHref(j[E],
                        "#" + b)
                }
            }
    }, Cb = this.setUseData = function(b) {
            var f = $(b);
            if (b.tagName !== "use") f = f.find("use");
            f.each(function() {
                var d = Ia(this).substr(1);
                if (d = svgedit.utilities.getElem(d)) {
                    $(this).data("ref", d);
                    if (d.tagName == "symbol" || d.tagName == "svg") $(this).data("symbol", d).data("ref", d)
                }
            })
        }, Wb = this.convertGradients = function(b) {
            var f = $(b).find("linearGradient, radialGradient");
            if (!f.length && svgedit.browser.isWebkit()) f = $(b).find("*").filter(function() {
                return this.tagName.indexOf("Gradient") >= 0
            });
            f.each(function() {
                if ($(this).attr("gradientUnits") ===
                    "userSpaceOnUse") {
                    var d = $(w).find('[fill="url(#' + this.id + ')"],[stroke="url(#' + this.id + ')"]');
                    if (d.length)
                        if (d = svgedit.utilities.getBBox(d[0]))
                            if (this.tagName === "linearGradient") {
                                var r = $(this).attr(["x1", "y1", "x2", "y2"]),
                                    j = this.gradientTransform.baseVal;
                                if (j && j.numberOfItems > 0) {
                                    var E = svgedit.math.transformListToTransform(j).matrix;
                                    j = svgedit.math.transformPoint(r.x1, r.y1, E);
                                    E = svgedit.math.transformPoint(r.x2, r.y2, E);
                                    r.x1 = j.x;
                                    r.y1 = j.y;
                                    r.x2 = E.x;
                                    r.y2 = E.y;
                                    this.removeAttribute("gradientTransform")
                                }
                                $(this).attr({
                                    x1: (r.x1 -
                                        d.x) / d.width,
                                    y1: (r.y1 - d.y) / d.height,
                                    x2: (r.x2 - d.x) / d.width,
                                    y2: (r.y2 - d.y) / d.height
                                });
                                this.removeAttribute("gradientUnits")
                            }
                }
            })
        }, Zb = this.convertToGroup = function(b) {
            b || (b = m[0]);
            var f = $(b),
                d = new svgedit.history.BatchCommand,
                r;
            if (f.data("gsvg")) {
                d = $(b.firstChild).attr(["x", "y"]);
                $(b.firstChild.firstChild).unwrap();
                $(b).removeData("gsvg");
                r = svgedit.transformlist.getTransformList(b);
                var j = q.createSVGTransform();
                j.setTranslate(d.x, d.y);
                r.appendItem(j);
                svgedit.recalculate.recalculateDimensions(b);
                ma("selected", [b])
            } else if (f.data("symbol")) {
                b = f.data("symbol");
                r = f.attr("transform");
                j = f.attr(["x", "y"]);
                var E = b.getAttribute("viewBox");
                if (E) {
                    E = E.split(" ");
                    j.x -= +E[0];
                    j.y -= +E[1]
                }
                r += " translate(" + (j.x || 0) + "," + (j.y || 0) + ")";
                j = f.prev();
                d.addSubCommand(new svgedit.history.RemoveElementCommand(f[0], f[0].nextSibling, f[0].parentNode));
                f.remove();
                E = $(w).find("use:data(symbol)").length;
                f = g.createElementNS(c.SVG, "g");
                var n = b.childNodes,
                    z;
                for (z = 0; z < n.length; z++) f.appendChild(n[z].cloneNode(true));
                if (svgedit.browser.isGecko()) {
                    n =
                        $(svgedit.utilities.findDefs()).children("linearGradient,radialGradient,pattern").clone();
                    $(f).append(n)
                }
                r && f.setAttribute("transform", r);
                r = b.parentNode;
                Ub(f);
                svgedit.browser.isGecko() && $(ea()).append($(f).find("linearGradient,radialGradient,pattern"));
                f.id = Ga();
                j.after(f);
                if (r) {
                    if (!E) {
                        j = b.nextSibling;
                        r.removeChild(b);
                        d.addSubCommand(new svgedit.history.RemoveElementCommand(b, j, r))
                    }
                    d.addSubCommand(new svgedit.history.InsertElementCommand(f))
                }
                Cb(f);
                svgedit.browser.isGecko() ? Wb(svgedit.utilities.findDefs()) :
                    Wb(f);
                svgedit.utilities.walkTreePost(f, function(B) {
                    try {
                        svgedit.recalculate.recalculateDimensions(B)
                    } catch (G) {
                        console.log(G)
                    }
                });
                $(f).find("a,circle,ellipse,foreignObject,g,image,line,path,polygon,polyline,rect,svg,text,tspan,use").each(function() {
                    if (!this.id) this.id = Ga()
                });
                Za([f]);
                (b = tb(f, true)) && d.addSubCommand(b);
                Y(d)
            } else console.log("Unexpected element to ungroup:", b)
        };
    this.setSvgString = function(b) {
        try {
            var f = svgedit.utilities.text2xml(b);
            this.prepareSvg(f);
            var d = new svgedit.history.BatchCommand("Change Source"),
                r = w.nextSibling,
                j = q.removeChild(w);
            d.addSubCommand(new svgedit.history.RemoveElementCommand(j, r, q));
            w = g.adoptNode ? g.adoptNode(f.documentElement) : g.importNode(f.documentElement, true);
            q.appendChild(w);
            var E = $(w);
            e.current_drawing_ = new svgedit.draw.Drawing(w, D);
            var n = u().getNonce();
            n ? ma("setnonce", n) : ma("unsetnonce");
            E.find("image").each(function() {
                var T = this;
                wb(T);
                var V = Ia(this);
                if (V) {
                    if (V.indexOf("data:") === 0) {
                        var X = V.match(/svgedit_url=(.*?);/);
                        if (X) {
                            var ca = decodeURIComponent(X[1]);
                            $(new Image).load(function() {
                                T.setAttributeNS(c.XLINK,
                                    "xlink:href", ca)
                            }).attr("src", ca)
                        }
                    }
                    e.embedImage(V)
                }
            });
            E.find("svg").each(function() {
                if (!$(this).closest("defs").length) {
                    Ub(this);
                    var T = this.parentNode;
                    if (T.childNodes.length === 1 && T.nodeName === "g") {
                        $(T).data("gsvg", this);
                        T.id = T.id || Ga()
                    } else Pb(this)
                }
            });
            svgedit.browser.isGecko() && E.find("linearGradient, radialGradient, pattern").appendTo(svgedit.utilities.findDefs());
            Cb(E);
            Wb(E[0]);
            svgedit.utilities.walkTreePost(w, function(T) {
                try {
                    svgedit.recalculate.recalculateDimensions(T)
                } catch (V) {
                    console.log(V)
                }
            });
            var z = {
                id: "svgcontent",
                overflow: i.show_outside_canvas ? "visible" : "hidden"
            }, B = false;
            if (E.attr("viewBox")) {
                var G = E.attr("viewBox").split(" ");
                z.width = G[2];
                z.height = G[3]
            } else $.each(["width", "height"], function(T, V) {
                var X = E.attr(V);
                X || (X = "100%");
                if (String(X).substr(-1) === "%") B = true;
                else z[V] = svgedit.units.convertToNum(V, X)
            });
            yb();
            E.children().find("a,circle,ellipse,foreignObject,g,image,line,path,polygon,polyline,rect,svg,text,tspan,use").each(function() {
                if (!this.id) this.id = Ga()
            });
            if (B) {
                var K = getStrokedBBox();
                z.width = K.width + K.x;
                z.height = K.height + K.y
            }
            if (z.width <= 0) z.width = 100;
            if (z.height <= 0) z.height = 100;
            E.attr(z);
            this.contentW = z.width;
            this.contentH = z.height;
            d.addSubCommand(new svgedit.history.InsertElementCommand(w));
            var C = E.attr(["width", "height"]);
            d.addSubCommand(new svgedit.history.ChangeElementCommand(q, C));
            A = 1;
            svgedit.transformlist.resetListMap();
            za();
            svgedit.path.clearData();
            q.appendChild(va.selectorParentGroup);
            Y(d);
            ma("changed", [w])
        } catch (O) {
            console.log(O);
            return false
        }
        return true
    };
    this.importSvgString =
        function(b) {
            var f, d;
            try {
                var r = svgedit.utilities.encode64(b.length + b).substr(0, 32),
                    j = false;
                if (Fb[r])
                    if ($(Fb[r].symbol).parents("#svgroot").length) j = true;
                var E = new svgedit.history.BatchCommand("Import SVG"),
                    n;
                if (j) {
                    n = Fb[r].symbol;
                    d = Fb[r].xform
                } else {
                    var z = svgedit.utilities.text2xml(b);
                    this.prepareSvg(z);
                    var B;
                    B = g.adoptNode ? g.adoptNode(z.documentElement) : g.importNode(z.documentElement, true);
                    Ub(B);
                    var G = svgedit.units.convertToNum("width", B.getAttribute("width")),
                        K = svgedit.units.convertToNum("height", B.getAttribute("height")),
                        C = B.getAttribute("viewBox"),
                        O = C ? C.split(" ") : [0, 0, G, K];
                    for (f = 0; f < 4; ++f) O[f] = +O[f];
                    w.getAttribute("width");
                    var T = +w.getAttribute("height");
                    d = K > G ? "scale(" + T / 3 / O[3] + ")" : "scale(" + T / 3 / O[2] + ")";
                    d = "translate(0) " + d + " translate(0)";
                    n = g.createElementNS(c.SVG, "symbol");
                    var V = svgedit.utilities.findDefs();
                    for (svgedit.browser.isGecko() && $(B).find("linearGradient, radialGradient, pattern").appendTo(V); B.firstChild;) n.appendChild(B.firstChild);
                    var X = B.attributes,
                        ca;
                    for (ca = 0; ca < X.length; ca++) {
                        var S = X[ca];
                        n.setAttribute(S.nodeName,
                            S.nodeValue)
                    }
                    n.id = Ga();
                    Fb[r] = {
                        symbol: n,
                        xform: d
                    };
                    svgedit.utilities.findDefs().appendChild(n);
                    E.addSubCommand(new svgedit.history.InsertElementCommand(n))
                }
                var M = g.createElementNS(c.SVG, "use");
                M.id = Ga();
                Ba(M, "#" + n.id);
                (p || u().getCurrentLayer()).appendChild(M);
                E.addSubCommand(new svgedit.history.InsertElementCommand(M));
                za();
                M.setAttribute("transform", d);
                svgedit.recalculate.recalculateDimensions(M);
                $(M).data("symbol", n).data("ref", n);
                gb([M]);
                Y(E);
                ma("changed", [w])
            } catch (J) {
                console.log(J);
                return false
            }
            return true
    };
    var yb = e.identifyLayers = function() {
        Sb();
        u().identifyLayers()
    };
    this.createLayer = function(b) {
        var f = new svgedit.history.BatchCommand("Create Layer");
        b = u().createLayer(b);
        f.addSubCommand(new svgedit.history.InsertElementCommand(b));
        Y(f);
        za();
        ma("changed", [b])
    };
    this.cloneLayer = function(b) {
        var f = new svgedit.history.BatchCommand("Duplicate Layer"),
            d = g.createElementNS(c.SVG, "g"),
            r = g.createElementNS(c.SVG, "title");
        r.textContent = b;
        d.appendChild(r);
        r = u().getCurrentLayer();
        $(r).after(d);
        r = r.childNodes;
        var j;
        for (j = 0; j < r.length; j++) {
            var E = r[j];
            E.localName != "title" && d.appendChild(ob(E))
        }
        za();
        yb();
        f.addSubCommand(new svgedit.history.InsertElementCommand(d));
        Y(f);
        e.setCurrentLayer(b);
        ma("changed", [d])
    };
    this.deleteCurrentLayer = function() {
        var b = u().getCurrentLayer(),
            f = b.nextSibling,
            d = b.parentNode;
        if (b = u().deleteCurrentLayer()) {
            var r = new svgedit.history.BatchCommand("Delete Layer");
            r.addSubCommand(new svgedit.history.RemoveElementCommand(b, f, d));
            Y(r);
            za();
            ma("changed", [d]);
            return true
        }
        return false
    };
    this.setCurrentLayer =
        function(b) {
            (b = u().setCurrentLayer(svgedit.utilities.toXml(b))) && za();
            return b
    };
    this.renameCurrentLayer = function(b) {
        var f, d = u();
        if (d.current_layer) {
            var r = d.current_layer;
            if (!e.setCurrentLayer(b)) {
                var j = new svgedit.history.BatchCommand("Rename Layer");
                for (f = 0; f < d.getNumLayers(); ++f)
                    if (d.all_layers[f][1] == r) break;
                var E = d.getLayerName(f);
                d.all_layers[f][0] = svgedit.utilities.toXml(b);
                var n = r.childNodes.length;
                for (f = 0; f < n; ++f) {
                    var z = r.childNodes.item(f);
                    if (z && z.tagName == "title") {
                        for (; z.firstChild;) z.removeChild(z.firstChild);
                        z.textContent = b;
                        j.addSubCommand(new svgedit.history.ChangeElementCommand(z, {
                            "#text": E
                        }));
                        Y(j);
                        ma("changed", [r]);
                        return true
                    }
                }
            }
            d.current_layer = r
        }
        return false
    };
    this.setCurrentLayerPosition = function(b) {
        var f, d = u();
        if (d.current_layer && b >= 0 && b < d.getNumLayers()) {
            for (f = 0; f < d.getNumLayers(); ++f)
                if (d.all_layers[f][1] == d.current_layer) break;
            if (f == d.getNumLayers()) return false;
            if (f != b) {
                var r = null,
                    j = d.current_layer.nextSibling;
                if (b > f) {
                    if (b < d.getNumLayers() - 1) r = d.all_layers[b + 1][1]
                } else r = d.all_layers[b][1];
                w.insertBefore(d.current_layer,
                    r);
                Y(new svgedit.history.MoveElementCommand(d.current_layer, j, w));
                yb();
                e.setCurrentLayer(d.getLayerName(b));
                return true
            }
        }
        return false
    };
    this.setLayerVisibility = function(b, f) {
        var d = u(),
            r = d.getLayerVisibility(b),
            j = d.setLayerVisibility(b, f);
        if (j) Y(new svgedit.history.ChangeElementCommand(j, {
            display: r ? "inline" : "none"
        }, "Layer Visibility"));
        else return false; if (j == d.getCurrentLayer()) {
            za();
            ra.clear()
        }
        return true
    };
    this.moveSelectedToLayer = function(b) {
        var f, d = null,
            r = u();
        for (f = 0; f < r.getNumLayers(); ++f)
            if (r.getLayerName(f) ==
                b) {
                d = r.all_layers[f][1];
                break
            }
        if (!d) return false;
        b = new svgedit.history.BatchCommand("Move Elements to Layer");
        r = m;
        for (f = r.length; f--;) {
            var j = r[f];
            if (j) {
                var E = j.nextSibling,
                    n = j.parentNode;
                d.appendChild(j);
                b.addSubCommand(new svgedit.history.MoveElementCommand(j, E, n))
            }
        }
        Y(b);
        return true
    };
    this.mergeLayer = function(b) {
        var f = new svgedit.history.BatchCommand("Merge Layer"),
            d = u(),
            r = $(d.current_layer).prev()[0];
        if (r) {
            for (f.addSubCommand(new svgedit.history.RemoveElementCommand(d.current_layer, d.current_layer.nextSibling,
                w)); d.current_layer.firstChild;) {
                var j = d.current_layer.firstChild;
                if (j.localName == "title") {
                    f.addSubCommand(new svgedit.history.RemoveElementCommand(j, j.nextSibling, d.current_layer));
                    d.current_layer.removeChild(j)
                } else {
                    var E = j.nextSibling;
                    r.appendChild(j);
                    f.addSubCommand(new svgedit.history.MoveElementCommand(j, E, d.current_layer))
                }
            }
            w.removeChild(d.current_layer);
            if (!b) {
                za();
                yb();
                ma("changed", [w]);
                Y(f)
            }
            d.current_layer = r;
            return f
        }
    };
    this.mergeAllLayers = function() {
        var b = new svgedit.history.BatchCommand("Merge all Layers"),
            f = u();
        for (f.current_layer = f.all_layers[f.getNumLayers() - 1][1]; $(w).children("g").length > 1;) b.addSubCommand(e.mergeLayer(true));
        za();
        yb();
        ma("changed", [w]);
        Y(b)
    };
    var Sb = this.leaveContext = function() {
        var b, f = oa.length;
        if (f) {
            for (b = 0; b < f; b++) {
                var d = oa[b],
                    r = Db(d, "orig_opac");
                r !== 1 ? d.setAttribute("opacity", r) : d.removeAttribute("opacity");
                d.setAttribute("style", "pointer-events: inherit")
            }
            oa = [];
            za(true);
            ma("contextset", null)
        }
        p = null
    }, hc = this.setContext = function(b) {
            Sb();
            if (typeof b === "string") b = svgedit.utilities.getElem(b);
            p = b;
            $(b).parentsUntil("#svgcontent").andSelf().siblings().each(function() {
                var f = this.getAttribute("opacity") || 1;
                Db(this, "orig_opac", f);
                this.setAttribute("opacity", f * 0.33);
                this.setAttribute("style", "pointer-events: none");
                oa.push(this)
            });
            za();
            ma("contextset", p)
        };
    this.clear = function() {
        ra.clear();
        za();
        e.clearSvgContentElement();
        e.current_drawing_ = new svgedit.draw.Drawing(w);
        e.createLayer("Layer 1");
        e.undoMgr.resetUndoStack();
        va.initGroup();
        Ca = va.getRubberBandBox();
        ma("cleared")
    };
    this.linkControlPoints =
        ra.linkControlPoints;
    this.getContentElem = function() {
        return w
    };
    this.getRootElem = function() {
        return q
    };
    this.getSelectedElems = function() {
        return m
    };
    var xb = this.getResolution = function() {
        var b = w.getAttribute("width") / A,
            f = w.getAttribute("height") / A;
        return {
            w: b,
            h: f,
            zoom: A
        }
    };
    this.getZoom = function() {
        return A
    };
    this.getVersion = function() {
        return "svgcanvas.js ($Rev: 2705 $)"
    };
    this.setUiStrings = function(b) {
        $.extend(qb, b.notification)
    };
    this.setConfig = function(b) {
        $.extend(i, b)
    };
    this.getTitle = function(b) {
        if (b = b || m[0]) {
            b =
                $(b).data("gsvg") || $(b).data("symbol") || b;
            var f = b.childNodes;
            for (b = 0; b < f.length; b++)
                if (f[b].nodeName == "title") return f[b].textContent;
            return ""
        }
    };
    this.setGroupTitle = function(b) {
        var f = m[0];
        f = $(f).data("gsvg") || f;
        var d = $(f).children("title"),
            r = new svgedit.history.BatchCommand("Set Label");
        if (b.length)
            if (d.length) {
                d = d[0];
                r.addSubCommand(new svgedit.history.ChangeElementCommand(d, {
                    "#text": d.textContent
                }));
                d.textContent = b
            } else {
                d = g.createElementNS(c.SVG, "title");
                d.textContent = b;
                $(f).prepend(d);
                r.addSubCommand(new svgedit.history.InsertElementCommand(d))
            } else {
                r.addSubCommand(new svgedit.history.RemoveElementCommand(d[0],
                    d.nextSibling, f));
                d.remove()
            }
        Y(r)
    };
    this.getDocumentTitle = function() {
        return e.getTitle(w)
    };
    this.setDocumentTitle = function(b) {
        var f, d = w.childNodes,
            r = false,
            j = "",
            E = new svgedit.history.BatchCommand("Change Image Title");
        for (f = 0; f < d.length; f++)
            if (d[f].nodeName == "title") {
                r = d[f];
                j = r.textContent;
                break
            }
        if (!r) {
            r = g.createElementNS(c.SVG, "title");
            w.insertBefore(r, w.firstChild)
        }
        if (b.length) r.textContent = b;
        else r.parentNode.removeChild(r);
        E.addSubCommand(new svgedit.history.ChangeElementCommand(r, {
            "#text": j
        }));
        Y(E)
    };
    this.getEditorNS = function(b) {
        b && w.setAttribute("xmlns:se", c.SE);
        return c.SE
    };
    this.setResolution = function(b, f) {
        var d = xb(),
            r = d.w;
        d = d.h;
        var j;
        if (b == "fit") {
            var E = getStrokedBBox();
            if (E) {
                j = new svgedit.history.BatchCommand("Fit Canvas to Content");
                var n = sb();
                gb(n);
                var z = [],
                    B = [];
                $.each(n, function() {
                    z.push(E.x * -1);
                    B.push(E.y * -1)
                });
                n = e.moveSelectedElements(z, B, true);
                j.addSubCommand(n);
                za();
                b = Math.round(E.width);
                f = Math.round(E.height)
            } else return false
        }
        if (b != r || f != d) {
            n = q.suspendRedraw(1E3);
            j || (j = new svgedit.history.BatchCommand("Change Image Dimensions"));
            b = svgedit.units.convertToNum("width", b);
            f = svgedit.units.convertToNum("height", f);
            w.setAttribute("width", b);
            w.setAttribute("height", f);
            this.contentW = b;
            this.contentH = f;
            j.addSubCommand(new svgedit.history.ChangeElementCommand(w, {
                width: r,
                height: d
            }));
            w.setAttribute("viewBox", [0, 0, b / A, f / A].join(" "));
            j.addSubCommand(new svgedit.history.ChangeElementCommand(w, {
                viewBox: ["0 0", r, d].join(" ")
            }));
            Y(j);
            q.unsuspendRedraw(n);
            ma("changed", [w])
        }
        return true
    };
    this.getOffset = function() {
        return $(w).attr(["x", "y"])
    };
    this.setBBoxZoom = function(b, f, d) {
        var r = 0.85,
            j = function(E) {
                if (!E) return false;
                var n = Math.min(Math.round(f / E.width * 100 * r) / 100, Math.round(d / E.height * 100 * r) / 100);
                e.setZoom(n);
                return {
                    zoom: n,
                    bbox: E
                }
            };
        if (typeof b == "object") {
            b = b;
            if (b.width == 0 || b.height == 0) {
                e.setZoom(b.zoom ? b.zoom : A * b.factor);
                return {
                    zoom: A,
                    bbox: b
                }
            }
            return j(b)
        }
        switch (b) {
            case "selection":
                if (!m[0]) return;
                b = $.map(m, function(E) {
                    if (E) return E
                });
                b = getStrokedBBox(b);
                break;
            case "canvas":
                b = xb();
                r = 0.95;
                b = {
                    width: b.w,
                    height: b.h,
                    x: 0,
                    y: 0
                };
                break;
            case "content":
                b =
                    getStrokedBBox();
                break;
            case "layer":
                b = getStrokedBBox(sb(u().getCurrentLayer()));
                break;
            default:
                return
        }
        return j(b)
    };
    this.setZoom = function(b) {
        var f = xb();
        w.setAttribute("viewBox", "0 0 " + f.w / b + " " + f.h / b);
        A = b;
        $.each(m, function(d, r) {
            r && va.requestSelector(r).resize()
        });
        ra.zoomChange();
        nb("zoomChanged", b)
    };
    this.getMode = function() {
        return ua
    };
    this.setMode = function(b) {
        ra.clear(true);
        La.clear();
        Ta = m[0] && m[0].nodeName == "text" ? Sa : t;
        ua = b
    };
    this.getColor = function(b) {
        return Ta[b]
    };
    this.setColor = function(b, f, d) {
        function r(z) {
            z.nodeName !=
                "g" && j.push(z)
        }
        t[b] = f;
        Ta[b + "_paint"] = {
            type: "solidColor"
        };
        for (var j = [], E = m.length; E--;) {
            var n = m[E];
            if (n)
                if (n.tagName == "g") svgedit.utilities.walkTree(n, r);
                else if (b == "fill") n.tagName != "polyline" && n.tagName != "line" && j.push(n);
            else j.push(n)
        }
        if (j.length > 0)
            if (d) zb(b, f, j);
            else {
                Va(b, f, j);
                ma("changed", j)
            }
    };
    var ac = this.setGradient = function(b) {
        if (!(!Ta[b + "_paint"] || Ta[b + "_paint"].type == "solidColor")) {
            var f = e[b + "Grad"],
                d = $b(f),
                r = svgedit.utilities.findDefs();
            if (d) f = d;
            else {
                f = r.appendChild(g.importNode(f, true));
                f.id = Ga()
            }
            e.setColor(b, "url(#" + f.id + ")")
        }
    }, $b = function(b) {
            var f = svgedit.utilities.findDefs();
            f = $(f).find("linearGradient, radialGradient");
            for (var d = f.length, r = ["r", "cx", "cy", "fx", "fy"]; d--;) {
                var j = f[d];
                if (b.tagName == "linearGradient") {
                    if (b.getAttribute("x1") != j.getAttribute("x1") || b.getAttribute("y1") != j.getAttribute("y1") || b.getAttribute("x2") != j.getAttribute("x2") || b.getAttribute("y2") != j.getAttribute("y2")) continue
                } else {
                    var E = $(b).attr(r),
                        n = $(j).attr(r),
                        z = false;
                    $.each(r, function(T, V) {
                        if (E[V] !=
                            n[V]) z = true
                    });
                    if (z) continue
                }
                var B = b.getElementsByTagNameNS(c.SVG, "stop"),
                    G = j.getElementsByTagNameNS(c.SVG, "stop");
                if (B.length == G.length) {
                    for (var K = B.length; K--;) {
                        var C = B[K],
                            O = G[K];
                        if (C.getAttribute("offset") != O.getAttribute("offset") || C.getAttribute("stop-opacity") != O.getAttribute("stop-opacity") || C.getAttribute("stop-color") != O.getAttribute("stop-color")) break
                    }
                    if (K == -1) return j
                }
            }
            return null
        };
    this.setPaint = function(b, f) {
        var d = new $.jGraduate.Paint(f);
        this.setPaintOpacity(b, d.alpha / 100, true);
        Ta[b +
            "_paint"] = d;
        switch (d.type) {
            case "solidColor":
                this.setColor(b, d.solidColor != "none" ? "#" + d.solidColor : "none");
                break;
            case "linearGradient":
            case "radialGradient":
                e[b + "Grad"] = d[d.type];
                ac(b)
        }
    };
    this.setStrokePaint = function(b) {
        this.setPaint("stroke", b)
    };
    this.setFillPaint = function(b) {
        this.setPaint("fill", b)
    };
    this.getStrokeWidth = function() {
        return Ta.stroke_width
    };
    this.setStrokeWidth = function(b) {
        function f(E) {
            E.nodeName != "g" && d.push(E)
        }
        if (b == 0 && ["line", "path"].indexOf(ua) >= 0) e.setStrokeWidth(1);
        else {
            Ta.stroke_width =
                b;
            for (var d = [], r = m.length; r--;) {
                var j = m[r];
                if (j) j.tagName == "g" ? svgedit.utilities.walkTree(j, f) : d.push(j)
            }
            if (d.length > 0) {
                Va("stroke-width", b, d);
                ma("changed", m)
            }
        }
    };
    this.setStrokeAttr = function(b, f) {
        t[b.replace("-", "_")] = f;
        for (var d = [], r = m.length; r--;) {
            var j = m[r];
            if (j) j.tagName == "g" ? svgedit.utilities.walkTree(j, function(E) {
                E.nodeName != "g" && d.push(E)
            }) : d.push(j)
        }
        if (d.length > 0) {
            Va(b, f, d);
            ma("changed", m)
        }
    };
    this.getStyle = function() {
        return t
    };
    this.getOpacity = function() {
        return t.opacity
    };
    this.setOpacity = function(b) {
        t.opacity =
            b;
        Va("opacity", b)
    };
    this.getFillOpacity = function() {
        return t.fill_opacity
    };
    this.getStrokeOpacity = function() {
        return t.stroke_opacity
    };
    this.setPaintOpacity = function(b, f, d) {
        t[b + "_opacity"] = f;
        d ? zb(b + "-opacity", f) : Va(b + "-opacity", f)
    };
    this.getPaintOpacity = function(b) {
        return b === "fill" ? this.getFillOpacity() : this.getStrokeOpacity()
    };
    this.getBlur = function(b) {
        var f = 0;
        if (b)
            if (b.getAttribute("filter"))
                if (b = svgedit.utilities.getElem(b.id + "_blur")) f = b.firstChild.getAttribute("stdDeviation");
        return f
    };
    (function() {
        function b() {
            var j =
                e.undoMgr.finishUndoableChange();
            f.addSubCommand(j);
            Y(f);
            d = f = null
        }
        var f = null,
            d = null,
            r = false;
        e.setBlurNoUndo = function(j) {
            if (d)
                if (j === 0) {
                    zb("filter", "");
                    r = true
                } else {
                    var E = m[0];
                    r && zb("filter", "url(#" + E.id + "_blur)");
                    if (svgedit.browser.isWebkit()) {
                        console.log("e", E);
                        E.removeAttribute("filter");
                        E.setAttribute("filter", "url(#" + E.id + "_blur)")
                    }
                    zb("stdDeviation", j, [d.firstChild]);
                    e.setBlurOffsets(d, j)
                } else e.setBlur(j)
        };
        e.setBlurOffsets = function(j, E) {
            if (E > 3) svgedit.utilities.assignAttributes(j, {
                x: "-50%",
                y: "-50%",
                width: "200%",
                height: "200%"
            }, 100);
            else if (!svgedit.browser.isWebkit()) {
                j.removeAttribute("x");
                j.removeAttribute("y");
                j.removeAttribute("width");
                j.removeAttribute("height")
            }
        };
        e.setBlur = function(j, E) {
            if (f) b();
            else {
                var n = m[0],
                    z = n.id;
                d = svgedit.utilities.getElem(z + "_blur");
                j -= 0;
                var B = new svgedit.history.BatchCommand;
                if (d) {
                    if (j === 0) d = null
                } else {
                    var G = L({
                        element: "feGaussianBlur",
                        attr: {
                            "in": "SourceGraphic",
                            stdDeviation: j
                        }
                    });
                    d = L({
                        element: "filter",
                        attr: {
                            id: z + "_blur"
                        }
                    });
                    d.appendChild(G);
                    svgedit.utilities.findDefs().appendChild(d);
                    B.addSubCommand(new svgedit.history.InsertElementCommand(d))
                }
                G = {
                    filter: n.getAttribute("filter")
                };
                if (j === 0) {
                    n.removeAttribute("filter");
                    B.addSubCommand(new svgedit.history.ChangeElementCommand(n, G))
                } else {
                    Va("filter", "url(#" + z + "_blur)");
                    B.addSubCommand(new svgedit.history.ChangeElementCommand(n, G));
                    e.setBlurOffsets(d, j);
                    f = B;
                    e.undoMgr.beginUndoableChange("stdDeviation", [d ? d.firstChild : null]);
                    if (E) {
                        e.setBlurNoUndo(j);
                        b()
                    }
                }
            }
        }
    })();
    this.getBold = function() {
        var b = m[0];
        if (b != null && b.tagName == "text" && m[1] ==
            null) return b.getAttribute("font-weight") == "bold";
        return false
    };
    this.setBold = function(b) {
        var f = m[0];
        if (f != null && f.tagName == "text" && m[1] == null) Va("font-weight", b ? "bold" : "normal");
        m[0].textContent || La.setCursor()
    };
    this.getItalic = function() {
        var b = m[0];
        if (b != null && b.tagName == "text" && m[1] == null) return b.getAttribute("font-style") == "italic";
        return false
    };
    this.setItalic = function(b) {
        var f = m[0];
        if (f != null && f.tagName == "text" && m[1] == null) Va("font-style", b ? "italic" : "normal");
        m[0].textContent || La.setCursor()
    };
    this.getFontFamily = function() {
        return Sa.font_family
    };
    this.setFontFamily = function(b) {
        Sa.font_family = b;
        Va("font-family", b);
        m[0] && !m[0].textContent && La.setCursor()
    };
    this.setFontColor = function(b) {
        Sa.fill = b;
        Va("fill", b)
    };
    this.getFontColor = function() {
        return Sa.fill
    };
    this.getFontSize = function() {
        return Sa.font_size
    };
    this.setFontSize = function(b) {
        Sa.font_size = b;
        Va("font-size", b);
        m[0].textContent || La.setCursor()
    };
    this.getText = function() {
        var b = m[0];
        if (b == null) return "";
        return b.textContent
    };
    this.setTextContent =
        function(b) {
            Va("#text", b);
            La.init(b);
            La.setCursor()
    };
    this.setImageURL = function(b) {
        var f = m[0];
        if (f) {
            var d = $(f).attr(["width", "height"]);
            d = !d.width || !d.height;
            var r = Ia(f);
            if (r !== b) d = true;
            else if (!d) return;
            var j = new svgedit.history.BatchCommand("Change Image URL");
            Ba(f, b);
            j.addSubCommand(new svgedit.history.ChangeElementCommand(f, {
                "#href": r
            }));
            d ? $(new Image).load(function() {
                var E = $(f).attr(["width", "height"]);
                $(f).attr({
                    width: this.width,
                    height: this.height
                });
                va.requestSelector(f).resize();
                j.addSubCommand(new svgedit.history.ChangeElementCommand(f,
                    E));
                Y(j);
                ma("changed", [f])
            }).attr("src", b) : Y(j)
        }
    };
    this.setLinkURL = function(b) {
        var f = m[0];
        if (f) {
            if (f.tagName !== "a") {
                f = $(f).parents("a");
                if (f.length) f = f[0];
                else return
            }
            var d = Ia(f);
            if (d !== b) {
                var r = new svgedit.history.BatchCommand("Change Link URL");
                Ba(f, b);
                r.addSubCommand(new svgedit.history.ChangeElementCommand(f, {
                    "#href": d
                }));
                Y(r)
            }
        }
    };
    this.setRectRadius = function(b) {
        var f = m[0];
        if (f != null && f.tagName == "rect") {
            var d = f.getAttribute("rx");
            if (d != b) {
                f.setAttribute("rx", b);
                f.setAttribute("ry", b);
                Y(new svgedit.history.ChangeElementCommand(f, {
                    rx: d,
                    ry: d
                }, "Radius"));
                ma("changed", [f])
            }
        }
    };
    this.makeHyperlink = function(b) {
        e.groupSelectedElements("a", b)
    };
    this.removeHyperlink = function() {
        e.ungroupSelectedElement()
    };
    this.setSegType = function(b) {
        ra.setSegType(b)
    };
    this.convertToPath = function(b, f) {
        if (b == null) $.each(m, function(S, M) {
            M && e.convertToPath(M)
        });
        else {
            if (!f) var d = new svgedit.history.BatchCommand("Convert element to Path");
            var r = f ? {} : {
                fill: t.fill,
                "fill-opacity": t.fill_opacity,
                stroke: t.stroke,
                "stroke-width": t.stroke_width,
                "stroke-dasharray": t.stroke_dasharray,
                "stroke-linejoin": t.stroke_linejoin,
                "stroke-linecap": t.stroke_linecap,
                "stroke-opacity": t.stroke_opacity,
                opacity: t.opacity,
                visibility: "hidden"
            };
            $.each(["marker-start", "marker-end", "marker-mid", "filter", "clip-path"], function() {
                if (b.getAttribute(this)) r[this] = b.getAttribute(this)
            });
            var j = L({
                element: "path",
                attr: r
            }),
                E = b.getAttribute("transform");
            E && j.setAttribute("transform", E);
            var n = b.id,
                z = b.parentNode;
            b.nextSibling ? z.insertBefore(j, b) : z.appendChild(j);
            var B = "",
                G = function(S) {
                    $.each(S, function(M, J) {
                        var N,
                            P = J[1];
                        B += J[0];
                        for (N = 0; N < P.length; N += 2) B += P[N] + "," + P[N + 1] + " "
                    })
                }, K = 1.81,
                C, O;
            switch (b.tagName) {
                case "ellipse":
                case "circle":
                    C = $(b).attr(["rx", "ry", "cx", "cy"]);
                    var T = C.cx,
                        V = C.cy;
                    O = C.rx;
                    ry = C.ry;
                    if (b.tagName == "circle") O = ry = $(b).attr("r");
                    G([
                        ["M", [T - O, V]],
                        ["C", [T - O, V - ry / K, T - O / K, V - ry, T, V - ry]],
                        ["C", [T + O / K, V - ry, T + O, V - ry / K, T + O, V]],
                        ["C", [T + O, V + ry / K, T + O / K, V + ry, T, V + ry]],
                        ["C", [T - O / K, V + ry, T - O, V + ry / K, T - O, V]],
                        ["Z", []]
                    ]);
                    break;
                case "path":
                    B = b.getAttribute("d");
                    break;
                case "line":
                    C = $(b).attr(["x1", "y1", "x2", "y2"]);
                    B = "M" + C.x1 + "," + C.y1 + "L" + C.x2 + "," + C.y2;
                    break;
                case "polyline":
                case "polygon":
                    B = "M" + b.getAttribute("points");
                    break;
                case "rect":
                    C = $(b).attr(["rx", "ry"]);
                    O = C.rx;
                    ry = C.ry;
                    var X = b.getBBox();
                    C = X.x;
                    T = X.y;
                    V = X.width;
                    X = X.height;
                    K = 4 - K;
                    !O && !ry ? G([
                        ["M", [C, T]],
                        ["L", [C + V, T]],
                        ["L", [C + V, T + X]],
                        ["L", [C, T + X]],
                        ["L", [C, T]],
                        ["Z", []]
                    ]) : G([
                        ["M", [C, T + ry]],
                        ["C", [C, T + ry / K, C + O / K, T, C + O, T]],
                        ["L", [C + V - O, T]],
                        ["C", [C + V - O / K, T, C + V, T + ry / K, C + V, T + ry]],
                        ["L", [C + V, T + X - ry]],
                        ["C", [C + V, T + X - ry / K, C + V - O / K, T + X, C + V - O, T + X]],
                        ["L", [C + O, T + X]],
                        ["C", [C + O /
                            K, T + X, C, T + X - ry / K, C, T + X - ry
                        ]],
                        ["L", [C, T + ry]],
                        ["Z", []]
                    ]);
                    break;
                default:
                    j.parentNode.removeChild(j)
            }
            B && j.setAttribute("d", B);
            if (f) {
                ra.resetOrientation(j);
                d = false;
                try {
                    d = j.getBBox()
                } catch (ca) {}
                j.parentNode.removeChild(j);
                return d
            } else {
                if (E) {
                    E = svgedit.transformlist.getTransformList(j);
                    svgedit.math.hasMatrixTransform(E) && ra.resetOrientation(j)
                }
                d.addSubCommand(new svgedit.history.RemoveElementCommand(b, b.nextSibling, z));
                d.addSubCommand(new svgedit.history.InsertElementCommand(j));
                za();
                b.parentNode.removeChild(b);
                j.setAttribute("id", n);
                j.removeAttribute("visibility");
                gb([j], true);
                Y(d)
            }
        }
    };
    var zb = function(b, f, d) {
        var r = q.suspendRedraw(1E3);
        ua == "pathedit" && ra.moveNode(b, f);
        d = d || m;
        for (var j = d.length, E = ["g", "polyline", "path"], n = ["transform", "opacity", "filter"]; j--;) {
            var z = d[j];
            if (z != null)
                if ((b === "x" || b === "y") && E.indexOf(z.tagName) >= 0) {
                    var B = getStrokedBBox([z]);
                    e.moveSelectedElements((b === "x" ? f - B.x : 0) * A, (b === "y" ? f - B.y : 0) * A, true)
                } else {
                    z.tagName === "g" && n.indexOf(b);
                    B = b === "#text" ? z.textContent : z.getAttribute(b);
                    if (B ==
                        null) B = "";
                    if (B !== String(f)) {
                        if (b == "#text") {
                            svgedit.utilities.getBBox(z);
                            z.textContent = f;
                            if (/rotate/.test(z.getAttribute("transform"))) z = Hb(z)
                        } else b == "#href" ? Ba(z, f) : z.setAttribute(b, f);
                        ua === "textedit" && b !== "#text" && z.textContent.length && La.toSelectMode(z);
                        if (svgedit.browser.isGecko() && z.nodeName === "text" && /rotate/.test(z.getAttribute("transform")))
                            if (String(f).indexOf("url") === 0 || ["font-size", "font-family", "x", "y"].indexOf(b) >= 0 && z.textContent) z = Hb(z);
                        m.indexOf(z) >= 0 && setTimeout(function() {
                            z.parentNode &&
                                va.requestSelector(z).resize()
                        }, 0);
                        B = svgedit.utilities.getRotationAngle(z);
                        if (B != 0 && b != "transform")
                            for (var G = svgedit.transformlist.getTransformList(z), K = G.numberOfItems; K--;)
                                if (G.getItem(K).type == 4) {
                                    G.removeItem(K);
                                    var C = svgedit.utilities.getBBox(z),
                                        O = svgedit.math.transformPoint(C.x + C.width / 2, C.y + C.height / 2, svgedit.math.transformListToTransform(G).matrix);
                                    C = O.x;
                                    O = O.y;
                                    var T = q.createSVGTransform();
                                    T.setRotate(B, C, O);
                                    G.insertItemBefore(T, K);
                                    break
                                }
                    }
                }
        }
        q.unsuspendRedraw(r)
    }, Va = this.changeSelectedAttribute =
            function(b, f, d) {
                d = d || m;
                e.undoMgr.beginUndoableChange(b, d);
                zb(b, f, d);
                b = e.undoMgr.finishUndoableChange();
                b.isEmpty() || Y(b)
        };
    this.deleteSelectedElements = function() {
        var b, f = new svgedit.history.BatchCommand("Delete Elements"),
            d = m.length,
            r = [];
        for (b = 0; b < d; ++b) {
            var j = m[b];
            if (j == null) break;
            var E = j.parentNode,
                n = j;
            va.releaseSelector(n);
            svgedit.path.removePath_(n.id);
            if (E.tagName === "a" && E.childNodes.length === 1) {
                n = E;
                E = E.parentNode
            }
            var z = n.nextSibling;
            n = E.removeChild(n);
            r.push(j);
            m[b] = null;
            f.addSubCommand(new Wa(n,
                z, E))
        }
        f.isEmpty() || Y(f);
        ma("changed", r);
        za()
    };
    this.cutSelectedElements = function() {
        var b, f = new svgedit.history.BatchCommand("Cut Elements"),
            d = m.length,
            r = [];
        for (b = 0; b < d; ++b) {
            var j = m[b];
            if (j == null) break;
            var E = j.parentNode,
                n = j;
            va.releaseSelector(n);
            svgedit.path.removePath_(n.id);
            var z = n.nextSibling;
            n = E.removeChild(n);
            r.push(j);
            m[b] = null;
            f.addSubCommand(new Wa(n, z, E))
        }
        f.isEmpty() || Y(f);
        ma("changed", r);
        za();
        e.clipBoard = r
    };
    this.copySelectedElements = function() {
        e.clipBoard = $.merge([], m)
    };
    this.pasteElements =
        function(b, f, d) {
            var r = e.clipBoard,
                j = r.length;
            if (j) {
                for (var E = [], n = new svgedit.history.BatchCommand("Paste elements"); j--;) {
                    var z = r[j];
                    if (z) {
                        var B = ob(z);
                        if (!svgedit.utilities.getElem(z.id)) B.id = z.id;
                        E.push(B);
                        (p || u().getCurrentLayer()).appendChild(B);
                        n.addSubCommand(new svgedit.history.InsertElementCommand(B))
                    }
                }
                Za(E);
                if (b !== "in_place") {
                    var G, K;
                    if (b) {
                        if (b === "point") {
                            G = f;
                            K = d
                        }
                    } else {
                        G = Oa.x;
                        K = Oa.y
                    }
                    b = getStrokedBBox(E);
                    var C = G - (b.x + b.width / 2),
                        O = K - (b.y + b.height / 2),
                        T = [],
                        V = [];
                    $.each(E, function() {
                        T.push(C);
                        V.push(O)
                    });
                    G = e.moveSelectedElements(T, V, false);
                    n.addSubCommand(G)
                }
                Y(n);
                ma("changed", E)
            }
    };
    this.groupSelectedElements = function(b, f) {
        b || (b = "g");
        var d = "";
        switch (b) {
            case "a":
                d = "Make hyperlink";
                var r = "";
                if (arguments.length > 1) r = f;
                break;
            default:
                b = "g";
                d = "Group Elements"
        }
        d = new svgedit.history.BatchCommand(d);
        var j = L({
            element: b,
            attr: {
                id: Ga()
            }
        });
        b === "a" && Ba(j, r);
        d.addSubCommand(new svgedit.history.InsertElementCommand(j));
        for (r = m.length; r--;) {
            var E = m[r];
            if (E != null) {
                if (E.parentNode.tagName === "a" && E.parentNode.childNodes.length ===
                    1) E = E.parentNode;
                var n = E.nextSibling,
                    z = E.parentNode;
                j.appendChild(E);
                d.addSubCommand(new svgedit.history.MoveElementCommand(E, n, z))
            }
        }
        d.isEmpty() || Y(d);
        Za([j], true)
    };
    var tb = this.pushGroupProperties = function(b, f) {
        var d = b.childNodes,
            r = d.length,
            j = b.getAttribute("transform"),
            E = svgedit.transformlist.getTransformList(b),
            n = svgedit.math.transformListToTransform(E).matrix,
            z = new svgedit.history.BatchCommand("Push group properties"),
            B = 0,
            G = svgedit.utilities.getRotationAngle(b),
            K = $(b).attr(["filter", "opacity"]),
            C, O, T;
        for (B = 0; B < r; B++) {
            var V = d[B];
            if (V.nodeType === 1) {
                if (K.opacity !== null && K.opacity !== 1) {
                    V.getAttribute("opacity");
                    var X = Math.round((V.getAttribute("opacity") || 1) * K.opacity * 100) / 100;
                    Va("opacity", X, [V])
                }
                if (K.filter) {
                    T = X = this.getBlur(V);
                    O || (O = this.getBlur(b));
                    if (X) X = Number(O) + Number(X);
                    else if (X === 0) X = O;
                    if (T) C = svgedit.utilities.getRefElem(V.getAttribute("filter"));
                    else if (C) {
                        C = ob(C);
                        svgedit.utilities.findDefs().appendChild(C)
                    } else C = svgedit.utilities.getRefElem(K.filter);
                    C.id = V.id + "_" + (C.firstChild.tagName ===
                        "feGaussianBlur" ? "blur" : "filter");
                    Va("filter", "url(#" + C.id + ")", [V]);
                    if (X) {
                        Va("stdDeviation", X, [C.firstChild]);
                        e.setBlurOffsets(C, X)
                    }
                }
                X = svgedit.transformlist.getTransformList(V);
                if (~V.tagName.indexOf("Gradient")) X = null;
                if (X)
                    if (V.tagName !== "defs")
                        if (E.numberOfItems) {
                            if (G && E.numberOfItems == 1) {
                                var ca = E.getItem(0).matrix,
                                    S = q.createSVGMatrix();
                                if (T = svgedit.utilities.getRotationAngle(V)) S = X.getItem(0).matrix;
                                var M = svgedit.utilities.getBBox(V),
                                    J = svgedit.math.transformListToTransform(X).matrix,
                                    N = svgedit.math.transformPoint(M.x +
                                        M.width / 2, M.y + M.height / 2, J);
                                M = G + T;
                                J = q.createSVGTransform();
                                J.setRotate(M, N.x, N.y);
                                ca = svgedit.math.matrixMultiply(ca, S, J.matrix.inverse());
                                T && X.removeItem(0);
                                if (M) X.numberOfItems ? X.insertItemBefore(J, 0) : X.appendItem(J);
                                if (ca.e || ca.f) {
                                    T = q.createSVGTransform();
                                    T.setTranslate(ca.e, ca.f);
                                    X.numberOfItems ? X.insertItemBefore(T, 0) : X.appendItem(T)
                                }
                            } else {
                                ca = V.getAttribute("transform");
                                T = {};
                                T.transform = ca || "";
                                T = q.createSVGTransform();
                                ca = svgedit.math.transformListToTransform(X).matrix;
                                S = ca.inverse();
                                ca = svgedit.math.matrixMultiply(S,
                                    n, ca);
                                T.setMatrix(ca);
                                X.appendItem(T)
                            }(V = svgedit.recalculate.recalculateDimensions(V)) && z.addSubCommand(V)
                        }
            }
        }
        if (j) {
            T = {};
            T.transform = j;
            b.setAttribute("transform", "");
            b.removeAttribute("transform");
            z.addSubCommand(new svgedit.history.ChangeElementCommand(b, T))
        }
        if (f && !z.isEmpty()) return z
    };
    this.ungroupSelectedElement = function() {
        var b = m[0];
        if ($(b).data("gsvg") || $(b).data("symbol")) Zb(b);
        else if (b.tagName === "use") {
            var f = svgedit.utilities.getElem(Ia(b).substr(1));
            $(b).data("symbol", f).data("ref", f);
            Zb(b)
        } else {
            f =
                $(b).parents("a");
            if (f.length) b = f[0];
            if (b.tagName === "g" || b.tagName === "a") {
                f = new svgedit.history.BatchCommand("Ungroup Elements");
                var d = tb(b, true);
                d && f.addSubCommand(d);
                d = b.parentNode;
                for (var r = b.nextSibling, j = Array(b.childNodes.length), E = 0; b.firstChild;) {
                    var n = b.firstChild,
                        z = n.nextSibling,
                        B = n.parentNode;
                    if (n.tagName === "title") {
                        f.addSubCommand(new svgedit.history.RemoveElementCommand(n, n.nextSibling, B));
                        B.removeChild(n)
                    } else {
                        j[E++] = n = d.insertBefore(n, r);
                        f.addSubCommand(new svgedit.history.MoveElementCommand(n,
                            z, B))
                    }
                }
                za();
                r = b.nextSibling;
                b = d.removeChild(b);
                f.addSubCommand(new svgedit.history.RemoveElementCommand(b, r, d));
                f.isEmpty() || Y(f);
                gb(j)
            }
        }
    };
    this.moveToTopSelectedElement = function() {
        var b = m[0];
        if (b != null) {
            b = b;
            var f = b.parentNode,
                d = b.nextSibling;
            b = b.parentNode.appendChild(b);
            if (d != b.nextSibling) {
                Y(new svgedit.history.MoveElementCommand(b, d, f, "top"));
                ma("changed", [b])
            }
        }
    };
    this.moveToBottomSelectedElement = function() {
        var b = m[0];
        if (b != null) {
            b = b;
            var f = b.parentNode,
                d = b.nextSibling,
                r = b.parentNode.firstChild;
            if (r.tagName == "title") r = r.nextSibling;
            if (r.tagName == "defs") r = r.nextSibling;
            b = b.parentNode.insertBefore(b, r);
            if (d != b.nextSibling) {
                Y(new svgedit.history.MoveElementCommand(b, d, f, "bottom"));
                ma("changed", [b])
            }
        }
    };
    this.moveUpDownSelected = function(b) {
        var f = m[0];
        if (f) {
            rb = [];
            var d, r, j = $(eb(getStrokedBBox([f]))).toArray();
            b == "Down" && j.reverse();
            $.each(j, function() {
                if (r) {
                    d = this;
                    return false
                } else if (this == f) r = true
            });
            if (d) {
                j = f.parentNode;
                var E = f.nextSibling;
                $(d)[b == "Down" ? "before" : "after"](f);
                if (E != f.nextSibling) {
                    Y(new svgedit.history.MoveElementCommand(f,
                        E, j, "Move " + b));
                    ma("changed", [f])
                }
            }
        }
    };
    this.moveSelectedElements = function(b, f, d) {
        if (b.constructor != Array) {
            b /= A;
            f /= A
        }
        d = d || true;
        for (var r = new svgedit.history.BatchCommand("position"), j = m.length; j--;) {
            var E = m[j];
            if (E != null) {
                var n = q.createSVGTransform(),
                    z = svgedit.transformlist.getTransformList(E);
                b.constructor == Array ? n.setTranslate(b[j], f[j]) : n.setTranslate(b, f);
                z.numberOfItems ? z.insertItemBefore(n, 0) : z.appendItem(n);
                (n = svgedit.recalculate.recalculateDimensions(E)) && r.addSubCommand(n);
                va.requestSelector(E).resize()
            }
        }
        if (!r.isEmpty()) {
            d &&
                Y(r);
            ma("changed", m);
            return r
        }
    };
    this.cloneSelectedElements = function(b, f) {
        var d, r, j = new svgedit.history.BatchCommand("Clone Elements"),
            E = m.length;
        m.sort(function(n, z) {
            return $(z).index() - $(n).index()
        });
        for (d = 0; d < E; ++d) {
            r = m[d];
            if (r == null) break
        }
        E = m.slice(0, d);
        this.clearSelection(true);
        for (d = E.length; d--;) {
            r = E[d] = ob(E[d]);
            (p || u().getCurrentLayer()).appendChild(r);
            j.addSubCommand(new svgedit.history.InsertElementCommand(r))
        }
        if (!j.isEmpty()) {
            gb(E.reverse());
            this.moveSelectedElements(b, f, false);
            Y(j)
        }
    };
    this.alignSelectedElements =
        function(b, f) {
            var d, r, j = [],
                E = Number.MAX_VALUE,
                n = Number.MIN_VALUE,
                z = Number.MAX_VALUE,
                B = Number.MIN_VALUE,
                G = Number.MIN_VALUE,
                K = Number.MIN_VALUE,
                C = m.length;
            if (C) {
                for (d = 0; d < C; ++d) {
                    if (m[d] == null) break;
                    r = m[d];
                    j[d] = getStrokedBBox([r]);
                    switch (f) {
                        case "smallest":
                            if ((b == "l" || b == "c" || b == "r") && (G == Number.MIN_VALUE || G > j[d].width) || (b == "t" || b == "m" || b == "b") && (K == Number.MIN_VALUE || K > j[d].height)) {
                                E = j[d].x;
                                z = j[d].y;
                                n = j[d].x + j[d].width;
                                B = j[d].y + j[d].height;
                                G = j[d].width;
                                K = j[d].height
                            }
                            break;
                        case "largest":
                            if ((b == "l" ||
                                b == "c" || b == "r") && (G == Number.MIN_VALUE || G < j[d].width) || (b == "t" || b == "m" || b == "b") && (K == Number.MIN_VALUE || K < j[d].height)) {
                                E = j[d].x;
                                z = j[d].y;
                                n = j[d].x + j[d].width;
                                B = j[d].y + j[d].height;
                                G = j[d].width;
                                K = j[d].height
                            }
                            break;
                        default:
                            if (j[d].x < E) E = j[d].x;
                            if (j[d].y < z) z = j[d].y;
                            if (j[d].x + j[d].width > n) n = j[d].x + j[d].width;
                            if (j[d].y + j[d].height > B) B = j[d].y + j[d].height
                    }
                }
                if (f == "page") {
                    z = E = 0;
                    n = e.contentW;
                    B = e.contentH
                }
                r = Array(C);
                G = Array(C);
                for (d = 0; d < C; ++d) {
                    if (m[d] == null) break;
                    K = j[d];
                    r[d] = 0;
                    G[d] = 0;
                    switch (b) {
                        case "l":
                            r[d] = E -
                                K.x;
                            break;
                        case "c":
                            r[d] = (E + n) / 2 - (K.x + K.width / 2);
                            break;
                        case "r":
                            r[d] = n - (K.x + K.width);
                            break;
                        case "t":
                            G[d] = z - K.y;
                            break;
                        case "m":
                            G[d] = (z + B) / 2 - (K.y + K.height / 2);
                            break;
                        case "b":
                            G[d] = B - (K.y + K.height)
                    }
                }
                this.moveSelectedElements(r, G)
            }
    };
    this.contentW = xb().w;
    this.contentH = xb().h;
    this.updateCanvas = function(b, f) {
        q.setAttribute("width", b);
        q.setAttribute("height", f);
        var d = $("#canvasBackground")[0],
            r = w.getAttribute("x"),
            j = w.getAttribute("y"),
            E = b / 2 - this.contentW * A / 2,
            n = f / 2 - this.contentH * A / 2;
        svgedit.utilities.assignAttributes(w, {
            width: this.contentW * A,
            height: this.contentH * A,
            x: E,
            y: n,
            viewBox: "0 0 " + this.contentW + " " + this.contentH
        });
        svgedit.utilities.assignAttributes(d, {
            width: w.getAttribute("width"),
            height: w.getAttribute("height"),
            x: E,
            y: n
        });
        (d = svgedit.utilities.getElem("background_image")) && svgedit.utilities.assignAttributes(d, {
            width: "100%",
            height: "100%"
        });
        va.selectorParentGroup.setAttribute("transform", "translate(" + E + "," + n + ")");
        nb("canvasUpdated", {
            new_x: E,
            new_y: n,
            old_x: r,
            old_y: j,
            d_x: E - r,
            d_y: n - j
        });
        return {
            x: E,
            y: n,
            old_x: r,
            old_y: j,
            d_x: E - r,
            d_y: n - j
        }
    };
    this.setBackground = function(b, f) {
        var d = svgedit.utilities.getElem("canvasBackground"),
            r = $(d).find("rect")[0],
            j = svgedit.utilities.getElem("background_image");
        r.setAttribute("fill", b);
        if (f) {
            if (!j) {
                j = g.createElementNS(c.SVG, "image");
                svgedit.utilities.assignAttributes(j, {
                    id: "background_image",
                    width: "100%",
                    height: "100%",
                    preserveAspectRatio: "xMinYMin",
                    style: "pointer-events:none"
                })
            }
            Ba(j, f);
            d.appendChild(j)
        } else j && j.parentNode.removeChild(j)
    };
    this.cycleElement = function(b) {
        var f = m[0],
            d = false,
            r = sb(p || u().getCurrentLayer());
        if (r.length) {
            if (f == null) {
                b = b ? r.length - 1 : 0;
                d = r[b]
            } else
                for (var j = r.length; j--;)
                    if (r[j] == f) {
                        b = b ? j - 1 : j + 1;
                        if (b >= r.length) b = 0;
                        else if (b < 0) b = r.length - 1;
                        d = r[b];
                        break
                    } Za([d], true);
            ma("selected", m)
        }
    };
    this.clear();
    this.getPrivateMethods = function() {
        return {
            addCommandToHistory: Y,
            setGradient: ac,
            addSvgElementFromJson: L,
            assignAttributes: ib,
            BatchCommand: Xb,
            call: ma,
            ChangeElementCommand: jb,
            copyElem: ob,
            ffClone: Hb,
            findDefs: ea,
            findDuplicateGradient: $b,
            getElem: kb,
            getId: Ya,
            getIntersectionList: eb,
            getMouseTarget: Ib,
            getNextId: Ga,
            getPathBBox: Lb,
            getUrlFromAttr: ka,
            hasMatrixTransform: qa,
            identifyLayers: yb,
            InsertElementCommand: bb,
            isIdentity: svgedit.math.isIdentity,
            logMatrix: Yb,
            matrixMultiply: da,
            MoveElementCommand: Ab,
            preventClickDefault: wb,
            recalculateAllSelectedDimensions: Qb,
            recalculateDimensions: Mb,
            remapElement: pb,
            RemoveElementCommand: Wa,
            removeUnusedDefElems: Tb,
            round: Gb,
            runExtensions: nb,
            sanitizeSvg: Nb,
            SVGEditTransformList: svgedit.transformlist.SVGTransformList,
            toString: toString,
            transformBox: svgedit.math.transformBox,
            transformListToTransform: fa,
            transformPoint: R,
            walkTree: svgedit.utilities.walkTree
        }
    }
};
(function() {
    if (!window.svgEditor) {
        window.svgEditor = function(a) {
            function I(t, m) {
                var L = c.setSvgString(t) !== false;
                m = m || a.noop;
                L ? m(true) : a.alert(v.notification.errorLoadingSVG, function() {
                    m(false)
                })
            }
            var o = {};
            o.tool_scale = 1;
            o.langChanged = false;
            o.showSaveWarning = false;
            o.storagePromptClosed = false;
            var c, i, s = svgedit.utilities,
                e = false,
                g = [],
                q = {}, w = {
                    lang: "",
                    iconsize: "",
                    bkgd_color: "#FFF",
                    bkgd_url: "",
                    img_save: "embed",
                    save_notice_done: false,
                    export_notice_done: false
                }, D = {}, u = {
                    extensions: [],
                    allowedOrigins: []
                }, A = ["ext-overview_window.js", "ext-connector.js", "ext-shapes.js", "ext-imagelib.js", "ext-grid.js", "ext-storage.js"
                ],
                p = {
                    canvasName: "default",
                    canvas_expansion: 3,
                    initFill: {
                        color: "FF0000",
                        opacity: 1
                    },
                    initStroke: {
                        width: 5,
                        color: "000000",
                        opacity: 1
                    },
                    initOpacity: 1,
                    colorPickerCSS: null,
                    initTool: "select",
                    wireframe: false,
                    showlayers: false,
                    no_save_warning: false,
                    imgPath: "images/",
                    langPath: "locale/",
                    extPath: "extensions/",
                    jGraduatePath: "jgraduate/images/",
                    dimensions: [640,
                        480
                    ],
                    gridSnapping: false,
                    gridColor: "#000",
                    baseUnit: "px",
                    snappingStep: 10,
                    showRulers: false,
                    preventAllURLConfig: false,
                    preventURLContentLoading: false,
                    lockExtensions: false,
                    noDefaultExtensions: false,
                    showGrid: false,
                    noStorageOnLoad: false,
                    forceStorage: false,
                    emptyStorageOnDecline: false
                }, v = o.uiStrings = {
                    common: {
                        ok: "OK",
                        cancel: "Cancel",
                        key_up: "Up",
                        key_down: "Down",
                        key_backspace: "Backspace",
                        key_del: "Del"
                    },
                    layers: {
                        layer: "Layer"
                    },
                    notification: {
                        invalidAttrValGiven: "Invalid value given",
                        noContentToFitTo: "No content to fit to",
                        dupeLayerName: "There is already a layer named that!",
                        enterUniqueLayerName: "Please enter a unique layer name",
                        enterNewLayerName: "Please enter the new layer name",
                        layerHasThatName: "Layer already has that name",
                        QmoveElemsToLayer: "Move selected elements to layer '%s'?",
                        QwantToClear: "Do you want to clear the drawing?\nThis will also erase your undo history!",
                        QwantToOpen: "Do you want to open a new file?\nThis will also erase your undo history!",
                        QerrorsRevertToSource: "There were parsing errors in your SVG source.\nRevert back to original SVG source?",
                        QignoreSourceChanges: "Ignore changes made to SVG source?",
                        featNotSupported: "Feature not supported",
                        enterNewImgURL: "Enter the new image URL",
                        defsFailOnSave: "NOTE: Due to a bug in your browser, this image may appear wrong (missing gradients or elements). It will however appear correct once actually saved.",
                        loadingImage: "Loading image, please wait...",
                        saveFromBrowser: "Select 'Save As...' in your browser to save this image as a %s file.",
                        noteTheseIssues: "Also note the following issues: ",
                        unsavedChanges: "There are unsaved changes.",
                        enterNewLinkURL: "Enter the new hyperlink URL",
                        errorLoadingSVG: "Error: Unable to load SVG data",
                        URLloadFail: "Unable to load from URL",
                        retrieving: "Retrieving '%s' ..."
                    }
                };
            a.pref = function(t, m) {
                if (m) {
                    D[t] = m;
                    o.curPrefs = D
                } else return t in D ? D[t] : w[t]
            };
            o.loadContentAndPrefs = function() {
                if (!(!u.forceStorage && (u.noStorageOnLoad || !document.cookie.match(/(?:^|;\s*)store=(?:prefsAndContent|prefsOnly)/)))) {
                    if (o.storage && (u.forceStorage || !u.noStorageOnLoad && document.cookie.match(/(?:^|;\s*)store=prefsAndContent/))) {
                        var t =
                            o.storage.getItem("svgedit-" + u.canvasName);
                        t && o.loadFromString(t)
                    }
                    for (var m in w)
                        if (w.hasOwnProperty(m)) {
                            t = "svg-edit-" + m;
                            if (o.storage) {
                                if (t = o.storage.getItem(t)) w[m] = String(t)
                            } else if (window.widget) w[m] = widget.preferenceForKey(t);
                            else {
                                t = document.cookie.match(RegExp("(?:^|;\\s*)" + s.preg_quote(encodeURIComponent(t)) + "=([^;]+)"));
                                w[m] = t ? decodeURIComponent(t[1]) : ""
                            }
                        }
                }
            };
            o.setConfig = function(t, m) {
                function L(R, da, qa) {
                    if (R[da] && typeof R[da] === "object") a.extend(true, R[da], qa);
                    else R[da] = qa
                }
                m = m || {};
                a.each(t,
                    function(R, da) {
                        if (t.hasOwnProperty(R))
                            if (w.hasOwnProperty(R)) {
                                if (!(m.overwrite === false && (u.preventAllURLConfig || D.hasOwnProperty(R))))
                                    if (m.allowInitialUserOverride === true) w[R] = da;
                                    else a.pref(R, da)
                            } else if (["extensions", "allowedOrigins"].indexOf(R) > -1) m.overwrite === false && (u.preventAllURLConfig || R === "allowedOrigins" || R === "extensions" && u.lockExtensions) || (u[R] = u[R].concat(da));
                        else if (p.hasOwnProperty(R))
                            if (!(m.overwrite === false && (u.preventAllURLConfig || u.hasOwnProperty(R))))
                                if (u.hasOwnProperty(R)) m.overwrite !==
                                    false && L(u, R, da);
                                else if (m.allowInitialUserOverride === true) L(p, R, da);
                        else if (p[R] && typeof p[R] === "object") {
                            u[R] = {};
                            a.extend(true, u[R], da)
                        } else u[R] = da
                    });
                o.curConfig = u
            };
            o.setCustomHandlers = function(t) {
                o.ready(function() {
                    if (t.open) {
                        a('#tool_open > input[type="file"]').remove();
                        a("#tool_open").show();
                        c.open = t.open
                    }
                    if (t.save) {
                        o.showSaveWarning = false;
                        c.bind("saved", t.save)
                    }
                    if (t.exportImage || t.pngsave) c.bind("exported", t.exportImage || t.pngsave);
                    q = t
                })
            };
            o.randomizeIds = function() {
                c.randomizeIds(arguments)
            };
            o.init = function() {
                function t() {
                    u = a.extend(true, {}, p, u);
                    if (!u.noDefaultExtensions) u.extensions = u.extensions.concat(A);
                    a.each(["extensions", "allowedOrigins"], function(h, k) {
                        u[k] = a.grep(u[k], function(H, F) {
                            return F === u[k].indexOf(H)
                        })
                    });
                    o.curConfig = u
                }

                function m(h, k) {
                    var H = h.id,
                        F = H.split("_"),
                        Q = F[0];
                    F = F[1];
                    k && c.setStrokeAttr("stroke-" + Q, F);
                    vb();
                    ib("#cur_" + Q, H, 20);
                    a(h).addClass("current").siblings().removeClass("current")
                }

                function L(h, k) {
                    a.pref("bkgd_color", h);
                    a.pref("bkgd_url", k);
                    c.setBackground(h, k)
                }

                function R() {
                    var h =
                        c.getHref(oa);
                    h = h.indexOf("data:") === 0 ? "" : h;
                    a.prompt(v.notification.enterNewImgURL, h, function(k) {
                        k && nb(k)
                    })
                }

                function da(h, k) {
                    k || (k = c.getZoom());
                    h || (h = a("#svgcanvas"));
                    var H, F, Q = c.getContentElem(),
                        U = svgedit.units.getTypeMap()[u.baseUnit];
                    for (H = 0; H < 2; H++) {
                        var Z = H === 0,
                            ga = Z ? "x" : "y",
                            ja = Z ? "width" : "height",
                            la = Number(Q.getAttribute(ga));
                        ga = a("#ruler_" + ga + " canvas:first");
                        var ia = ga.clone();
                        ga.replaceWith(ia);
                        var na = ia[0];
                        var sa = ga = h[ja]();
                        na.parentNode.style[ja] = sa + "px";
                        var Ha = 0,
                            W = na.getContext("2d"),
                            Ea, xa,
                            Ja;
                        W.fillStyle = "rgb(200,0,0)";
                        W.fillRect(0, 0, na.width, na.height);
                        ia.siblings().remove();
                        if (ga >= 3E4) {
                            Ja = parseInt(ga / 3E4, 10) + 1;
                            Ea = [];
                            Ea[0] = W;
                            var Qa;
                            for (F = 1; F < Ja; F++) {
                                na[ja] = 3E4;
                                Qa = na.cloneNode(true);
                                na.parentNode.appendChild(Qa);
                                Ea[F] = Qa.getContext("2d")
                            }
                            Qa[ja] = ga % 3E4;
                            ga = 3E4
                        }
                        na[ja] = ga;
                        ja = U * k;
                        na = 50 / ja;
                        ia = 1;
                        for (F = 0; F < Sa.length; F++) {
                            ia = xa = Sa[F];
                            if (na <= xa) break
                        }
                        na = ia * ja;
                        W.font = "9px sans-serif";
                        for (var Fa = la / ja % ia * ja, Ra = Fa - na; Fa < sa;) {
                            Ra += na;
                            F = Math.round(Fa) + 0.5;
                            if (Z) {
                                W.moveTo(F, 15);
                                W.lineTo(F, 0)
                            } else {
                                W.moveTo(15,
                                    F);
                                W.lineTo(0, F)
                            }
                            xa = (Ra - la) / ja;
                            if (ia >= 1) F = Math.round(xa);
                            else {
                                F = String(ia).split(".")[1].length;
                                F = xa.toFixed(F)
                            } if (F !== 0 && F !== 1E3 && F % 1E3 === 0) F = F / 1E3 + "K";
                            if (Z) W.fillText(F, Fa + 2, 8);
                            else {
                                xa = String(F).split("");
                                for (F = 0; F < xa.length; F++) W.fillText(xa[F], 1, Fa + 9 + F * 9)
                            }
                            xa = na / 10;
                            for (F = 1; F < 10; F++) {
                                var Pa = Math.round(Fa + xa * F) + 0.5;
                                if (Ea && Pa > ga) {
                                    Ha++;
                                    W.stroke();
                                    if (Ha >= Ja) {
                                        F = 10;
                                        Fa = sa;
                                        continue
                                    }
                                    W = Ea[Ha];
                                    Fa -= 3E4;
                                    Pa = Math.round(Fa + xa * F) + 0.5
                                }
                                var Ka = F % 2 ? 12 : 10;
                                if (Z) {
                                    W.moveTo(Pa, 15);
                                    W.lineTo(Pa, Ka)
                                } else {
                                    W.moveTo(15, Pa);
                                    W.lineTo(Ka,
                                        Pa)
                                }
                            }
                            Fa += na
                        }
                        W.strokeStyle = "#000";
                        W.stroke()
                    }
                }

                function qa() {
                    if (c.deleteCurrentLayer()) {
                        cb();
                        Ua();
                        a("#layerlist tr.layer").removeClass("layersel");
                        a("#layerlist tr.layer:first").addClass("layersel")
                    }
                }

                function fa() {
                    var h = c.getCurrentDrawing().getCurrentLayerName() + " copy";
                    a.prompt(v.notification.enterUniqueLayerName, h, function(k) {
                        if (k)
                            if (c.getCurrentDrawing().hasLayer(k)) a.alert(v.notification.dupeLayerName);
                            else {
                                c.cloneLayer(k);
                                cb();
                                Ua()
                            }
                    })
                }

                function ea(h) {
                    var k = a("#layerlist tr.layersel").index(),
                        H =
                            c.getCurrentDrawing().getNumLayers();
                    if (k > 0 || k < H - 1) {
                        k += h;
                        c.setCurrentLayerPosition(H - k - 1);
                        Ua()
                    }
                }

                function ka(h) {
                    h.stopPropagation();
                    h.preventDefault()
                }

                function Ia(h) {
                    h.stopPropagation();
                    h.preventDefault()
                }

                function Ba(h) {
                    h.stopPropagation();
                    h.preventDefault()
                }
                try {
                    if ("localStorage" in window) o.storage = localStorage
                } catch (Lb) {}
                var kb = [];
                a("#lang_select option").each(function() {
                    kb.push(this.value)
                });
                (function() {
                    var h, k;
                    i = a.deparam.querystring(true);
                    if (a.isEmptyObject(i)) {
                        t();
                        o.loadContentAndPrefs()
                    } else {
                        if (i.dimensions) i.dimensions =
                            i.dimensions.split(",");
                        if (i.bkgd_color) i.bkgd_color = "#" + i.bkgd_color;
                        if (i.extensions) i.extensions = i.extensions.match(/[:\/\\]/) ? "" : i.extensions.split(",");
                        a.each(["extPath", "imgPath", "langPath", "jGraduatePath"], function(H) {
                            i[H] && delete i[H]
                        });
                        o.setConfig(i, {
                            overwrite: false
                        });
                        t();
                        if (!u.preventURLContentLoading) {
                            h = i.source;
                            k = a.param.querystring();
                            if (!h)
                                if (k.indexOf("source=data:") >= 0) h = k.match(/source=(data:[^&]*)/)[1];
                            if (h) {
                                if (h.indexOf("data:") === 0) {
                                    h = h.replace(/ /g, "+");
                                    o.loadFromDataURI(h)
                                } else o.loadFromString(h);
                                return
                            }
                            if (k.indexOf("paramurl=") !== -1) {
                                o.loadFromURL(k.substr(9));
                                return
                            }
                            if (i.url) {
                                o.loadFromURL(i.url);
                                return
                            }
                        }
                        if (!i.noStorageOnLoad || u.forceStorage) o.loadContentAndPrefs()
                    }
                    D = a.extend(true, {}, w, D);
                    o.curPrefs = D
                })();
                (function() {
                    var h, k = window.opener;
                    if (k) try {
                        h = k.document.createEvent("Event");
                        h.initEvent("svgEditorReady", true, true);
                        k.document.documentElement.dispatchEvent(h)
                    } catch (H) {}
                })();
                var ib = o.setIcon = function(h, k) {
                    var H = typeof k === "string" ? a.getSvgIcon(k, true) : k.clone();
                    H ? a(h).empty().append(H) :
                        console.log("NOTE: Icon image missing: " + k)
                }, ta = function() {
                        a.each(u.extensions, function() {
                            var h = this;
                            h.match(/^ext-.*\.js/) && a.getScript(u.extPath + h, function(k) {
                                if (!k) {
                                    k = document.createElement("script");
                                    k.src = u.extPath + h;
                                    document.querySelector("head").appendChild(k)
                                }
                            })
                        });
                        o.putLocale(null, kb)
                    };
                document.location.protocol === "file:" ? setTimeout(ta, 100) : ta();
                a.svgIcons(u.imgPath + "svg_edit_icons.svg", {
                    w: 24,
                    h: 24,
                    id_match: false,
                    no_img: !svgedit.browser.isWebkit(),
                    fallback_path: u.imgPath,
                    fallback: {
                        new_image: "clear.png",
                        save: "save.png",
                        open: "open.png",
                        source: "source.png",
                        docprops: "document-properties.png",
                        wireframe: "wireframe.png",
                        undo: "undo.png",
                        redo: "redo.png",
                        select: "select.png",
                        select_node: "select_node.png",
                        pencil: "fhpath.png",
                        pen: "line.png",
                        square: "square.png",
                        rect: "rect.png",
                        fh_rect: "freehand-square.png",
                        circle: "circle.png",
                        ellipse: "ellipse.png",
                        fh_ellipse: "freehand-circle.png",
                        path: "path.png",
                        text: "text.png",
                        image: "image.png",
                        zoom: "zoom.png",
                        clone: "clone.png",
                        node_clone: "node_clone.png",
                        "delete": "delete.png",
                        node_delete: "node_delete.png",
                        group: "shape_group_elements.png",
                        ungroup: "shape_ungroup.png",
                        move_top: "move_top.png",
                        move_bottom: "move_bottom.png",
                        to_path: "to_path.png",
                        link_controls: "link_controls.png",
                        reorient: "reorient.png",
                        align_left: "align-left.png",
                        align_center: "align-center.png",
                        align_right: "align-right.png",
                        align_top: "align-top.png",
                        align_middle: "align-middle.png",
                        align_bottom: "align-bottom.png",
                        go_up: "go-up.png",
                        go_down: "go-down.png",
                        ok: "save.png",
                        cancel: "cancel.png",
                        arrow_right: "flyouth.png",
                        arrow_down: "dropdown.gif"
                    },
                    placement: {
                        "#logo": "logo",
                        "#tool_clear div,#layer_new": "new_image",
                        "#tool_save div": "save",
                        "#tool_export div": "export",
                        "#tool_open div div": "open",
                        "#tool_import div div": "import",
                        "#tool_source": "source",
                        "#tool_docprops > div": "docprops",
                        "#tool_wireframe": "wireframe",
                        "#tool_undo": "undo",
                        "#tool_redo": "redo",
                        "#tool_select": "select",
                        "#tool_fhpath": "pencil",
                        "#tool_line": "pen",
                        "#tool_rect,#tools_rect_show": "rect",
                        "#tool_square": "square",
                        "#tool_fhrect": "fh_rect",
                        "#tool_ellipse,#tools_ellipse_show": "ellipse",
                        "#tool_circle": "circle",
                        "#tool_fhellipse": "fh_ellipse",
                        "#tool_path": "path",
                        "#tool_text,#layer_rename": "text",
                        "#tool_image": "image",
                        "#tool_zoom": "zoom",
                        "#tool_clone,#tool_clone_multi": "clone",
                        "#tool_node_clone": "node_clone",
                        "#layer_delete,#tool_delete,#tool_delete_multi": "delete",
                        "#tool_node_delete": "node_delete",
                        "#tool_add_subpath": "add_subpath",
                        "#tool_openclose_path": "open_path",
                        "#tool_move_top": "move_top",
                        "#tool_move_bottom": "move_bottom",
                        "#tool_topath": "to_path",
                        "#tool_node_link": "link_controls",
                        "#tool_reorient": "reorient",
                        "#tool_group_elements": "group_elements",
                        "#tool_ungroup": "ungroup",
                        "#tool_unlink_use": "unlink_use",
                        "#tool_alignleft, #tool_posleft": "align_left",
                        "#tool_aligncenter, #tool_poscenter": "align_center",
                        "#tool_alignright, #tool_posright": "align_right",
                        "#tool_aligntop, #tool_postop": "align_top",
                        "#tool_alignmiddle, #tool_posmiddle": "align_middle",
                        "#tool_alignbottom, #tool_posbottom": "align_bottom",
                        "#cur_position": "align",
                        "#linecap_butt,#cur_linecap": "linecap_butt",
                        "#linecap_round": "linecap_round",
                        "#linecap_square": "linecap_square",
                        "#linejoin_miter,#cur_linejoin": "linejoin_miter",
                        "#linejoin_round": "linejoin_round",
                        "#linejoin_bevel": "linejoin_bevel",
                        "#url_notice": "warning",
                        "#layer_up": "go_up",
                        "#layer_down": "go_down",
                        "#layer_moreopts": "context_menu",
                        "#layerlist td.layervis": "eye",
                        "#tool_source_save,#tool_docprops_save,#tool_prefs_save": "ok",
                        "#tool_source_cancel,#tool_docprops_cancel,#tool_prefs_cancel": "cancel",
                        "#rwidthLabel, #iwidthLabel": "width",
                        "#rheightLabel, #iheightLabel": "height",
                        "#cornerRadiusLabel span": "c_radius",
                        "#angleLabel": "angle",
                        "#linkLabel,#tool_make_link,#tool_make_link_multi": "globe_link",
                        "#zoomLabel": "zoom",
                        "#tool_fill label": "fill",
                        "#tool_stroke .icon_label": "stroke",
                        "#group_opacityLabel": "opacity",
                        "#blurLabel": "blur",
                        "#font_sizeLabel": "fontsize",
                        ".flyout_arrow_horiz": "arrow_right",
                        ".dropdown button, #main_button .dropdown": "arrow_down",
                        "#palette .palette_item:first, #fill_bg, #stroke_bg": "no_color"
                    },
                    resize: {
                        "#logo .svg_icon": 28,
                        ".flyout_arrow_horiz .svg_icon": 5,
                        ".layer_button .svg_icon, #layerlist td.layervis .svg_icon": 14,
                        ".dropdown button .svg_icon": 7,
                        "#main_button .dropdown .svg_icon": 9,
                        ".palette_item:first .svg_icon": 15,
                        "#fill_bg .svg_icon, #stroke_bg .svg_icon": 16,
                        ".toolbar_button button .svg_icon": 16,
                        ".stroke_tool div div .svg_icon": 20,
                        "#tools_bottom label .svg_icon": 18
                    },
                    callback: function() {
                        a(".toolbar_button button > svg, .toolbar_button button > img").each(function() {
                            a(this).parent().prepend(this)
                        });
                        var h, k = a("#tools_left");
                        if (k.length !== 0) h = k.offset().top + k.outerHeight();
                        k = a.pref("iconsize");
                        o.setIconSize(k ||
                            (a(window).height() < h ? "s" : "m"));
                        a(".tools_flyout").each(function() {
                            var H = a("#" + this.id + "_show"),
                                F = H.attr("data-curopt");
                            if (!H.children("svg, img").length) {
                                F = a(F).children().clone();
                                if (F.length) {
                                    F[0].removeAttribute("style");
                                    H.append(F)
                                }
                            }
                        });
                        o.runCallbacks();
                        setTimeout(function() {
                            a(".flyout_arrow_horiz:empty").each(function() {
                                a(this).append(a.getSvgIcon("arrow_right").width(5).height(5))
                            })
                        }, 1)
                    }
                });
                o.canvas = c = new a.SvgCanvas(document.getElementById("svgcanvas"), u);
                var pb, Mb, ab, Nb, Ab, bb = svgedit.browser.isMac() ?
                        "meta+" : "ctrl+",
                    Wa = c.pathActions,
                    jb = c.undoMgr,
                    Xb = u.imgPath + "logo.png",
                    Y = a("#workarea"),
                    va = a("#cmenu_canvas"),
                    qb = null,
                    Ob = "crosshair",
                    Db = "crosshair",
                    ub = "toolbars",
                    Bb = "",
                    Na = {
                        fill: null,
                        stroke: null
                    };
                (function() {
                    a("#dialog_container").draggable({
                        cancel: "#dialog_content, #dialog_buttons *",
                        containment: "window"
                    });
                    var h = a("#dialog_box"),
                        k = a("#dialog_buttons"),
                        H = a("#dialog_content"),
                        F = function(Q, U, Z, ga, ja, la, ia) {
                            var na, sa, Ha;
                            H.html("<p>" + U.replace(/\n/g, "</p><p>") + "</p>").toggleClass("prompt", Q == "prompt");
                            k.empty();
                            na = a('<input type="button" value="' + v.common.ok + '">').appendTo(k);
                            Q !== "alert" && a('<input type="button" value="' + v.common.cancel + '">').appendTo(k).click(function() {
                                h.hide();
                                Z(false)
                            });
                            if (Q === "prompt") {
                                sa = a('<input type="text">').prependTo(k);
                                sa.val(ga || "");
                                sa.bind("keydown", "return", function() {
                                    na.click()
                                })
                            } else if (Q === "select") {
                                U = a('<div style="text-align:center;">');
                                sa = a("<select>").appendTo(U);
                                if (ia) {
                                    var W = a("<label>").text(ia.label);
                                    Ha = a('<input type="checkbox">').appendTo(W);
                                    Ha.val(ia.value);
                                    ia.tooltip && W.attr("title", ia.tooltip);
                                    Ha.prop("checked", !! ia.checked);
                                    U.append(a("<div>").append(W))
                                }
                                a.each(ja || [], function(Ea, xa) {
                                    typeof xa === "object" ? sa.append(a("<option>").val(xa.value).html(xa.text)) : sa.append(a("<option>").html(xa))
                                });
                                H.append(U);
                                ga && sa.val(ga);
                                la && sa.bind("change", "return", la);
                                sa.bind("keydown", "return", function() {
                                    na.click()
                                })
                            }
                            Q === "process" && na.hide();
                            h.show();
                            na.click(function() {
                                h.hide();
                                var Ea = Q === "prompt" || Q === "select" ? sa.val() : true;
                                if (Z) Ha ? Z(Ea, Ha.prop("checked")) : Z(Ea)
                            }).focus();
                            if (Q === "prompt" || Q === "select") sa.focus()
                        };
                    a.alert = function(Q, U) {
                        F("alert", Q, U)
                    };
                    a.confirm = function(Q, U) {
                        F("confirm", Q, U)
                    };
                    a.process_cancel = function(Q, U) {
                        F("process", Q, U)
                    };
                    a.prompt = function(Q, U, Z) {
                        F("prompt", Q, Z, U)
                    };
                    a.select = function(Q, U, Z, ga, ja, la) {
                        F("select", Q, Z, ja, U, ga, la)
                    }
                })();
                var mb = function() {
                    var h = a(".tool_button_current");
                    if (h.length && h[0].id !== "tool_select") {
                        h.removeClass("tool_button_current").addClass("tool_button");
                        a("#tool_select").addClass("tool_button_current").removeClass("tool_button");
                        a("#styleoverrides").text("#svgcanvas svg *{cursor:move;pointer-events:all} #svgcanvas svg{cursor:default}")
                    }
                    c.setMode("select");
                    Y.css("cursor", "auto")
                }, oa = null,
                    Ma = false,
                    ya = false,
                    lb = false,
                    ua = false,
                    db = "",
                    Fb = a("title:first").text(),
                    Sa = [];
                for (ta = 0.1; ta < 1E5; ta *= 10) {
                    Sa.push(ta);
                    Sa.push(2 * ta);
                    Sa.push(5 * ta)
                }
                var Ta = function(h) {
                    var k, H = [],
                        F = c.getCurrentDrawing().getNumLayers();
                    for (k = 0; k < F; k++) H[k] = c.getCurrentDrawing().getLayerName(k);
                    if (h)
                        for (k = 0; k < F; ++k) H[k] != h && c.getCurrentDrawing().setLayerOpacity(H[k],
                            0.5);
                    else
                        for (k = 0; k < F; ++k) c.getCurrentDrawing().setLayerOpacity(H[k], 1)
                }, Ua = function() {
                        c.clearSelection();
                        for (var h = a("#layerlist tbody").empty(), k = a("#selLayerNames").empty(), H = c.getCurrentDrawing(), F = H.getCurrentLayerName(), Q = c.getCurrentDrawing().getNumLayers(), U = a.getSvgIcon("eye"); Q--;) {
                            var Z = H.getLayerName(Q),
                                ga = a('<tr class="layer">').toggleClass("layersel", Z === F),
                                ja = a('<td class="layervis">').toggleClass("layerinvis", !H.getLayerVisibility(Z)),
                                la = a('<td class="layername">' + Z + "</td>");
                            h.append(ga.append(ja,
                                la));
                            k.append('<option value="' + Z + '">' + Z + "</option>")
                        }
                        if (U !== undefined) {
                            k = U.clone();
                            a("td.layervis", h).append(k);
                            a.resizeSvgIcons({
                                "td.layervis .svg_icon": 14
                            })
                        }
                        a("#layerlist td.layername").mouseup(function(ia) {
                            a("#layerlist tr.layer").removeClass("layersel");
                            a(this.parentNode).addClass("layersel");
                            c.setCurrentLayer(this.textContent);
                            ia.preventDefault()
                        }).mouseover(function() {
                            Ta(this.textContent)
                        }).mouseout(function() {
                            Ta()
                        });
                        a("#layerlist td.layervis").click(function() {
                            var ia = a(this.parentNode).prevAll().length;
                            ia = a("#layerlist tr.layer:eq(" + ia + ") td.layername").text();
                            var na = a(this).hasClass("layerinvis");
                            c.setLayerVisibility(ia, na);
                            a(this).toggleClass("layerinvis")
                        });
                        for (k = 5 - a("#layerlist tr.layer").size(); k-- > 0;) h.append('<tr><td style="color:white">_</td><td/></tr>')
                    }, Ca = function(h, k) {
                        if (!ya) {
                            ya = true;
                            Bb = c.getSvgString();
                            a("#save_output_btns").toggle( !! k);
                            a("#tool_source_back").toggle(!k);
                            a("#svg_source_textarea").val(Bb);
                            a("#svg_source_editor").fadeIn();
                            a("#svg_source_textarea").focus()
                        }
                    }, rb = function(h,
                        k) {
                        a("#path_node_panel").toggle(h);
                        a("#tools_bottom_2,#tools_bottom_3").toggle(!h);
                        if (h) {
                            a(".tool_button_current").removeClass("tool_button_current").addClass("tool_button");
                            a("#tool_select").addClass("tool_button_current").removeClass("tool_button");
                            ib("#tool_select", "select_node");
                            Ma = false;
                            if (k.length) oa = k[0]
                        } else setTimeout(function() {
                            ib("#tool_select", "select")
                        }, 1E3)
                    }, vb = function() {
                        window.opera && a("<p/>").hide().appendTo("body").remove()
                    }, Oa = o.toolButtonClick = function(h, k) {
                        if (a(h).hasClass("disabled")) return false;
                        if (a(h).parent().hasClass("tools_flyout")) return true;
                        k || a(".tools_flyout").fadeOut("normal");
                        a("#styleoverrides").text("");
                        Y.css("cursor", "auto");
                        a(".tool_button_current").removeClass("tool_button_current").addClass("tool_button");
                        a(h).addClass("tool_button_current").removeClass("tool_button");
                        return true
                    }, Eb = o.clickSelect = function() {
                        if (Oa("#tool_select")) {
                            c.setMode("select");
                            a("#styleoverrides").text("#svgcanvas svg *{cursor:move;pointer-events:all}, #svgcanvas svg{cursor:default}")
                        }
                    }, nb = o.setImageURL =
                        function(h) {
                            h || (h = Xb);
                            c.setImageURL(h);
                            a("#image_url").val(h);
                            if (h.indexOf("data:") === 0) {
                                a("#image_url").hide();
                                a("#change_image_url").show()
                            } else {
                                c.embedImage(h, function(k) {
                                    a("#url_notice").toggle(!k);
                                    Xb = h
                                });
                                a("#image_url").show();
                                a("#change_image_url").hide()
                            }
                    }, Gb = function(h) {
                        var k = Math.min(Math.max(12 + h.value.length * 6, 50), 300);
                        a(h).width(k)
                    }, 
                    eb = o.updateCanvas = function(h, k) {
                        //THIS BITCH IS THE ZOOMING MFER THAT KILLS MY SOUL

                        // var H = Y.width(),
                        //     F = Y.height(),
                        //     Q = H,
                        //     U = F,
                        //     Z = c.getZoom(),
                        //     ga = a("#svgcanvas"),
                        //     ja = {
                        //         x: Y[0].scrollLeft + Q / 2,
                        //         y: Y[0].scrollTop + U / 2
                        //     }, la = u.canvas_expansion;
                        // H = Math.max(Q, c.contentW * Z * la);
                        // F = Math.max(U, c.contentH * Z * la);
                        // H == Q && F == U ? Y.css("overflow", "hidden") : Y.css("overflow", "scroll");
                        // la = ga.height() / 2;
                        // var ia = ga.width() / 2;
                        // ga.width(H).height(F);
                        // var na = F / 2,
                        //     sa = H / 2,
                        //     Ha = c.updateCanvas(H, F),
                        //     W = sa / ia;
                        // H = H / 2 - Q / 2;
                        // F = F / 2 - U / 2;
                        // if (k) {
                        //     k.x += Ha.x;
                        //     k.y += Ha.y
                        // } else k = {
                        //     x: sa + (ja.x - ia) * W,
                        //     y: na + (ja.y - la) * W
                        // }; if (h)
                        //     if (c.contentW > Y.width()) {
                        //         Y[0].scrollLeft = Ha.x - 10;
                        //         Y[0].scrollTop = Ha.y - 10
                        //     } else {
                        //         Y[0].scrollLeft = H;
                        //         Y[0].scrollTop = F
                        //     } else {
                        //         Y[0].scrollLeft = k.x - Q / 2;
                        //         Y[0].scrollTop = k.y - U / 2
                        //     }
                        // if (u.showRulers) {
                        //     da(ga,
                        //         Z);
                        //     Y.scroll()
                        // }
                        // i.storagePrompt !== true && !o.storagePromptClosed && a("#dialog_box").hide()
                    }, 
                    sb = function() {
                        var h, k, H = c.getColor("fill") == "none",
                            F = c.getColor("stroke") == "none",
                            Q = ["#tool_fhpath", "#tool_line"],
                            U = ["#tools_rect .tool_button", "#tools_ellipse .tool_button", "#tool_text", "#tool_path"];
                        if (F)
                            for (h in Q) {
                                k = Q[h];
                                a(k).hasClass("tool_button_current") && Eb();
                                a(k).addClass("disabled")
                            } else
                                for (h in Q) {
                                    k = Q[h];
                                    a(k).removeClass("disabled")
                                }
                        if (F && H)
                            for (h in U) {
                                k = U[h];
                                a(k).hasClass("tool_button_current") && Eb();
                                a(k).addClass("disabled")
                            } else
                                for (h in U) {
                                    k = U[h];
                                    a(k).removeClass("disabled")
                                }
                        c.runExtensions("toolButtonStateUpdate", {
                            nofill: H,
                            nostroke: F
                        });
                        a(".tools_flyout").each(function() {
                            var Z = a("#" + this.id + "_show"),
                                ga = false;
                            a(this).children().each(function() {
                                a(this).hasClass("disabled") || (ga = true)
                            });
                            Z.toggleClass("disabled", !ga)
                        });
                        vb()
                    }, cb = function() {
                        var h = oa;
                        if (h != null && !h.parentNode) h = null;
                        var k = c.getCurrentDrawing().getCurrentLayerName(),
                            H = c.getMode(),
                            F = u.baseUnit !== "px" ? u.baseUnit : null,
                            Q = H == "pathedit",
                            U = a("#cmenu_canvas li");
                        a("#multiselected_panel, #g_panel, #rect_panel, #circle_panel,#ellipse_panel, #line_panel, #image_panel, #use_panel, #a_panel").hide();
                        if (h != null) {
                            var Z = h.nodeName,
                                ga = c.getRotationAngle(h);
                            a("#angle").val(ga);
                            var ja = c.getBlur(h);
                            a("#blur").val(ja);
                            a("#blur_slider").slider("option", "value", ja);
                            c.addedNew && Z === "image" && c.getHref(h).indexOf("data:") !== 0 && R();
                            if (!Q && H != "pathedit") {
                                a("#selected_panel").show();
                                if (["line", "circle", "ellipse"].indexOf(Z) >=
                                    0) a("#xy_panel").hide();
                                else {
                                    var la, ia;
                                    if (["g", "polyline", "path"].indexOf(Z) >= 0) {
                                        if (H = c.getStrokedBBox([h])) {
                                            la = H.x;
                                            ia = H.y
                                        }
                                    } else {
                                        la = h.getAttribute("x");
                                        ia = h.getAttribute("y")
                                    } if (F) {
                                        la = svgedit.units.convertUnit(la);
                                        ia = svgedit.units.convertUnit(ia)
                                    }
                                    a("#selected_x").val(la || 0);
                                    a("#selected_y").val(ia || 0);
                                    a("#xy_panel").show()
                                }
                                F = ["image", "text", "path", "g", "use"].indexOf(Z) == -1;
                                a("#tool_topath").toggle(F);
                                a("#tool_reorient").toggle(Z === "path");
                                a("#tool_reorient").toggleClass("disabled", ga === 0)
                            } else {
                                k =
                                    Wa.getNodePoint();
                                a("#tool_add_subpath").removeClass("push_button_pressed").addClass("tool_button");
                                a("#tool_node_delete").toggleClass("disabled", !Wa.canDeleteNodes);
                                ib("#tool_openclose_path", Wa.closed_subpath ? "open_path" : "close_path");
                                if (k) {
                                    Q = a("#seg_type");
                                    if (F) {
                                        k.x = svgedit.units.convertUnit(k.x);
                                        k.y = svgedit.units.convertUnit(k.y)
                                    }
                                    a("#path_node_x").val(k.x);
                                    a("#path_node_y").val(k.y);
                                    k.type ? Q.val(k.type).removeAttr("disabled") : Q.val(4).attr("disabled", "disabled")
                                }
                                return
                            }
                            F = {
                                g: [],
                                a: [],
                                rect: ["rx",
                                    "width", "height"
                                ],
                                image: ["width", "height"],
                                circle: ["cx", "cy", "r"],
                                ellipse: ["cx", "cy", "rx", "ry"],
                                line: ["x1", "y1", "x2", "y2"],
                                text: [],
                                use: []
                            };
                            var na = h.tagName;
                            Z = null;
                            if (na === "a") {
                                Z = c.getHref(h);
                                a("#g_panel").show()
                            }
                            if (h.parentNode.tagName === "a")
                                if (!a(h).siblings().length) {
                                    a("#a_panel").show();
                                    Z = c.getHref(h.parentNode)
                                }
                            a("#tool_make_link, #tool_make_link").toggle(!Z);
                            Z && a("#link_url").val(Z);
                            if (F[na]) {
                                F = F[na];
                                a("#" + na + "_panel").show();
                                a.each(F, function(sa, Ha) {
                                    var W = h.getAttribute(Ha);
                                    if (u.baseUnit !==
                                        "px" && h[Ha]) W = svgedit.units.convertUnit(h[Ha].baseVal.value);
                                    a("#" + na + "_" + Ha).val(W || 0)
                                });
                                if (na == "text") {
                                    a("#text_panel").css("display", "inline");
                                    c.getItalic() ? a("#tool_italic").addClass("push_button_pressed").removeClass("tool_button") : a("#tool_italic").removeClass("push_button_pressed").addClass("tool_button");
                                    c.getBold() ? a("#tool_bold").addClass("push_button_pressed").removeClass("tool_button") : a("#tool_bold").removeClass("push_button_pressed").addClass("tool_button");
                                    a("#font_family").val(h.getAttribute("font-family"));
                                    a("#font_size").val(h.getAttribute("font-size"));
                                    a("#text").val(h.textContent);
                                    c.addedNew && setTimeout(function() {
                                        a("#text").focus().select()
                                    }, 100)
                                } else if (na == "image") nb(c.getHref(h));
                                else if (na === "g" || na === "use") {
                                    a("#container_panel").show();
                                    F = c.getTitle();
                                    Z = a("#g_title")[0];
                                    Z.value = F;
                                    Gb(Z);
                                    a("#g_title").prop("disabled", na == "use")
                                }
                            }
                            U[(na === "g" ? "en" : "dis") + "ableContextMenuItems"]("#ungroup");
                            U[(na === "g" || !Ma ? "dis" : "en") + "ableContextMenuItems"]("#group")
                        } else if (Ma) {
                            a("#multiselected_panel").show();
                            U.enableContextMenuItems("#group").disableContextMenuItems("#ungroup")
                        } else U.disableContextMenuItems("#delete,#cut,#copy,#group,#ungroup,#move_front,#move_up,#move_down,#move_back");
                        a("#tool_undo").toggleClass("disabled", jb.getUndoStackSize() === 0);
                        a("#tool_redo").toggleClass("disabled", jb.getRedoStackSize() === 0);
                        c.addedNew = false;
                        if (h && !Q || Ma) {
                            a("#selLayerNames").removeAttr("disabled").val(k);
                            va.enableContextMenuItems("#delete,#cut,#copy,#move_front,#move_up,#move_down,#move_back")
                        } else a("#selLayerNames").attr("disabled",
                            "disabled")
                    }, Pb = function() {
                        if (!pb) {
                            var h = "#workarea.wireframe #svgcontent * { stroke-width: " + 1 / c.getZoom() + "px; }";
                            a("#wireframe_rules").text(Y.hasClass("wireframe") ? h : "")
                        }
                    }, ob = function(h) {
                        h = h || c.getDocumentTitle();
                        h = Fb + (h ? ": " + h : "");
                        a("title:first").text(h)
                    }, Ya = c.zoomChanged = function(h, k, H) {
                        //THIS IS THE OTHER ZOOMING BITCH
                        // if (k = c.setBBoxZoom(k, Y.width() - 15, Y.height() - 15)) {
                        //     h = k.zoom;
                        //     k = k.bbox;
                        //     if (h < 0.001) ab({
                        //         value: 0.1
                        //     });
                        //     else {
                        //         a("#zoom").val((h * 100).toFixed(1));
                        //         H ? eb() : eb(false, {
                        //             x: k.x * h + k.width * h / 2,
                        //             y: k.y * h + k.height * h / 2
                        //         });
                        //         c.getMode() ==
                        //             "zoom" && k.width && mb();
                        //         Pb()
                        //     }
                        // }
                    };
                ab = function(h) {
                    var k = h.value / 100;
                    if (k < 0.001) h.value = 0.1;
                    else {
                        h = c.getZoom();
                        Ya(window, {
                            width: 0,
                            height: 0,
                            x: (Y[0].scrollLeft + Y.width() / 2) / h,
                            y: (Y[0].scrollTop + Y.height() / 2) / h,
                            zoom: k
                        }, true)
                    }
                };
                a("#cur_context_panel").delegate("a", "click", function() {
                    var h = a(this);
                    h.attr("data-root") ? c.leaveContext() : c.setContext(h.text());
                    c.clearSelection();
                    return false
                });
                var Ga = {}, ma = function() {
                        a(".tools_flyout").each(function() {
                            var h = a("#" + this.id + "_show");
                            if (!h.data("isLibrary")) {
                                var k = [];
                                a(this).children().each(function() {
                                    k.push(this.title)
                                });
                                h[0].title = k.join(" / ")
                            }
                        })
                    }, La = function() {
                        a(".tools_flyout").each(function() {
                            var h = a("#" + this.id + "_show"),
                                k = h.offset();
                            h = h.outerWidth();
                            a(this).css({
                                left: 200,
                                top: 207
                            })
                        })
                    }, ra = function(h) {
                        a.each(h, function(k, H) {
                            var F = a(k).children(),
                                Q = k + "_show",
                                U = a(Q),
                                Z = false;
                            F.addClass("tool_button").unbind("click mousedown mouseup").each(function(la) {
                                var ia = H[la];
                                Ga[ia.sel] = ia.fn;
                                if (ia.isDefault) Z = la;
                                la = function(na) {
                                    var sa = ia;
                                    if (na.type ===
                                        "keydown") {
                                        var Ha = a(sa.parent + "_show").hasClass("tool_button_current"),
                                            W = a(sa.parent + "_show").attr("data-curopt");
                                        a.each(h[ia.parent], function(xa, Ja) {
                                            if (Ja.sel == W) sa = !na.shiftKey || !Ha ? Ja : h[ia.parent][xa + 1] || h[ia.parent][0]
                                        })
                                    }
                                    if (a(this).hasClass("disabled")) return false;
                                    Oa(Q) && sa.fn();
                                    var Ea;
                                    Ea = sa.icon ? a.getSvgIcon(sa.icon, true) : a(sa.sel).children().eq(0).clone();
                                    Ea[0].setAttribute("width", U.width());
                                    Ea[0].setAttribute("height", U.height());
                                    U.children(":not(.flyout_arrow_horiz)").remove();
                                    U.append(Ea).attr("data-curopt",
                                        sa.sel)
                                };
                                a(this).mouseup(la);
                                ia.key && a(document).bind("keydown", ia.key[0] + " shift+" + ia.key[0], la)
                            });
                            if (Z) U.attr("data-curopt", H[Z].sel);
                            else U.attr("data-curopt") || U.attr("data-curopt", H[0].sel);
                            var ga, ja = a(Q).position();
                            U.mousedown(function(la) {
                                if (U.hasClass("disabled")) return false;
                                var ia = a(k),
                                    na = 120,
                                    sa = ia.width() * -1,
                                    Ha = ia.data("shown_popop") ? 200 : 0;
                                ga = setTimeout(function() {
                                        U.data("isLibrary") ? ia.css("left", na).show() : ia.css("left", sa).show().animate({
                                            left: na
                                        }, 150);
                                        ia.data("shown_popop", true)
                                    },
                                    Ha);
                                la.preventDefault()
                            }).mouseup(function() {
                                clearTimeout(ga);
                                var la = a(this).attr("data-curopt");
                                if (U.data("isLibrary") && a(Q.replace("_show", "")).is(":visible")) Oa(Q, true);
                                else Oa(Q) && Ga[la] && Ga[la]()
                            })
                        });
                        ma();
                        La()
                    }, Hb = function(h, k) {
                        return a("<div>", {
                            "class": "tools_flyout",
                            id: h
                        }).appendTo("#svg_editor").append(k)
                    }, Qb = function() {
                        var h, k = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
                            H = document.getElementsByTagName("script")[0];
                        for (h in H.style)
                            if (k.test(h)) return h.match(k)[0];
                        if ("WebkitOpacity" in H.style) return "Webkit";
                        if ("KhtmlOpacity" in H.style) return "Khtml";
                        return ""
                    }(),
                    gc = function(h, k) {
                        var H = ["top", "left", "bottom", "right"];
                        h.each(function() {
                            var F, Q = a(this),
                                U = Q.outerWidth() * (k - 1),
                                Z = Q.outerHeight() * (k - 1);
                            for (F = 0; F < 4; F++) {
                                var ga = H[F],
                                    ja = Q.data("orig_margin-" + ga);
                                if (ja == null) {
                                    ja = parseInt(Q.css("margin-" + ga), 10);
                                    Q.data("orig_margin-" + ga, ja)
                                }
                                ja = ja * k;
                                if (ga === "right") ja += U;
                                else if (ga === "bottom") ja += Z;
                                Q.css("margin-" + ga, ja)
                            }
                        })
                    }, Yb = o.setIconSize = function(h) {
                        var k = a("#tools_top .toolset, #editor_panel > *, #history_panel > *,\t\t\t\t#main_button, #tools_left > *, #path_node_panel > *, #multiselected_panel > *,\t\t\t\t#g_panel > *"),
                            H = 1;
                        H = typeof h === "number" ? h : {
                            s: 0.75,
                            m: 1,
                            l: 1.25,
                            xl: 1.5
                        }[h];
                        o.tool_scale = H;
                        La();
                        var F = k.parents(":hidden");
                        F.css("visibility", "hidden").show();
                        gc(k, H);
                        F.css("visibility", "visible").hide();
                        a.pref("iconsize", h);
                        a("#iconsize").val(h);
                        F = {
                            "#tools_top": {
                                left: 50,
                                height: 72
                            },
                            "#tools_left": {
                                width: 31,
                                top: 74
                            },
                            "div#workarea": {
                                left: 38,
                                top: 74
                            }
                        };
                        k = a("#tool_size_rules");
                        if (k.length) k.empty();
                        else k = a('<style id="tool_size_rules"></style>').appendTo("head"); if (h !== "m") {
                            var Q = "";
                            a.each(F, function(U, Z) {
                                U = "#svg_editor " +
                                    U.replace(/,/g, ", #svg_editor");
                                Q += U + "{";
                                a.each(Z, function(ga, ja) {
                                    var la;
                                    if (typeof ja === "number") la = ja * H + "px";
                                    else if (ja[h] || ja.all) la = ja[h] || ja.all;
                                    Q += ga + ":" + la + ";"
                                });
                                Q += "}"
                            });
                            F = "-" + Qb.toLowerCase() + "-";
                            Q += "#tools_top .toolset, #editor_panel > *, #history_panel > *,\t\t\t\t#main_button, #tools_left > *, #path_node_panel > *, #multiselected_panel > *,\t\t\t\t#g_panel > *, #tool_font_size > *, .tools_flyout{" + F + "transform: scale(" + H + ");} #svg_editor div.toolset .toolset {" + F + "transform: scale(1); margin: 1px !important;} #svg_editor .ui-slider {" +
                                F + "transform: scale(" + 1 / H + ");}";
                            k.text(Q)
                        }
                        La()
                    }, fb = function(h, k, H, F) {
                        var Q = a(h);
                        k = a(k);
                        var U = false,
                            Z = F.dropUp;
                        Z && a(h).addClass("dropup");
                        k.find("li").bind("mouseup", function() {
                            if (F.seticon) {
                                ib("#cur_" + Q[0].id, a(this).children());
                                a(this).addClass("current").siblings().removeClass("current")
                            }
                            H.apply(this, arguments)
                        });
                        a(window).mouseup(function() {
                            if (!U) {
                                Q.removeClass("down");
                                k.hide();
                                k.css({
                                    top: 0,
                                    left: 0
                                })
                            }
                            U = false
                        });
                        Q.bind("mousedown", function() {
                            var ga = Q.offset();
                            if (Z) {
                                ga.top -= k.height();
                                ga.left += 8
                            } else ga.top +=
                                Q.height();
                            k.offset(ga);
                            if (Q.hasClass("down")) {
                                k.hide();
                                k.css({
                                    top: 0,
                                    left: 0
                                })
                            } else {
                                k.show();
                                U = true
                            }
                            Q.toggleClass("down")
                        }).hover(function() {
                            U = true
                        }).mouseout(function() {
                            U = false
                        });
                        F.multiclick && k.mousedown(function() {
                            U = true
                        })
                    }, za = [],
                    gb = function(h, k, H) {
                        k = {
                            alpha: k
                        };
                        if (h.indexOf("url(#") === 0) {
                            h = (h = c.getRefElem(h)) ? h.cloneNode(true) : a("#" + H + "_color defs *")[0];
                            k[h.tagName] = h
                        } else k.solidColor = h.indexOf("#") === 0 ? h.substr(1) : "none";
                        return new a.jGraduate.Paint(k)
                    };
                a("#text").focus(function() {});
                a("#text").blur(function() {});
                c.bind("selected", function(h, k) {
                    var H = c.getMode();
                    H === "select" && mb();
                    H = H == "pathedit";
                    oa = k.length === 1 || k[1] == null ? k[0] : null;
                    Ma = k.length >= 2 && k[1] != null;
                    if (oa != null)
                        if (!H) {
                            var F, Q;
                            if (oa != null) switch (oa.tagName) {
                                case "use":
                                case "image":
                                case "foreignObject":
                                    break;
                                case "g":
                                case "a":
                                    var U = null,
                                        Z = oa.getElementsByTagName("*");
                                    F = 0;
                                    for (Q = Z.length; F < Q; F++) {
                                        var ga = Z[F].getAttribute("stroke-width");
                                        if (F === 0) U = ga;
                                        else if (U !== ga) U = null
                                    }
                                    a("#stroke_width").val(U === null ? "" : U);
                                    Na.fill.update(true);
                                    Na.stroke.update(true);
                                    break;
                                default:
                                    Na.fill.update(true);
                                    Na.stroke.update(true);
                                    a("#stroke_width").val(oa.getAttribute("stroke-width") || 1);
                                    a("#stroke_style").val(oa.getAttribute("stroke-dasharray") || "none");
                                    F = oa.getAttribute("stroke-linejoin") || "miter";
                                    a("#linejoin_" + F).length != 0 && m(a("#linejoin_" + F)[0]);
                                    F = oa.getAttribute("stroke-linecap") || "butt";
                                    a("#linecap_" + F).length != 0 && m(a("#linecap_" + F)[0])
                            }
                            if (oa != null) {
                                F = (oa.getAttribute("opacity") || 1) * 100;
                                a("#group_opacity").val(F);
                                a("#opac_slider").slider("option", "value", F);
                                a("#elem_id").val(oa.id)
                            }
                            sb()
                        }
                    rb(H, k);
                    cb();
                    c.runExtensions("selectedChanged", {
                        elems: k,
                        selectedElement: oa,
                        multiselected: Ma
                    })
                });
                c.bind("transition", function(h, k) {
                    var H = c.getMode(),
                        F = k[0];
                    if (F) {
                        Ma = k.length >= 2 && k[1] != null;
                        if (!Ma) switch (H) {
                            case "rotate":
                                H = c.getRotationAngle(F);
                                a("#angle").val(H);
                                a("#tool_reorient").toggleClass("disabled", H === 0)
                        }
                        c.runExtensions("elementTransition", {
                            elems: k
                        })
                    }
                });
                c.bind("changed", function(h, k) {
                    var H, F = c.getMode();
                    F === "select" && mb();
                    for (H = 0; H < k.length; ++H) {
                        var Q = k[H];
                        if (Q &&
                            Q.tagName === "svg") {
                            Ua();
                            eb()
                        } else if (Q && oa && oa.parentNode == null) oa = Q
                    }
                    o.showSaveWarning = true;
                    cb();
                    if (oa && F === "select") {
                        Na.fill.update();
                        Na.stroke.update()
                    }
                    c.runExtensions("elementChanged", {
                        elems: k
                    })
                });
                c.bind("saved", function(h, k) {
                    o.showSaveWarning = false;
                    k = '<?xml version="1.0"?>\n' + k;
                    if (svgedit.browser.isIE()) Ca(0, true);
                    else {
                        var H = h.open("data:image/svg+xml;base64," + s.encode64(k)),
                            F = a.pref("save_notice_done");
                        if (F !== "all") {
                            var Q = v.notification.saveFromBrowser.replace("%s", "SVG");
                            if (svgedit.browser.isGecko())
                                if (k.indexOf("<defs") !== -1) {
                                    Q += "\n\n" + v.notification.defsFailOnSave;
                                    a.pref("save_notice_done", "all");
                                    F = "all"
                                } else a.pref("save_notice_done", "part");
                                else a.pref("save_notice_done", "all");
                            F !== "part" && H.alert(Q)
                        }
                    }
                });
                c.bind("exported", function(h, k) {
                    var H = k.issues,
                        F = k.type || "PNG",
                        Q = (F === "ICO" ? "BMP" : F).toLowerCase();
                    a("#export_canvas").length || a("<canvas>", {
                        id: "export_canvas"
                    }).hide().appendTo("body");
                    var U = a("#export_canvas")[0];
                    U.width = c.contentW;
                    U.height = c.contentH;
                    canvg(U, k.svg, {
                        renderCallback: function() {
                            var Z = k.quality ? U.toDataURL("image/" +
                                Q, k.quality) : U.toDataURL("image/" + Q);
                            qb.location.href = Z;
                            if (a.pref("export_notice_done") !== "all") {
                                Z = v.notification.saveFromBrowser.replace("%s", F);
                                if (H.length) Z += "\n\n" + v.notification.noteTheseIssues + "\n \u2022 " + H.join("\n \u2022 ");
                                a.pref("export_notice_done", "all");
                                qb.alert(Z)
                            }
                        }
                    })
                });
                c.bind("zoomed", Ya);
                c.bind("contextset", function(h, k) {
                    var H = "";
                    if (k) {
                        var F = "";
                        H = '<a href="#" data-root="y">' + c.getCurrentDrawing().getCurrentLayerName() + "</a>";
                        a(k).parentsUntil("#svgcontent > g").andSelf().each(function() {
                            if (this.id) {
                                F +=
                                    " > " + this.id;
                                H += this !== k ? ' > <a href="#">' + this.id + "</a>" : " > " + this.id
                            }
                        });
                        db = F
                    } else db = null;
                    a("#cur_context_panel").toggle( !! k).html(H);
                    ob()
                });
                c.bind("extension_added", function(h, k) {
                    function H() {
                        if (Mb) {
                            clearTimeout(Mb);
                            Mb = null
                        }
                        Q || (Mb = setTimeout(function() {
                            Q = true;
                            Yb(a.pref("iconsize"))
                        }, 50))
                    }
                    if (k) {
                        var F = false,
                            Q = false,
                            U = true;
                        if (k.langReady)
                            if (o.langChanged) {
                                var Z = a.pref("lang");
                                k.langReady({
                                    lang: Z,
                                    uiStrings: v
                                })
                            } else za.push(k);
                        var ga = function() {
                            if (k.callback && !F && U) {
                                F = true;
                                k.callback()
                            }
                        }, ja = [];
                        k.context_tools &&
                            a.each(k.context_tools, function(Ha, W) {
                                var Ea, xa = W.container_id ? ' id="' + W.container_id + '"' : "",
                                    Ja = a("#" + W.panel);
                                Ja.length || (Ja = a("<div>", {
                                    id: W.panel
                                }).appendTo("#tools_top"));
                                switch (W.type) {
                                    case "tool_button":
                                        Ea = '<div class="tool_button">' + W.id + "</div>";
                                        var Qa = a(Ea).appendTo(Ja);
                                        W.events && a.each(W.events, function(Pa, Ka) {
                                            a(Qa).bind(Pa, Ka)
                                        });
                                        break;
                                    case "select":
                                        Ea = "<label" + xa + '><select id="' + W.id + '">';
                                        a.each(W.options, function(Pa, Ka) {
                                            Ea += '<option value="' + Pa + '"' + (Pa == W.defval ? " selected" : "") + ">" + Ka +
                                                "</option>"
                                        });
                                        Ea += "</select></label>";
                                        var Fa = a(Ea).appendTo(Ja).find("select");
                                        a.each(W.events, function(Pa, Ka) {
                                            a(Fa).bind(Pa, Ka)
                                        });
                                        break;
                                    case "button-select":
                                        Ea = '<div id="' + W.id + '" class="dropdown toolset" title="' + W.title + '"><div id="cur_' + W.id + '" class="icon_label"></div><button></button></div>';
                                        xa = a('<ul id="' + W.id + '_opts"></ul>').appendTo("#option_lists");
                                        W.colnum && xa.addClass("optcols" + W.colnum);
                                        a(Ea).appendTo(Ja).children();
                                        ja.push({
                                            elem: "#" + W.id,
                                            list: "#" + W.id + "_opts",
                                            title: W.title,
                                            callback: W.events.change,
                                            cur: "#cur_" + W.id
                                        });
                                        break;
                                    case "input":
                                        Ea = "<label" + xa + '><span id="' + W.id + '_label">' + W.label + ':</span><input id="' + W.id + '" title="' + W.title + '" size="' + (W.size || "4") + '" value="' + (W.defval || "") + '" type="text"/></label>';
                                        var Ra = a(Ea).appendTo(Ja).find("input");
                                        W.spindata && Ra.SpinButton(W.spindata);
                                        W.events && a.each(W.events, function(Pa, Ka) {
                                            Ra.bind(Pa, Ka)
                                        })
                                }
                            });
                        if (k.buttons) {
                            var la = {}, ia = {}, na = k.svgicons,
                                sa = {};
                            a.each(k.buttons, function(Ha, W) {
                                var Ea, xa, Ja, Qa = W.id;
                                for (xa = Ha; a("#" + Qa).length;) Qa = W.id + "_" + ++xa;
                                if (na) {
                                    la[Qa] = W.icon;
                                    xa = W.svgicon || W.id;
                                    if (W.type == "app_menu") ia["#" + Qa + " > div"] = xa;
                                    else ia["#" + Qa] = xa
                                } else Ea = a('<img src="' + W.icon + '">');
                                var Fa, Ra;
                                switch (W.type) {
                                    case "mode_flyout":
                                    case "mode":
                                        Fa = "tool_button";
                                        Ra = "#tools_left";
                                        break;
                                    case "context":
                                        Fa = "tool_button";
                                        Ra = "#" + W.panel;
                                        a(Ra).length || a("<div>", {
                                            id: W.panel
                                        }).appendTo("#tools_top");
                                        break;
                                    case "app_menu":
                                        Fa = "";
                                        Ra = "#main_menu ul"
                                }
                                var Pa, Ka, Xa = a(W.list || W.type == "app_menu" ? "<li/>" : "<div/>").attr("id", Qa).attr("title", W.title).addClass(Fa);
                                if (!W.includeWith && !W.list) {
                                    if ("position" in W) a(Ra).children().eq(W.position).length ? a(Ra).children().eq(W.position).before(Xa) : a(Ra).children().last().before(Xa);
                                    else Xa.appendTo(Ra); if (W.type == "mode_flyout") {
                                        Ka = a(Xa);
                                        Fa = Ka.parent();
                                        if (!Ka.parent().hasClass("tools_flyout")) {
                                            Ja = Ka[0].id.replace("tool_", "tools_");
                                            xa = Ka.clone().attr("id", Ja + "_show").append(a("<div>", {
                                                "class": "flyout_arrow_horiz"
                                            }));
                                            Ka.before(xa);
                                            Fa = Hb(Ja, Ka);
                                            Fa.data("isLibrary", true);
                                            xa.data("isLibrary", true)
                                        }
                                        ia["#" + Ja + "_show"] = W.id;
                                        Ja = sa["#" + Fa[0].id] = [{
                                                sel: "#" + Qa,
                                                fn: W.events.click,
                                                icon: W.id,
                                                isDefault: true
                                            },
                                            Pa
                                        ]
                                    } else W.type == "app_menu" && Xa.append("<div>").append(W.title)
                                } else if (W.list) {
                                    Xa.addClass("push_button");
                                    a("#" + W.list + "_opts").append(Xa);
                                    if (W.isDefault) {
                                        a("#cur_" + W.list).append(Xa.children().clone());
                                        xa = W.svgicon || W.id;
                                        ia["#cur_" + W.list] = xa
                                    }
                                } else if (W.includeWith) {
                                    Ra = W.includeWith;
                                    Ka = a(Ra.button);
                                    Fa = Ka.parent();
                                    if (!Ka.parent().hasClass("tools_flyout")) {
                                        Ja = Ka[0].id.replace("tool_", "tools_");
                                        xa = Ka.clone().attr("id", Ja + "_show").append(a("<div>", {
                                            "class": "flyout_arrow_horiz"
                                        }));
                                        Ka.before(xa);
                                        Fa = Hb(Ja, Ka)
                                    }
                                    Pa = Nb.getButtonData(Ra.button);
                                    if (Ra.isDefault) ia["#" + Ja + "_show"] = W.id;
                                    Ja = sa["#" + Fa[0].id] = [{
                                            sel: "#" + Qa,
                                            fn: W.events.click,
                                            icon: W.id,
                                            key: W.key,
                                            isDefault: W.includeWith ? W.includeWith.isDefault : 0
                                        },
                                        Pa
                                    ];
                                    Qa = "position" in Ra ? Ra.position : "last";
                                    Pa = Fa.children().length;
                                    if (!isNaN(Qa) && Qa >= 0 && Qa < Pa) Fa.children().eq(Qa).before(Xa);
                                    else {
                                        Fa.append(Xa);
                                        Ja.reverse()
                                    }
                                }
                                na || Xa.append(Ea);
                                W.list || a.each(W.events, function(bc, cc) {
                                    if (bc == "click" && W.type == "mode") {
                                        W.includeWith ?
                                            Xa.bind(bc, cc) : Xa.bind(bc, function() {
                                                Oa(Xa) && cc()
                                            });
                                        if (W.key) {
                                            a(document).bind("keydown", W.key, cc);
                                            W.title && Xa.attr("title", W.title + " [" + W.key + "]")
                                        }
                                    } else Xa.bind(bc, cc)
                                });
                                ra(sa)
                            });
                            a.each(ja, function() {
                                fb(this.elem, this.list, this.callback, {
                                    seticon: true
                                })
                            });
                            if (na) U = false;
                            a.svgIcons(na, {
                                w: 24,
                                h: 24,
                                id_match: false,
                                no_img: !svgedit.browser.isWebkit(),
                                fallback: la,
                                placement: ia,
                                callback: function() {
                                    a.pref("iconsize") !== "m" && H();
                                    U = true;
                                    ga()
                                }
                            })
                        }
                        ga()
                    }
                });
                c.textActions.setInputElem(a("#text")[0]);
                var Za = '<div class="palette_item" data-rgb="none"></div>';
                a.each(["#000000", "#3f3f3f", "#7f7f7f", "#bfbfbf", "#ffffff", "#ff0000", "#ff7f00", "#ffff00", "#7fff00", "#00ff00", "#00ff7f", "#00ffff", "#007fff", "#0000ff", "#7f00ff", "#ff00ff", "#ff007f", "#7f0000", "#7f3f00", "#7f7f00", "#3f7f00", "#007f00", "#007f3f", "#007f7f", "#003f7f", "#00007f", "#3f007f", "#7f007f", "#7f003f", "#ffaaaa", "#ffd4aa", "#ffffaa", "#d4ffaa", "#aaffaa", "#aaffd4", "#aaffff", "#aad4ff", "#aaaaff", "#d4aaff", "#ffaaff", "#ffaad4"], function(h, k) {
                    Za += '<div class="palette_item" style="background-color: ' + k + ';" data-rgb="' +
                        k + '"></div>'
                });
                a("#palette").append(Za);
                Za = "";
                a.each(["#FFF", "#888", "#000"], function() {
                    Za += '<div class="color_block" style="background-color:' + this + ';"></div>'
                });
                a("#bg_blocks").append(Za);
                var Ib = a("#bg_blocks div");
                Ib.each(function() {
                    a(this).click(function() {
                        Ib.removeClass("cur_background");
                        a(this).addClass("cur_background")
                    })
                });
                L(a.pref("bkgd_color"), a.pref("bkgd_url"));
                a("#image_save_opts input").val([a.pref("img_save")]);
                var wb = function(h, k) {
                    if (k == null) k = h.value;
                    a("#group_opacity").val(k);
                    if (!h || !h.handle) a("#opac_slider").slider("option", "value", k);
                    c.setOpacity(k / 100)
                }, Tb = function(h, k, H) {
                        if (k == null) k = h.value;
                        a("#blur").val(k);
                        var F = false;
                        if (!h || !h.handle) {
                            a("#blur_slider").slider("option", "value", k);
                            F = true
                        }
                        H ? c.setBlurNoUndo(k) : c.setBlur(k, F)
                    };
                a("#stroke_style").change(function() {
                    c.setStrokeAttr("stroke-dasharray", a(this).val());
                    vb()
                });
                a("#stroke_linejoin").change(function() {
                    c.setStrokeAttr("stroke-linejoin", a(this).val());
                    vb()
                });
                a("select").change(function() {
                    a(this).blur()
                });
                var Ub = false;
                a("#selLayerNames").change(function() {
                    var h = this.options[this.selectedIndex].value,
                        k = v.notification.QmoveElemsToLayer.replace("%s", h),
                        H = function(F) {
                            if (F) {
                                Ub = true;
                                c.moveSelectedToLayer(h);
                                c.clearSelection();
                                Ua()
                            }
                        };
                    if (h) Ub ? H(true) : a.confirm(k, H)
                });
                a("#font_family").change(function() {
                    c.setFontFamily(this.value)
                });
                a("#seg_type").change(function() {
                    c.setSegType(a(this).val())
                });
                a("#text").keyup(function() {
                    c.setTextContent(this.value)
                });
                a("#image_url").change(function() {
                    nb(this.value)
                });
                a("#link_url").change(function() {
                    this.value.length ?
                        c.setLinkURL(this.value) : c.removeHyperlink()
                });
                a("#g_title").change(function() {
                    c.setGroupTitle(this.value)
                });
                a(".attr_changer").change(function() {
                    var h = this.getAttribute("data-attr"),
                        k = this.value;
                    if (!svgedit.units.isValidUnit(h, k, oa)) {
                        a.alert(v.notification.invalidAttrValGiven);
                        this.value = oa.getAttribute(h);
                        return false
                    }
                    if (h !== "id")
                        if (isNaN(k)) k = c.convertToNum(h, k);
                        else if (u.baseUnit !== "px") {
                        var H = svgedit.units.getTypeMap();
                        if (oa[h] || c.getMode() === "pathedit" || h === "x" || h === "y") k *= H[u.baseUnit]
                    }
                    if (h ===
                        "id") {
                        h = oa;
                        c.clearSelection();
                        h.id = k;
                        c.addToSelection([h], true)
                    } else c.changeSelectedAttribute(h, k);
                    this.blur()
                });
                a("#palette").mouseover(function() {
                    var h = a('<input type="hidden">');
                    a(this).append(h);
                    h.focus().remove()
                });
                a(".palette_item").mousedown(function(h) {
                    h = h.shiftKey || h.button === 2 ? "stroke" : "fill";
                    var k = a(this).data("rgb"),
                        H;
                    if (k === "none" || k === "transparent" || k === "initial") {
                        k = "none";
                        H = new a.jGraduate.Paint
                    } else H = new a.jGraduate.Paint({
                        alpha: 100,
                        solidColor: k.substr(1)
                    });
                    Na[h].setPaint(H);
                    c.setColor(h,
                        k);
                    k !== "none" && c.getPaintOpacity(h) !== 1 && c.setPaintOpacity(h, 1);
                    sb()
                }).bind("contextmenu", function(h) {
                    h.preventDefault()
                });
                a("#toggle_stroke_tools").on("click", function() {
                    a("#tools_bottom").toggleClass("expanded")
                });
                (function() {
                    var h = null,
                        k = null,
                        H = Y[0],
                        F = false,
                        Q = false;
                    a("#svgcanvas").bind("mousemove mouseup", function(U) {
                        if (F !== false) {
                            H.scrollLeft -= U.clientX - h;
                            H.scrollTop -= U.clientY - k;
                            h = U.clientX;
                            k = U.clientY;
                            if (U.type === "mouseup") F = false;
                            return false
                        }
                    }).mousedown(function(U) {
                        if (U.button === 1 || Q === true) {
                            F =
                                true;
                            h = U.clientX;
                            k = U.clientY;
                            return false
                        }
                    });
                    a(window).mouseup(function() {
                        F = false
                    });
                    a(document).bind("keydown", "space", function(U) {
                        c.spaceKey = Q = true;
                        U.preventDefault()
                    }).bind("keyup", "space", function(U) {
                        U.preventDefault();
                        c.spaceKey = Q = false
                    }).bind("keydown", "shift", function() {
                        c.getMode() === "zoom" && Y.css("cursor", Db)
                    }).bind("keyup", "shift", function() {
                        c.getMode() === "zoom" && Y.css("cursor", Ob)
                    });
                    o.setPanning = function(U) {
                        c.spaceKey = Q = U
                    }
                })();
                (function() {
                    var h = a("#main_icon"),
                        k = a("#main_icon span"),
                        H = a("#main_menu"),
                        F = false,
                        Q = 0,
                        U = true,
                        Z = false;
                    a(window).mouseup(function(ja) {
                        if (!F) {
                            h.removeClass("buttondown");
                            if (ja.target.tagName != "INPUT") H.fadeOut(200);
                            else if (!Z) {
                                Z = true;
                                a(ja.target).click(function() {
                                    H.css("margin-left", "-9999px").show()
                                })
                            }
                        }
                        F = false
                    }).mousedown(function(ja) {
                        a(ja.target).closest("div.tools_flyout, .contextMenu").length || a(".tools_flyout:visible,.contextMenu").fadeOut(250)
                    });
                    k.bind("mousedown", function() {
                        if (h.hasClass("buttondown")) H.fadeOut(200);
                        else {
                            H.css("margin-left", 0).show();
                            Q || (Q = H.height());
                            H.css("height", 0).animate({
                                height: Q
                            }, 200);
                            F = true
                        }
                        h.toggleClass("buttondown buttonup")
                    }).hover(function() {
                        F = true
                    }).mouseout(function() {
                        F = false
                    });
                    var ga = a("#main_menu li");
                    ga.mouseover(function() {
                        U = a(this).css("background-color") == "rgba(0, 0, 0, 0)";
                        ga.unbind("mouseover");
                        U && ga.mouseover(function() {
                            this.style.backgroundColor = "#FFC"
                        }).mouseout(function() {
                            this.style.backgroundColor = "transparent";
                            return true
                        })
                    })
                })();
                o.addDropDown = function(h, k, H) {
                    if (a(h).length != 0) {
                        var F = a(h).find("button"),
                            Q = a(h).find("ul").attr("id",
                                a(h)[0].id + "-list"),
                            U = false;
                        H ? a(h).addClass("dropup") : a("#option_lists").append(Q);
                        Q.find("li").bind("mouseup", k);
                        a(window).mouseup(function() {
                            if (!U) {
                                F.removeClass("down");
                                Q.hide()
                            }
                            U = false
                        });
                        F.bind("mousedown", function() {
                            if (F.hasClass("down")) Q.hide();
                            else {
                                if (!H) {
                                    var Z = a(h).position();
                                    Q.css({
                                        top: Z.top - 33,
                                        left: Z.left
                                    })
                                }
                                Q.show();
                                U = true
                            }
                            F.toggleClass("down")
                        }).hover(function() {
                            U = true
                        }).mouseout(function() {
                            U = false
                        })
                    }
                };
                o.addDropDown("#font_family_dropdown", function() {
                    a("#font_family").val(a(this).text()).change()
                });
                o.addDropDown("#opacity_dropdown", function() {
                    if (!a(this).find("div").length) {
                        var h = parseInt(a(this).text().split("%")[0], 10);
                        wb(false, h)
                    }
                }, true);
                a("#opac_slider").slider({
                    start: function() {
                        a("#opacity_dropdown li:not(.special)").hide()
                    },
                    stop: function() {
                        a("#opacity_dropdown li").show();
                        a(window).mouseup()
                    },
                    slide: function(h, k) {
                        wb(k)
                    }
                });
                o.addDropDown("#blur_dropdown", a.noop);
                var Cb = false;
                a("#blur_slider").slider({
                    max: 10,
                    step: 0.1,
                    stop: function(h, k) {
                        Cb = false;
                        Tb(k);
                        a("#blur_dropdown li").show();
                        a(window).mouseup()
                    },
                    start: function() {
                        Cb = true
                    },
                    slide: function(h, k) {
                        Tb(k, null, Cb)
                    }
                });
                o.addDropDown("#zoom_dropdown", function() {
                    var h = a(this),
                        k = h.data("val");
                    k ? Ya(window, k) : ab({
                        value: parseFloat(h.text())
                    })
                }, true);
                fb("#stroke_linecap", "#linecap_opts", function() {
                    m(this, true)
                }, {
                    dropUp: true
                });
                fb("#stroke_linejoin", "#linejoin_opts", function() {
                    m(this, true)
                }, {
                    dropUp: true
                });
                fb("#tool_position", "#position_opts", function() {
                    var h = this.id.replace("tool_pos", "").charAt(0);
                    c.alignSelectedElements(h, "page")
                }, {
                    multiclick: true
                });
                (function() {
                    var h,
                        k = function() {
                            a(h).blur()
                        };
                    a("#svg_editor").find("button, select, input:not(#text)").focus(function() {
                        h = this;
                        ub = "toolbars";
                        Y.mousedown(k)
                    }).blur(function() {
                        ub = "canvas";
                        Y.unbind("mousedown", k);
                        c.getMode() == "textedit" && a("#text").focus()
                    })
                })();
                var Wb = function() {
                    Oa("#tool_fhpath") && c.setMode("fhpath")
                }, Zb = function() {
                        Oa("#tool_line") && c.setMode("line")
                    }, yb = function() {
                        Oa("#tool_square") && c.setMode("square")
                    }, Sb = function() {
                        Oa("#tool_rect") && c.setMode("rect")
                    }, hc = function() {
                        Oa("#tool_fhrect") && c.setMode("fhrect")
                    },
                    xb = function() {
                        Oa("#tool_circle") && c.setMode("circle")
                    }, ac = function() {
                        Oa("#tool_ellipse") && c.setMode("ellipse")
                    }, $b = function() {
                        Oa("#tool_fhellipse") && c.setMode("fhellipse")
                    }, zb = function() {
                        Oa("#tool_image") && c.setMode("image")
                    }, Va = function() {
                        if (Oa("#tool_zoom")) {
                            c.setMode("zoom");
                            Y.css("cursor", Ob)
                        }
                    }, tb = function(h) {
                        var k = c.getResolution();
                        h = h ? k.zoom * h : 1;
                        a("#zoom").val(h * 100);
                        c.setZoom(h);
                        Pb();
                        eb(true)
                    }, b = function() {
                        if (Oa("#tool_zoom")) {
                            tb();
                            mb()
                        }
                    }, f = function() {
                        Oa("#tool_text") && c.setMode("text")
                    }, d =
                        function() {
                            Oa("#tool_path") && c.setMode("path")
                    }, r = function() {
                        if (oa != null || Ma) c.deleteSelectedElements()
                    }, j = function() {
                        if (oa != null || Ma) c.cutSelectedElements()
                    }, E = function() {
                        if (oa != null || Ma) c.copySelectedElements()
                    }, n = function() {
                        var h = c.getZoom(),
                            k = (Y[0].scrollLeft + Y.width() / 2) / h - c.contentW;
                        h = (Y[0].scrollTop + Y.height() / 2) / h - c.contentH;
                        c.pasteElements("point", k, h)
                    }, z = function() {
                        oa != null && c.moveToTopSelectedElement()
                    }, B = function() {
                        oa != null && c.moveToBottomSelectedElement()
                    }, G = function(h) {
                        oa != null && c.moveUpDownSelected(h)
                    },
                    K = function() {
                        oa != null && c.convertToPath()
                    }, C = function() {
                        oa != null && Wa.reorient()
                    }, O = function() {
                        if (oa != null || Ma) a.prompt(v.notification.enterNewLinkURL, "http://", function(h) {
                            h && c.makeHyperlink(h)
                        })
                    }, T = function(h, k) {
                        if (oa != null || Ma) {
                            if (u.gridSnapping) {
                                var H = c.getZoom() * u.snappingStep;
                                h *= H;
                                k *= H
                            }
                            c.moveSelectedElements(h, k)
                        }
                    }, V = function() {
                        a("#tool_node_link").toggleClass("push_button_pressed tool_button");
                        var h = a("#tool_node_link").hasClass("push_button_pressed");
                        Wa.linkControlPoints(h)
                    }, X = function() {
                        Wa.getNodePoint() &&
                            Wa.clonePathNode()
                    }, ca = function() {
                        Wa.getNodePoint() && Wa.deletePathNode()
                    }, S = function() {
                        var h = a("#tool_add_subpath"),
                            k = !h.hasClass("push_button_pressed");
                        h.toggleClass("push_button_pressed tool_button");
                        Wa.addSubPath(k)
                    }, M = function() {
                        Wa.opencloseSubPath()
                    }, J = function() {
                        c.cycleElement(1)
                    }, N = function() {
                        c.cycleElement(0)
                    }, P = function(h, k) {
                        if (!(oa == null || Ma)) {
                            h || (k *= -1);
                            var H = parseFloat(a("#angle").val()) + k;
                            c.setRotationAngle(H);
                            cb()
                        }
                    }, aa = function() {
                        var h = u.dimensions;
                        a.confirm(v.notification.QwantToClear,
                            function(k) {
                                if (k) {
                                    mb();
                                    c.clear();
                                    c.setResolution(h[0], h[1]);
                                    eb(true);
                                    tb();
                                    Ua();
                                    cb();
                                    Na.fill.prep();
                                    Na.stroke.prep();
                                    c.runExtensions("onNewDocument")
                                }
                            })
                    }, ha = function() {
                        c.setBold(!c.getBold());
                        cb();
                        return false
                    }, pa = function() {
                        c.setItalic(!c.getItalic());
                        cb();
                        return false
                    }, Aa = function() {
                        a.select("Select an image type for export: ", ["PNG", "JPEG", "BMP", "WEBP"], function(h) {
                            if (h) {
                                if (!q.exportImage && !q.pngsave) {
                                    var k = v.notification.loadingImage;
                                    qb = window.open("data:text/html;charset=utf-8,<title>" + k + "</title><h1>" +
                                        k + "</h1>")
                                }
                                var H = parseInt(a("#image-slider").val(), 10) / 100;
                                window.canvg ? c.rasterExport(h, H) : a.getScript("canvg/rgbcolor.js", function() {
                                    a.getScript("canvg/canvg.js", function() {
                                        c.rasterExport(h, H)
                                    })
                                })
                            }
                        }, function() {
                            var h = a(this);
                            if (h.val() === "JPEG" || h.val() === "WEBP") a("#image-slider").length || a('<div><label>Quality: <input id="image-slider" type="range" min="1" max="100" value="92" /></label></div>').appendTo(h.parent());
                            else a("#image-slider").parent().remove()
                        })
                    }, ba = function() {
                        c.open()
                    }, wa = function() {},
                    Da = function() {
                        if (jb.getUndoStackSize() > 0) {
                            jb.undo();
                            Ua()
                        }
                    }, $a = function() {
                        if (jb.getRedoStackSize() > 0) {
                            jb.redo();
                            Ua()
                        }
                    }, hb = function() {
                        if (Ma) c.groupSelectedElements();
                        else oa && c.ungroupSelectedElement()
                    }, Jb = function() {
                        c.cloneSelectedElements(20, 20)
                    }, Rb = function() {
                        var h = this.id.replace("tool_align", "").charAt(0);
                        c.alignSelectedElements(h, a("#align_relative_to").val())
                    }, Kb = function() {
                        a("#tool_wireframe").toggleClass("push_button_pressed tool_button");
                        Y.toggleClass("wireframe");
                        if (!pb) {
                            var h = a("#wireframe_rules");
                            h.length ? h.empty() : a('<style id="wireframe_rules"></style>').appendTo("head");
                            Pb()
                        }
                    };
                a("#svg_docprops_container, #svg_prefs_container").draggable({
                    cancel: "button,fieldset",
                    containment: "window"
                });
                var wc = function() {
                    if (!lb) {
                        lb = true;
                        a("#image_save_opts input").val([a.pref("img_save")]);
                        var h = c.getResolution();
                        if (u.baseUnit !== "px") {
                            h.w = svgedit.units.convertUnit(h.w) + u.baseUnit;
                            h.h = svgedit.units.convertUnit(h.h) + u.baseUnit
                        }
                        a("#canvas_width").val(h.w);
                        a("#canvas_height").val(h.h);
                        a("#canvas_title").val(c.getDocumentTitle());
                        a("#svg_docprops").show()
                    }
                }, xc = function() {
                        if (!ua) {
                            ua = true;
                            a("#main_menu").hide();
                            var h = a("#bg_blocks div"),
                                k = D.bkgd_color,
                                H = a.pref("bkgd_url");
                            h.each(function() {
                                var F = a(this),
                                    Q = F.css("background-color") == k;
                                F.toggleClass("cur_background", Q);
                                Q && a("#canvas_bg_url").removeClass("cur_background")
                            });
                            k || h.eq(0).addClass("cur_background");
                            H && a("#canvas_bg_url").val(H);
                            a("#grid_snapping_on").prop("checked", u.gridSnapping);
                            a("#grid_snapping_step").attr("value", u.snappingStep);
                            a("#grid_color").attr("value",
                                u.gridColor);
                            a("#svg_prefs").show()
                        }
                    }, ic = function() {
                        a("#svg_source_editor").hide();
                        ya = false;
                        a("#svg_source_textarea").blur()
                    }, nc = function() {
                        if (ya) {
                            var h = function() {
                                c.clearSelection();
                                ic();
                                tb();
                                Ua();
                                ob();
                                Na.fill.prep();
                                Na.stroke.prep()
                            };
                            c.setSvgString(a("#svg_source_textarea").val()) ? h() : a.confirm(v.notification.QerrorsRevertToSource, function(k) {
                                if (!k) return false;
                                h()
                            });
                            mb()
                        }
                    }, oc = function() {
                        a("#svg_docprops").hide();
                        a("#canvas_width,#canvas_height").removeAttr("disabled");
                        a("#resolution")[0].selectedIndex =
                            0;
                        a("#image_save_opts input").val([a.pref("img_save")]);
                        lb = false
                    }, pc = function() {
                        a("#svg_prefs").hide();
                        ua = false
                    }, yc = function() {
                        var h = a("#canvas_title").val();
                        ob(h);
                        c.setDocumentTitle(h);
                        h = a("#canvas_width");
                        var k = h.val(),
                            H = a("#canvas_height"),
                            F = H.val();
                        if (k != "fit" && !svgedit.units.isValidUnit("width", k)) {
                            a.alert(v.notification.invalidAttrValGiven);
                            h.parent().addClass("error");
                            return false
                        }
                        h.parent().removeClass("error");
                        if (F != "fit" && !svgedit.units.isValidUnit("height", F)) {
                            a.alert(v.notification.invalidAttrValGiven);
                            H.parent().addClass("error");
                            return false
                        }
                        H.parent().removeClass("error");
                        if (!c.setResolution(k, F)) {
                            a.alert(v.notification.noContentToFitTo);
                            return false
                        }
                        a.pref("img_save", a("#image_save_opts :checked").val());
                        eb();
                        oc()
                    }, zc = o.savePreferences = function() {
                        var h = a("#bg_blocks div.cur_background").css("background-color") || "#FFF";
                        L(h, a("#canvas_bg_url").val());
                        h = a("#lang_select").val();
                        h !== a.pref("lang") && o.putLocale(h, kb);
                        Yb(a("#iconsize").val());
                        u.gridSnapping = a("#grid_snapping_on")[0].checked;
                        u.snappingStep =
                            a("#grid_snapping_step").val();
                        u.gridColor = a("#grid_color").val();
                        u.showRulers = a("#show_rulers")[0].checked;
                        a("#rulers").toggle(u.showRulers);
                        u.showRulers && da();
                        u.baseUnit = a("#base_unit").val();
                        c.setConfig(u);
                        eb();
                        pc()
                    }, dc = a.noop,
                    qc = function() {
                        a("#dialog_box").hide();
                        if (!ya && !lb && !ua) db && c.leaveContext();
                        else {
                            if (ya) Bb !== a("#svg_source_textarea").val() ? a.confirm(v.notification.QignoreSourceChanges, function(h) {
                                h && ic()
                            }) : ic();
                            else if (lb) oc();
                            else ua && pc();
                            dc()
                        }
                    }, rc = {
                        width: a(window).width(),
                        height: a(window).height()
                    };
                svgedit.browser.isIE() && function() {
                    dc = function() {
                        if (Y[0].scrollLeft === 0 && Y[0].scrollTop === 0) {
                            Y[0].scrollLeft = Ab.left;
                            Y[0].scrollTop = Ab.top
                        }
                    };
                    Ab = {
                        left: Y[0].scrollLeft,
                        top: Y[0].scrollTop
                    };
                    a(window).resize(dc);
                    o.ready(function() {
                        setTimeout(function() {
                            dc()
                        }, 500)
                    });
                    Y.scroll(function() {
                        Ab = {
                            left: Y[0].scrollLeft,
                            top: Y[0].scrollTop
                        }
                    })
                }();
                a(window).resize(function() {
                    a.each(rc, function(h, k) {
                        var H = a(window)[h]();
                        Y[0]["scroll" + (h === "width" ? "Left" : "Top")] -= (H - k) / 2;
                        rc[h] = H
                    });
                    La()
                });
                (function() {
                    Y.scroll(function() {
                        if (a("#ruler_x").length !=
                            0) a("#ruler_x")[0].scrollLeft = Y[0].scrollLeft;
                        if (a("#ruler_y").length != 0) a("#ruler_y")[0].scrollTop = Y[0].scrollTop
                    })
                })();
                a("#url_notice").click(function() {
                    a.alert(this.title)
                });
                a("#change_image_url").click(R);
                (function() {
                    var h = ["clear", "open", "save", "source", "delete", "delete_multi", "paste", "clone", "clone_multi", "move_top", "move_bottom"],
                        k = "";
                    a.each(h, function(H, F) {
                        k += "#tool_" + F + (H == h.length - 1 ? "," : "")
                    });
                    a(k).mousedown(function() {
                        a(this).addClass("tool_button_current")
                    }).bind("mousedown mouseout", function() {
                        a(this).removeClass("tool_button_current")
                    });
                    a("#tool_undo, #tool_redo").mousedown(function() {
                        a(this).hasClass("disabled") || a(this).addClass("tool_button_current")
                    }).bind("mousedown mouseout", function() {
                        a(this).removeClass("tool_button_current")
                    })
                })();
                if (svgedit.browser.isMac() && !window.opera) {
                    var ec = ["tool_clear", "tool_save", "tool_source", "tool_undo", "tool_redo", "tool_clone"];
                    for (ta = ec.length; ta--;) {
                        var jc = document.getElementById(ec[ta]);
                        if (jc) {
                            var kc = jc.title,
                                sc = kc.indexOf("Ctrl+");
                            jc.title = [kc.substr(0, sc), "Cmd+", kc.substr(sc + 5)].join("")
                        }
                    }
                }
                var tc =
                    function(h) {
                        var k = h.attr("id") == "stroke_color" ? "stroke" : "fill",
                            H = Na[k].paint,
                            F = k == "stroke" ? "Pick a Stroke Paint and Opacity" : "Pick a Fill Paint and Opacity";
                        h = h.offset();
                        a("#color_picker").draggable({
                            cancel: ".jGraduate_tabs, .jGraduate_colPick, .jGraduate_gradPick, .jPicker",
                            containment: "window"
                        }).css(u.colorPickerCSS || {
                            left: h.left + 100,
                            bottom: 40
                        }).jGraduate({
                            paint: H,
                            window: {
                                pickerTitle: F
                            },
                            images: {
                                clientPath: u.jGraduatePath
                            },
                            newstop: "inverse"
                        }, function(Q) {
                            H = new a.jGraduate.Paint(Q);
                            Na[k].setPaint(H);
                            c.setPaint(k, H);
                            a("#color_picker").hide()
                        }, function() {
                            a("#color_picker").hide()
                        })
                };
                ta = function(h, k) {
                    var H, F, Q = u[k === "fill" ? "initFill" : "initStroke"],
                        U = (new DOMParser).parseFromString('<svg xmlns="http://www.w3.org/2000/svg"><rect width="16.5" height="16.5"\t\t\t\t\tfill="#' + Q.color + '" opacity="' + Q.opacity + '"/>\t\t\t\t\t<defs><linearGradient id="gradbox_"/></defs></svg>', "text/xml").documentElement;
                    U = a(h)[0].appendChild(document.importNode(U, true));
                    U.setAttribute("width", 16.5);
                    this.rect = U.firstChild;
                    this.defs = U.getElementsByTagName("defs")[0];
                    this.grad = this.defs.firstChild;
                    this.paint = new a.jGraduate.Paint({
                        solidColor: Q.color
                    });
                    this.type = k;
                    this.setPaint = function(Z, ga) {
                        this.paint = Z;
                        var ja = "none",
                            la = Z.type,
                            ia = Z.alpha / 100;
                        switch (la) {
                            case "solidColor":
                                ja = Z[la] != "none" ? "#" + Z[la] : Z[la];
                                break;
                            case "linearGradient":
                            case "radialGradient":
                                this.defs.removeChild(this.grad);
                                this.grad = this.defs.appendChild(Z[la]);
                                ja = "url(#" + (this.grad.id = "gradbox_" + this.type) + ")"
                        }
                        this.rect.setAttribute("fill", ja);
                        this.rect.setAttribute("opacity",
                            ia);
                        if (ga) {
                            c.setColor(this.type, H, true);
                            c.setPaintOpacity(this.type, F, true)
                        }
                    };
                    this.update = function(Z) {
                        if (oa) {
                            var ga, ja, la = this.type;
                            switch (oa.tagName) {
                                case "use":
                                case "image":
                                case "foreignObject":
                                    return;
                                case "g":
                                case "a":
                                    var ia = null,
                                        na = oa.getElementsByTagName("*");
                                    ga = 0;
                                    for (ja = na.length; ga < ja; ga++) {
                                        var sa = na[ga].getAttribute(la);
                                        if (ga === 0) ia = sa;
                                        else if (ia !== sa) {
                                            ia = null;
                                            break
                                        }
                                    }
                                    if (ia === null) {
                                        H = null;
                                        return
                                    }
                                    H = ia;
                                    F = 1;
                                    break;
                                default:
                                    F = parseFloat(oa.getAttribute(la + "-opacity"));
                                    if (isNaN(F)) F = 1;
                                    ga = la === "fill" ?
                                        "black" : "none";
                                    H = oa.getAttribute(la) || ga
                            }
                            if (Z) {
                                c.setColor(la, H, true);
                                c.setPaintOpacity(la, F, true)
                            }
                            F *= 100;
                            this.setPaint(gb(H, F, la))
                        }
                    };
                    this.prep = function() {
                        switch (this.paint.type) {
                            case "linearGradient":
                            case "radialGradient":
                                var Z = new a.jGraduate.Paint({
                                    copy: this.paint
                                });
                                c.setPaint(k, Z)
                        }
                    }
                };
                Na.fill = new ta("#fill_color", "fill");
                Na.stroke = new ta("#stroke_color", "stroke");
                a("#stroke_width").val(u.initStroke.width);
                a("#group_opacity").val(u.initOpacity * 100);
                ta = Na.fill.rect.cloneNode(false);
                ta.setAttribute("style",
                    "vector-effect:non-scaling-stroke");
                pb = ta.style.vectorEffect === "non-scaling-stroke";
                ta.removeAttribute("style");
                ta = Na.fill.rect.ownerDocument.createElementNS(svgedit.NS.SVG, "feGaussianBlur");
                ta.stdDeviationX === undefined && a("#tool_blur").hide();
                a(ta).remove();
                (function() {
                    var h = "-" + Qb.toLowerCase() + "-zoom-",
                        k = h + "in";
                    Y.css("cursor", k);
                    if (Y.css("cursor") === k) {
                        Ob = k;
                        Db = h + "out"
                    }
                    Y.css("cursor", "auto")
                })();
                setTimeout(function() {
                    c.embedImage("images/logo.png", function(h) {
                        if (!h) {
                            a("#image_save_opts [value=embed]").attr("disabled",
                                "disabled");
                            a("#image_save_opts input").val(["ref"]);
                            a.pref("img_save", "ref");
                            a("#image_opt_embed").css("color", "#666").attr("title", v.notification.featNotSupported)
                        }
                    })
                }, 1E3);
                a("#fill_color, #tool_fill .icon_label").click(function() {
                    tc(a("#fill_color"));
                    sb()
                });
                a("#stroke_color, #tool_stroke .icon_label").click(function() {
                    tc(a("#stroke_color"));
                    sb()
                });
                a("#group_opacityLabel").click(function() {
                    a("#opacity_dropdown button").mousedown();
                    a(window).mouseup()
                });
                // a("#zoomLabel").click(function() {
                //     a("#zoom_dropdown button").mousedown();
                //     a(window).mouseup()
                // });
                a("#tool_move_top").mousedown(function(h) {
                    a("#tools_stacking").show();
                    h.preventDefault()
                });
                a(".layer_button").mousedown(function() {
                    a(this).addClass("layer_buttonpressed")
                }).mouseout(function() {
                    a(this).removeClass("layer_buttonpressed")
                }).mouseup(function() {
                    a(this).removeClass("layer_buttonpressed")
                });
                a(".push_button").mousedown(function() {
                    a(this).hasClass("disabled") || a(this).addClass("push_button_pressed").removeClass("push_button")
                }).mouseout(function() {
                    a(this).removeClass("push_button_pressed").addClass("push_button")
                }).mouseup(function() {
                    a(this).removeClass("push_button_pressed").addClass("push_button")
                });
                a("#layer_new").click(function() {
                    var h, k = c.getCurrentDrawing().getNumLayers();
                    do h = v.layers.layer + " " + ++k; while (c.getCurrentDrawing().hasLayer(h));
                    a.prompt(v.notification.enterUniqueLayerName, h, function(H) {
                        if (H)
                            if (c.getCurrentDrawing().hasLayer(H)) a.alert(v.notification.dupeLayerName);
                            else {
                                c.createLayer(H);
                                cb();
                                Ua()
                            }
                    })
                });
                a("#layer_delete").click(qa);
                a("#layer_up").click(function() {
                    ea(-1)
                });
                a("#layer_down").click(function() {
                    ea(1)
                });
                a("#layer_rename").click(function() {
                    var h = a("#layerlist tr.layersel td.layername").text();
                    a.prompt(v.notification.enterNewLayerName, "", function(k) {
                        if (k)
                            if (h == k || c.getCurrentDrawing().hasLayer(k)) a.alert(v.notification.layerHasThatName);
                            else {
                                c.renameCurrentLayer(k);
                                Ua()
                            }
                    })
                });
                var Vb = -1,
                    fc = false,
                    lc = false,
                    uc = function(h) {
                        var k = a("#ruler_x");
                        a("#sidepanels").width("+=" + h);
                        a("#layerpanel").width("+=" + h);
                        k.css("right", parseInt(k.css("right"), 10) + h);
                        Y.css("right", parseInt(Y.css("right"), 10) + h);
                        c.runExtensions("workareaResized")
                    }, vc = function(h) {
                        if (lc)
                            if (Vb != -1) {
                                fc = true;
                                h = Vb - h.pageX;
                                var k = a("#sidepanels").width();
                                if (k + h > 300) h = 300 - k;
                                else if (k + h < 2) h = 2 - k;
                                if (h != 0) {
                                    Vb -= h;
                                    uc(h)
                                }
                            }
                    }, mc = function(h) {
                        var k = a("#sidepanels").width();
                        uc((k > 2 || h ? 2 : 150) - k)
                    };
                a("#sidepanel_handle").mousedown(function(h) {
                    Vb = h.pageX;
                    a(window).mousemove(vc);
                    lc = false;
                    setTimeout(function() {
                        lc = true
                    }, 20)
                }).mouseup(function() {
                    fc || mc();
                    Vb = -1;
                    fc = false
                });
                a(window).mouseup(function() {
                    Vb = -1;
                    fc = false;
                    a("#svg_editor").unbind("mousemove", vc)
                });
                Ua();
                a(window).bind("load resize", function() {
                    Y.css("line-height", Y.height() + "px")
                });
                a("#resolution").change(function() {
                    var h =
                        a("#canvas_width,#canvas_height");
                    if (this.selectedIndex)
                        if (this.value == "content") h.val("fit").attr("disabled", "disabled");
                        else {
                            var k = this.value.split("x");
                            a("#canvas_width").val(k[0]);
                            a("#canvas_height").val(k[1]);
                            h.removeAttr("disabled")
                        } else a("#canvas_width").val() == "fit" && h.removeAttr("disabled").val(100)
                });
                a("input,select").attr("autocomplete", "off");
                Nb = function() {
                    var h = [{
                        sel: "#tool_select",
                        fn: Eb,
                        evt: "click",
                        key: ["V", true]
                    }, {
                        sel: "#tool_fhpath",
                        fn: Wb,
                        evt: "click",
                        key: ["Q", true]
                    }, {
                        sel: "#tool_line",
                        fn: Zb,
                        evt: "click",
                        key: ["L", true]
                    }, {
                        sel: "#tool_rect",
                        fn: Sb,
                        evt: "mouseup",
                        key: ["R", true],
                        parent: "#tools_rect",
                        icon: "rect"
                    }, {
                        sel: "#tool_square",
                        fn: yb,
                        evt: "mouseup",
                        parent: "#tools_rect",
                        icon: "square"
                    }, {
                        sel: "#tool_fhrect",
                        fn: hc,
                        evt: "mouseup",
                        parent: "#tools_rect",
                        icon: "fh_rect"
                    }, {
                        sel: "#tool_ellipse",
                        fn: ac,
                        evt: "mouseup",
                        key: ["E", true],
                        parent: "#tools_ellipse",
                        icon: "ellipse"
                    }, {
                        sel: "#tool_circle",
                        fn: xb,
                        evt: "mouseup",
                        parent: "#tools_ellipse",
                        icon: "circle"
                    }, {
                        sel: "#tool_fhellipse",
                        fn: $b,
                        evt: "mouseup",
                        parent: "#tools_ellipse",
                        icon: "fh_ellipse"
                    }, {
                        sel: "#tool_path",
                        fn: d,
                        evt: "click",
                        key: ["P", true]
                    }, {
                        sel: "#tool_text",
                        fn: f,
                        evt: "click",
                        key: ["T", true]
                    }, {
                        sel: "#tool_image",
                        fn: zb,
                        evt: "mouseup"
                    }, {
                        sel: "#tool_zoom",
                        fn: Va,
                        evt: "mouseup",
                        key: ["Z", true]
                    }, {
                        sel: "#tool_clear",
                        fn: aa,
                        evt: "mouseup",
                        key: ["N", true]
                    }, {
                        sel: "#tool_save",
                        fn: function() {
                            if (ya) nc();
                            else {
                                var H = {
                                    images: a.pref("img_save"),
                                    round_digits: 6
                                };
                                c.save(H)
                            }
                        },
                        evt: "mouseup",
                        key: ["S", true]
                    }, {
                        sel: "#tool_export",
                        fn: Aa,
                        evt: "mouseup"
                    }, {
                        sel: "#tool_open",
                        fn: ba,
                        evt: "mouseup",
                        key: ["O", true]
                    }, {
                        sel: "#tool_import",
                        fn: wa,
                        evt: "mouseup"
                    }, {
                        sel: "#tool_source",
                        fn: Ca,
                        evt: "click",
                        key: ["U", true]
                    }, {
                        sel: "#tool_wireframe",
                        fn: Kb,
                        evt: "click",
                        key: ["F", true]
                    }, {
                        sel: "#tool_source_cancel,.overlay,#tool_docprops_cancel,#tool_prefs_cancel",
                        fn: qc,
                        evt: "click",
                        key: ["esc", false, false],
                        hidekey: true
                    }, {
                        sel: "#tool_source_save",
                        fn: nc,
                        evt: "click"
                    }, {
                        sel: "#tool_docprops_save",
                        fn: yc,
                        evt: "click"
                    }, {
                        sel: "#tool_docprops",
                        fn: wc,
                        evt: "mouseup"
                    }, {
                        sel: "#tool_prefs_save",
                        fn: zc,
                        evt: "click"
                    }, {
                        sel: "#tool_prefs_option",
                        fn: function() {
                            xc();
                            return false
                        },
                        evt: "mouseup"
                    }, {
                        sel: "#tool_delete,#tool_delete_multi",
                        fn: r,
                        evt: "click",
                        key: ["del/backspace", true]
                    }, {
                        sel: "#tool_reorient",
                        fn: C,
                        evt: "click"
                    }, {
                        sel: "#tool_node_link",
                        fn: V,
                        evt: "click"
                    }, {
                        sel: "#tool_node_clone",
                        fn: X,
                        evt: "click"
                    }, {
                        sel: "#tool_node_delete",
                        fn: ca,
                        evt: "click"
                    }, {
                        sel: "#tool_openclose_path",
                        fn: M,
                        evt: "click"
                    }, {
                        sel: "#tool_add_subpath",
                        fn: S,
                        evt: "click"
                    }, {
                        sel: "#tool_move_top",
                        fn: z,
                        evt: "click",
                        key: "ctrl+shift+]"
                    }, {
                        sel: "#tool_move_bottom",
                        fn: B,
                        evt: "click",
                        key: "ctrl+shift+["
                    }, {
                        sel: "#tool_topath",
                        fn: K,
                        evt: "click"
                    }, {
                        sel: "#tool_make_link,#tool_make_link_multi",
                        fn: O,
                        evt: "click"
                    }, {
                        sel: "#tool_undo",
                        fn: Da,
                        evt: "click",
                        key: ["Z", true]
                    }, {
                        sel: "#tool_redo",
                        fn: $a,
                        evt: "click",
                        key: ["Y", true]
                    }, {
                        sel: "#tool_clone,#tool_clone_multi",
                        fn: Jb,
                        evt: "click",
                        key: ["D", true]
                    }, {
                        sel: "#tool_group_elements",
                        fn: hb,
                        evt: "click",
                        key: ["G", true]
                    }, {
                        sel: "#tool_ungroup",
                        fn: hb,
                        evt: "click"
                    }, {
                        sel: "#tool_unlink_use",
                        fn: hb,
                        evt: "click"
                    }, {
                        sel: "[id^=tool_align]",
                        fn: Rb,
                        evt: "click"
                    }, {
                        sel: "#tool_bold",
                        fn: ha,
                        evt: "mousedown"
                    }, {
                        sel: "#tool_italic",
                        fn: pa,
                        evt: "mousedown"
                    }, {
                        sel: "#sidepanel_handle",
                        fn: mc,
                        key: ["X"]
                    }, {
                        sel: "#copy_save_done",
                        fn: qc,
                        evt: "click"
                    }, {
                        key: "ctrl+left",
                        fn: function() {
                            P(0, 1)
                        }
                    }, {
                        key: "ctrl+right",
                        fn: function() {
                            P(1, 1)
                        }
                    }, {
                        key: "ctrl+shift+left",
                        fn: function() {
                            P(0, 5)
                        }
                    }, {
                        key: "ctrl+shift+right",
                        fn: function() {
                            P(1, 5)
                        }
                    }, {
                        key: "shift+O",
                        fn: N
                    }, {
                        key: "shift+P",
                        fn: J
                    }, {
                        key: [bb + "up", true],
                        fn: function() {
                            tb(2)
                        }
                    }, {
                        key: [bb + "down", true],
                        fn: function() {
                            tb(0.5)
                        }
                    }, {
                        key: [bb + "]", true],
                        fn: function() {
                            G("Up")
                        }
                    }, {
                        key: [bb + "[", true],
                        fn: function() {
                            G("Down")
                        }
                    }, {
                        key: ["up",
                            true
                        ],
                        fn: function() {
                            T(0, -1)
                        }
                    }, {
                        key: ["down", true],
                        fn: function() {
                            T(0, 1)
                        }
                    }, {
                        key: ["left", true],
                        fn: function() {
                            T(-1, 0)
                        }
                    }, {
                        key: ["right", true],
                        fn: function() {
                            T(1, 0)
                        }
                    }, {
                        key: "shift+up",
                        fn: function() {
                            T(0, -10)
                        }
                    }, {
                        key: "shift+down",
                        fn: function() {
                            T(0, 10)
                        }
                    }, {
                        key: "shift+left",
                        fn: function() {
                            T(-10, 0)
                        }
                    }, {
                        key: "shift+right",
                        fn: function() {
                            T(10, 0)
                        }
                    }, {
                        key: ["alt+up", true],
                        fn: function() {
                            c.cloneSelectedElements(0, -1)
                        }
                    }, {
                        key: ["alt+down", true],
                        fn: function() {
                            c.cloneSelectedElements(0, 1)
                        }
                    }, {
                        key: ["alt+left", true],
                        fn: function() {
                            c.cloneSelectedElements(-1,
                                0)
                        }
                    }, {
                        key: ["alt+right", true],
                        fn: function() {
                            c.cloneSelectedElements(1, 0)
                        }
                    }, {
                        key: ["alt+shift+up", true],
                        fn: function() {
                            c.cloneSelectedElements(0, -10)
                        }
                    }, {
                        key: ["alt+shift+down", true],
                        fn: function() {
                            c.cloneSelectedElements(0, 10)
                        }
                    }, {
                        key: ["alt+shift+left", true],
                        fn: function() {
                            c.cloneSelectedElements(-10, 0)
                        }
                    }, {
                        key: ["alt+shift+right", true],
                        fn: function() {
                            c.cloneSelectedElements(10, 0)
                        }
                    }, {
                        key: "A",
                        fn: function() {
                            c.selectAllInCurrentLayer()
                        }
                    }, {
                        key: bb + "z",
                        fn: Da
                    }, {
                        key: bb + "shift+z",
                        fn: $a
                    }, {
                        key: bb + "y",
                        fn: $a
                    }, {
                        key: bb + "x",
                        fn: j
                    }, {
                        key: bb + "c",
                        fn: E
                    }, {
                        key: bb + "v",
                        fn: n
                    }],
                        k = {
                            "4/Shift+4": "#tools_rect_show",
                            "5/Shift+5": "#tools_ellipse_show"
                        };
                    return {
                        setAll: function() {
                            var H = {};
                            a.each(h, function(F, Q) {
                                var U;
                                if (Q.sel) {
                                    U = a(Q.sel);
                                    if (U.length == 0) return true;
                                    if (Q.evt) {
                                        if (svgedit.browser.isTouch() && Q.evt === "click") Q.evt = "mousedown";
                                        U[Q.evt](Q.fn)
                                    }
                                    if (Q.parent && a(Q.parent + "_show").length != 0) {
                                        var Z = a(Q.parent);
                                        Z.length || (Z = Hb(Q.parent.substr(1)));
                                        Z.append(U);
                                        a.isArray(H[Q.parent]) || (H[Q.parent] = []);
                                        H[Q.parent].push(Q)
                                    }
                                }
                                if (Q.key) {
                                    var ga =
                                        Q.fn,
                                        ja = false;
                                    if (a.isArray(Q.key)) {
                                        Z = Q.key[0];
                                        if (Q.key.length > 1) ja = Q.key[1]
                                    } else Z = Q.key;
                                    Z += "";
                                    a.each(Z.split("/"), function(ia, na) {
                                        a(document).bind("keydown", na, function(sa) {
                                            ga();
                                            ja && sa.preventDefault();
                                            return false
                                        })
                                    });
                                    if (Q.sel && !Q.hidekey && U.attr("title")) {
                                        var la = U.attr("title").split("[")[0] + " (" + Z + ")";
                                        k[Z] = Q.sel;
                                        U.parents("#main_menu").length || U.attr("title", la)
                                    }
                                }
                            });
                            ra(H);
                            a(".attr_changer, #image_url").bind("keydown", "return", function(F) {
                                a(this).change();
                                F.preventDefault()
                            });
                            a(window).bind("keydown",
                                "tab", function(F) {
                                    if (ub === "canvas") {
                                        F.preventDefault();
                                        J()
                                    }
                                }).bind("keydown", "shift+tab", function(F) {
                                if (ub === "canvas") {
                                    F.preventDefault();
                                    N()
                                }
                            });
                            a("#tool_zoom").dblclick(b)
                        },
                        setTitles: function() {
                            a.each(k, function(H, F) {
                                var Q = a(F).parents("#main_menu").length;
                                a(F).each(function() {
                                    var U;
                                    U = Q ? a(this).text().split(" [")[0] : this.title.split(" [")[0];
                                    var Z = "";
                                    a.each(H.split("/"), function(ga, ja) {
                                        var la = ja.split("+"),
                                            ia = "";
                                        if (la.length > 1) {
                                            ia = la[0] + "+";
                                            ja = la[1]
                                        }
                                        Z += (ga ? "/" : "") + ia + (v["key_" + ja] || ja)
                                    });
                                    if (Q) this.lastChild.textContent =
                                        U + " [" + Z + "]";
                                    else this.title = U + " [" + Z + "]"
                                })
                            })
                        },
                        getButtonData: function(H) {
                            var F;
                            a.each(h, function(Q, U) {
                                if (U.sel === H) F = U
                            });
                            return F
                        }
                    }
                }();
                Nb.setAll();
                o.ready(function() {
                    var h = u.initTool,
                        k = a("#tools_left, #svg_editor .tools_flyout"),
                        H = k.find("#tool_" + h);
                    h = k.find("#" + h);
                    (H.length ? H : h.length ? h : a("#tool_select")).click().mouseup();
                    u.wireframe && a("#tool_wireframe").click();
                    u.showlayers && mc();
                    a("#rulers").toggle( !! u.showRulers);
                    if (u.showRulers) a("#show_rulers")[0].checked = true;
                    u.baseUnit && a("#base_unit").val(u.baseUnit);
                    if (u.gridSnapping) a("#grid_snapping_on")[0].checked = true;
                    u.snappingStep && a("#grid_snapping_step").val(u.snappingStep);
                    u.gridColor && a("#grid_color").val(u.gridColor)
                });
                a("#rect_rx").SpinButton({
                    min: 0,
                    max: 1E3,
                    callback: function(h) {
                        c.setRectRadius(h.value)
                    }
                });
                a("#stroke_width").SpinButton({
                    min: 0,
                    max: 99,
                    smallStep: 0.1,
                    callback: function(h) {
                        var k = h.value;
                        if (k == 0 && oa && ["line", "polyline"].indexOf(oa.nodeName) >= 0) k = h.value = 1;
                        c.setStrokeWidth(k)
                    }
                });
                a("#angle").SpinButton({
                    min: -180,
                    max: 180,
                    step: 5,
                    callback: function(h) {
                        c.setRotationAngle(h.value);
                        a("#tool_reorient").toggleClass("disabled", parseInt(h.value, 10) === 0)
                    }
                });
                a("#font_size").SpinButton({
                    min: 0.001,
                    stepfunc: function(h, k) {
                        var H = Number(h.value),
                            F = H + k,
                            Q = F >= H;
                        if (k === 0) return H;
                        if (H >= 24) {
                            if (Q) return Math.round(H * 1.1);
                            return Math.round(H / 1.1)
                        }
                        if (H <= 1) {
                            if (Q) return H * 2;
                            return H / 2
                        }
                        return F
                    },
                    callback: function(h) {
                        c.setFontSize(h.value)
                    }
                });
                a("#group_opacity").SpinButton({
                    min: 0,
                    max: 100,
                    step: 5,
                    callback: wb
                });
                a("#blur").SpinButton({
                    min: 0,
                    max: 10,
                    step: 0.1,
                    callback: Tb
                });
                a("#zoom").SpinButton({
                    min: 0.001,
                    max: 1E4,
                    step: 50,
                    stepfunc: function(h, k) {
                        var H = Number(h.value);
                        if (H === 0) return 100;
                        var F = H + k;
                        if (k === 0) return H;
                        if (H >= 100) return F;
                        if (F >= H) return H * 2;
                        return H / 2
                    },
                    callback: ab
                }).val(c.getZoom() * 100);
                a("#workarea").contextMenu({
                    menu: "cmenu_canvas",
                    inSpeed: 0
                }, function(h) {
                    switch (h) {
                        case "delete":
                            r();
                            break;
                        case "cut":
                            j();
                            break;
                        case "copy":
                            E();
                            break;
                        case "paste":
                            c.pasteElements();
                            break;
                        case "paste_in_place":
                            c.pasteElements("in_place");
                            break;
                        case "group_elements":
                            c.groupSelectedElements();
                            break;
                        case "ungroup":
                            c.ungroupSelectedElement();
                            break;
                        case "move_front":
                            z();
                            break;
                        case "move_up":
                            G("Up");
                            break;
                        case "move_down":
                            G("Down");
                            break;
                        case "move_back":
                            B();
                            break;
                        default:
                            svgedit.contextmenu && svgedit.contextmenu.hasCustomHandler(h) && svgedit.contextmenu.getCustomHandler(h).call()
                    }
                    c.clipBoard.length && va.enableContextMenuItems("#paste,#paste_in_place")
                });
                ta = function(h) {
                    switch (h) {
                        case "dupe":
                            fa();
                            break;
                        case "delete":
                            qa();
                            break;
                        case "merge_down":
                            if (a("#layerlist tr.layersel").index() != c.getCurrentDrawing().getNumLayers() - 1) {
                                c.mergeLayer();
                                cb();
                                Ua()
                            }
                            break;
                        case "merge_all":
                            c.mergeAllLayers();
                            cb();
                            Ua()
                    }
                };
                a("#layerlist").contextMenu({
                    menu: "cmenu_layers",
                    inSpeed: 0
                }, ta);
                a("#layer_moreopts").contextMenu({
                    menu: "cmenu_layers",
                    inSpeed: 0,
                    allowLeft: true
                }, ta);
                a(".contextMenu li").mousedown(function(h) {
                    h.preventDefault()
                });
                a("#cmenu_canvas li").disableContextMenu();
                va.enableContextMenuItems("#delete,#cut,#copy");
                window.addEventListener("beforeunload", function(h) {
                    if (jb.getUndoStackSize() === 0) o.showSaveWarning = false;
                    if (!u.no_save_warning && o.showSaveWarning) return h.returnValue =
                        v.notification.unsavedChanges
                }, false);
                o.openPrep = function(h) {
                    a("#main_menu").hide();
                    jb.getUndoStackSize() === 0 ? h(true) : a.confirm(v.notification.QwantToOpen, h)
                };
                if (window.FileReader) {
                    ta = function(h) {
                        a.process_cancel(v.notification.loadingImage);
                        h.stopPropagation();
                        h.preventDefault();
                        a("#workarea").removeAttr("style");
                        a("#main_menu").hide();
                        if (h = h.type == "drop" ? h.dataTransfer.files[0] : this.files[0])
                            if (h.type.indexOf("image") != -1) {
                                var k;
                                if (h.type.indexOf("svg") != -1) {
                                    k = new FileReader;
                                    k.onloadend = function(H) {
                                        c.importSvgString(H.target.result,
                                            true);
                                        c.ungroupSelectedElement();
                                        c.ungroupSelectedElement();
                                        c.groupSelectedElements();
                                        c.alignSelectedElements("m", "page");
                                        c.alignSelectedElements("c", "page")
                                    };
                                    k.readAsText(h)
                                } else {
                                    k = new FileReader;
                                    k.onloadend = function(H) {
                                        var F = 100,
                                            Q = 100,
                                            U = new Image;
                                        U.src = H.target.result;
                                        U.style.opacity = 0;
                                        U.onload = function() {
                                            F = U.offsetWidth;
                                            Q = U.offsetHeight;
                                            var Z = c.addSvgElementFromJson({
                                                element: "image",
                                                attr: {
                                                    x: 0,
                                                    y: 0,
                                                    width: F,
                                                    height: Q,
                                                    id: c.getNextId(),
                                                    style: "pointer-events:inherit"
                                                }
                                            });
                                            c.setHref(Z, H.target.result);
                                            c.selectOnly([Z]);
                                            c.alignSelectedElements("m", "page");
                                            c.alignSelectedElements("c", "page");
                                            cb()
                                        }
                                    };
                                    k.readAsDataURL(h)
                                }
                            }
                    };
                    Y[0].addEventListener("dragenter", ka, false);
                    Y[0].addEventListener("dragover", Ia, false);
                    Y[0].addEventListener("dragleave", Ba, false);
                    Y[0].addEventListener("drop", ta, false);
                    ec = a('<input type="file">').change(function() {
                        var h = this;
                        o.openPrep(function(k) {
                            if (k) {
                                c.clear();
                                if (h.files.length === 1) {
                                    a.process_cancel(v.notification.loadingImage);
                                    k = new FileReader;
                                    k.onloadend = function(H) {
                                        I(H.target.result);
                                        eb()
                                    };
                                    k.readAsText(h.files[0])
                                }
                            }
                        })
                    });
                    a("#tool_open").show().prepend(ec);
                    ta = a('<input type="file">').change(ta);
                    a("#tool_import").show().prepend(ta)
                }
                eb(true);
                a(function() {
                    window.svgCanvas = c;
                    c.ready = o.ready
                });
                o.setLang = function(h, k) {
                    o.langChanged = true;
                    a.pref("lang", h);
                    a("#lang_select").val(h);
                    if (k) {
                        var H = a("#layerlist tr.layersel td.layername").text() == v.common.layer + " 1";
                        a.extend(v, k);
                        c.setUiStrings(k);
                        Nb.setTitles();
                        if (H) {
                            c.renameCurrentLayer(v.common.layer + " 1");
                            Ua()
                        }
                        if (za.length)
                            for (; za.length;) za.shift().langReady({
                                lang: h,
                                uiStrings: v
                            });
                        else c.runExtensions("langReady", {
                            lang: h,
                            uiStrings: v
                        });
                        c.runExtensions("langChanged", h);
                        ma();
                        a.each({
                            "#stroke_color": "#tool_stroke .icon_label, #tool_stroke .color_block",
                            "#fill_color": "#tool_fill label, #tool_fill .color_block",
                            "#linejoin_miter": "#cur_linejoin",
                            "#linecap_butt": "#cur_linecap"
                        }, function(F, Q) {
                            a(Q).attr("title", a(F)[0].title)
                        });
                        a("#multiselected_panel div[id^=tool_align]").each(function() {
                            a("#tool_pos" + this.id.substr(10))[0].title = this.title
                        })
                    }
                }
            };
            o.ready = function(t) {
                e ?
                    t() : g.push(t)
            };
            o.runCallbacks = function() {
                a.each(g, function() {
                    this()
                });
                e = true
            };
            o.loadFromString = function(t) {
                o.ready(function() {
                    I(t)
                })
            };
            o.disableUI = function() {};
            o.loadFromURL = function(t, m) {
                m || (m = {});
                var L = m.cache,
                    R = m.callback;
                o.ready(function() {
                    a.ajax({
                        url: t,
                        dataType: "text",
                        cache: !! L,
                        beforeSend: function() {
                            a.process_cancel(v.notification.loadingImage)
                        },
                        success: function(da) {
                            I(da, R)
                        },
                        error: function(da, qa, fa) {
                            da.status != 404 && da.responseText ? I(da.responseText, R) : a.alert(v.notification.URLloadFail + ": \n" +
                                fa, R)
                        },
                        complete: function() {
                            a("#dialog_box").hide()
                        }
                    })
                })
            };
            o.loadFromDataURI = function(t) {
                o.ready(function() {
                    var m = t.substring(26);
                    I(s.decode64(m))
                })
            };
            o.addExtension = function() {
                var t = arguments;
                a(function() {
                    c && c.addExtension.apply(this, t)
                })
            };
            return o
        }(jQuery);
        $(svgEditor.init)
    }
})();
var svgEditor = function(a, I) {
    function o(i, s, e) {
        var g, q, w, D, u, A = a("#svg_editor").parent();
        for (q in s) {
            (w = s[q]) || console.log(q);
            if (e) q = "#" + q;
            g = A.find(q);
            if (g.length) {
                D = A.find(q)[0];
                switch (i) {
                    case "content":
                        for (g = 0; g < D.childNodes.length; g++) {
                            u = D.childNodes[g];
                            if (u.nodeType === 3 && u.textContent.replace(/\s/g, "")) {
                                u.textContent = w;
                                break
                            }
                        }
                        break;
                    case "title":
                        D.title = w
                }
            } else console.log("Missing: " + q)
        }
    }
    var c;
    I.readLang = function(i) {
        var s = I.canvas.runExtensions("addlangData", c, true);
        a.each(s, function(v, t) {
            if (t.data) i =
                a.merge(i, t.data)
        });
        if (i.tools) {
            var e = i.tools;
            s = i.properties;
            var g = i.config,
                q = i.layers,
                w = i.common,
                D = i.ui;
            o("content", {
                curve_segments: s.curve_segments,
                fitToContent: e.fitToContent,
                fit_to_all: e.fit_to_all,
                fit_to_canvas: e.fit_to_canvas,
                fit_to_layer_content: e.fit_to_layer_content,
                fit_to_sel: e.fit_to_sel,
                icon_large: g.icon_large,
                icon_medium: g.icon_medium,
                icon_small: g.icon_small,
                icon_xlarge: g.icon_xlarge,
                image_opt_embed: g.image_opt_embed,
                image_opt_ref: g.image_opt_ref,
                includedImages: g.included_images,
                largest_object: e.largest_object,
                layersLabel: q.layers,
                page: e.page,
                relativeToLabel: e.relativeTo,
                selLayerLabel: q.move_elems_to,
                selectedPredefined: g.select_predefined,
                selected_objects: e.selected_objects,
                smallest_object: e.smallest_object,
                straight_segments: s.straight_segments,
                svginfo_bg_url: g.editor_img_url + ":",
                svginfo_bg_note: g.editor_bg_note,
                svginfo_change_background: g.background,
                svginfo_dim: g.doc_dims,
                svginfo_editor_prefs: g.editor_prefs,
                svginfo_height: w.height,
                svginfo_icons: g.icon_size,
                svginfo_image_props: g.image_props,
                svginfo_lang: g.language,
                svginfo_title: g.doc_title,
                svginfo_width: w.width,
                tool_docprops_cancel: w.cancel,
                tool_docprops_save: w.ok,
                tool_source_cancel: w.cancel,
                tool_source_save: w.ok,
                tool_prefs_cancel: w.cancel,
                tool_prefs_save: w.ok,
                sidepanel_handle: q.layers.split("").join(" "),
                tool_clear: e.new_doc,
                tool_docprops: e.docprops,
                tool_export: e.export_img,
                tool_import: e.import_doc,
                tool_imagelib: e.imagelib,
                tool_open: e.open_doc,
                tool_save: e.save_doc,
                svginfo_units_rulers: g.units_and_rulers,
                svginfo_rulers_onoff: g.show_rulers,
                svginfo_unit: g.base_unit,
                svginfo_grid_settings: g.grid,
                svginfo_snap_onoff: g.snapping_onoff,
                svginfo_snap_step: g.snapping_stepsize,
                svginfo_grid_color: g.grid_color
            }, true);
            var u, A = {};
            for (u in i.shape_cats) A['#shape_cats [data-cat="' + u + '"]'] = i.shape_cats[u];
            setTimeout(function() {
                o("content", A)
            }, 2E3);
            var p = {};
            a.each(["cut", "copy", "paste", "paste_in_place", "delete", "group", "ungroup", "move_front", "move_up", "move_down", "move_back"], function() {
                p['#cmenu_canvas a[href="#' + this + '"]'] = e[this]
            });
            a.each(["dupe", "merge_down", "merge_all"],
                function() {
                    p['#cmenu_layers a[href="#' + this + '"]'] = q[this]
                });
            p['#cmenu_layers a[href="#delete"]'] = q.del;
            o("content", p);
            o("title", {
                align_relative_to: e.align_relative_to,
                circle_cx: s.circle_cx,
                circle_cy: s.circle_cy,
                circle_r: s.circle_r,
                cornerRadiusLabel: s.corner_radius,
                ellipse_cx: s.ellipse_cx,
                ellipse_cy: s.ellipse_cy,
                ellipse_rx: s.ellipse_rx,
                ellipse_ry: s.ellipse_ry,
                fill_color: s.fill_color,
                font_family: s.font_family,
                idLabel: s.id,
                image_height: s.image_height,
                image_url: s.image_url,
                image_width: s.image_width,
                layer_delete: q.del,
                layer_down: q.move_down,
                layer_new: q["new"],
                layer_rename: q.rename,
                layer_moreopts: w.more_opts,
                layer_up: q.move_up,
                line_x1: s.line_x1,
                line_x2: s.line_x2,
                line_y1: s.line_y1,
                line_y2: s.line_y2,
                linecap_butt: s.linecap_butt,
                linecap_round: s.linecap_round,
                linecap_square: s.linecap_square,
                linejoin_bevel: s.linejoin_bevel,
                linejoin_miter: s.linejoin_miter,
                linejoin_round: s.linejoin_round,
                main_icon: e.main_menu,
                mode_connect: e.mode_connect,
                tools_shapelib_show: e.mode_shapelib,
                palette: D.palette_info,
                zoom_panel: D.zoom_level,
                path_node_x: s.node_x,
                path_node_y: s.node_y,
                rect_height_tool: s.rect_height,
                rect_width_tool: s.rect_width,
                seg_type: s.seg_type,
                selLayerNames: q.move_selected,
                selected_x: s.pos_x,
                selected_y: s.pos_y,
                stroke_color: s.stroke_color,
                stroke_style: s.stroke_style,
                stroke_width: s.stroke_width,
                svginfo_title: g.doc_title,
                text: s.text_contents,
                toggle_stroke_tools: D.toggle_stroke_tools,
                tool_add_subpath: e.add_subpath,
                tool_alignbottom: e.align_bottom,
                tool_aligncenter: e.align_center,
                tool_alignleft: e.align_left,
                tool_alignmiddle: e.align_middle,
                tool_alignright: e.align_right,
                tool_aligntop: e.align_top,
                tool_angle: s.angle,
                tool_blur: s.blur,
                tool_bold: s.bold,
                tool_circle: e.mode_circle,
                tool_clone: e.clone,
                tool_clone_multi: e.clone,
                tool_delete: e.del,
                tool_delete_multi: e.del,
                tool_ellipse: e.mode_ellipse,
                tool_eyedropper: e.mode_eyedropper,
                tool_fhellipse: e.mode_fhellipse,
                tool_fhpath: e.mode_fhpath,
                tool_fhrect: e.mode_fhrect,
                tool_font_size: s.font_size,
                tool_group_elements: e.group_elements,
                tool_make_link: e.make_link,
                tool_link_url: e.set_link_url,
                tool_image: e.mode_image,
                tool_italic: s.italic,
                tool_line: e.mode_line,
                tool_move_bottom: e.move_bottom,
                tool_move_top: e.move_top,
                tool_node_clone: e.node_clone,
                tool_node_delete: e.node_delete,
                tool_node_link: e.node_link,
                tool_opacity: s.opacity,
                tool_openclose_path: e.openclose_path,
                tool_path: e.mode_path,
                tool_position: e.align_to_page,
                tool_rect: e.mode_rect,
                tool_redo: e.redo,
                tool_reorient: e.reorient_path,
                tool_select: e.mode_select,
                tool_source: e.source_save,
                tool_square: e.mode_square,
                tool_text: e.mode_text,
                tool_topath: e.to_path,
                tool_undo: e.undo,
                tool_ungroup: e.ungroup,
                tool_wireframe: e.wireframe_mode,
                view_grid: e.toggle_grid,
                tool_zoom: e.mode_zoom,
                url_notice: e.no_embed
            }, true);
            I.setLang(c, i)
        }
    };
    I.putLocale = function(i, s) {
        if (i) c = i;
        else {
            c = a.pref("lang");
            if (!c) {
                if (navigator.userLanguage) c = navigator.userLanguage;
                else if (navigator.language) c = navigator.language;
                if (c == null) return
            }
            console.log("Lang: " + c);
            if (a.inArray(c, s) === -1 && c !== "test") c = "en"
        }
        var e = I.curConfig.langPath + "lang." + c + ".js";
        a.getScript(e, function(g) {
            if (!g) {
                g = document.createElement("script");
                g.src = e;
                document.querySelector("head").appendChild(g)
            }
        })
    };
    return I
}(jQuery, svgEditor);
svgedit = svgedit || {};
(function() {
    var a = this;
    if (!svgedit.contextmenu) svgedit.contextmenu = {};
    a.contextMenuExtensions = {};
    svgEditor.ready(function() {
        for (var I in contextMenuExtensions) {
            var o = contextMenuExtensions[I];
            Object.keys(a.contextMenuExtensions).length === 0 && $("#cmenu_canvas").append("<li class='separator'>");
            var c = o.shortcut || "";
            $("#cmenu_canvas").append("<li class='disabled'><a href='#" + o.id + "'>" + o.label + "<span class='shortcut'>" + c + "</span></a></li>")
        }
    });
    svgedit.contextmenu.resetCustomMenus = function() {
        a.contextMenuExtensions = {}
    };
    svgedit.contextmenu.add = function(I) {
        if (I && I.id && I.label && I.action && typeof I.action == "function")
            if (I.id in a.contextMenuExtensions) console.error('Cannot add extension "' + I.id + '", an extension by that name already exists"');
            else {
                console.log("Registed contextmenu item: {id:" + I.id + ", label:" + I.label + "}");
                a.contextMenuExtensions[I.id] = I
            } else console.error("Menu items must be defined and have at least properties: id, label, action, where action must be a function")
    };
    svgedit.contextmenu.hasCustomHandler =
        function(I) {
            return a.contextMenuExtensions[I] && true
    };
    svgedit.contextmenu.getCustomHandler = function(I) {
        return a.contextMenuExtensions[I].action
    }
})();