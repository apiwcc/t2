var mobileAgent = new Array("iphone", "ipod", "ipad", "android", "mobile", "blackberry", "webos", "incognito", "webmate", "bada", "nokia", "lg", "ucweb", "skyfire");
var browser = navigator.userAgent.toLowerCase();
for (var i=0; i<mobileAgent.length; i++){
	if (browser.indexOf(mobileAgent[i])!=-1){
		if(window.location.href.indexOf('//www.') > 0) {
			window.location.href = window.location.href.replace('//www.', '//m.');
		}
		break;
	}
}
var user;
if (document.cookie.length > 0) {
	var offset = document.cookie.indexOf("_user=");
	if (offset > -1) {
		offset += 6;
		var end = document.cookie.indexOf(";", offset);
		if (end == -1) end = document.cookie.length;
		user = JSON.parse(unescape(document.cookie.substring(offset, end)));
	}
}

//登陆调用
function login(){
if(user){
    document.writeln('<li id=\"loginbarx\"><a href=\"/user.html\" target=\"_top\">'+user.name+'</a></li><li id=\"bookcase\"><a href=\"/mark.html\" target=\"_top\">我的书架</a></li>');
}else{
  var jumpurl="";
  if(location.href.indexOf("jumpurl") == -1){
    jumpurl=location.href;
  }
document.writeln("<li id=\"bookcase\"><a href=\"/history.html\" target=\"_top\">阅读记录</a></li><li id=\"loginbarx\"><a href=\"/login.html?jumpurl="+jumpurl.replace('&','%26')+"\" target=\"_top\">登录</a></li>");
}
}


function socommon() {
	document.writeln('<a href="https://apiw.cc">ApiWcc</a>');
	
}

function search() {
	document.writeln('<form target="_blank" style="margin:0;padding:0;"  action="{:mac_url('vod/search')}" method="post">');
	document.writeln('<input type="hidden" name="searchtype" value="all">');
	document.writeln("<input class=\"search\" id=\"bdcsMain\" name=\"searchkey\" type=\"text\"  maxlength=\"30\" value=\"可搜书名和作者，请您少字也别输错字。\" title=\"请正确输入\" onfocus=\"this.style.color = '#000000';this.focus();if(this.value=='可搜书名和作者，请您少字也别输错字。'){this.value='';}\" ondblclick=\"javascript:this.value=''\" />");
	document.writeln('<input type="submit" class="searchBtn" value="搜索" title="搜索"  /></form>');
}

function textselect() {
	document.writeln('<ul class="tools">\
<li class="theme"><p>主题：</p><a class="day"></a><a class="night"></a><a class="pink"></a><a class="yellow"></a><a class="blue"></a><a class="green"></a><a class="gray"></a></li>\
<li class="size"><p>字体：</p><a class="dec">-</a><p id="fontsize">18</p><a class="inc">+</a></li>\
<li class="reset">重置</li>\
</ul>');
}


