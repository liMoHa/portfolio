// 1. 스크롤시 nav bar background-color 변경시키기 ✅
// 2. 메뉴 버튼 클릭시 해당 위치로 이동 ✅
// 3. contact me 버튼 눌렀을 때 내 이메일로 연동
// 4. mywork: button클릭시 필터링
// 5. 필터링 될 때 애니메이션도 추가.

window.addEventListener('load', ()=>{
    const navBar = document.querySelector('.logoAndNav__nav-bar');
    const workBtn = document.querySelector('.work__buttons');

    function onChangeColor(){
        const logoAndNav = document.querySelector('.home__logoAndNav');
        const navRectY = document.documentElement.getBoundingClientRect().y;
        
        if(navRectY === 0){
            console.log(navRectY);
            logoAndNav.style.backgroundColor = "transparent";
        }
        else{
            logoAndNav.style.backgroundColor = "var(--color-light-green)";
        }
    }

    function onMove(id){
        const element = document.querySelector(`.${id}`);
        element.scrollIntoView({behavior:'smooth', block:'center'});
    }

    function loadItem(){
        return fetch('../data/items.json')
        .then((response)=>{
            return response.json();
        })
        .then((json)=>{
            return json.items;
        })
    }
    
    function createElement(item){
        return `
        <div class="project">
            <img src=${item['img']} />
            <span>${item['description']}</span>
            <a href="https://github.com/liMoHa" target="_blank">
                <i class="fab fa-github-square"></i>
            </a>
        </div>
        `
    }

    function display(items){
        const elements = items.map(createElement).join('');
        const projectParent = document.querySelector('.work__projects');
        projectParent.innerHTML = elements;
    }

    function onFilter(id){
        itemPromise.then((json)=>{
            let filteredItems = json.filter((item)=>{
                return item['field'] === id || id === 'all';
            });
            display(filteredItems);
        });
    }

    const itemPromise = loadItem();
    onFilter('all');

    document.defaultView.addEventListener('scroll', onChangeColor);
    navBar.addEventListener('click', (e)=>{
        if(e.target.tagName === 'LI'){
            onMove(e.target.dataset.id);
        }
    })
    workBtn.addEventListener('click',(e)=> onFilter(e.target.dataset.id));
})

