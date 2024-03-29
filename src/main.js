// 1. 스크롤시 nav bar background-color 변경시키기
// 2. 메뉴 버튼 클릭시 해당 위치로 이동
// 3. mywork: button클릭시 필터링 + 필터링 될 때 애니메이션도 추가.
// 4. 스크롤 내릴 때 홈 점점 투명하게 만들기 -> 글씨, 배경화면 등 전체를 투명하게
// 5. 토글 버튼 클릭하면 활성화 비활성화
// 6. arrow up 버튼 클릭시 home으로 이동
// 7. button 클릭하면 selected상태로 만들기
// 8. 스크롤 내리면서 해당 영역으로 들어가면 menu버튼 변경
"use strict";

window.addEventListener("load", () => {
  const navBar = document.querySelector(".logoAndNav__nav-bar");
  const workBtn = document.querySelector(".work__buttons");
  const contactMe = document.querySelector(".home__description__contact");
  const homeDescription = document.querySelector(".home__description");
  const arrowUp = document.querySelector(".arrowUp");
  const home = document.querySelector(".home");
  const homeHeight = home.getBoundingClientRect().height;

  function onChangeColor() {
    const logoAndNav = document.querySelector(".home__logoAndNav");
    const logoAndNavRect = logoAndNav.getBoundingClientRect();
    // element의 사이즈를 알고 싶음 방법 1. getBoundingClientRect 2. offset
    // 여기 다시보자. 여기 음수 사용 안 하고 다시 해야 함. -> window.scrollY

    if (window.scrollY < logoAndNavRect.height) {
      logoAndNav.classList.remove("nonTransparent");
    } else {
      logoAndNav.classList.add("nonTransparent");
    }
  }

  function onMove(name) {
    const element = document.querySelector(`.${name}`);
    element.scrollIntoView({ behavior: "smooth", block: "start" });

    const target = document.querySelector(`.logoAndNav__nav-bar li[data-id=${name}]`);
    selectNavItem(target);
  }

  function onChangeOpacity() {
    let opacity = 1 - window.scrollY / homeHeight;
    // 불투명도 변경시키기
    // opacity계산에 scrollY값을 이용
    homeDescription.style.opacity = opacity;
  }

  function onShowArrow() {
    const point = homeHeight / 2;
    if (window.scrollY >= point) {
      arrowUp.classList.add("visible");
    } else {
      arrowUp.classList.remove("visible");
    }
  }

  const workProjects = document.querySelector('.work__projects');
  const projects = document.querySelectorAll('.work__projects .project');
  function onFilter(field){
    workProjects.classList.add('anim-out');
    setTimeout(()=>{
        workProjects.classList.remove('anim-out');
        projects.forEach(project => {
          if(field === 'all' || project.dataset.field === field){
            project.classList.remove('invisible');
          }
          else{
            project.classList.add('invisible');
          }
        });
      }, 150);   
  }

  //여기 다음에 작성할 때는 더 효율적이게 작성하자. -> like slectNavItem
  function onActiveBtn(active, element){
    // 버튼 한 번 더 클릭시 버그 발생 방지
    if(active.className === element.className){
        return;
    }
    element.classList.add('selected');
    active.classList.remove('selected'); 
  }
  const navId = ['home', 'about', 'skills', 'work', 'testimonial', 'contact']; 
  const navItem = navId.map(id => document.querySelector(`li[data-id=${id}]`));
  const sectionItem = navId.map(id => document.querySelector(`body .${id}`));
  let navIndex = 0;
  let currentSelectedItem = navItem[0];
  function selectNavItem(selected){
    currentSelectedItem.classList.remove('selected');
    selected.classList.add('selected');
    currentSelectedItem = selected;
  }
  // 페이지 전체에 적용되는 이벤트를 등록할 땐 뭘 쓰지..? -> document
  arrowUp.addEventListener("click", (e) => {
    onMove("home");
  });

  // when click logo
  const logo = document.querySelector('.logoAndNav__logo');
  logo.addEventListener('click', ()=>{
    onMove('home');
  })
  navBar.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (e.target.tagName !== "LI") {
      return;
    }
    onMove(id);
    selectNavItem(e.target);
  });
  contactMe.addEventListener("click", (e) => {
    if (e.target.dataset.id === "contact") {
      onMove(e.target.dataset.id);
    }
  });
  
  // change to static viersion
  workBtn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const active = document.querySelector('.work__buttons button.selected');
      onFilter(id);
      onActiveBtn(active, e.target.parentElement);
  });

  const toggleBtn = document.querySelector('#bar');
  const logoAndNav = document.querySelector('.home__logoAndNav');
  const cancleBtn = document.querySelector('#cancle');
  toggleBtn.addEventListener('click',(e)=>{
    // const를 여기에 적는 게 좋을까 밖에 적는 게 좋을까?
    logoAndNav.classList.add('active');
    navBar.classList.add('active');
    e.target.classList.remove('active');
    cancleBtn.classList.add('active');
  });
 
  cancleBtn.addEventListener('click', (e)=> {
    logoAndNav.classList.remove('active');
    navBar.classList.remove('active');
    e.target.classList.remove('active');
    toggleBtn.classList.add('active');
  })

  document.addEventListener('scroll',()=>{
    onChangeColor();
    onChangeOpacity();
    onShowArrow();
    // hide menu when scrolling
    const check = document.querySelector('#cancle.active');
    if(check == null){
        return;
    }
    else{
        logoAndNav.classList.remove('active');
        navBar.classList.remove('active');
        cancleBtn.classList.remove('active');
        toggleBtn.classList.add('active');
    }
  });

  
  
  // make menu active when scrolling depending on section
  // make an observer object
  
  // 맨 처음에는 콜백함수 실행 안 되게 하고 싶은데 방법이 없을까... -> ratio이용 

  const callBack = (entries, observer) =>{
    console.log('callback');
    entries.forEach(entry=>{
        if(!entry.isIntersecting && entry.intersectionRatio > 0){
            let index = navId.indexOf(`${entry.target.className}`);
            //scroll down
            if(entry.target.getBoundingClientRect().y < 0) navIndex = index + 1; 
            // scroll up
            else navIndex  = index - 1; 
        }
    });
  }
  const options = {
    threshold: 0.3
  };
  const intersectionObserver = new IntersectionObserver(callBack, options);
  // add as an observation object.
  sectionItem.forEach(item=>{
      intersectionObserver.observe(item);
  });

  // wheel event가 적용 안되는 이유?
  window.addEventListener('wheel', ()=>{
      // 스크롤이 맨 위일 때
      if(window.scrollY === 0){
          navIndex = 0;
      }
      // 스크롤이 맨 아래일 때
      // ⭐⭐⭐ 전체 높이 계산 하는 방법!! window.scrollY !== body.clientHeight 임을 주의하자. 
      // 정확한 이유는 모르겠으나 식을 보면 scrollY에다가 스크롤이 차지하는 높이를 더해야 body전체 높이가 나오는 것 같음.
      else if(Math.round(window.scrollY + window.innerHeight) === document.body.clientHeight){
            navIndex = navId.length - 1;
      }
      selectNavItem(navItem[navIndex]);
  })
});