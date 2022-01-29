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
    element.scrollIntoView({ behavior: "smooth", block: "end" });
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

  const itemPromise = loadItem();
  onFilter("all");

  function onFilter(id) {
    itemPromise.then((json) => {
      let filteredItems = json.filter(item => item["field"] === id || id === "all");
      display(filteredItems);
    });
  }

  const btnArray = document.querySelectorAll('.work__buttons button');
  function onActiveBtn(id){
      btnArray.forEach(btn => {
          if(btn.className === id || btn.className === `${id} active`){
              btn.classList.add('active');
              console.log(btn.className, id);
          }
          else{
              btn.classList.remove('active');
          }
      })
  }
  // 페이지 전체에 적용되는 이벤트를 등록할 땐 뭘 쓰지..? -> document
  document.addEventListener("scroll", onChangeColor);
  document.addEventListener("scroll", onChangeOpacity);
  document.addEventListener("scroll", onShowArrow);
  arrowUp.addEventListener("click", (e) => {
    onMove("home");
  });

  navBar.addEventListener("click", (e) => {
    if (e.target.tagName !== "LI") {
      return;
    }
    onMove(e.target.dataset.id);
  });
  contactMe.addEventListener("click", (e) => {
    if (e.target.dataset.id === "contact") {
      onMove(e.target.dataset.id);
    }
  });
  workBtn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      onFilter(id);
      onActiveBtn(id);
  });
});
