// ==UserScript==
// @name         ModernGMOJ
// @version      1.3.1
// @namespace    https://gmoj.net/
// @match        https://gmoj.net/*
// @icon         https://gmoj.net/favicon.ico
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

'use strict';

var big_timer_interval_id;
function make_timer() {
    if ($('#timer').length==0) {
        var li=document.createElement('li'),a=document.createElement('a');
//        a.style.color='#0c3463';
//        a.style['font-size']='14px';
//        a.style['padding-left']='12px';
        a.href='#timer';
        a.id='timer';
        li.appendChild(a);
        li.className='nav_bar';
        $('#navigation')[0].appendChild(li);
        $('#timer').click( function() {
            $('#navigation li').removeClass('active');
            $(this).parent().addClass('active');
        });
        setInterval("$('#timer')[0].innerText=(new Date($.now() + delta)).toString().substr(16,8);", 200);
    }
}

function remove_avatar() {
    var avatar=$('#username>div>img');
    if (avatar.length>0)
        avatar[0].onerror=function(event){this.parentElement.remove();};
}

function sidebar() {
    $(` #nav_home, #nav_task, #nav_group, #nav_ranklist, #nav_admin,
    #scroll_tip,
    #copyleft`).remove();
    document.body.appendChild($('#navigation')[0]);
    $('#nav_toggle').toggle(function() {
            $('#navigation').animate({ left: '-200px', width: '0' }, 320);
            $('#page_content').animate({ 'margin-left': '10px' }, 320);
            $('#icon_nav_toggle').removeClass();
            $('#icon_nav_toggle').addClass('icon-arrow-right');
            }, function() {
            $('#navigation').animate({ left: '0', width: '100px' }, 320);
            $('#page_content').animate({ 'margin-left': '110px' }, 320);
            $('#icon_nav_toggle').removeClass();
            $('#icon_nav_toggle').addClass('icon-arrow-left');
            });
    $('#nav_toggle')[0].style.top='270px';
    $('#nav_toggle')[0].style.left='3px';
}

function contest_home_page() {
    var tr=$('#contest_table tr');
    for (var i=0; i<tr.length; i++)
        tr[i].children[7].remove(),
        tr[i].children[4].remove(),
        tr[i].children[2].remove();
}

function return_button() {
    var dirname=document.location.hash.split('/');
    if (dirname.length>2&&dirname[0]=='#main'&&dirname[1]=='statistic') {
        $('#page_content>button')[0].onclick=function(){
            document.location.hash='#main/show/'+dirname[2];
        };
    }
}

var observer = new MutationObserver(function () {
    try {
        set_page_content=function(selector, url, success) {
            if (url=='index.php/timer') {
                $('#page_content').hide();
                $('#page_content').html(`
                <div>
                    <div style="
                    font-size: calc(25vw - 50px);
                    line-height: 1.15;
                    font-weight: 800;" id="big_timer"></div>
                    <div style="
                    float: right;
                    font-size: calc(5vw - 10px);
                    line-height: 1.15;" id="big_date"></div>
                </div>`);
                $('#timer').parent().addClass('active');
                big_timer_interval_id=setInterval("$('#big_timer')[0].innerText=(new Date($.now() + delta)).toString().substr(16,8);", 200);
                $('#big_date')[0].innerText=(new Date($.now() + delta)).toString().substr(0,15);
                remove_avatar();
                sidebar();
                $('#page_content').fadeIn(250);
            } else {
                addRequest = {};
                url = randomize(url);
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function(data){
                        clearInterval(big_timer_interval_id);
                        $(selector).hide();
                        $(selector).html(data);
                        remove_avatar();
                        make_timer();
                        sidebar();
                        contest_home_page();
                        return_button();
                        $(selector).fadeIn(250);
                        if (success != void 0) success();
                    }, error: function(xhr, statusText, error){
                        $(selector).html('<div class="alert"><strong>Error: ' + ' ' + error + '</strong></div>');
                    }
                });
            }
        }
        observer.disconnect();
    } catch(e) { }
});
observer.observe((document.head), { subtree: true, childList: true });


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
.nav_bar.active>a:hover, .nav-tabs>.active>a:focus {
    cursor: default;
    border: initial;
}
.nav_bar.active>a:hover {
    color: #08c;
    background-color: #eeeeee;
}
.nav_bar.active>a {
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
    border-top: initial;
}
.pagination ul>li>a, .pagination ul>li>span {
    border: initial;
}
#contest_table th, #contest_table td {
    text-align: center;
    vertical-align: center;
}
.btn {
    text-shadow: initial;
    background-image: initial;
    background-repeat: initial;
    border: initial;
    filter: initial;
}
::-webkit-scrollbar {
   width: 6px;
   height: 10px;
}
::-webkit-scrollbar-track {
   background-color: #eeeeee;
}
::-webkit-scrollbar-thumb {
   background-color: #d6d6d6;
}
::-webkit-scrollbar-thumb:hover {
   background-color: #444444;
}`
document.head.appendChild(style);
