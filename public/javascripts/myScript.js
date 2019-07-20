import {getCookie} from './getCookie.mjs';

var navbar = new Vue({
    el: '#usrname',
    data: {
        userName: getCookie('usrName')
    }
})

window.filterToggle = function filterToggle(){
    var filter = document.getElementById('filter');
    filter.classList.toggle('hidden');
}

try {
    var author = document.getElementById('author');
    author.value = getCookie('token');
}
catch(err){
    // console.log('Not avaliable : ');
}

try {
    $('.carousel').carousel({
        interval: 2000
      })
}
catch(err){

}