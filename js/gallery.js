const openBtn = document.getElementById('open-gallery');
const expandIcon = document.getElementById('expand-icon');
const narrowIcon = document.getElementById('narrow-icon');
const gallery = document.getElementById('gallery');
const closeBtn = document.getElementById('close-gallery');
const title = gallery.querySelector('.title-text');
const titleLetters = title.children;
const popupTitleAnimationTime = 200;
const opacityTransitionTime = 200;
const rightArrow = document.getElementById('right-arrow');
const leftArrow = document.getElementById('left-arrow');
const imgRow = document.querySelector('.gallery__img-row');
const smallImgRow = document.querySelector('.gallery__sm-img-row');
const slideTransition = 300;
let currentImg = imgRow.querySelector('.js-current');
let currentSmImg = smallImgRow.querySelector('.js-current');
const wideImgModal = document.getElementById('wide-img');
let wideImg;

let galleryIsClosed = true;

let firstLetter = titleLetters[0];
function poppingUpLetters() {
    firstLetter.style.transform = 'translateY(0) scale(1)';
    setTimeout(() => {
        if (!firstLetter.nextElementSibling) {
            firstLetter = titleLetters[0];
            return;
        }
        firstLetter = firstLetter.nextElementSibling;
        poppingUpLetters();
    }, popupTitleAnimationTime / 2);
}

let readyToSwipe = true;
function toNextSlide(multiplier = 1) {
    if (readyToSwipe) {
        readyToSwipe = false;
        imgRow.style.transition = '';
        imgRow.style.transform = `translateX(-${multiplier * imgRow.offsetWidth}px)`;
        setTimeout(() => {
            for (let i = 0; i < multiplier; i++) {
                let firstImg = imgRow.firstElementChild;
                imgRow.append(firstImg);
                currentImg.classList.remove('js-current');
                currentImg = currentImg.nextElementSibling;
                currentImg.classList.add('js-current');
                currentSmImg.classList.remove('js-current');
                currentSmImg = smallImgRow.querySelector(`[data-num="${currentImg.dataset.num}"]`);
                currentSmImg.classList.add('js-current');
            }
            imgRow.style.transition = 'none';
            imgRow.style.transform = '';
            readyToSwipe = true;
        }, slideTransition);
    }
}

function toPrevSlide(multiplier) {
    if (readyToSwipe) {
        readyToSwipe = false;
        imgRow.style.transition = '';
        imgRow.style.transform = `translateX(${multiplier * imgRow.offsetWidth}px)`;
        setTimeout(() => {
            for (let i = 0; i < multiplier; i++) {                                
                let lastImg = imgRow.lastElementChild;
                imgRow.prepend(lastImg);
                currentImg.classList.remove('js-current');
                currentImg = currentImg.previousElementSibling;
                currentImg.classList.add('js-current');
                currentSmImg.classList.remove('js-current');
                currentSmImg = smallImgRow.querySelector(`[data-num="${currentImg.dataset.num}"]`);
                currentSmImg.classList.add('js-current');
            }
            imgRow.style.transition = 'none';
            imgRow.style.transform = '';
            readyToSwipe = true;
        }, slideTransition);                       
    }
}
function onToucnDown(e){    
    let startX = e.touches[0].clientX;
    let startY = e.touches[0].clientY;
    let diffX;
    let diffY;
    function onTouchMove(e){
        let moveX = e.touches[0].clientX;
        if (moveX < 0 || moveX > window.innerWidth) {
            return;
        }
        let moveY = e.touches[0].clientY;        
        diffX = startX - moveX;
        diffY = startY - moveY;                

        if(Math.abs(diffY) > Math.abs(diffX)){            
            document.removeEventListener('touchmove', onTouchMove);
            return;
        }        
        imgRow.style.transition = 'none';
        imgRow.style.transform = `translateX(${-diffX}px)`;                        
    }
    imgRow.ontouchend = function(){
        if(Math.abs(diffX) > window.innerWidth / 2.5){
            if(diffX > 0) toNextSlide(1);
            else toPrevSlide(1);
        }
        else{
            imgRow.style.transition = '';
            imgRow.style.transform = ''                        
        }
        document.removeEventListener('touchmove', onTouchMove);        
        return;
    }
    document.addEventListener('touchmove', onTouchMove);
    
}

function onResize(){
    imgRow.removeEventListener('touchstart', onToucnDown);        
    if(window.innerWidth <= 768){
        imgRow.addEventListener('touchstart', onToucnDown);
    }
    else{
        return;
    }
}

window.addEventListener('resize', onResize); 
if(window.innerWidth <= 768){
    imgRow.addEventListener('touchstart', onToucnDown);
}   


let modalIsClosed = true;

openBtn.onclick = function () {
    if (galleryIsClosed) {
        if (galleryIsClosed == 'in process') return;
        galleryIsClosed = 'in process';
        html.style.overflowY = 'hidden';
        gallery.classList.remove('d-none');
        setTimeout(() => {
            gallery.classList.remove('opacity-0');
        }, 0);
        setTimeout(() => {
            galleryIsClosed = false;
            poppingUpLetters();            
        }, opacityTransitionTime);
    }
}
closeBtn.onclick = function () {
    if (!galleryIsClosed) {
        galleryIsClosed = 'in process';
        gallery.classList.add('opacity-0');
        setTimeout(() => {
            for (let letter of titleLetters) {
                letter.style.transition = 'none';
                letter.style.transform = '';
                setTimeout(() => {
                    letter.style.transition = '';
                }, 0);
            }
            html.style.overflowY = '';
            gallery.classList.add('d-none');                        
            galleryIsClosed = true;
        }, opacityTransitionTime);
    }
}
rightArrow.onclick = () => toNextSlide(1);
leftArrow.onclick = () => toPrevSlide(1);    
smallImgRow.onclick = function(e){
    if(e.target.closest('.gallery__img-sm')){
        let smImg =  e.target.closest('.gallery__img-sm');
        if(currentSmImg == smImg) return;
        let currentNum = +currentImg.dataset.num;
        currentSmImg.classList.remove('js-current');
        currentSmImg = smImg;
        currentSmImg.classList.add('js-current');       
        let num = +smImg.dataset.num;
        let n = num - currentNum;        
        if(n < 0){
            toPrevSlide(Math.abs(n));
        }
        else{
            toNextSlide(n);
        }
    }
}
expandIcon.onclick = function(){
    if (modalIsClosed) {
        if (modalIsClosed == 'in process') return;
        modalIsClosed = 'in process';        
        wideImgModal.classList.remove('d-none');
        setTimeout(() => {
            wideImgModal.classList.remove('opacity-0');
        }, 0);
        setTimeout(() => {
            wideImg = currentImg.cloneNode(true);
            wideImgModal.querySelector('.gallery__wide-img').append(wideImg);
            modalIsClosed = false;                                
        }, opacityTransitionTime);
    }
}
narrowIcon.onclick = function(){
    if (!modalIsClosed) {
        modalIsClosed = 'in process';
        wideImgModal.classList.add('opacity-0');
        setTimeout(() => {                        
            wideImgModal.classList.add('d-none');                        
            wideImg.remove();
            modalIsClosed = true;
        }, opacityTransitionTime);
    }
}