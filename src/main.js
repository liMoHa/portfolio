// 1. 스크롤시 nav bar background-color 변경시키기
// 2. 메뉴 버튼 클릭시 해당 위치로 이동
// 3. mywork: button클릭시 필터링 + 필터링 될 때 애니메이션도 추가.
// 4. 스크롤 내릴 때 홈 점점 투명하게 만들기 -> 글씨, 배경화면 등 전체를 투명하게
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
      // 이렇게 하지말고 classList.add로 클래스 추가해서 변경해보자.
      logoAndNav.classList.remove("nonTransparent");
    } else {
      logoAndNav.classList.add("nonTransparent");
    }
  }

  function onMove(name) {
    const element = document.querySelector(`.${name}`);
    element.scrollIntoView({ behavior: "smooth", block: "start" });
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

  // filtering
  function loadItem() {
    return fetch("../data/items.json")
      .then(response => response.json())
      .then(json => json.items);
  }

  function createElement(item) {
    return `
        <div class="project">
            <img src=${item["img"]} />
            <span>${item["description"]}</span>
            <a href="https://github.com/liMoHa" target="_blank">
                <i class="fab fa-github-square"></i>
            </a>
        </div>
        `;
  }

  function display(items) {
    const elements = items.map(createElement).join("");
    const projectParent = document.querySelector(".work__projects");
    projectParent.innerHTML = elements;
  }


  function onFilter(id) {
    const workProjects = document.querySelector('.work__projects');
    workProjects.classList.add('anim-out');
    setTimeout(()=>{
        workProjects.classList.remove('anim-out');
        itemPromise.then((json) => {
            let filteredItems = json.filter(item => item["field"] === id || id === "all");
            display(filteredItems);
          });
    }, 150);
    
  }
  
  function onActiveBtn(active, element){
    if(active.className === element.className){
        return;
    }
    element.classList.add('selected');
    active.classList.remove('selected'); 
  }
  // 페이지 전체에 적용되는 이벤트를 등록할 땐 뭘 쓰지..? -> document
  
  arrowUp.addEventListener("click", (e) => {
    onMove("home");
    const active = document.querySelector('.logoAndNav__nav-bar li.selected');
    const home = document.querySelector('.logoAndNav__nav-bar li[data-id=home]');
    console.log(home);
    onActiveBtn(active, home);
  });

  navBar.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    const active = document.querySelector('.logoAndNav__nav-bar li.selected');
    if (e.target.tagName !== "LI") {
      return;
    }
    onMove(id);
    onActiveBtn(active, e.target);
  });
  contactMe.addEventListener("click", (e) => {
    if (e.target.dataset.id === "contact") {
      onMove(e.target.dataset.id);
    }
  });
  
  const itemPromise = loadItem();
  onFilter("all");

  workBtn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const active = document.querySelector('.work__buttons button.selected');
      console.log(e);
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
  })
});
