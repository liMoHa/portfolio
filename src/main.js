// 1. 스크롤시 nav bar background-color 변경시키기 ✅
// 2. 메뉴 버튼 클릭시 해당 위치로 이동 ✅
// 3. contact me 버튼 눌렀을 때 내 이메일로 연동
// 4. mywork: button클릭시 필터링
// 5. 필터링 될 때 애니메이션도 추가.

window.addEventListener('load', ()=>{
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

    document.defaultView.addEventListener('scroll', onChangeColor)
    
    const navBar = document.querySelector('.logoAndNav__nav-bar');
    navBar.addEventListener('click', (e)=>{
        if(e.target.tagName === 'LI'){
            // console.log(e);
            onMove(e.target.dataset.id);
        }
    })
})

