const debounce = (func, delay= 1000) => {
    let timeoutId;
    // this is shield 
    return (...args) => {
    // u will search many times each time u be call oninput if
    // undifiend like first itme skip then fetch data then timeoutid has value
    // then event listen will call oninput then go ininput and will clear
    // then has anew value and keep doing until u wait full sec and fetch data
    if(timeoutId){
        clearTimeout(timeoutId)
    }
    timeoutId = setTimeout (() => {
        // apply func is no matter how many args passed keep track
        // and send as indvidual args to func
        func.apply(null,args);
        }, delay)
    }
}