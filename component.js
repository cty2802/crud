import { Service } from './module/service.js';
let service = new Service();


async function drawTable() {
    let html = '';
    let arrayCurrency = await service.getLocalData();
    for (let i = 0; i < arrayCurrency.length; i++) {
        let htmlSegment = `<tr>
        <td> ${arrayCurrency[i].r030} </td>
        <td style="text-align: left"> ${ arrayCurrency[i].txt} </td>
        <td>${ arrayCurrency[i].quantity}</td>
        <td > ${arrayCurrency[i].cc} </td>
       <td > ${arrayCurrency[i].rate} </td>
        <td> ${arrayCurrency[i].exchangedate} </td>
        <td><button id='del'>Delete</button></td><tr>`;
        html += htmlSegment;
    }
    let container = document.querySelector('.container');
    container.innerHTML = html;
    let htmlDate = '';
    let htmlDateFilling = `Дані на ${arrayCurrency[0].exchangedate}`;
    htmlDate += htmlDateFilling;
    let containerDate = document.querySelector('.fillCurrentgDate');
    containerDate.innerHTML = htmlDate;
}


function onBtnReloadFromServer() {
    drawTable();
}

function onBtnAdd() {
    let html = '';
    let choosenDate = document.getElementById('chooseDate');
    let newDate = choosenDate.value.replace("-", "").replace("-", "");
    let htmlSegment = `<tr><td><input id="r030"></input></td>
        <td><input id="txt"></input></td>
        <td><input id="quantity"></input></td>
        <td><input id="cc"></input></td>
        <td><input id="rate"></input></td>
        <td id="dateInput">${newDate}</td>
        <td><button id='del'>Delete</button></td></tr>`;
    html += htmlSegment;
    let container = document.querySelector('.container');
    container.innerHTML = html;
}

function onBtnSave() {
    service.create();
    document.getElementById('dateInput').value = "";
    document.getElementById('r030').value = "";
    document.getElementById('txt').value = "";
    document.getElementById('quantity').value = "";
    document.getElementById('cc').value = "";
    document.getElementById('rate').value = "";
}

function onBtnShowFromLocalStorage() {
    drawTable();
}


window.onBtnShowFromLocalStorage = onBtnShowFromLocalStorage;
window.onBtnAdd = onBtnAdd;
window.onBtnSave = onBtnSave;
window.onBtnReloadFromServer = onBtnReloadFromServer;