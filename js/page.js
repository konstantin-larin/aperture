const html = document.documentElement;
const header = document.getElementById('header');
const headerNav = document.getElementById('header-nav');
const headerSwitch = document.getElementById('header-switch');
const headerSwitchCondition = headerSwitch.querySelector('.js-switch-condition');
const whatWeDoList = document.getElementById('what-we-do-list');
const gearCage = document.getElementById('gear-cage');
const helpSection = document.getElementById('help');
let headerIsOpened;
// header links 
let prevLink = null;
let activateClosingDropdown = false;

function documentOnLoad() {
    // header
    let headerNavHeight = headerNav.offsetHeight;
    function headerMdLg() {
        let headerNavIsOpened = false;
        headerNav.style.height = 0;
        headerNav.style.overflow = 'hidden';
        header.style.paddingBottom = 0;
        headerSwitch.onclick = function () {
            if (headerNavIsOpened == 'in process') return;
            if (!headerNavIsOpened) {
                headerSwitchCondition.textContent = 'Close menu';
                headerNav.style.height = headerNavHeight + 'px';
                header.style.paddingBottom = 2.25 + 'rem';
                headerNavIsOpened = 'in process';
                headerNav.ontransitionend = () => {
                    headerNav.style.overflow = '';
                    headerNavIsOpened = true;
                    headerNav.ontransitionend = '';
                }
            }
            else {
                headerSwitchCondition.textContent = 'Open menu';
                headerNav.style.overflow = 'hidden';
                headerNav.style.height = 0;
                header.style.paddingBottom = 0;
                headerNavIsOpened = 'in process';
                headerNav.ontransitionend = () => {
                    headerNavIsOpened = false;
                }
            }
        }
    }
    function headerToMd() {
        headerIsOpened = false;
        header.style.transform = 'translateX(-100%)';

        headerSwitch.onclick = function () {            
            if (!headerIsOpened) {
                if (window.innerWidth < 360) {
                    headerSwitchCondition.textContent = '';
                }
                else {
                    headerSwitchCondition.textContent = 'Close menu';
                }
                header.style.transform = 'translateX(0)';                
                setTimeout(() => {
                    headerIsOpened = true;
                }, 300);                
            }
            else {
                if(!header.querySelector('.js-header-dropdown').classList.contains('closed')){
                    header.querySelector('.js-header-dropdown').classList.add('closed');
                    activateClosingDropdown = false;
                }
                headerSwitchCondition.textContent = 'Open menu';
                header.style.transform = 'translateX(-100%)';                
                setTimeout(() => {
                    headerIsOpened = false;
                }, 300);
            }
        }
    }
    if (window.innerWidth <= 768) headerToMd();
    else if (window.innerWidth > 768 && window.innerWidth <= 992) headerMdLg();


    function onResize() {
        headerSwitchCondition.textContent = 'Open menu';
        headerNav.style.height = '';
        if (window.innerWidth <= 768) {            
            headerNav.style.overflow = '';
            header.style.paddingBottom = '';
            headerToMd();
        }
        else if (window.innerWidth > 768 && window.innerWidth <= 992) {
            header.style.transform = '';
            headerMdLg();
        }
        else {            
            headerNav.style.overflow = '';
            header.style.paddingBottom = '';
            header.style.transform = '';
            headerSwitch.onclick = '';
        }
    }
    window.addEventListener('resize', onResize);
}

function closeDropDownInHeaderToMd(e){
    
}

function windowOnLoad() {
    let wwdParagraphHeights = [];
    let wwdCardsHeights = [];

    for (let paragraph of whatWeDoList.querySelectorAll('.what-we-do__paragraph')) {
        wwdParagraphHeights.push(paragraph.scrollHeight);
        // determined by eye
        let maxHeight = paragraph.closest('.what-we-do__list-item').offsetHeight * 0.5;
        wwdCardsHeights.push(maxHeight);
        paragraph.style.maxHeight = maxHeight + 'px';
        paragraph.style.height = '3.75rem';
    }

    function readMore(e) {
        if (e.target.closest('.js-read-more')) {
            let btn = e.target.closest('.js-read-more');
            let listItem = btn.closest('.what-we-do__list-item');
            let paragraph = listItem.querySelector('.what-we-do__paragraph');
            let hiddenCondition = btn.querySelector('.js-hidden-condition');

            paragraph.style.overflow = '';

            if (!paragraph.classList.contains('js-is-opened')) {
                paragraph.classList.add('js-is-opened');
                hiddenCondition.textContent = 'Hide text';

                let num = +listItem.dataset.num;
                let height = wwdParagraphHeights[num];
                let maxHeight = wwdCardsHeights[num];
                paragraph.style.height = height + 'px';
                if (height > maxHeight) {
                    paragraph.style.overflow = 'auto';
                }

                paragraph.ontransitionend = () => {
                    paragraph.ontransitionend = '';
                }
            }
            else {
                paragraph.classList.remove('js-is-opened');

                hiddenCondition.textContent = 'Read more';
                paragraph.style.height = '3.75rem';

                paragraph.ontransitionend = () => {
                    paragraph.ontransitionend = '';
                }
            }
        }
    }

    function onResize() {
        wwdParagraphHeights = [];
        wwdCardsHeights = [];
        for (let paragraph of whatWeDoList.querySelectorAll('.what-we-do__paragraph')) {
            wwdParagraphHeights.push(paragraph.scrollHeight);
            paragraph.closest('.what-we-do__list-item').querySelector('.js-hidden-condition').textContent = 'Read more';
            // determined by eye
            let maxHeight = paragraph.closest('.what-we-do__list-item').offsetHeight * 0.5;
            wwdCardsHeights.push(maxHeight);
            paragraph.style.maxHeight = maxHeight + 'px';
            paragraph.style.height = '3.75rem';
            paragraph.style.overflow = '';
            paragraph.classList.remove('js-is-opened');
        }
    }


    whatWeDoList.addEventListener('click', readMore);
    window.addEventListener('resize', onResize);
}

