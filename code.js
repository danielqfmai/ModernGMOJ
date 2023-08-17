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

function make_timer() {
    if ($('#timer').length==0) {
        var li=document.createElement('li'),a=document.createElement('a');
        a.style.color='#0c3463';
        a.style['font-size']='14px';
        a.style['padding-left']='12px';
        a.href='#timer';
        a.id='timer';
        li.appendChild(a);
        li.className='nav_bar';
        $('#navigation')[0].appendChild(li);
        setInterval("$('#timer')[0].innerText=(new Date($.now() + delta)).toString().substr(16,8);", 200);
    }
}

function remove_avatar() {
    var avatar=$('#username>div>img');
    if (avatar.length>0)
        avatar[0].onerror=function(event){this.parentElement.remove();};
}

function contest_home_page() {
    var tr=$('#contest_table tr');
    for (var i=0; i<tr.length; i++)
        tr[i].children[7].remove(),
            tr[i].children[4].remove(),
            tr[i].children[2].remove();
}

var observer = new MutationObserver(function () {
    try {
        set_page_content=function(selector, url, success) {
            if (url=='index.php/timer') {
                $('#page_content')[0].innerHTML=`
                <div style="
                float: left;
                font-size: calc(3vw - 4.8px);
                line-height: 1.15;" id="big_time_zone">Thu Aug 17 2023</div>
                <div style="
                font-size: calc(25vw - 40px);
                line-height: 1.15;
                font-weight: 800;" id="big_timer">20:07:49</div>
                <div style="
                float: right;
                font-size: calc(5vw - 8px);
                line-height: 1.15;" id="big_date">Thu Aug 17 2023</div>`
                $('#big_time_zone')[0].innerText=(new Date($.now() + delta)).toString().substr(25,17);
                setInterval("$('#big_timer')[0].innerText=(new Date($.now() + delta)).toString().substr(16,8);", 200);
                setInterval("$('#big_date')[0].innerText=(new Date($.now() + delta)).toString().substr(0,15);", 200);
            } else {
                addRequest = {};
                url = randomize(url);
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function(data){
                        $(selector).hide();
                        $(selector).html(data);
                        remove_avatar();
                        make_timer();
                        $(` #nav_task, #nav_group, #nav_ranklist, #nav_admin,
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
                        contest_home_page();
                        $(selector).fadeIn(250);
                        if (success != void 0) success();
                    },
                    error: function(xhr, statusText, error){
                        $(selector).html('<div class="alert"><strong>Error: ' + ' ' + error + '</strong></div>');
                    }
                });
            }
        }
//        init_framework=function() {
//            	window.preventHashchange = false;
//                if (window.location.hash != '') {
//                    if (window.location.hash=='#timer') {
//                    } else {
//                        set_page_content('#page_content', hash_to_url(window.location.hash));
//                    }
//                }
//                else load_page('main/home');
//                var privilege = get_cookie('privilege');
//                if (privilege == 'admin') $('.nav_admin').attr({style:"display:block"});
//                else $('.nav_admin').attr({style:"display:none"});
//                getServerPushData();
//        }
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
    border-top: initial;
}
.pagination ul>li>a, .pagination ul>li>span {
    border: initial;
}
#contest_table th, #contest_table td {
    text-align: center;
    vertical-align: center;
}`
document.head.appendChild(style);
