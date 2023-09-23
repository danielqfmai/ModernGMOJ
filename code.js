// ==UserScript==
// @name         ModernGMOJ
// @version      1.4.3
// @namespace    https://gmoj.net/
// @match        https://gmoj.net/*
// @icon         https://gmoj.net/favicon.ico
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

'use strict';

var domparser=new DOMParser();

var big_timer_exist=0,big_timer_interval_id=0;
function make_timer() {
    if ($('#timer').length==0&&$('#navigation').length>0) {
        var li=document.createElement('li'),a=document.createElement('a');
        li.className='nav_bar';
        a.href='#timer';
        a.id='timer';
        li.appendChild(a);
        $('#navigation')[0].appendChild(li);
//        $('#navigation')[0].appendChild(domparser.parseFromString(
//            '<li class="nav_bar"><a href="#timer" id="timer"></a></li>',
//            'application/xml').firstChild);
        $('#timer').text((new Date($.now() + delta)).toString().substr(16,8));
        $('#timer').click(function() {
            $('#navigation li').removeClass('active');
            $(this).parent().addClass('active');
        });
        setInterval('$("#timer").html((new Date($.now() + delta)).toString().substr(16,8))',500);
    }
}

function remove_avatar() {
    $('#username>div>img').error(function() {
        $(this).parent().remove();
    });
}

function sidebar() {
    $(` #nav_home, #nav_task, #nav_group, #nav_ranklist, #nav_admin,
    #scroll_tip, #nav_toggle,
    #copyleft`).remove();
    document.body.appendChild($('#navigation')[0]);
}

function contest_home_page() {
    $(`#contest_table th:nth-child(8),
       #contest_table td:nth-child(8),
       #contest_table th:nth-child(5),
       #contest_table td:nth-child(5),
       #contest_table th:nth-child(3),
       #contest_table td:nth-child(3)`).remove();
}

function return_button() {
    var dirname=document.location.hash.split('/');
    if (dirname.length>2&&dirname[0]=='#main'&&dirname[1]=='statistic') {
        $('#page_content>button').click(function() {
            document.location.hash='#main/show/'+dirname[2];
        });
    }
}

function trigger(data) {
    var a=$('#trigger');
    var x=`<div style="position: absolute; display: none;"><div style="
            max-height: 350px;
            overflow-y: auto;
            margin-top: 16px;
            padding: 10px;
            background-color: #f5f5f5;
            color: #333;
            border-radius: 4px;
            box-shadow: 0px 0px 3px rgba(0,0,0,0.2);">`
        +data.replace(new RegExp('(Case [0-9]*<br />)*$'),'</div></div>').
        replace(/Case [0-9]+/g,'<b style="display: inline-block; margin-top: 6px;">$&</b>');
    a.each(function(){
        $(this)[0].innerHTML+=x;
        $(this).parent()[0].removeAttribute('href');
        $(this).find('.label.label-info').css('float','right');
        $(this).find('.label.label-info').css('margin-left','2px');
    });
    a.mouseenter(function(){
        var b=$(this).find('div');
        b.fadeIn(250);
        b.css( 'top',($(this)[0].offsetTop)+'px');
        b.css('left',($(this)[0].offsetLeft+7-b[0].clientWidth/2)+'px');
    });
    a.mouseleave(function(){a.find('div').fadeOut(250);});
}

var observer = new MutationObserver(function () {
    try {
        $.get=function(e, r, i, s) {
            if (e.split('simple').length>1) r=trigger;
            return $.isFunction(r) && (s = s || i, i = r),
            $.ajax({
                type: 'get',
                url: e,
                data: r,
                success: i,
                dataType: s
            })
        }
        set_page_content=function(selector, url, success) {
            if (url=='index.php/timer') {
                $('#page_content').hide();
                make_timer();
                $('#page_content').html(`
                <div style="text-align:center; overflow: visible">
                    <div style="
                    font-size: calc(25vw - 60px);
                    line-height: 1;
                    font-weight: 800;" id="big_timer"></div>
                    <div style="
                    float: right;
                    font-size: calc(5vw - 12px);
                    line-height: 2;" id="big_date"></div>
                </div>`);
                $('#big_timer')[0].innerText=(new Date($.now() + delta)).toString().substr(16,8);
                big_timer_interval_id=setInterval("$('#big_timer')[0].innerText=(new Date($.now() + delta)).toString().substr(16,8);", 500);
                big_timer_exist=1;
                $('#timer').parent().addClass('active');
                $('#big_date')[0].innerText=(new Date($.now() + delta)).toString().substr(0,15);
                $('#page_content').fadeIn(250);
                sidebar();
            } else {
                addRequest = {};
                url = randomize(url);
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function(data){
                        $(selector).hide();
                        $(selector).html(data);
                        if (selector=='#page_content') {
                            if (big_timer_exist) {
                                clearInterval(big_timer_interval_id);
                                big_timer_exist=0;
                            }
                            make_timer();
                            sidebar();
                            contest_home_page();
                            return_button();
                            $('#div_tags').remove();
                        } else {
                            if (selector=='#userinfo') {
                                remove_avatar();
                            }
                        }
                        $(selector).fadeIn(250);
                        if (success != void 0) success();
                    }, error: function(xhr, statusText, error){
                        $(selector).html('<div class="alert"><strong>Error: ' + ' ' + error + '</strong></div>');
                    }
                });
            }
        }
        if (!scripts_injected) {
//            $('#markdown_scripts').html(`
 //               <script src="https://cdn.jsdelivr.net/npm/marked@3.0.0/marked.min.js"></script>
//                <script id="MathJax-script" async="" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>`);
            scripts_injected=1;
        }
//        MathJax = { tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]} };
        observer.disconnect();
    } catch(e) { }
});
observer.observe((document.head), { subtree: true, childList: true });


var style = document.createElement('style');
style.innerHTML=`
legend {
    border-bottom:initial;
}
a:hover, a:focus {
    text-decoration: none;
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
#contest_table th, #contest_table td {
    text-align: center;
    vertical-align: center;
}
#mainbar {
    width: 90%;
}
#sidebar {
    position: fixed;
    right: 0px;
    width: 10%;
}
#header>div>div>a:hover strong {
    color: #a10 !important;
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
.btn {
    text-shadow: initial;
    background-image: initial;
    background-repeat: initial;
    border: initial;
    filter: initial;
    box-shadow: initial;
}
.btn-primary, .btn-primary:visited {
    background-color: #04d;
    color: #fff;
    margin-top: 6px;
}
.btn-primary:hover, btn-primary:focus {
    background-color: #03c;
}
.input-prepend .add-on, .input-prepend .input-mini, .input-prepend .input-xlarge {
    border: initial;
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
