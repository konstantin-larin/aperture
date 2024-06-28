const gearCageImages = document.querySelector('.gear-cage__images');
const clientLogosRow = document.querySelector('.past-clients__img-row');
const movingRowsWrapper = clientLogosRow.querySelector('.js-infinity-moving-row__wrapper');
const movingRows = Array.from(movingRowsWrapper.children).reverse();

function fadeSlider() {
    let firstImg = gearCageImages.lastElementChild;
    firstImg.classList.add('opacity-0');
    setTimeout(() => {
        gearCageImages.prepend(firstImg);
        firstImg.classList.remove('opacity-0');
        fadeSlider();
    }, 2000);
}

let movingInterval;

function infinityRow() {

    let gap = movingRows[1].querySelector('img').nextElementSibling.getBoundingClientRect().left - movingRows[1].querySelector('img').getBoundingClientRect().right;
    movingRowsWrapper.style.transform = `translateX(${-movingRowsWrapper.scrollWidth / movingRows.length}px)`;
    movingRowsWrapper.style.gap = gap + 'px';

    function moveRows() {        
        movingInterval = setInterval(() => {
            for (let i = 0; i < movingRows.length; i++) {
                let row = movingRows[i];                
                +row.dataset.translate++;
                row.style.transform = `translateX(${+row.dataset.translate}px)`;
                if (+row.dataset.translate / (i + 1) > row.scrollWidth + gap) {                                        
                    if (i == 0) {                                                                                                                                               
                        row.dataset.translate = -row.scrollWidth * (movingRows.length - 1)  - gap;
                        row.style.transform = `translateX(${+row.dataset.translate}px)`;
                    }
                    else {                        
                        row.dataset.translate = 0;
                        row.style.transform = `translateX(${+row.dataset.translate}px)`;
                    }
                }
            }
        }, 15);

    }

    moveRows();

    clientLogosRow.onclick = function () {
        if (movingInterval) {
            clearInterval(movingInterval);
            movingInterval = null;
        }
        else {
            moveRows();
        }
    }
}

function onLoad() {
    fadeSlider();
    infinityRow();
}

function onResize() {
    clearInterval(movingInterval);        
    for(let row of movingRows){
        row.style.transform = 'none';
        row.dataset.translate = 0;
    }
    infinityRow();
}

window.addEventListener('load', onLoad);

window.addEventListener('resize', onResize);

