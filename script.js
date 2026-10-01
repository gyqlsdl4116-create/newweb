document.addEventListener('DOMContentLoaded', function () {

  /* 1) 스크롤 리빌: .reveal 요소가 화면에 들어오면 in 클래스 부여 */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* 1-1) 히어로 배너 슬라이드쇼: 3초마다 오른쪽에서 왼쪽으로 자동 전환 */
  const heroSlider = document.getElementById('hero-slider');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroCounter = document.getElementById('hero-slide-counter');

  if (heroSlider && heroSlides.length) {
    let heroIndex = 0;
    const heroTotal = heroSlides.length;

    function renderHeroSlides() {
      heroSlides.forEach((slide, i) => {
        const relPos = (i - heroIndex + heroTotal) % heroTotal;
        // relPos: 0 = 현재 보이는 슬라이드, 1 = 오른쪽 대기, (heroTotal-1) = 왼쪽으로 빠져나간 상태
        let x = '100%';
        if (relPos === 0) x = '0%';
        else if (relPos === heroTotal - 1) x = '-100%';

        slide.style.transform = `translateX(${x})`;
        slide.classList.toggle('is-active', relPos === 0);
      });

      if (heroCounter) {
        heroCounter.textContent = `${heroIndex + 1}/${heroTotal}`;
      }
    }

    renderHeroSlides();

    // 초기 위치는 애니메이션 없이 순간 배치, 그 다음 프레임부터 트랜지션 활성화
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroSlider.classList.add('is-ready');
      });
    });

    setInterval(() => {
      heroIndex = (heroIndex + 1) % heroTotal;
      renderHeroSlides();
    }, 3000);
  }

  /* 2) 헤더 햄버거 버튼: 좁은 화면에서 카테고리 스트립 드롭다운 토글 */
  const categoryToggle = document.getElementById('category-toggle');
  const categoryStrip = document.querySelector('.category-strip');

  if (categoryToggle && categoryStrip) {
    categoryToggle.addEventListener('click', function () {
      categoryStrip.classList.toggle('open');
    });
  }

  /* 2-1) 헤더 메인 네비 활성 표시: 홈/베스트/신상품/이벤트 클릭 시 해당 링크만 핑크로 강조 */
  const mainNavLinks = document.querySelectorAll('.main-nav a');

  if (mainNavLinks.length) {
    mainNavLinks.forEach((link) => {
      link.addEventListener('click', function () {
        mainNavLinks.forEach((l) => l.classList.remove('on'));
        link.classList.add('on');
      });
    });
  }

  /* 3) 카테고리 칩 필터 (베스트셀러 섹션: 전체/사료/간식/영양제/용품 - 그리드 자체를 전환, 각 뷰는 독립된 카드 세트) */
  const chipRow = document.querySelector('.chip-row');
  const viewGrids = document.querySelectorAll('.bestseller-scroll [data-view]');
  const bestsellerScroll = document.getElementById('bestseller-scroll');

  if (chipRow && viewGrids.length) {
    chipRow.addEventListener('click', function (e) {
      const chip = e.target.closest('.chip');
      if (!chip) return;

      chipRow.querySelectorAll('.chip').forEach((c) => c.classList.remove('on'));
      chip.classList.add('on');

      const filter = chip.dataset.filter;

      viewGrids.forEach((grid) => {
        grid.style.display = (grid.dataset.view === filter) ? '' : 'none';
      });

      if (bestsellerScroll) {
        bestsellerScroll.scrollTop = 0;
      }
    });
  }

  /* 4) 위시(찜) 하트 토글 */
  document.querySelectorAll('.prod-thumb .wish').forEach((btn) => {
    btn.addEventListener('click', function () {
      this.classList.toggle('on');
      this.textContent = this.classList.contains('on') ? '♥' : '♡';
    });
  });

  /* 5) 뉴스레터 폼: 이메일 미입력 시 경고 표시, 입력되어 있으면 안내 문구로 전환 */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const originalPlaceholder = newsletterEmail ? newsletterEmail.placeholder : '';

  if (newsletterEmail) {
    newsletterEmail.addEventListener('input', function () {
      newsletterEmail.classList.remove('input-error');
      newsletterEmail.placeholder = originalPlaceholder;
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!newsletterEmail || newsletterEmail.value.trim() === '') {
        newsletterEmail.classList.add('input-error');
        newsletterEmail.placeholder = '이메일을 입력하세요';
        newsletterEmail.focus();
        return;
      }

      const btn = newsletterForm.querySelector('button');
      const original = btn.textContent;
      btn.textContent = '구독 완료 ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        newsletterForm.reset();
      }, 2200);
    });
  }

  /* 6) 맨 위로 가기 버튼: 스크롤 내리면 나타나고, 클릭하면 맨 위로 부드럽게 이동 */
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* 7) 로그인 폼: 아이디/비밀번호 미입력 시 빨간 테두리 + 안내 문구 표시 (login.html 전용) */
  const loginForm = document.getElementById('login-form');
  const loginId = document.getElementById('login-id');
  const loginPw = document.getElementById('login-pw');

  if (loginForm && loginId && loginPw) {
    const loginIdPlaceholder = loginId.placeholder;
    const loginPwPlaceholder = loginPw.placeholder;

    [loginId, loginPw].forEach((input) => {
      input.addEventListener('input', function () {
        input.classList.remove('input-error');
      });
    });

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let hasError = false;

      if (loginId.value.trim() === '') {
        loginId.classList.add('input-error');
        loginId.placeholder = '아이디를 입력하세요';
        hasError = true;
      }

      if (loginPw.value.trim() === '') {
        loginPw.classList.add('input-error');
        loginPw.placeholder = '비밀번호를 입력하세요';
        hasError = true;
      }

      if (hasError) {
        (loginId.classList.contains('input-error') ? loginId : loginPw).focus();
        return;
      }

      const btn = loginForm.querySelector('.login-submit');
      btn.textContent = '로그인 중...';
      btn.disabled = true;
      setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
      }, 1200);
    });
  }

  /* 8) 로그인 상태 반영 (index.html 전용): 마이페이지 버튼/장바구니 배지 표시, 로그인↔로그아웃 링크 전환 */
  const authLink = document.getElementById('auth-link');
  const mypageBtn = document.getElementById('mypage-btn');
  const cartBadge = document.getElementById('cart-badge');

  if (authLink) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    function applyAuthState(loggedIn) {
      if (loggedIn) {
        authLink.textContent = '로그아웃';
        authLink.setAttribute('href', '#');
        if (mypageBtn) mypageBtn.style.display = '';
        if (cartBadge) cartBadge.style.display = '';
      } else {
        authLink.textContent = '로그인';
        authLink.setAttribute('href', 'login.html');
        if (mypageBtn) mypageBtn.style.display = 'none';
        if (cartBadge) cartBadge.style.display = 'none';
      }
    }

    applyAuthState(isLoggedIn);

    authLink.addEventListener('click', function (e) {
      if (localStorage.getItem('isLoggedIn') === 'true') {
        e.preventDefault();
        setTimeout(() => {
          localStorage.removeItem('isLoggedIn');
          window.location.href = 'index.html';
        }, 500);
      }
    });
  }
});
