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

    const res = await fetch(url);
    const data = await res.json();
    searchQueryItems.push(data);
    loadTable(searchQueryItems[0], listRef);

    // .then(res => res.json())
    // .then(data =>{
    //     searchQueryItems.push(data);
    //     loadTable(searchQueryItems[0], listRef);
    // })
    // .catch(err =>{
    //     console.log(`error ${err}`);
    //     console.log(item);
    // });
}

//loads table with list of items
function loadTable(items, listRef){
    let tbodyRef = document.getElementById(listRef);
    let newRow = tbodyRef.insertRow();

    //orders tables with different such as name, type,  colors, cmc, rarity and then sets
    let name = newRow.insertCell(0);
    name.innerHTML = items.name;

    let type = newRow.insertCell(1);
    type.innerHTML = items.type_line;

    let colors = newRow.insertCell(2);
    if(items.colors.length == 0)
    {
        colors.innerHTML = 'colorless';
    }
    else
    {
        colors.innerHTML = items.colors;
    }

    let cmc = newRow.insertCell(3);
    cmc.innerHTML = items.cmc;

    let rarity = newRow.insertCell(4);
    rarity.innerHTML = items.rarity;

    //minimize the table for space for the amount of sets there are; changes the space box into a button
    let sets = newRow.insertCell(5);
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
    fetch(items.prints_search_uri)
        .then(res => res.json())
        .then(data =>{
            setNames.push(data.data);
            console.log(setNames);
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
        })
        .catch(err =>{
            console.log(`error ${err}`)
        });

}

//filters what is in each list that is not in the other
/*
    need to revise the look of the list to differentiate the two
*/

function compareLists(){
    const list1 = document.querySelector('#text-of-deck-1').value;
    const updatedList1 = list1.split(/\n|\t/).filter(item => item != '\t' || item == '');
    
    const list2 = document.querySelector('#text-of-deck-2').value;
    const updatedList2 = list2.split(/\n|\t/).filter(item => item != '\t' || item == '');

    const x_list = updatedList1.filter(item => !updatedList2.includes(item));
    const add_list = updatedList2.filter(item => !updatedList1.includes(item));
    
    x_list.forEach(el => {
        // const node = document.createElement('li');
        // const textNode = document.createTextNode(el);
        // node.appendChild(textNode);
        // document.getElementById('x-list').appendChild(node);
        getFetch(el, 'x-body');
    });

    add_list.forEach(el => {
        // const node = document.createElement('li');
        // const textNode = document.createTextNode(el);
        // node.appendChild(textNode);
        // document.getElementById('add-list').appendChild(node);

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
//enter 2 lists
//first list - the items not in second list
//second list + the items not in first list
//table? for prices
//what else to add in table?
//table for information
/**/ 