
{/*array*/}

/*function Foo () {
    this.bar = 10;
}

Foo.prototype.bar = 20;

const foo = new Foo();
console.log(foo.bar);

delete foo.bar;
console.log(foo.bar);

delete Foo.prototype.bar;
console.log(foo.bar);

const trees = ["redwood", "bay", "cedar", "oak", "maple"];
trees.splice(2, 4,);
console.log(trees); // ["redwood", "bay", "cedar", "maple"]

const f = () => ({a:1, b:2});
console.log((f()).toString());

function sum(a, b) {
    return a + b;
}    
console.log(sum(1, 2));



const temp = 15;

if (temp !== 12) {
    console.log("salah");
} else if (temp === 15) {
    console.log("benar");
} else {
    console.log("salah");
}

switch (temp) {
    case 12:
        console.log("benar");
        break;
    case 15:
        console.log("benar");
        break;
    default:
        console.log("benar");
        break;
}

window.onload = function () {
    

/*const dt = new Date();
const bulan = dt.getMonth();
console.log(bulan, dt)
let msg;

switch (bulan) {
    case 0:
        msg = "Januari";
        break;
    case 1:
        msg = "Februari";
        break;
    case 2:
        msg = "Maret";
        break;
    default:
       msg = "yang lain";
};


const el = document.getElementById("result");
el.innerHTML = msg;

};

window.onload = function () {
const house = {sqft:800, bdRooms: 2, bthRooms: 1};
let houseDetails = "information about  this house";

for (let prop in house) {
    houseDetails = `${houseDetails} <br> ${prop} <br> ${house[prop]} <br>`;
    document.getElementById('result').innerHTML= houseDetails;
}

};


const imah = ['yopi', 'angga', 'budi'];

for (let house of imah) {
    console.log(imah[0]);
    document.getElementById('result').innerHTML= [`${imah[0]} <br> ${imah[1]} <br> ${imah[2]}s`];
}


let nomerKosong = 0;
let nomer= 70;
let kosong;

do{
    kosong = Math.floor(Math.random() * 100);
    nomerKosong++;
}while (kosong != nomer) 

document.getElementById('result').innerHTML= `<h2>tebak nomer berapa</h2>

<p>nomer kosong ${nomerKosong}</p>`;


let noTelp = "0889-7362-9332"

for (let digit of noTelp) {
   if (digit == "-") {
       continue;N
   } 
   console.log(digit);
}
*/

// let imah = [10,100, 15, 20, 2];
// imah.slice(1, 3);
// imah.some(function (value) {
//     return value > 0
// })
// console.log(imah.some(function (value) {
    
// }))

// let total = 0;
// let hasil = '';

// for (let i = 0; i < imah.length; i++) {
//     total += imah[i];
//     console.log(total);
//     hasil += total + '<br>';
// }

// document.getElementById('result').innerHTML= hasil;



// let ingridients = ['susu', 'telur', 'minyak', 'gula'];
// ingridients.splice('susu', 'telur', 'minyak', 'gula', 'keju', 'mentega');

// document.getElementById('result').innerHTML= ingridients;


// console.log(ingridients);

// {/*fungsi fungsi array*/}

{/*array method*/}

{/*push() => menambahkan elemen di akhir array*/}
{/*pop() => menghapus elemen di akhir array*/}
{/*shift() => menghapus elemen di awal array*/}
{/*unshift() => menambahkan elemen di awal array*/}
{/*slice() => memotong array*/}
{/*splice() => memotong array*/}
/* let imah = ['yopi', 'angga', 'budi'];
   imah.splice(1, 1); -> ['yopi', 'budi']
   imah.splice(1, 0, ridwan) ->['yopi', 'ridwan', 'budi'] tambah ridwan ke index 1  
   console.log(imah);
   hasinya adalah -> hapus index 1 sebanyak 1*/
 
//    function hitung(value, hitungan) {
//     let hasil = hitungan(value);
//     return hasil
//    }

//  console.log(hitung(4, function (value) {
//     return 2*Math.PI*value
//  }));


//  let harga = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
//  let total = 0;

//  total = harga.reduce(
//     function (prev, curr) {
//         return prev + curr, 1000
//     }
//  )

//  console.log(total);

//  let harga = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
 
//  let listItems = harga.map(
//     (nilai) => `<li>${nilai}</li>`
//  )

//  let list = document.getElementById('result');
//  list.innerHTML = listItems.join('');


// const body = document.body;

// const div = document.createElement('div');
// const th = document.querySelector('th');
// th.style.border = "3px solid black";

// div.innerHTML = 'Hello World';
// body.appendChild(div);

// const hitung = document.getElementById('hitung')
// function kelik() {
//    hitung.style.background = "red" 
//    hitung.style.border = "none"
//    hitung.style.padding = "10px"
//    hitung.style.borderRadius = "5px"
// }

