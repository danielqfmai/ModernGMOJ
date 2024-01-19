// ==UserScript==
// @name         ModernGMOJ
// @version      1.5.0
// @namespace    https://gmoj.net/
// @match        https://gmoj.net/*
// @icon         https://gmoj.net/favicon.ico
// @run-at       document-start
// ==/UserScript==

"use strict";
var parser=new DOMParser();

function make_timer() {
    if ($("#timer").length==0&&$("#navigation").length>0) {
        var li=document.createElement("li"),a=document.createElement("a");
        li.className="nav_bar";
        a.id="timer";
        li.appendChild(a);
        $("#navigation")[0].appendChild(li);
        $("#timer").text((new Date($.now() + delta)).toString().substr(16,8));
        setInterval("$('#timer').text((new Date($.now() + delta)).toString().substr(16,8))",500);
    }
}

function sidebar() {
    $(` #nav_home, #nav_task, #nav_group, #nav_ranklist, #nav_admin,
    #scroll_tip, #nav_toggle,
    #copyleft`).remove();
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
    var dirname=document.location.hash.split("/");
    if (dirname.length>2&&dirname[0]=="#main"&&dirname[1]=="statistic") {
        $("#page_content>button").click(function() {
            document.location.hash="#main/show/"+dirname[2];
        });
    }
}

function trigger(data) {
    var a=$("#trigger");
    var x=`<div style="position: absolute; display: none;"><div style="
            max-height: 350px;
            overflow-y: auto;
            margin-top: 16px;
            padding: 10px;
            background-color: #f5f5f5;
            color: #333;
            border-radius: 4px;
            box-shadow: 0px 0px 3px rgba(0,0,0,0.2);">`
        +data.replace(new RegExp("(Case [0-9]*<br />)*$"),"</div></div>").
        replace(/Case [0-9]+/g,"<b style='display: inline-block; margin-top: 6px;'>$&</b>");
    a.each(function(){
        $(this)[0].innerHTML+=x;
        $(this).parent()[0].removeAttribute("href");
        $(this).find(".label.label-info").css("float","right");
        $(this).find(".label.label-info").css("margin-left","2px");
    });
    a.mouseenter(function(){
        var b=$(this).find("div");
        b.fadeIn(250);
        b.css( "top",($(this)[0].offsetTop)+"px");
        b.css("left",($(this)[0].offsetLeft+7-b[0].clientWidth/2)+"px");
    });
    a.mouseleave(function(){a.find("div").fadeOut(250);});
}

