// ==UserScript==
// @name         ModernGMOJ
// @version      1.1
// @namespace    https://gmoj.net/
// @match        https://gmoj.net/*
// @icon         https://gmoj.net/favicon.ico
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByClassName('container-fluid')[0].style.padding='initial';
    setTimeout("document.evaluate('/html/body/div[2]/div[1]/div/div',document).iterateNext().style.padding='10px 0px'",100);
    document.getElementById('navigation').style['border-right']='initial';

    document.getElementById("nav_task").remove();
    document.getElementById("nav_group").remove();
    document.getElementById("nav_ranklist").remove();
    document.getElementById("nav_admin").remove();
    document.getElementById("scroll_tip").remove();
    setTimeout("document.getElementById('username').querySelector('div').remove()",100);
    var style = document.createElement('style');

    style.innerHTML=
    `.well {
        margin:10px;
        background-color: #f5f5f5;
        border: initial;
        -webkit-border-radius: initial;
        -moz-border-radius: initial;
        border-radius: initial;
        -webkit-box-shadow: initial;
        -moz-box-shadow: initial;
        box-shadow: initial
    }
    .nav-tabs>.active>a {
        color: #555;
        cursor: default;
        background-color: #fff;
        border: initial;
        border-bottom-color: initial;
    }
    .tabs-left>.nav-tabs>li>a {
        margin-right: -1px;
        border-radius: initial;
    }
    .tabs-left>.nav-tabs .active>a {
        border-color: initial;
        *border-right-color: initial;
    }`

    var split_by_contest=document.location.href.split('contest')
    if (split_by_contest.length>1&&split_by_contest[1]!='') {
        // setTimeout("document.evaluate('/html/body/div[2]/div[1]/div/div/div[1]/div[1]/div[1]/div/ul/li[1]',document).iterateNext().remove()",200);
        style.innerHTML+=
            `.navbar-inner {
            background-image: initial;
            border: initial;
            border-radius: initial;
            -webkit-border-radius: initial;
            -moz-border-radius: initial;
            -moz-box-shadow: initial;
            background-color: initial;
            -webkit-box-shadow: initial;
            -moz-box-shadow: initial;
        }`
    }
    document.head.appendChild(style);
})();