let dropdownClosingIsActivated = false;
function documentOnMouseOver(e) {        
    if (e.target.closest('.js-header-dropdown')) {
        if (window.innerWidth <= 768) return;
        let target = e.target.closest('.js-header-dropdown');
        let list = target.querySelector('.js-header-dropdown__list');
        if (target.classList.contains('closed')) {
            target.classList.remove('closed');
            setTimeout(() => {
                list.style.opacity = 1;
            }, 0);
        }

        if (!target.classList.contains('closed') && !dropdownClosingIsActivated) {
            target.onmouseleave = function () {            
                dropdownClosingIsActivated = true;
                list.style.opacity = 0;

                setTimeout(() => {
                    target.classList.add('closed');
                    dropdownClosingIsActivated = false;
                    target.onmouseleave = '';
                }, 200);                                                                                         
            }
        }
    }
}

function changeLayout(){
    let gearImages = gearCage.querySelector('.gear-cage__images');
    let gearCageTitle = gearCage.querySelector('.gear-cage__title');
    if(window.innerWidth <= 768){        
        gearCageTitle.after(gearImages);
    }
    else{
        gearCage.append(gearImages);
    }
}

function documentOnClick(e){
    if (e.target.closest('.link-text')) {
        let link = e.target.closest('.link-text');
        if(link.classList.contains('no-js')) return;
        e.preventDefault();                
        
        if (link.classList.contains('js-header-dropdown')) {
            if (window.innerWidth > 768) return;
            else {                
                let list = link.querySelector('.js-header-dropdown__list');
                if (link.classList.contains('closed') && !activateClosingDropdown) {
                    link.classList.remove('closed');
                    setTimeout(() => {
                        list.style.opacity = 1;
                        activateClosingDropdown = true;
                    }, 0);
                }                
            }
            return;
        }
        // else if??
        if(window.innerWidth < 768) {
            headerIsOpened = false;            
            header.style.transform = 'translateX(-100%)';
            headerSwitchCondition.textContent = 'Open menu';            
            if(!header.querySelector('.js-header-dropdown').classList.contains('closed')){
                header.querySelector('.js-header-dropdown').classList.add('closed');
                activateClosingDropdown = false;
            }            
        }

        if(link.classList.contains('js-footer-dropdown')){
            link.classList.toggle('closed');
            return;
        }
        if(link.closest('.js-footer-dropdown__list')){            
            link.closest('.js-footer-dropdown').classList.add('closed');            
        }   
        
        if (link.classList.contains('js-current')) return;
        if (prevLink) prevLink.classList.remove('js-current');

        link.classList.add('js-current');
        prevLink = link;

        const block = document.getElementById(link.getAttribute('href').substr(1));                                                                                                                        
        let top = block.getBoundingClientRect().top;

        if(window.innerWidth >= 768){
            window.scrollBy(0, top - header.offsetHeight);
        } 
        else{
            block.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
        return;
    }
    if (!e.target.closest('.link-text')){
        if(!document.querySelector('.link-text.js-current')) return;
        document.querySelector('.link-text.js-current').classList.remove('js-current');
    }
    if(window.innerWidth <= 768 && !e.target.closest('.js-header-dropdown__list') && activateClosingDropdown){
        if(!header.querySelector('.js-header-dropdown').classList.contains('closed')){
            header.querySelector('.js-header-dropdown').classList.add('closed');
            activateClosingDropdown = false;
        }                    
    }    
}

function removeHead(){
    if(window.innerWidth > 768){
        if(helpSection.getBoundingClientRect().top < 0){
            header.style.display = 'none';
        }
        else{
            header.style.display = '';
        }
    }    
    else return;
}

changeLayout();
window.addEventListener('resize', changeLayout);
window.addEventListener('load', windowOnLoad);
window.addEventListener('scroll', removeHead);

document.addEventListener('DOMContentLoaded', documentOnLoad);
document.addEventListener('mouseover', documentOnMouseOver);
document.addEventListener('click', documentOnClick);

