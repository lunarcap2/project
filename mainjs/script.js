jQuery(function($){
    
    // scrolling
    var $scrollStatus = $('.scroll-status');

    $('.nav').navScroll({
        mobileDropdown: true,
        mobileBreakpoint: 768,
        scrollSpy: true,
        onScrollStart: function() {
            $scrollStatus.show();
            $scrollStatus.text('Started scrolling');
        },
        onScrollEnd: function() {
            $scrollStatus.text('Scrolling ended');
            setTimeout(function() {
            $scrollStatus.fadeOut(200);
            }, 1000);
        }
    });

//    $('.click-me').navScroll({
//        navHeight: 0
//    });
    
    // scroll top button
    var scrollTimeout;

    $('.scroll-top').click(function(){
        $('html, body').animate({scrollTop:0},500);
        return false;
    });

    $(window).scroll(function(){
        clearTimeout(scrollTimeout);
        if($(window).scrollTop()>400){
            scrollTimeout = setTimeout(function(){$('.scroll-top:hidden').fadeIn()},100);
        }
        else{
            scrollTimeout = setTimeout(function(){$('.scroll-top:visible').fadeOut()},100);    
        }
    });

    // mobile menu
    $('.nav').on('click', '.nav-mobile i', function (e) {
        e.preventDefault();
        $('.nav ul').slideToggle('fast');
    });
    
    // main typing text
    $(window).load(function(){
        var typingBool = false; 
        var typingIdx=0; 
        var typingTxt = $(".typing-txt").text();
        typingTxt=typingTxt.split("");
        if(typingBool==false){
        typingBool=true; 
        
        var tyInt = setInterval(typing,100);
     } 
     
        function typing(){ 
        if(typingIdx<typingTxt.length){
            $(".typing").append(typingTxt[typingIdx]);
            typingIdx++; 
        } else{ 
            clearInterval(tyInt);
        } 
        }
    })
    
    
    // about horizon effect
    $(document).ready( function(){
        $('.horizon').horizon();
    });


    // skill chart
    $(window).on('scroll', function(){
        var containerTop = $('#wrap').offset().top+0;
        var skillSetion = $('#skills').offset().top;
        var top = $(window).scrollTop();
        var win_h = $(window).height();

        if( $(window).scrollTop() >= skillSetion-400 ){ 
            $('#skills .skills-chart ul li').fadeIn();
            $('.chart').easyPieChart({
                barColor:"#2c94d4",
                scaleColor:false,
                lineCap: "square",
                lineWidth:10,
                size:100,
                offset:500,
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            })
           } 
 
    });
    
    // portfolio isotope filter
    $(window).on('load',function(){
        $obj=$('.grid').isotope();
    });
    
    $('.pf-menu a').on('click',function(e){
        $(this).addClass('active').siblings().removeClass('active');
        var filterName = $(this).data('filter');
        $obj.isotope({
        filter:filterName
        });
        e.preventDefault();
    });


    // portfolio popup
    var state = 0;

	function pop (idx){
		state = 1;
		$('.modal').fadeIn();
		$('.pop').eq(idx).fadeIn();
//		$('html, body').css({'overflow' : 'hidden'}); //�ㅽ겕濡� �놁븷湲�
	}

	function pop_close (){
		state = 0;
		$('.modal').fadeOut();
		$('.pop').fadeOut();
//		$('html, body').css({'overflow' : 'visible'});
	}

	$('.grid .grid-item').click(function(){
		pop($(this).index());
	});


	$('i').click(function(){
		pop_close($(this).index());
	});
    
    
});

