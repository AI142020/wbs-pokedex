"use strict"


const itemsList = document.getElementById("items-list")
const submitButton = document.getElementById("submit-button")


const fetchPokimon = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    for(let [id, item] of Object.entries(data.results)){
      submitButton.addEventListener("click", (event) => {
        
/*          const liElement = document.createElement("li")
        liElement.innerText = (parseInt(id) + 1 ) + " "+ item.name
        itemsList.appendChild(liElement) */

        /**
         * <table>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Country</th>
            </tr>
            <tr>
              <td>Alfreds Futterkiste</td>
              <td>Maria Anders</td>
              <td>Germany</td>
            </tr>
            <tr>
              <td>Centro comercial Moctezuma</td>
              <td>Francisco Chang</td>
              <td>Mexico</td>
            </tr>
          </table>
         */

          const tableElement = document.createElement("table")
          const trElement = document.createElement("tr")
          const tdElement = document.createElement("td")
          
      })

     
    }


  } catch (error) {
    console.log(error);
  }
};

fetchPokimon("https://pokeapi.co/api/v2/pokemon?limit=10")





/* const getFetch = () => fetch("https://pokeapi.co/api/v2/pokemon?limit=10")
  .then((res) => res.json())
    .then((data) => {
     
      let items = data.results
      for(let [id, item] of Object.entries(data.results)){

        id = parseInt(id) +1  
        name = item.name
          
      } 
   
      return {id, name}


 })   */