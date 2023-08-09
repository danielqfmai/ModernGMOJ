// ==UserScript==
// @name         ModernGMOJ
// @version      1.2
// @namespace    https://gmoj.net/
// @match        https://gmoj.net/*
// @icon         https://gmoj.net/favicon.ico
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    setTimeout("document.evaluate('/html/body/div[2]/div[1]/div/div',document).iterateNext().style.padding='10px 0px'",100);
    $('#nav_toggle')[0].style.top='255px';

    $("#nav_task").remove();
    $("#nav_group").remove();
    $("#nav_ranklist").remove();
    $("#nav_admin").remove();
    $("#scroll_tip").remove();
    // $('#copyleft').remove();
    setTimeout("document.getElementById('username').querySelector('div').remove()",100);
    document.body.appendChild($('#navigation')[0]);

    $('#nav_toggle').toggle(function() {
			$('#navigation').animate({ left: '-200px', width: '0' }, 320);
			$('#page_content').animate({ 'margin-left': '10px' }, 320);
			$('#icon_nav_toggle').removeClass();
			$('#icon_nav_toggle').addClass('icon-arrow-right');
		},
		function() {
			$('#navigation').animate({ left: '0', width: '100px' }, 320);
			$('#page_content').animate({ 'margin-left': '110px' }, 320);
			$('#icon_nav_toggle').removeClass();
			$('#icon_nav_toggle').addClass('icon-arrow-left');
		}
	);

    var hms = document.createElement('li');
    $('#navigation')[0].appendChild(hms);
    hms.style['text-align']='center';
    setInterval(function() {
        hms.innerText=$('#server_time')[0].innerText.substr(29,8)
    }, 100);

    var style = document.createElement('style');
    style.innerHTML=
    `#navigation {
        position: fixed;
        top: 5px;
        border-right: initial;
        margin: 0;
    }
    #page_content {
        margin-left: 110px;
    }
    .well {
        margin:0;
        border: initial;
        border-radius: initial;
        box-shadow: initial
    }
    .container-fluid {
        padding: initial;
    }
    .nav-tabs {
        border-bottom: initial;
    }
    .nav-tabs>li {
        float: none;
    }
    .nav-tabs>li>a {
        border: initial;
        margin-right: -1px;
        border-radius: initial;
    }
    .nav-tabs>.active>a {
        border: initial;
        margin-right: -1px;
        border-radius: initial;
    }`

    var split_by_contest=document.location.href.split('contest')
    if (split_by_contest.length>1&&split_by_contest[1]!='') {
        style.innerHTML+=
        `.navbar-inner {
            background-image: initial;
            border: initial;
            border-radius: initial;
            background-color: initial;
        }`
    }
    document.head.appendChild(style);
})();
