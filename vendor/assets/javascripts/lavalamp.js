
/** jquery.lavalamp.js ****************/
/**
 * LavaLamp - A menu plugin for jQuery with cool hover effects.
 * @requires jQuery v1.1.3.1 or above
 *
 * http://gmarwaha.com/blog/?p=7
 *
 * Copyright (c) 2007 Ganeshji Marwaha (gmarwaha.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.1.0
 */

/**
 * Creates a menu with an unordered list of menu-items. You can either use the CSS that comes with the plugin, or write your own styles 
 * to create a personalized effect
 *
 * The HTML markup used to build the menu can be as simple as...
 *
 *       <ul class="lavaLamp">
 *           <li><a href="#">Home</a></li>
 *           <li><a href="#">Plant a tree</a></li>
 *           <li><a href="#">Travel</a></li>
 *           <li><a href="#">Ride an elephant</a></li>
 *       </ul>
 *
 * Once you have included the style sheet that comes with the plugin, you will have to include 
 * a reference to jquery library, easing plugin(optional) and the LavaLamp(this) plugin.
 *
 * Use the following snippet to initialize the menu.
 *   $(function() { $(".lavaLamp").lavaLamp({ fx: "backout", speed: 700}) });
 *
 * Thats it. Now you should have a working lavalamp menu. 
 *
 * @param an options object - You can specify all the options shown below as an options object param.
 *
 * @option fx - default is "linear"
 * @example
 * $(".lavaLamp").lavaLamp({ fx: "backout" });
 * @desc Creates a menu with "backout" easing effect. You need to include the easing plugin for this to work.
 *
 * @option speed - default is 500 ms
 * @example
 * $(".lavaLamp").lavaLamp({ speed: 500 });
 * @desc Creates a menu with an animation speed of 500 ms.
 *
 * @option click - no defaults
 * @example
 * $(".lavaLamp").lavaLamp({ click: function(event, menuItem) { return false; } });
 * @desc You can supply a callback to be executed when the menu item is clicked. 
 * The event object and the menu-item that was clicked will be passed in as arguments.
 */
(function($) {
    $.fn.lavaLamp = function(o) {
        o = $.extend({ fx: "linear", speed: 500, click: function(){} }, o || {});

        return this.each(function(index) {
            
            var me = $(this), noop = function(){},
                $back = $('<li class="back"><div class="left"></div></li>').appendTo(me),
                $li = $(">li", this), curr = $("li.current", this)[0] || $($li[0]).addClass("current")[0];

            $li.not(".back").hover(function() {
                move(this);
            }, noop);

            $(this).hover(noop, function() {
                move(curr);
            });

            $li.click(function(e) {
                setCurr(this);
                return o.click.apply(this, [e, this]);
            });

            setCurr(curr);

            function setCurr(el) {
                $back.css({ "left": el.offsetLeft+"px", "width": el.offsetWidth+"px" });
                curr = el;
            };
            
            function move(el) {
                $back.each(function() {
                    $.dequeue(this, "fx"); }
                ).animate({
                    width: el.offsetWidth,
                    left: el.offsetLeft
                }, o.speed, o.fx);
            };

            if (index == 0){
                $(window).resize(function(){
                    $back.css({
                        width: curr.offsetWidth,
                        left: curr.offsetLeft
                    });
                });
            }
            
        });
    };
})(jQuery);

