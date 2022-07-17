document.querySelector('#search-button').addEventListener('click', getFetch);
document.querySelector('#compare-button').addEventListener('click', compareLists);

function getFetch(){
    const searchItem = document.querySelector('#search-bar').value;
    // const url = `https://api.scryfall.com/cards/named?exact=${searchItem}`;
    const url = `https://api.scryfall.com/cards/named?fuzzy=${searchItem}`;
    // console.log(searchItem);
    let searchQueryItems = [];

    fetch(url)
    .then(res => res.json())
    .then(data =>{
        searchQueryItems.push(data);
        // console.log(searchQueryItems);

        // var newText = document.createTextNode('new row');
        // xList_newCell.appendChild(newText);

        // console.log(searchQueryItems[0].name);
        // console.log(searchQueryItems[0].type_line);
        // console.log(searchQueryItems[0].colors);
        // console.log(searchQueryItems[0].cmc);
        // console.log(searchQueryItems[0].rarity);

        loadTable(searchQueryItems[0], 'x-body');

        // fetch(searchQueryItems[0].prints_search_uri)
        // .then(res => res.json())
        // .then(data =>{
        //     setNames.push(data.data);
        //     console.log(setNames);
        //     setNames[0].forEach(el =>{
        //         console.log(el.set_name);
        //         console.log(el.prices.usd);
        //     })
        // })
        // .catch(err =>{
        //     console.log(`error ${err}`)
        // });
    })
    .catch(err =>{
        console.log(`error ${err}`)
    });
}

function loadTable(items, listRef){
    let tbodyRef = document.getElementById(listRef);
    let newRow = tbodyRef.insertRow();

    let name = newRow.insertCell(0);
    name.innerHTML = items.name;

    let type = newRow.insertCell(1);
    type.innerHTML = items.type_line;

    let colors = newRow.insertCell(2);
    colors.innerHTML = items.colors;

    let cmc = newRow.insertCell(3);
    cmc.innerHTML = items.cmc;

    let rarity = newRow.insertCell(4);
    rarity.innerHTML = items.rarity;

    let sets = newRow.insertCell(5);    
    let setNames = [];

    let setTable = document.createElement('table');
    let setBody = document.createElement('tbody');

    sets.appendChild(setTable);
    setTable.appendChild(setBody);

    fetch(items.prints_search_uri)
        .then(res => res.json())
        .then(data =>{
            setNames.push(data.data);
            console.log(setNames);
            setNames[0].forEach(el =>{
                if(el.prices.usd != null)
                {

                
                console.log(el.set_name);
                console.log(el.prices.usd);
                            
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

function compareLists(){
    const list1 = document.querySelector('#text-of-deck-1').value;
    const updatedList1 = list1.split(/\n|\t/).filter(item => item != '\t' || item == '');
    
    const list2 = document.querySelector('#text-of-deck-2').value;
    const updatedList2 = list2.split(/\n|\t/).filter(item => item != '\t' || item == '');

    console.log(updatedList1 , updatedList2);

    const x_list = updatedList1.filter(item => !updatedList2.includes(item));
    const add_list = updatedList2.filter(item => !updatedList1.includes(item));

    console.log(x_list);
    console.log(add_list);

    
    x_list.forEach(el => {
        const node = document.createElement('li');
        const textNode = document.createTextNode(el);
        node.appendChild(textNode);
        document.getElementById('x-list').appendChild(node);
    });
    add_list.forEach(el => {
        const node = document.createElement('li');
        const textNode = document.createTextNode(el);
        node.appendChild(textNode);
        document.getElementById('add-list').appendChild(node);
    });

}

function simplifyList(listOfItems){

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