// ==UserScript==
// @name         ModernGMOJ
// @version      1.3
// @namespace    https://gmoj.net/
// @match        https://gmoj.net/*
// @icon         https://gmoj.net/favicon.ico
// @grant        unsafeWindow
// @run-at       document-body
// ==/UserScript==

'use strict';

set_page_content=function(selector, url, success) {
    addRequest = {};
    url = randomize(url);
    $('.overlay').css({'z-index': '1000', 'display': 'block'});
    $('.overlay').animate({opacity: '0.5'}, 250);
    $.ajax({
        type: "GET",
        url: url,
        success: function(data){
            $(selector).hide();
            $('.overlay').css({'z-index': '-1000', 'display': 'none'});
            $('.overlay').animate({opacity: '0'}, 250);
            $(selector).html(data);
            var split_by_contest=document.location.href.split('#contest');
            if (split_by_contest.length>=2&&split_by_contest[1]=='') {
//                $('#contest_table>thead')[0].remove();
                var tr=$('#contest_table tr');
                for (var i=0; i<tr.length; i++) tr[i].children[7].remove();
                for (var i=0; i<tr.length; i++) tr[i].children[4].remove();
                for (var i=0; i<tr.length; i++) tr[i].children[2].remove();
            }
            $(selector).fadeIn(250);
            if (success != void 0) success();
        },
        error: function(xhr, statusText, error){
            $('.overlay').css({'z-index': '-1000', 'display': 'none'});
            $('.overlay').animate({opacity: '0'}, 250);
            $(selector).html('<div class="alert"><strong>Error: ' + ' ' + error + '</strong></div>');
        }
    });
}
function make_timer() {
    var li=document.createElement('li'),a=document.createElement('a');
    a.style.color='#000';
    a.style['font-size']='16px';
    a.style['padding-left']='15px';
    a.id='timer';
    li.appendChild(a);
    li.className='nav_bar';
    $('#navigation')[0].appendChild(li);
    setInterval("$('#timer')[0].innerText=(new Date($.now() + delta)).toString().substr(16,8);", 100);
}

$("#nav_task").remove();
$("#nav_group").remove();
$("#nav_ranklist").remove();
$("#nav_admin").remove();
$("#scroll_tip").remove();
$('#copyleft').remove();
setTimeout("$('#username>div')[0].remove()",300);
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

//var hms = document.createElement('li');
//$('#navigation')[0].appendChild(hms);
//hms.style['text-align']='center';
//setInterval(function() {hms.innerText=$('#server_time')[0].innerText.substr(16,8)}, 100);
make_timer();

$('#nav_toggle')[0].style.top='270px';
$('#nav_toggle')[0].style.left='3px';
var style = document.createElement('style');
style.innerHTML=`
legend {
    border-bottom:initial;
}
#navigation {
    position: fixed;
    top: 5px;
    border-right: initial;
    margin: 0;
}
#page_content {
    margin: 10px 10px 0px 110px;
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
    border-radius: initial;
}
.nav-tabs>.active>a:hover, .nav-tabs>.active>a:focus {
    cursor: default;
    border: initial;
}
.nav-tabs>.active>a:hover {
    color: #08c;
    background-color: #eeeeee;
}
.nav-tabs>.active>a {
    border: initial;
    border-radius: initial;
}
.navbar-inner {
    background-image: initial;
    border: initial;
    border-radius: initial;
    background-color: initial;
}
.table-bordered {
    border: initial;
}
.table-bordered th, .table-bordered td {
    border-left: initial;
}
.table-condensed th, .table-condensed td {
    padding: 5px;
}
.table th, .table td {
    text-align: center;
    vertical-align: center;
    border-top: initial;
}`
document.head.appendChild(style);