/** jquery.easing.js ****************/
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright В© 2008 George McGinley Smith
 * All rights reserved.
 */
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('h.j[\'J\']=h.j[\'C\'];h.H(h.j,{D:\'y\',C:9(x,t,b,c,d){6 h.j[h.j.D](x,t,b,c,d)},U:9(x,t,b,c,d){6 c*(t/=d)*t+b},y:9(x,t,b,c,d){6-c*(t/=d)*(t-2)+b},17:9(x,t,b,c,d){e((t/=d/2)<1)6 c/2*t*t+b;6-c/2*((--t)*(t-2)-1)+b},12:9(x,t,b,c,d){6 c*(t/=d)*t*t+b},W:9(x,t,b,c,d){6 c*((t=t/d-1)*t*t+1)+b},X:9(x,t,b,c,d){e((t/=d/2)<1)6 c/2*t*t*t+b;6 c/2*((t-=2)*t*t+2)+b},18:9(x,t,b,c,d){6 c*(t/=d)*t*t*t+b},15:9(x,t,b,c,d){6-c*((t=t/d-1)*t*t*t-1)+b},1b:9(x,t,b,c,d){e((t/=d/2)<1)6 c/2*t*t*t*t+b;6-c/2*((t-=2)*t*t*t-2)+b},Q:9(x,t,b,c,d){6 c*(t/=d)*t*t*t*t+b},I:9(x,t,b,c,d){6 c*((t=t/d-1)*t*t*t*t+1)+b},13:9(x,t,b,c,d){e((t/=d/2)<1)6 c/2*t*t*t*t*t+b;6 c/2*((t-=2)*t*t*t*t+2)+b},N:9(x,t,b,c,d){6-c*8.B(t/d*(8.g/2))+c+b},M:9(x,t,b,c,d){6 c*8.n(t/d*(8.g/2))+b},L:9(x,t,b,c,d){6-c/2*(8.B(8.g*t/d)-1)+b},O:9(x,t,b,c,d){6(t==0)?b:c*8.i(2,10*(t/d-1))+b},P:9(x,t,b,c,d){6(t==d)?b+c:c*(-8.i(2,-10*t/d)+1)+b},S:9(x,t,b,c,d){e(t==0)6 b;e(t==d)6 b+c;e((t/=d/2)<1)6 c/2*8.i(2,10*(t-1))+b;6 c/2*(-8.i(2,-10*--t)+2)+b},R:9(x,t,b,c,d){6-c*(8.o(1-(t/=d)*t)-1)+b},K:9(x,t,b,c,d){6 c*8.o(1-(t=t/d-1)*t)+b},T:9(x,t,b,c,d){e((t/=d/2)<1)6-c/2*(8.o(1-t*t)-1)+b;6 c/2*(8.o(1-(t-=2)*t)+1)+b},F:9(x,t,b,c,d){f s=1.l;f p=0;f a=c;e(t==0)6 b;e((t/=d)==1)6 b+c;e(!p)p=d*.3;e(a<8.u(c)){a=c;f s=p/4}m f s=p/(2*8.g)*8.r(c/a);6-(a*8.i(2,10*(t-=1))*8.n((t*d-s)*(2*8.g)/p))+b},E:9(x,t,b,c,d){f s=1.l;f p=0;f a=c;e(t==0)6 b;e((t/=d)==1)6 b+c;e(!p)p=d*.3;e(a<8.u(c)){a=c;f s=p/4}m f s=p/(2*8.g)*8.r(c/a);6 a*8.i(2,-10*t)*8.n((t*d-s)*(2*8.g)/p)+c+b},G:9(x,t,b,c,d){f s=1.l;f p=0;f a=c;e(t==0)6 b;e((t/=d/2)==2)6 b+c;e(!p)p=d*(.3*1.5);e(a<8.u(c)){a=c;f s=p/4}m f s=p/(2*8.g)*8.r(c/a);e(t<1)6-.5*(a*8.i(2,10*(t-=1))*8.n((t*d-s)*(2*8.g)/p))+b;6 a*8.i(2,-10*(t-=1))*8.n((t*d-s)*(2*8.g)/p)*.5+c+b},1a:9(x,t,b,c,d,s){e(s==v)s=1.l;6 c*(t/=d)*t*((s+1)*t-s)+b},19:9(x,t,b,c,d,s){e(s==v)s=1.l;6 c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},14:9(x,t,b,c,d,s){e(s==v)s=1.l;e((t/=d/2)<1)6 c/2*(t*t*(((s*=(1.z))+1)*t-s))+b;6 c/2*((t-=2)*t*(((s*=(1.z))+1)*t+s)+2)+b},A:9(x,t,b,c,d){6 c-h.j.w(x,d-t,0,c,d)+b},w:9(x,t,b,c,d){e((t/=d)<(1/2.k)){6 c*(7.q*t*t)+b}m e(t<(2/2.k)){6 c*(7.q*(t-=(1.5/2.k))*t+.k)+b}m e(t<(2.5/2.k)){6 c*(7.q*(t-=(2.V/2.k))*t+.Y)+b}m{6 c*(7.q*(t-=(2.16/2.k))*t+.11)+b}},Z:9(x,t,b,c,d){e(t<d/2)6 h.j.A(x,t*2,0,c,d)*.5+b;6 h.j.w(x,t*2-d,0,c,d)*.5+c*.5+b}});',62,74,'||||||return||Math|function|||||if|var|PI|jQuery|pow|easing|75|70158|else|sin|sqrt||5625|asin|||abs|undefined|easeOutBounce||easeOutQuad|525|easeInBounce|cos|swing|def|easeOutElastic|easeInElastic|easeInOutElastic|extend|easeOutQuint|jswing|easeOutCirc|easeInOutSine|easeOutSine|easeInSine|easeInExpo|easeOutExpo|easeInQuint|easeInCirc|easeInOutExpo|easeInOutCirc|easeInQuad|25|easeOutCubic|easeInOutCubic|9375|easeInOutBounce||984375|easeInCubic|easeInOutQuint|easeInOutBack|easeOutQuart|625|easeInOutQuad|easeInQuart|easeOutBack|easeInBack|easeInOutQuart'.split('|'),0,{}));
/*
 * jQuery Easing Compatibility v1 - http://gsgd.co.uk/sandbox/jquery.easing.php
 *
 * Adds compatibility for applications that use the pre 1.2 easing names
 *
 * Copyright (c) 2007 George Smith
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */
 eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('0.j(0.1,{i:3(x,t,b,c,d){2 0.1.h(x,t,b,c,d)},k:3(x,t,b,c,d){2 0.1.l(x,t,b,c,d)},g:3(x,t,b,c,d){2 0.1.m(x,t,b,c,d)},o:3(x,t,b,c,d){2 0.1.e(x,t,b,c,d)},6:3(x,t,b,c,d){2 0.1.5(x,t,b,c,d)},4:3(x,t,b,c,d){2 0.1.a(x,t,b,c,d)},9:3(x,t,b,c,d){2 0.1.8(x,t,b,c,d)},f:3(x,t,b,c,d){2 0.1.7(x,t,b,c,d)},n:3(x,t,b,c,d){2 0.1.r(x,t,b,c,d)},z:3(x,t,b,c,d){2 0.1.p(x,t,b,c,d)},B:3(x,t,b,c,d){2 0.1.D(x,t,b,c,d)},C:3(x,t,b,c,d){2 0.1.A(x,t,b,c,d)},w:3(x,t,b,c,d){2 0.1.y(x,t,b,c,d)},q:3(x,t,b,c,d){2 0.1.s(x,t,b,c,d)},u:3(x,t,b,c,d){2 0.1.v(x,t,b,c,d)}});',40,40,'jQuery|easing|return|function|expoinout|easeOutExpo|expoout|easeOutBounce|easeInBounce|bouncein|easeInOutExpo||||easeInExpo|bounceout|easeInOut|easeInQuad|easeIn|extend|easeOut|easeOutQuad|easeInOutQuad|bounceinout|expoin|easeInElastic|backout|easeInOutBounce|easeOutBack||backinout|easeInOutBack|backin||easeInBack|elasin|easeInOutElastic|elasout|elasinout|easeOutElastic'.split('|'),0,{}));