// function create() {
//    var x = document.createElement("TABLE");
//   x.setAttribute("id", "myTable");
//   document.body.appendChild(x);
//   x.style.border = "1px solid black";

//   var z = document.createElement("TD");
//   var t = document.createTextNode("cell");
//   z.appendChild(t);
//   document.getElementById("myTr").appendChild(z);
// }


// const deret = ['🤞', '🙌', '💕', '😘', '🌹']

// const bwir = deret.includes('🤞');

// if (bwir) {
//     const posBwir = deret.indexOf('🤞');
//     const sebBwir = posBwir + 1
//     const posWal = deret[deret.length - 1];
//     console.log(posBwir, sebBwir, posWal);
// }

// const daftar = [];

// daftar['stick'] = '🕹';
// daftar['bibir'] = '💋';
// daftar['semongko'] = '👀';

// const panjang = Object.keys(daftar).length; //cara menghitung panjang dikarenakan array diubah jadi object

// console.log(daftar);
// console.log(panjang);

// // shallow dan copy array di javascript

// const arrNew = ['💋', '🕹', '🤣', '🤦‍♂️', '🐱‍🐉']
// // const arrCop = [...arrNew]; //cara menyalin array
// // const arrCop = arrNew.slice();//cara menyalin array
// const arrCop = JSON.parse(JSON.stringify(arrNew));//cara menyalin array    
// // const arrCop = Array.from(arrNew);
// arrCop[0] = '👀';

// console.log(arrNew);
// console.log(arrCop);

// array multi dimensi
// const multi = ['💕', 15, {nama:'angga'}, ['makan', 'minum'], {fungsi: function() {console.log('hello');}}];

// console.log(multi[3][1]);
// // console.log(multi[4].fungsi()); //cara mengelsekusi function dalam array
// multi[4].fungsi();


// const buahAku = ['🍌', '🍓', '🍒'];
// const buahKamu = ['🍇', '🍏', '🍐', '🍊'];

// const gabung = buahAku.concat(buahKamu);

// for (list in gabung) {
//     console.log(list); // menampilkan array dengan perulangan
// }

// gabung.map((value, index) => {
//     console.log(index, value);
// })

let daKar = [
{ 
    nama : 'angga',
    umur : 23,
    pekerjaan : 'student',
    alamat : 'ciamis'
},
{
    nama : 'yopi',
    umur : 28,
    pekerjaan : 'developer',
    alamat : 'jakarta'
},
{
    nama : 'budi',
    umur : 30,
    pekerjaan : 'engineer',
    alamat : 'jogjakarta'
},
{
    nama : 'sonny',
    umur : 35,
    pekerjaan : 'arsitek',
    alamat : 'jombang'
}
]

// const cari = daKar.filter(item => item.nama === 'angga');
// cari.forEach(item => console.log(item.nama));

// console.log(daKar.find(item => item.pekerjaan === 'engineer')?.pekerjaan); //unruk menampilkan array secara spesifik dengan find
// console.log(daKar.findIndex(item => item.pekerjaan === 'engineer')) //untuk menampilkan index

// console.log(daKar.sort((a, b) => b.umur - a.umur)); //untuk mengurutkan array

// console.log(daKar[0])

// daKar.map((value, index) => {
//     console.log(value.nama, index); // menampilkan array dengan map hanya memunculkan nama saja.
// })

// console.log(daKar.length)

// const tahunLahir = [1998, 1999, 2000, 2001, 2002];

// const usia = [];

// for (let a =0; a < tahunLahir.length; a++) {
//     usia.push(new Date().getFullYear() - tahunLahir[a]); //tradisonal for loop
// }

// console.log(usia); 

// const tahunLahir = [1998, 1999, 2000, 2001, 2002];
// const usia = tahunLahir.map(tahun => new Date().getFullYear() - tahun); //map array looping dengan cara lebih singkat

// console.log(usia); 

// const approve = []

// for(let x = 0; x < daKar.length; x++) {
//     if (daKar[x].pekerjaan === 'engineer' || daKar[x].nama === 'sonny') {
//         approve.push(daKar[x].pekerjaan, daKar[x].nama); //tradisional filter
//     }
// }

// console.log(approve);

// daKar = daKar.filter(data => data.umur > 25);

// console.log(daKar.map(data => data.nama ))

function cekGanjilGenap (angka) {
    if (angka % 2 === 0) {
        return 'genap';
    } else {
        return 'ganjil';
    }
}

// console.log(cekGanjilGenap(10));

// function balikKata(kalimat) {
//     return kalimat .split("").reverse().join("");
// }

function balikKata(kalimat) {
    let balik = '';
    for(let a = kalimat.length - 1; a >= 0; a--) {
        balik += kalimat[a];
    }
    return balik;
}
console.log(balikKata('angga'));