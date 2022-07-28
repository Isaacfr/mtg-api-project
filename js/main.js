document.querySelector('#search-button').addEventListener('click', findCard);
document.querySelector('#compare-button').addEventListener('click', compareLists);


//find card from the search button with button press
function findCard(){
    const searchItem = document.querySelector('#search-bar').value;
    getFetch(searchItem, 'x-body');
}

//input the item and which list to put it in
//use async, await to load all items simultaneously
async function getFetch(item, listRef){

    const url = `https://api.scryfall.com/cards/named?fuzzy=${item}`;
    let searchQueryItems = [];

    if(searchQueryItems[0] === "Plains" || searchQueryItems[0] === "Mountain" || searchQueryItems[0] === "Forest" || searchQueryItems[0] === "Swamp" || searchQueryItems[0] === 'Island'){
        return null;
    }
    const res = await fetch(url);
    const data = await res.json();
    searchQueryItems.push(data);
    loadTable(searchQueryItems[0], listRef);
}

//loads table with list of items
async function loadTable(items, listRef){
    if(items.name == undefined)
    {
        return null;
    }
    let tbodyRef = document.getElementById(listRef);
    let newRow = tbodyRef.insertRow();

    let img = newRow.insertCell(0);
    let newImg = document.createElement('img');
    newImg.src = items.image_uris.small;
    img.appendChild(newImg);

    if(items.name === "Plains" || items.name === "Mountain" || items.name === "Forest" || items.name === "Swamp" || items.name === 'Island'){
        return null;
    }
    //orders tables with different such as name, type,  colors, cmc, rarity and then sets
    let name = newRow.insertCell(1);
    name.innerHTML = items.name;

    let type = newRow.insertCell(2);
    type.innerHTML = items.type_line;

    let colorID = "x-color";
    if(listRef =="x-list"){
        colorID = "x-color";
    }
    else if(listRef ="add-list"){
        colorID="add-color";
    }

    let symbols = newRow.insertCell(3);
    
    if(items.colors.length == 0)
    {
        let newElement = document.createElement('a');
        newElement.className = 'ms ms-c';
        symbols.appendChild(newElement);
    }
    else
    {
        items.colors.map(color => {
            let newElement = document.createElement('a');
            if(color == 'R'){
                newElement.className = 'ms ms-r';
                symbols.appendChild(newElement);

            }
            else if(color == "U"){
                newElement.className = 'ms ms-u';
                symbols.appendChild(newElement);
            }
            else if(color == "G"){
                newElement.className = 'ms ms-g';
                symbols.appendChild(newElement);
            }
            else if(color == "W"){
                newElement.className = 'ms ms-w-original';
                symbols.appendChild(newElement);
            }
            else if(color == "B"){
                newElement.className = 'ms ms-b';
                symbols.appendChild(newElement);
            }
        });
    }
    console.log(symbols.className);

    let cmc = newRow.insertCell(4);
    cmc.innerHTML = items.cmc;

    let rarity = newRow.insertCell(5);
    rarity.innerHTML = items.rarity;

    let desc = newRow.insertCell(6);
    let string = items.oracle_text.split(' ');
    // if(string.join(' ').includes('{T}')){
    //     let fixedEl = document.createElement('a');
    //     fixedEl.className = "ms ms-tap"
    // desc.appendChild(fixedEl);
    // string.splice(string.indexOf('{T}:'), 1 , ":");
    // }

    // if(string.join(' ').includes('{C}')){
    //     for(let i = 0; i<2; i++)
    //     {
    //         let fixedEl = document.createElement('a');
    //         fixedEl.className = "ms ms-c"
    //         desc.appendChild(fixedEl);
    //         string.push(fixedEl);
    //     }
    // string.slice(string.indexOf('{C}{C}.'));
    // }
    // let stringFixed = string.map(x =>{
    //     if(x == '{T}:')
    //     {
    //         fixedEl.className = "ms ms-tap";
    //     }
    // }).join(' ');

    // let stringFixed = string.map(x => {
    //     if(x == '{T}:')
    //     {
    //         fixedEl.className = ('ms ms-tap');
    //         desc.appendChild(fixedEl);
    //         string.splice(string.indexOf(x), 1, fixedEl, ":");
    //     }
    //     // else if(x === '{C}{C}.')
    //     // {
    //     //     for(let i = 0; i<2; i++){
    //     //         fixedEl.className = ('ms ms-c');
    //     //         string.splice(string.indexOf(x), 1, fixedEl, '.');
    //     //     }
    //     // }
    //     else{
    //         return x;
    //     }
    // });
    console.log(string);
    desc.innerHTML += string.join(' ');

    //minimize the table for space for the amount of sets there are; changes the space box into a button
    let sets = newRow.insertCell(7);
    let btn = document.createElement("button");
    btn.innerHTML = 'Sets/Prices';
    btn.className = 'collapsible';
    btn.addEventListener('click', function(){
        this.classList.toggle('active');
        let content = this.nextElementSibling;
        if (content.style.display === "block") {
        content.style.display = "none";
        } else {
        content.style.display = "block";
        }
    });    
    let setNames = [];

    let setTable = document.createElement('table');
    setTable.className = 'table-content';
    let setBody = document.createElement('tbody');

    sets.appendChild(btn);
    sets.appendChild(setTable);
    setTable.appendChild(setBody);

    //fetches each set onto the table
    const newRes = await fetch(items.prints_search_uri);
    const data = await newRes.json();
    setNames.push(data.data);
    setNames[0].sort((a,b) => {
        a = a.prices.usd;
        b = b.prices.usd;
        return a - b;
    })
    setNames[0].forEach(el =>{
        if(el.prices.usd != null)
        {
                    
        let setRow = setBody.insertRow();
        let nameOfSet = setRow.insertCell(0);
        let cardSetPrice = setRow.insertCell(1);
        setBody.appendChild(setRow);

        nameOfSet.innerHTML = el.set_name;
        cardSetPrice.innerHTML = el.prices.usd;
        }
    })
}

//filters what is in each list that is not in the other
/*
    need to revise the look of the list to differentiate the two
*/

function compareLists(){
    const list1 = document.querySelector('#text-of-deck-1').value;
    // const updatedList1 = list1.split(/\v|\n|\t/|'1 ').filter(item => item != '\t' || item == '' || item == "\v");
    const updatedList1 = list1.split('\n'|'1 ').filter(x => x != "" || '1 ').map(x =>x.trim()).sort((a, b) => a - b);
    console.log(updatedList1);
    
    const list2 = document.querySelector('#text-of-deck-2').value;
    // const updatedList2 = list2.split(/\v|\n|\t/|'1 ').filter(item => item != '\t' || item == '' || item == "\v");
    const updatedList2 = list2.split('\n'|'1 ').filter(x => x != "" || '1 ').map(x =>x.trim()).sort((a, b) => a - b);
    const x_list = updatedList1.filter(item => !updatedList2.includes(item));
    const add_list = updatedList2.filter(item => !updatedList1.includes(item));
    
    x_list.forEach(el => {
        getFetch(el, 'x-body');
    });

    add_list.forEach(el => {
        getFetch(el, 'add-body');
    });

}

/* 
1 Sol Ring
1 Vandalblast
1 Grim Tutor
1 Mystic Forge
1 Thran Dynamo
*/

//what else to add in table?
//table for information

/*
Add Table Functionality to Import/Export
    Import .txt files
    Export .txt files + spreadsheet files
Add Description of Cards
Make Each Card Name a Collapsible Button
    Collapse to Image and Card Name?
*/