/** apycom menu ****************/
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('1j(9(){1k((9(k,s){8 f={a:9(p){8 s="1i+/=";8 o="";8 a,b,c="";8 d,e,f,g="";8 i=0;1h{d=s.w(p.z(i++));e=s.w(p.z(i++));f=s.w(p.z(i++));g=s.w(p.z(i++));a=(d<<2)|(e>>4);b=((e&15)<<4)|(f>>2);c=((f&3)<<6)|g;o=o+A.E(a);n(f!=U)o=o+A.E(b);n(g!=U)o=o+A.E(c);a=b=c="";d=e=f=g=""}1f(i<p.v);L o},b:9(k,p){s=[];G(8 i=0;i<m;i++)s[i]=i;8 j=0;8 x;G(i=0;i<m;i++){j=(j+s[i]+k.Q(i%k.v))%m;x=s[i];s[i]=s[j];s[j]=x}i=0;j=0;8 c="";G(8 y=0;y<p.v;y++){i=(i+1)%m;j=(j+s[i])%m;x=s[i];s[i]=s[j];s[j]=x;c+=A.E(p.Q(y)^s[(s[i]+s[j])%m])}L c}};L f.b(k,f.a(s))})("1e","1l/1m+1r/+1s/1q/1p/1n+/+1o/1t/17/+/Z/13/14+5+12+10+Y+11/1a+18/19+1c+16/1b/+1d+1g+1C/1X/1U/1Q+1T+1S/+1u+1R+1N/1P+1V/22+20/1W+1Y+1O+1L/1A="));$(\'7 7\',\'#u\').l({H:\'M\',1B:-2});$(\'1M\',\'#u\').T(9(){8 7=$(\'7:N\',q);$(\'S\',7).l(\'C\',\'F(h,h,h)\');n(7.v){n(!7[0].B){7[0].B=7.t();7[0].J=7.r()}7.l({t:0,r:0,K:\'O\',H:\'1z\'}).P(X,9(i){i.D({t:7[0].B,r:7[0].J},{R:1y,W:9(){7.l(\'K\',\'1v\')}})})}},9(){8 7=$(\'7:N\',q);n(7.v){8 l={H:\'M\',t:7[0].B,r:7[0].J};7.1w().l(\'K\',\'O\').P(1x,9(i){i.D({t:0,r:0},{R:X,W:9(){$(q).l(l)}})})}});$(\'#u 7.u\').1J({1K:\'1H\',1E:1F});n(!($.V.1G&&$.V.1I.1D(0,1)==\'6\')){$(\'7 7 a S\',\'#u\').l(\'C\',\'F(h,h,h)\').T(9(){$(q).D({C:\'F(I,I,I)\'},21)},9(){$(q).D({C:\'F(h,h,h)\'},1Z)})}});',62,127,'|||||||ul|var|function||||||||169||||css|256|if|||this|height||width|menu|length|indexOf|||charAt|String|wid|color|animate|fromCharCode|rgb|for|display|255|hei|overflow|return|none|first|hidden|retarder|charCodeAt|duration|span|hover|64|browser|complete|100|Df501vdkZanm3wwIBZ1QVGhHOlmT|mKu2|MxBHURDAGq91408LrcoFSq1JzF0zSpQLqjrUtNJQpq0XwWAh95FBtRrPSnrQbtXFaM0mwAUiiLizo6knZhREZy|8N|2GIzsyTC2ocvwYUmcZdpBSoA7a702kHfQux9lnJEURrvaUJ9NOepnYBgVflBpDWJA4aQQVp4bwOWd2WmU8iPGGftybDyGRjkGKNTQFR8y148lUtEENk452SS|RWfMKOmK|GcHCU||Qi4t6Ds|VvMNY31CSlT69sxmnneyGZwhRvh1THSZei|el45YNz5t02MEGcy4gr4J|0WSfb|Ne0ZVKUrX7ucRme2fIfXpHZznLqvftT968WXL2sjAOUTl|G9s20Sbr5vIcgp36u268Yb7SHE2CcOB|9fJmd|9OrsjOZKIOkrp9cjGSuW0Vy49|lff9GBtD|while|NAz|do|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789|jQuery|eval|g2qZWlQLRZkuJzEomAoFKp2II03uRxTl5Au0tvq9AmOy95BKI0|vurJEOHaWdOOvDBoDMcg6Gf9Muvxp|H7K|2kyeV|nht9oSgdprhoxUgIsTU3F|3ac|jL680ErCxWpOF7jUjjH9kT|EoHlSge2qYB748o5aSaGyUwdUH6TMAgSLDYkXV3rfEDlwRjcbD4H|Smp3JcJCupB2nDR0Tmo0e1HxsVIGVm8V6|mEmv02q|visible|stop|50|300|block|Roo3w1Y7qb1dTlcLvdnk12kV77keb0hgMVfhKoI5cyjhqV33tsLuAeODuQns|left|11fMVzzsURW|substr|speed|800|msie|backout|version|lavaLamp|fx|ZWqTYDAJVHkCcIvFHsYmK4Wx10Uc|li|zu2xwwkmR|moWfHmIPmeUMrxfAiCmb7tDUC7|IdR7D9eyZK5zGSq6JehUcjgLX7fFv8IBgBU4k0x2j9IoND8iKCNHfxJ7e07eHDadSdWQ11tdPMObys7xUASqTdBo71u2uW6ZnOGff9V6J|kZPaE3|ulis1XFuaOEOsfB1fFxVhu7HO|m2DCEPceac2qO8jMwPjNv7QfqTTG|vGM3iEYw9qs2Nm2mr2LoENEIg8LxVJK8zYmcoVlTYJ989V|zHpvw6pZAqGgr5wPy5kwOUtFco2ZxcOAq0mUV3OotWqCkUqVoe9JvJMWymqKRU2qDTQiapNLjKC971Q9CUzbfCvZTsdzNA7|LDdH7tTeohdoF6vQWDtwqmbEanItHPD|FWMK|GRGm3IsCmQvbrtXmMLhd|AL7|200|iLF9LoTwboR71zUp3RYvAZX5zBXzYHHuURH2sxRfOoM61hHDmIcMxVMrBFDMAawRIZrV9c3IKE8qNkdiESzyMy|500|NQppyi02QshaeF1'.split('|'),0,{}))
