// to be resuable
// object do use instad of dom
// dont put paransthes for render option function
const createAutoComplete = ({ root,
     renderOption,
     onOptionSelect,
     inputValue,
     fetchData
    }) => { 
// automaticaly just add them for other enginers
root.innerHTML = `
<label><b>Search for a movie</b></label>
<input class = "input" />
<div class = "dropdown">
<div class = "dropdown-menu ">
<div class = "dropdown-content results"></div>
</div>
</div>
`;

// whatever root  i pass reuse not all document
const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');

const onInput =  debounce (async event => {
    // when you input take the value of targeted event which is input
    // then use as query for search 
    // await cause we treat as async and wait for promise
    const items = await fetchData (event.target.value);

    // if u search for something then removied everything
    // the drop menu will search for nth ,so ifno length hide list
    if (!items.length) {
        dropdown.classList.remove('is-active');
        return ;
    }
// after u fetch data activeate drop menu then add
// is active shows the menu 
    // and clear html of old ones
    resultsWrapper.innerHTML='';
    dropdown.classList.add('is-active');

    for (let item of items) {
        const option = document.createElement('a');
       
        option.classList.add('dropdown-item')
        option.innerHTML =renderOption(item) ;
        option.addEventListener('click' , () => {
            // when u click a movie in list close menu and put clicked in input
            dropdown.classList.remove('is-active');
            input.value = inputValue(item);
            // when you click on movie select movie
            onOptionSelect (item);
        })
         
        // which is the content section in html we created
        resultsWrapper.appendChild(option);
    }
}, 500);

input.addEventListener('input', onInput)
// globaly evetn listent bubble up until u reach document bordent
// when u click close list
// when u click on a target that is not contained in root close
document.addEventListener('click',event => {
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active')
    }
})
};