function contest_saver() {
    if (location.hash.split("#contest/home/").length>1)
        $("div.hero-unit")[0].innerHTML +=
      `<button class="btn btn-primary" onclick="
          async function main() {
              const parser = new DOMParser();
              const lct = location;
              var doc = '# ';
              var imgcnt = 0;
              var dijing = [];
              const dirHandle = await showDirectoryPicker()
                  .catch((e) => {});
              if (!dirHandle) return;
              await $.ajax({ url: lct.pathname + 'index.php/contest/home/' + lct.hash.split('/')[2],
                  success: (data) => {
                      var ele = parser.parseFromString(data, 'text/html');
                      doc += ele.querySelector('h2').innerText;
                  }
              });
              async function download(url,name,handle) {
                  const response = await fetch(url);
                  const newFileHandle = await handle.getFileHandle(name, { create: true });
                  const writable = await newFileHandle.createWritable();
                  await response.body.pipeTo(writable);
              }
              async function detailed_limits(z,id) {
                  const problemDirHandle = await dirHandle.getDirectoryHandle(String(id), { create: true });
                  download(lct.pathname + z.split('#')[1] + '?simple', 'detailed_limits.html', problemDirHandle);
                  await $.ajax({ url: lct.pathname + 'index.php/main/showdownload/' + z.split('limits/')[1],
                      success: (data) => {
                          console.log(data);
                          var ele = parser.parseFromString(data, 'text/html');
                          tmp = ele.querySelectorAll('a');
                          for (var i = 0; i < tmp.length; ++i)
                              download(tmp[i].href, '(' + String(i) + ')' + tmp[i].innerText, problemDirHandle);
                      }
                  });
              }
              for (var i = 0, flg = 1; flg; ++i) {
                flg = 0;
                  await $.ajax({ url: lct.pathname + 'index.php/contest/show/' + lct.hash.split('/')[2] + '/' + String(i),
                      success: (data) => {
                          var ele = parser.parseFromString(data, 'text/html');
                          if (!ele.querySelector('div.row-fluid')) return;
                          flg = 1;
                          var title = ele.querySelector('div.row-fluid > div > h2').innerText
                          doc += '\\n## ' + title;
                          var tmp = ele.querySelectorAll('div.row-fluid > div > div > span > span');
                          doc += '\\n' + tmp[0].innerText + ', ' + tmp[1].innerText;
                          ele.querySelectorAll('div.row-fluid > div > div > span.label').forEach(
                              (label) => { doc += ', ' + label.innerText; });
                          tmp=ele.querySelectorAll('div.row-fluid > div > h4 > span');
                          if (tmp.length) doc += '\\n\\nInput : \`' + tmp[0].innerText
                              + '\`\\n\\nOutput : \`' + tmp[1].innerText + '\`';
                          detailed_limits(ele.querySelector('#link_limits').href,i);
                          try { tmp = ele.querySelectorAll('#mainbar > script');
                              eval(tmp[tmp.length - 1].innerText + 'md = rawMarkdown;');
                              for (var part in md) if (md[part] != '') {
                                  var x = md[part].split(/!\\[.*\\]\\(/g);
                                  for (var j = 1; j < x.length; ++j) {
                                      var y = x[j].split(')');
                                      download(y[0],String(imgcnt) + '.png',dirHandle);
                                      y[0] = String(imgcnt) + '.png';
                                      ++imgcnt;
                                      x[j] = y.join(')');
                                  }
                                  doc += '\\n### ' + String(part) + '\\n' + x.join('![](');
                              }
                              tmp = ele.querySelectorAll('div.div_samplecase_plaintext > div');
                              if (tmp.length) {
                                  doc += '\\n### Samples';
                                  tmp.forEach((sample) => { doc += '\\n#### ' + sample.children[0].children[0].innerText
                                      + '\\n\`\`\`\\n' + sample.children[1].innerText + '\\n\`\`\`'; });
                              }
                          }
                          catch (error) {
                              alert('请手动保存 ' + title + ' 的题面，你可以在控制台（按 F12）中看到题目名称');
                              dijing.push(title);
                          }
                      }
                  });
              }
              const docHandle = await dirHandle.getFileHandle('statements.md', { create: true });
              const writable = await docHandle.createWritable();
              writable.write(doc);
              writable.close();
              console.log(dijing);
          }
          main();">Save Contest</button>`;
}

var observer = new MutationObserver(() => {
    try { set_page_content = (selector, url, success) => {
            const jqDom = $(selector).find("#vue-app")
            jqDom.length && jqDom[0].__vue__.$destroy()
            $.ajax({ type: "GET", url: url,
                success: (data) => {
                    $(selector).hide();
                    $(selector).html(data);
                    if (selector == "#page_content") {
                        make_timer();
                        sidebar();
                        contest_home_page();
                        return_button();
                        $("#div_tags").remove();
                        contest_saver();
                    }
                    $(selector).fadeIn(250);
                    if (success != void 0) success();
                },
                error: (xhr, statusText, error) => {
                    $(selector).html("<div class='alert'><strong>Error: " + error + "</strong></div>");
                }
            });
        }
        observer.disconnect();
    }
    catch(e) { }
});
observer.observe((document.head), { subtree: true, childList: true });

var style = document.createElement("style");
style.innerHTML=`
legend {
    border-bottom:initial;
}
a:hover, a:focus {
    text-decoration: none;
}
#navigation {
    border-right: initial;
    margin: 0;
}
#contest_table th, #contest_table td {
    text-align: center;
    vertical-align: center;
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