function formatDate(time) {
	var date = new Date(time);
	var month = date.getMonth()+1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	if (month < 10) month = '0' + month;
	if (day < 10) day = '0' + day;
	if (hour < 10) hour = '0' + hour;
	if (minute < 10) minute = '0' + minute;
	return month+'-'+day+' '+hour+':'+minute;
}
function active(url){
	if (!user) {
		if (confirm('您尚未登录，是否马上登录？')) {
			window.location.href='/login.html?jumpurl='+escape(window.location.href);
		}
		return;
	}
	var xhr = new XMLHttpRequest();          
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
			var json = JSON.parse(xhr.responseText);
			alert(json._info);
		}
	}
	xhr.send();
}
function vote(id){
	id = id || 0;
	active('/vote/'+id+'/?d=json&r='+Math.random());
}
function mark(id, cid){
	id = id || 0;
	cid = cid || 0;
	active('/mark/add/'+id+'/'+cid+'/?d=json&r='+Math.random());
}
function init(type){
	if (type==='mark') {
		$('#sitebox').on('click', 'a.delbtn', function(){
			var li = $(this).parents('dl');
			if (confirm('确定删除书签吗？ ')) {
				$.getJSON('/mark/del/'+li.attr('article-id')+'/?d=json', function(res){
					if (res._status >= 0) {
						li.remove();
						$('#mark_num').text($('#sitebox dl').length);
					}
					alert(res._info);
				});
			}
		});
		return;
	}
	if (type==='history') {
		var list = [];
		for (var i=0; i<window.localStorage.length; i++) {
			if (window.localStorage.key(i).substr(0,5) === 'book_') {
				var book = JSON.parse(window.localStorage.getItem(window.localStorage.key(i)));
				if (!book.readid) continue;
				book.id = window.localStorage.key(i).substr(5);
				list.push(book);
			}
		}
		list.sort(function(a, b){
			return b.readtime - a.readtime;
		});
			var url_info=$('ul.list').attr('url-info'), url_read=$('ul.list').attr('url-read'), url_chapter=$('ul.list').attr('url-chapter'), url_author=$('ul.list').attr('url-author'), url_cover=$('ul.list').attr('url-cover');
			var html = '';
			for (var i=0; i<list.length; i++) {
				html += '<li class="bo" article-id="'+list[i].id+'">';
				html += '<dt><a href="'+url_info.replace('[id]',list[i].id)+'" target="_blank"><img src="'+url_cover.replace('[id]',list[i].id).replace('[dataid]',list[i].dataid)+'" onerror="this.onerror=null;this.src="/static/image/nocover.jpg" alt="'+list[i].name+'" height="155" width="120"></a></dt>';
				html += '<dd><h3><a href="'+url_read.replace('[id]',list[i].id)+'" target="_blank">'+list[i].name+'</a></h3></dd>';
				html += '<dd class="book_other">作者：<span><a href="'+url_author.replace('[author]',list[i].author)+'">'+list[i].author+'</a></span></dd>';
				html += '<dd class="book_other">读到：'+(list[i].readid>0?'<a href="'+url_chapter.replace('[id]',list[i].id).replace('[cid]',list[i].readid)+'">'+list[i].readname+'</a>':'暂未阅读')+'</dd>';
				html += '<dd class="book_other">时间：'+formatDate(list[i].readtime,1)+'</dd>';
				html += '<dd class="action"><a href="'+url_chapter.replace('[id]',list[i].id).replace('[cid]',list[i].readid)+'">继续阅读</a><a class="history_del" href="javascript:void(0)">移除书架</a></dd>';
				html += '</li>';
			}
		$('#history_num').text(list.length);
		$('.sitebox .list').html(html);
		$('.sitebox .list').on('click', 'a.history_del', function(){
			var li = $(this).parents('li');
			window.localStorage.removeItem('book_'+li.attr('article-id'));
			li.remove();
			$('#history_num').text($('.sitebox .list li').length);
			return false;
		});
		$('#history_clear').click(function(){
			if (confirm('确定清空吗？ ')){
				$('.sitebox li').each(function(){
					window.localStorage.removeItem('book_'+$(this).attr('article-id'));
				});
				$('.sitebox .list').html('');
				$('#history_num').text('0');
			}
		});
		return;
	}
	var articleid = $('body').attr('article-id') || 0, chapterid = $('body').attr('chapter-id') || 0;
	if (chapterid > 0) {
		var book = {name:$('body').attr('article-name'),author:$('body').attr('article-author'),dataid:$('body').attr('data-id')||0,readid:chapterid,readname:$('h1').text(),readtime:$.now()};
		window.localStorage.setItem('book_'+articleid, JSON.stringify(book));
		var theme = function(v){
			if (typeof v === 'undefined') v = window.localStorage.getItem('theme') || 'day';
			$('body').attr('class', v);
			$('li.theme a.'+v).addClass('on').siblings().removeClass('on');
			window.localStorage.setItem('theme', v);
		};
		var size = function(v){
			if (typeof v === 'undefined') v = parseInt(window.localStorage.getItem('size')) || 24;
			$('li.size a.num').text(v);
			$('#content').css('font-size', v);
			$('li.size a').removeClass('disabled');
			if (v<=10) $('li.size a.dec').addClass('disabled');
			if (v>=50) $('li.size a.inc').addClass('disabled');
			$('#fontsize').text(v);
			window.localStorage.setItem('size', v);
		};
		$('li.theme a').click(function(){
			theme($(this).attr('class'));
		});
		$('li.size a').click(function(){
			if ($(this).hasClass('disabled')) return;
			size(parseInt($('#fontsize').text()) + ($(this).hasClass('dec') ? -2 : 2));
		});
		$('li.reset').click(function(){
			theme('day');
			size(24);
		});
		theme();
		size();
		$(document).keydown(function(e){
			switch (e.which) {
				case 37:
					$(window).attr('location', $('#pager_prev').attr('href'));
					break;
				case 39:
					$(window).attr('location', $('#pager_next').attr('href'));
					break;
				case 13:
					$(window).attr('location', $('#pager_current').attr('href'));
					break;
			}
		});
	}
	if (articleid > 0) {
		var visit = window.localStorage.getItem('visit_'+articleid) || 0;
		if (Math.floor(visit/8640000) !== Math.floor($.now()/8640000)) {
			$.getJSON('/visit/'+articleid+'/?d=json');
			window.localStorage.setItem('visit_'+articleid, $.now());
		}
	}
}

/*统计代码*/
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?e38def92ed8e57ba462fdf3fe8e6a2b5";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
