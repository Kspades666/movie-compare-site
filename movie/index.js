 const autoCompleteConfig = {
    //  render option to show poster and h1 
    renderOption : (movie) => {
        // if there is no poseter then give empty one , else give poster
      const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
              // must be back template tick not '' if u wanna create more than one line
      return  `
      <img src = "${imgSrc}" />
       ${movie.Title} (${movie.Year})
      `;
   },
   inputValue(movie){
       return movie.Title;
   },
   async fetchData(searchTerm) {
      // async to use await to wait async request then run code
      // if so u will log before finding url
      // get to get url ,without key yet , put '' 
      const response = await axios.get('http://www.omdbapi.com/' , {
          // object for query for get
          params : {
              // all type of strings and paratmers u wana use
              // use s: to search and get id then put in i the id of avengers
              apikey : '73558549',
              s : searchTerm
          }
      });
  
      // if we couldnt find dont print error 202
      // return an empty array so no content shown
      if(response.data.Error){
          return [];
      }
      return response.data.Search;
   }
 };

 createAutoComplete({
    //  take all the copies of auto config then add root propity
     ...autoCompleteConfig,
     root : document.querySelector('#left-autocomplete'),
     onOptionSelect(movie) {
        //    when you pick a movie hide tutorial text
           document.querySelector('.tutorial').classList.add('is-hidden');
        //   the context left is called 
           onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
       }, 
 });
 createAutoComplete({
    //  take all the copies of auto config then add root propity
     ...autoCompleteConfig,
     root : document.querySelector('#right-autocomplete'),
     onOptionSelect(movie) {
        //    when you pick a movie hide tutorial text
           document.querySelector('.tutorial').classList.add('is-hidden');
           onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
       }, 
 });

//  to compare ratings and stuff
let leftMoive;
let rightMovie;

// a function that gets movie infromation
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/' , {
        params : {
            apikey : '73558549',
            i : movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);

    // get data for each side then compare
    if (side === 'left') {
        leftMoive = response.data;
    } else {
        rightMovie = response.data;
    }
    if (leftMoive && rightMovie){
        runComparison();
    }
}

const runComparison = () => {
    // select all left side summer with notfi class
    const leftSideStats = document.querySelectorAll('#left-summary .notification')
    const rightSideStats = document.querySelectorAll('#right-summary .notification')
// for each select elemnt left stat and its index
    leftSideStats.forEach((leftStat , index) => {
        // right stat will equal smae indix but on right
        const rightStat = rightSideStats[index];
        // which is data-value attribute
        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;

        // compare and hightlight 
        // === not == 
        // also else if , and if if as u wanna have one of 3 cases
        // not one who has both
        if (leftSideValue === 'no'&& rightSideValue ==='no')
        {
            rightStat.classList.remove('is-primary')
            leftStat.classList.remove('is-primary')
        }
       else  if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary')
            leftStat.classList.add('is-warning')
        }else {
            rightStat.classList.remove('is-primary')
            rightStat.classList.add('is-warning')
        }
});
};

const movieTemplate = (movieDetail) => {
    // string looks like '$640,000,000' to easier to compare need to trans
    //transfer it to '' , //g means all , iff u put in the middle of '' that means only first one
    //also $ needs escaoe \ 
    //everything inside is string
    // later put them in databvalue
    const dollars = parseInt (movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
    const awards = 'no';
    const metascore = parseInt (movieDetail.Metascore)
    const imdbRating = parseFloat(movieDetail.imdbRating)
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''))
    return `
    <article class = "media">
    <figure class = "media-left"
    <p class = "image">
    <img src = "${movieDetail.Poster}"/>
    </p>
    </figure>
    <div class = "media-content">
    <div class = "content">
    <h1> ${movieDetail.Title}</h1>
    <h4> ${movieDetail.Genre}</h4>
    <p> ${movieDetail.Plot}</p>
    </div>
    </div>
    </article>
    <article data-value = ${awards} class = "notification is-primary">
    <p class = "title" > ${movieDetail.Awards}</p>
    <p class = "subtitle">Awards</p>
    </article>
    <article data-value = ${dollars} class = "notification is-primary">
    <p class = "title" > ${movieDetail.BoxOffice}</p>
    <p class = "subtitle">Box Office</p>
    </article>
    <article data-value = ${metascore} class = "notification is-primary">
    <p class = "title" > ${movieDetail.Metascore}</p>
    <p class = "subtitle">Metascore</p>
    </article>
    <article data-value = ${imdbRating} class = "notification is-primary">
    <p class = "title" > ${movieDetail.imdbRating}</p>
    <p class = "subtitle">IMDB Rating</p>
    </article>
    <article data-value = ${imdbVotes} class = "notification is-primary">
    <p class = "title" > ${movieDetail.imdbVotes}</p>
    <p class = "subtitle">IMDB Votes</p>
    </article>
    `;
} ;