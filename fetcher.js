
javascript:(function () {
    var todo = 7;
    var EXPAND_POST = 1;
    var EXPAND_COMMENTS = 2;
    var EXPAND_REPLIES = 4;
    var EXPAND_XLAT = 8;
    var WAIT_TIME = 100;
    var MAX_WAIT = 20;
    var END_DELAY = 2.5;
    var ID_CONTENT = "contentArea";
    var CSS_COMMENT_AREA = "UFIList";
    var ATTR_SHOW_COMMENT_AREA = "data-comment-prelude-ref";
    var CSS_SHOW_COMMENT_AREA = "UFIBlingBox";
    var CSS_SHOW_COMMENT_AREA_2 = "uiBlingBox";
    var _NONE = "no-value";
    var _COMMENTS = "-comments";
    var _REPLIES = "-replies";
    var EXPOSE_CONTENT = "text_exposed_link";
    var CSS_PAGER = "UFIPagerLink";
    var CSS_LINK_TEXT = "UFIReplySocialSentenceLinkText";
    var CSS_SEE_MORE = "fss";
    var CSS_GROUPS_SIDE_MARGIN = "groupsSideMargin";
    var CSS_COMMENT = "UFIComment";
    var CSS_REPLY_LIST = "UFIReplyList";
    var CSS_XLAT_POST = "_43f9";
    var CSS_XLAT_COMMENT = "UFITranslateLink";
    var CSS_XLATED = "UFITranslatedText";
    var CSS_LOGIN_OVERLAY = "_5hn6";
    var CSS_LOGIN_DIALOG = "generic_dialog_modal";
    var CSS_PERMALINK = "permalinkPost";
    var CSS_THEATER1 = "_xlt";
    var CSS_THEATER2 = "_5tl7";

    function keyboardOn() {
        window.abortNow = false;
        document.addEventListener("keyup", docKeyUp);
    }

    function keyboardOff() {
        window.abortNow = true;
        document.removeEventListener("keyup", docKeyUp);
    }

    function docKeyUp(e) {
        if (e.keyCode == 27) {
            myLog("Aborting...");
            window.abortNow = true;
        }
    }

    function showStatusWindow() {
        var WANT_W = 300;
        var WANT_H = 200;
        var sizer = document.getElementsByTagName("html")[0];
        var w = sizer.clientWidth;
        var h = sizer.clientHeight;
        var x = 0;
        if (w > WANT_W) {
            x = (w - WANT_W) / 2;
        }
        var y = 0;
        if (h > WANT_H) {
            y = (h - WANT_H) / 3;
        }
        var div = document.createElement("div");
        div.id = "status-window";
        div.style.position = "fixed";
        div.style.zIndex = "999999";
        div.style.left = x + "px";
        div.style.width = WANT_W + "px";
        div.style.top = y + "px";
        div.style.height = WANT_H + "px";
        var container = document.body;
        container.insertBefore(div, container.firstChild);
        var edit = document.createElement("textarea");
        edit.style.width = "100%";
        edit.style.height = "100%";
        edit.style.color = "#fff";
        edit.style.backgroundColor = "#425f9c";
        div.appendChild(edit);
        window.g_logger = edit;
    }

    function hideStatusWindow() {
        var div = document.getElementById("status-window");
        document.body.removeChild(div);
        window.g_logger = null;
    }

    function myLog(s) {
        console.log(s);
        window.g_logger.value = s + "\n" + window.g_logger.value;
    }

    function logCounts() {
        if (window.timeouts > 0) {
            myLog(window.timeouts + " timeout(s)");
        }
        var comments = 0;
        var replies = 0;
        var cr = window.g_rootNode.getElementsByClassName(CSS_COMMENT);
        for (var i = 0; i < cr.length; i++) {
            var role = cr[i].getAttribute("aria-label");
            role == "Comment" ? comments++ : replies++;
        }
        myLog("Comments + replies = " + comments + " + " + replies + " = " + cr.length);
    }

    function endSession() {
        logCounts();
        keyboardOff();
        window.setTimeout(hideStatusWindow, END_DELAY * 1000);
    }

    function determinePageType() {
        window.g_rootNode = document;
        var divs = document.getElementsByClassName(CSS_PERMALINK);
        if (divs.length === 1) {
            myLog("Expanding permalinked post only");
            window.g_rootNode = divs[0];
        }
    }

    function getContentSize() {
        var node = document.getElementById(ID_CONTENT);
        if (!node) {
            node = document.getElementsByTagName("html")[0];
        }
        return node.offsetHeight;
    }

    function getStyle(node) {
        return node.ownerDocument.defaultView.getComputedStyle(node, null);
    }

    function isHidden(node) {
        return getStyle(node)["display"] == "none";
    }

    function hasClassName(node, className) {
        var i = node.className.indexOf(className);
        if (i < 0) {
            return false;
        }
        var x = node.className.length - className.length;
        if (x === 0) {
            return true;
        }
        if (i === 0) {
            return node.className.indexOf(className + " ") === 0;
        }
        if (i === x) {
            return node.className.indexOf(" " + className) === (x - 1);
        }
        return node.className.indexOf(" " + className + " ") > 0;
    }

    function getAncestorByType(node, type, deflt) {
        while (node) {
            node = node.parentNode;
            if (node && node.nodeName == type) {
                return node;
            }
        }
        return deflt;
    }

    function getAncestorByClass(node, className) {
        while (node) {
            node = node.parentNode;
            if (node && node.className && hasClassName(node, className)) {
                return node;
            }
        }
        return null;
    }

    function deleteOverlay() {
        var divs = document.getElementsByClassName(CSS_LOGIN_OVERLAY);
        if (divs.length === 1) {
            myLog("Removing Sign Up overlay");
            divs[0].parentNode.removeChild(divs[0]);
        }
        divs = document.getElementsByClassName(CSS_LOGIN_DIALOG);
        if (divs.length === 1) {
            myLog("Removing login dialog");
            divs[0].parentNode.removeChild(divs[0]);
        }
    }

    function closeTheaterMode(onDone) {
        var acted = false;
        var nodes = document.getElementsByClassName(CSS_THEATER1);
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].offsetHeight > 0) {
                acted = true;
                nodes[i].click();
            }
        }
        nodes = document.getElementsByClassName(CSS_THEATER2);
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].offsetHeight > 0) {
                acted = true;
                nodes[i].click();
            }
        }
        if (acted) {
            myLog("Ensuring not in theater mode");
        }
        if (onDone) {
            window.setTimeout(onDone, 0);
        }
    }

    function ensureCommentsShowing(value, onDone) {
        var byClass = (value != null);
        var showers = byClass ? window.g_rootNode.getElementsByClassName(value) : window.g_rootNode.getElementsByTagName("A");
        var filter = [];
        for (var i = 0; i < showers.length; i++) {
            if (byClass || showers[i].getAttribute(ATTR_SHOW_COMMENT_AREA)) {
                var root = getAncestorByType(showers[i], "FORM", document);
                var area = root.getElementsByClassName(CSS_COMMENT_AREA);
                if (area.length == 0) {
                    filter.push(showers[i]);
                }
            }
        }
        if (filter.length > 0) {
            myLog("Showing comments for " + filter.length + " post(s)");
            clickAndWait(_NONE, onDone, filter, 0);
        } else {
            if (onDone) onDone();
        }
    }

    function isHideReplies(link) {
        if (hasClassName(link, CSS_LINK_TEXT)) {
            if (link.textContent.indexOf("\u00b7") >= 0) {
                return false;
            }
            return isNaN(window.parseInt(link.textContent, 10));
        }
        return false;
    }

    function isNewWindow(link) {
        var anchors = link.getElementsByTagName("A");
        if (anchors.length > 0) {
            return !!anchors[0].getAttribute("target");
        }
        return false;
    }

    function newWindowNow(link) {
        var anchors = link.getElementsByTagName("A");
        if (anchors.length > 0) {
            var target = anchors[0].getAttribute("target");
            if (target) {
                myLog("New window: " + anchors[0].textContent);
                var w = window.open(anchors[0].getAttribute("href"), target);
                if (!w) {
                    myLog("New window was blocked!");
                }
            }
        }
    }

    function clickClass(value, onDone) {
        if (window.abortNow) {
            if (onDone) onDone();
            return;
        }
        var links = window.g_rootNode.getElementsByClassName(value);
        var filter = [];
        for (var i = 0; i < links.length; i++) {
            if (value === EXPOSE_CONTENT) {
                if (getAncestorByClass(links[i], CSS_GROUPS_SIDE_MARGIN)) {
                    continue;
                }
                if (!isHidden(links[i]) && links[i].children.length > 0) {
                    if (isNewWindow(links[i])) {
                        if ((todo & EXPAND_POST) != 0) {
                            newWindowNow(links[i]);
                        }
                    } else {
                        filter.push(links[i].children[0]);
                    }
                }
                continue;
            }
            if (value === CSS_XLAT_POST) {
                if (links[i].children.length > 0 && links[i].children[0].nodeName === "A") {
                    filter.push(links[i].children[0]);
                }
                continue;
            }
            if (value === CSS_XLAT_COMMENT) {
                if (links[i].children.length > 0) {
                    continue;
                }
                if (!getAncestorByClass(links[i], CSS_XLATED)) {
                    filter.push(links[i]);
                }
                continue;
            }
            if (isHideReplies(links[i])) {
            } else if (value === CSS_SEE_MORE && links[i].nodeName === "SPAN") {
                continue;
            } else {
                filter.push(links[i]);
            }
        }
        if (filter.length > 0) {
            clickAndWait(value, onDone, filter, 0);
        } else {
            if (onDone) onDone();
        }
    }

    function doNotWait(value) {
        var check = [CSS_SEE_MORE, CSS_XLAT_COMMENT, EXPOSE_CONTENT];
        return check.indexOf(value) >= 0;
    }

    function commentsOrReplies(comments, onDone) {
        if (window.abortNow) {
            if (onDone) onDone();
            return;
        }
        var links = window.g_rootNode.getElementsByClassName(CSS_PAGER);
        var filter = [];
        for (var i = 0; i < links.length; i++) {
            var isReply = getAncestorByClass(links[i], CSS_REPLY_LIST) != null;
            if (comments && !isReply) {
                filter.push(links[i]);
            } else if (!comments && isReply) {
                filter.push(links[i]);
            }
        }
        if (filter.length > 0) {
            clickAndWait(comments ? _COMMENTS : _REPLIES, onDone, filter, 0);
        } else {
            if (onDone) onDone();
        }
    }

    function clickAndWait(value, onDone, links, i) {
        if (window.abortNow) {
            if (onDone) onDone();
            return;
        }
        var label = links[i].getAttribute("aria-label");
        if (!label) {
            label = links[i].textContent;
        }
        myLog("click (" + (links.length - i - 1) + " left): " + label);
        links[i].click();
        var n = getContentSize();
        var wait = MAX_WAIT;
        var time = WAIT_TIME;
        if (doNotWait(value)) {
            wait = -1;
            time = 0;
        }
        window.setTimeout(function () {
            waitHelper(value, onDone, links, i, n, wait);
        }, time);
    }

    function waitHelper(value, onDone, links, i, n, wait) {
        if (wait === -1) {
            if (++i < links.length) {
                clickAndWait(value, onDone, links, i);
            } else {
                if (onDone) onDone();
            }
            return;
        }
        if (getContentSize() - n != 0) {
            if (++i < links.length) {
                clickAndWait(value, onDone, links, i);
            } else {
                if (value == _COMMENTS || value == _REPLIES) {
                    commentsOrReplies(value == _COMMENTS, onDone);
                } else {
                    clickClass(value, onDone);
                }
            }
            return;
        }
        if (wait > 0) {
            window.setTimeout(function () {
                waitHelper(value, onDone, links, i, n, --wait);
            }, WAIT_TIME);
            return;
        }
        window.timeouts++;
        if (++i < links.length) {
            clickAndWait(value, onDone, links, i);
        } else {
            if (onDone) onDone();
        }
    }

    function setUpActions() {
        window.timeouts = 0;
        var actions = window.actions = [];
        actions.push(function (onDone) {
            closeTheaterMode(onDone);
        });
        actions.push(function (onDone) {
            ensureCommentsShowing(null, onDone);
        });
        actions.push(function (onDone) {
            ensureCommentsShowing(CSS_SHOW_COMMENT_AREA, onDone);
        });
        actions.push(function (onDone) {
            ensureCommentsShowing(CSS_SHOW_COMMENT_AREA_2, onDone);
        });
        actions.push(function (onDone) {
            clickClass(EXPOSE_CONTENT, onDone);
        });
        if ((todo & EXPAND_COMMENTS) != 0) {
            actions.push(function (onDone) {
                commentsOrReplies(true, onDone);
            });
        }
        if ((todo & EXPAND_REPLIES) != 0) {
            actions.push(function (onDone) {
                clickClass(CSS_LINK_TEXT, onDone);
            });
            actions.push(function (onDone) {
                commentsOrReplies(false, onDone);
            });
        }
        if ((todo & EXPAND_XLAT) != 0) {
            actions.push(function (onDone) {
                clickClass(CSS_XLAT_POST, onDone);
            });
            actions.push(function (onDone) {
                clickClass(CSS_XLAT_COMMENT, onDone);
            });
        }
        actions.push(function (onDone) {
            clickClass(CSS_SEE_MORE, onDone);
        });
        actions.push(endSession);
        actions.push(null);
    }

    function doActions(i) {
        if (window.actions[i] != null) {
            window.actions[i](function () {
                doActions(i + 1);
            });
        }
    }

    function main() {
        showStatusWindow();
        keyboardOn();
        deleteOverlay();
        determinePageType();
        setUpActions();
        doActions(0);
    }

    if (!window.g_logger) {
        main();
    }
})();