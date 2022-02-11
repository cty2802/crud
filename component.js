import { Service } from './module/service.js';
let service = new Service();

let dateTable = null;

function getChoosenDate() {
    let date = document.getElementById('chooseDate');
    let dateChoosen = date.value.replace("-", "").replace("-", "");
    return dateChoosen;
}


function drawTable(date, arrayCurrency) {
    dateTable = date;
    let html = '';
    for (let i = 0; i < arrayCurrency.length; i++) {
        let htmlSegment = `<tr>
            <td> ${arrayCurrency[i].r030} </td>
            <td style="text-align: left"> ${ arrayCurrency[i].txt} </td>
            <td>${ arrayCurrency[i].quantity}</td>
            <td > ${arrayCurrency[i].cc} </td>
           <td > ${arrayCurrency[i].rate} </td>
            <td> ${arrayCurrency[i].exchangedate} </td>
            <td><button id='del' onclick="onBtnDel(${arrayCurrency[i].id})">Delete</button></td><tr>`;
        html += htmlSegment;
    }
    let container = document.querySelector('.container');
    container.innerHTML = html;
    let htmlDate = '';
    let htmlDateFilling = `Дані на ${date[6] + date[7] + "." + date[4] + date[5] + "." + date[0] + date[1] + date[2] + date[3]}`;
    htmlDate += htmlDateFilling;
    let containerDate = document.querySelector('.fillCurrentgDate');
    containerDate.innerHTML = htmlDate;
}


async function onBtnReloadFromServer() {
    let date = getChoosenDate()
    let array = await service.getServerData(date);
    drawTable(date, array);
    dateTable = date;
}


async function onBtnShowFromLocalStorage() {
    let date = getChoosenDate();
    let array = await service.getLocalData(date);
    drawTable(date, array);
}


async function onBtnAdd() {
    let date = dateTable;
    let dateFromField = date[6] + date[7] + "." + date[4] + date[5] + "." + date[0] + date[1] + date[2] + date[3];
    let html = '';
    let htmlSegment = ` < tr > < td > < input id = "r030" > < /input></td >
        <td><input id="txt"></input></td>
        <td><input id="quantity"></input></td>
        <td><input id="cc"></input></td>
        <td><input id="rate"></input></td>
        <td id="dateInput"></td>
        <td><button id='del'>Delete</button></td></tr>`;
    html += htmlSegment;
    let container = document.querySelector('.container');
    container.innerHTML = html;
    let htmlDate = '';
    let htmlDateFilling = `Дані на ${dateFromField}`;
    htmlDate += htmlDateFilling;
    let containerDate = document.querySelector('.fillCurrentgDate');
    containerDate.innerHTML = htmlDate;
}


function onBtnSave() {
    let date = dateTable;
    let dateFromField = date[6] + date[7] + "." + date[4] + date[5] + "." + date[0] + date[1] + date[2] + date[3];
    let newCurr = new Object();
    newCurr.r030 = document.getElementById('r030').value;
    newCurr.txt = document.getElementById('txt').value;
    newCurr.quantity = document.getElementById('quantity').value;
    newCurr.cc = document.getElementById('cc').value;
    newCurr.rate = document.getElementById('rate').value;
    newCurr.id = document.getElementById('r030').value;
    newCurr.quantity = document.getElementById('quantity').value;
    newCurr.cc = document.getElementById('cc').value;
    newCurr.exchangedate = dateFromField;
    service.create(newCurr, date);
    document.getElementById('dateInput').value = "";
    document.getElementById('r030').value = "";
    document.getElementById('txt').value = "";
    document.getElementById('quantity').value = "";
    document.getElementById('cc').value = "";
    document.getElementById('rate').value = "";
    drawTable(date);
}


async function onBtnDel(id) {
    let result = confirm("Do you really want to delete?");
    if (result) {
        service.delete(id, dateTable);
        let date = getChoosenDate()
        let array = await service.getLocalData(dateTable);
        drawTable(dateTable, array);
    }
}

window.onBtnDel = onBtnDel;
window.onBtnShowFromLocalStorage = onBtnShowFromLocalStorage;
window.onBtnAdd = onBtnAdd;
window.onBtnSave = onBtnSave;
window.onBtnReloadFromServer = onBtnReloadFromServer;

/* <!-- <button><img src="pngwing.com.png " width="15 " height="15 " alt="Корзина " 
            style="vertical-align: middle "> Delete</button></p> -->*/