(() => {

	let yOffset = 0; // window.pageYOffset 대신 쓸 변수
	let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
	let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
	let enterNewScene = false; // 새로운 scene이 시작된 순간 true

	const sceneInfo = [
		{
			// 0
			type: 'sticky',
			heightNum: 3, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-0'),
				messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				pencilLogo: document.querySelector('#scroll-section-0 .pencil-logo'),
				pencil: document.querySelector('#scroll-section-0 .pencil'),
				ribbonPath: document.querySelector('.ribbon-path path')
			},
			values: {
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.4, end: 0.5 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageA_opacity_out: [1, 0, { start: 0.3, end: 0.4 }],
				messageB_opacity_out: [1, 0, { start: 0.6, end: 0.7 }],
				messageA_translateY_out: [0, -20, { start: 0.3, end: 0.4 }],
				pencilLogo_width_in: [1000, 200, { start: 0.1, end: 0.4 }],
				pencilLogo_width_out: [200, 50, { start: 0.4, end: 0.8 }],
				pencilLogo_translateX_in: [-10, -20, { start: 0.2, end: 0.4 }],
				pencilLogo_translateX_out: [-20, -50, { start: 0.4, end: 0.8 }],
				pencilLogo_opacity_out: [1, 0, { start: 0.8, end: 0.9 }],
				pencil_right: [-10, 70, { start: 0.3, end: 0.8 }],
				pencil_bottom: [-80, 100, { start: 0.3, end: 0.8 }],
				pencil_rotate: [-120, -200, { start: 0.3, end: 0.8 }],
				path_dashoffset_in: [1401, 0, { start: 0.2, end: 0.4 }],
				path_dashoffset_out: [0, -1401, { start: 0.6, end: 0.8 }]
			}
		}
	];

	function setLayout() {
		// 각 스크롤 섹션의 높이 세팅
		for (let i = 0; i < sceneInfo.length; i++) {
			if (sceneInfo[i].type === 'sticky') {
				sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			} else if (sceneInfo[i].type === 'normal')  {
				sceneInfo[i].scrollHeight = sceneInfo[i].objs.content.offsetHeight + window.innerHeight * 0.5;
			}
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
		}

		yOffset = window.pageYOffset;

		let totalScrollHeight = 0;
		for (let i = 0; i < sceneInfo.length; i++) {
			totalScrollHeight += sceneInfo[i].scrollHeight;
			if (totalScrollHeight >= yOffset) {
				currentScene = i;
				break;
			}
		}
		document.body.setAttribute('id', `show-scene-${currentScene}`);
	}

	function calcValues(values, currentYOffset) {
		let rv;
		// 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		if (values.length === 3) {
			// start ~ end 사이에 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;

			if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
				rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			} else if (currentYOffset < partScrollStart) {
				rv = values[0];
			} else if (currentYOffset > partScrollEnd) {
				rv = values[1];
			}
		} else {
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}

		return rv;
	}

	function playAnimation() {
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset - prevScrollHeight;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		switch (currentScene) {
			case 0:
				if (scrollRatio <= 0.25) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.55) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
				}

				// 크기가 커져도 깨지지 않는 SVG의 장점을 살리기 위해 transform scale 대신 width를 조정
				if (scrollRatio <= 0.4) {
					objs.pencilLogo.style.width = `${calcValues(values.pencilLogo_width_in, currentYOffset)}vw`;
					objs.pencilLogo.style.transform = `translate(${calcValues(values.pencilLogo_translateX_in, currentYOffset)}%, -50%)`;
				} else {
					objs.pencilLogo.style.width = `${calcValues(values.pencilLogo_width_out, currentYOffset)}vw`;
					objs.pencilLogo.style.transform = `translate(${calcValues(values.pencilLogo_translateX_out, currentYOffset)}%, -50%)`;
				}

				// 빨간 리본 패스(줄 긋기)
				if (scrollRatio <= 0.5) {
					objs.ribbonPath.style.strokeDashoffset = calcValues(values.path_dashoffset_in, currentYOffset);
				} else {
					objs.ribbonPath.style.strokeDashoffset = calcValues(values.path_dashoffset_out, currentYOffset);
				}

				objs.pencilLogo.style.opacity = calcValues(values.pencilLogo_opacity_out, currentYOffset);
				objs.pencil.style.right = `${calcValues(values.pencil_right, currentYOffset)}%`;
				objs.pencil.style.bottom = `${calcValues(values.pencil_bottom, currentYOffset)}%`;
				objs.pencil.style.transform = `rotate(${calcValues(values.pencil_rotate, currentYOffset)}deg)`;

				break;
		}
	}

	function scrollLoop() {
		enterNewScene = false;
		prevScrollHeight = 0;

		for (let i = 0; i < currentScene; i++) {
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

		if (yOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			document.body.classList.remove('scroll-effect-end');
		}

		if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true;
			if (currentScene === sceneInfo.length - 1) {
				document.body.classList.add('scroll-effect-end');
			}
			if (currentScene < sceneInfo.length - 1) {
				currentScene++;
			}
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}

		if (yOffset < prevScrollHeight) {
			enterNewScene = true;
			// 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
			if (currentScene === 0) return;
			currentScene--;
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}

		if (enterNewScene) return;

		playAnimation();
	}

	window.addEventListener('load', () => {
        document.body.classList.remove('before-load');
		setLayout();

        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset;
            scrollLoop();
  		});

  		window.addEventListener('resize', () => {
  			if (window.innerWidth > 900) {
  				setLayout();
			}
  		});

  		window.addEventListener('orientationchange', () => {
  			setTimeout(setLayout, 500);
		});
		  
		document.querySelector('.loading').addEventListener('transitionend', (e) => {
			document.body.removeChild(e.currentTarget);
		});

	});

})();