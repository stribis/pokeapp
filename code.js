
getAllPokemon ()
async function getAllPokemon () {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1200`)
  const data = await response.json()
  // console.log(data)
  displayAll(data)
}

async function searchPoke (pokemon) {
  try {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`)
  const data = await response.json()
  // console.log(data)
  displayResult(data)
  } catch (err) {
    document.querySelector('.results').innerHTML = 'No such pokemon'
  }
}

document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault()
  searchPoke(document.querySelector('input').value)
})


function displayAll(data) {
  const template = `
    <h2>List of Pokemon</h2>

    <ul class="listAllPokemon">
    ${data.results.map(entry => `<li>${entry.name}</li>`).join("")}
    </ul>
  `
  const dataTemp = `
    <datalist id="pokemons">
    ${data.results.map(entry => `<option value="${entry.name}">`).join("")}
    </datalist>
  `

  document.querySelector('.results').innerHTML = template
  document.querySelector('.search form').innerHTML += dataTemp
  document.querySelector('.listAllPokemon').addEventListener('click', e => {
    const selectedPoke = e.target.innerText
    searchPoke(selectedPoke)
  } )

}


function displayResult(data) {

  document.querySelector('.info').classList.remove('hidden')
  document.querySelector('.home').classList.remove('hidden')

  const template = `
  <a target="_blank" href="https://bulbapedia.bulbagarden.net/wiki/${data.name[0].toUpperCase() + data.name.slice(1)}_(Pok%C3%A9mon)"><h2>${data.name[0].toUpperCase() + data.name.slice(1)}</h2></a>
  <div class="official_artwork">
    <img src="${data.sprites.other["official-artwork"].front_default}">
  </div>
  <div class="evo_chain">Loading${getEvolutions(data.species.url)}</div>
  <ul class="types_list">
  ${data.types.map(entry => `<li class="type-${entry.type.name}">${entry.type.name.toUpperCase()}</li>`).join("")}
  </ul>
  <div class="relations hidden">
    <div>
      <h3>Strong Against</h3>
      <ul class="types_rel types_strengths">
        <li>
          <ul class="rl ddt">
            <li class="tr_title">x2</li>
          </ul>
        </li>
        <li>
          <ul class="rl hdf">
            <li class="tr_title">/2</li>
          </ul>
        </li>
        <li>
          <ul class="rl ndf">
            <li class="tr_title">-</li>
          </ul>
        </li>
      </ul>
    </div>
    <div>
      <h3>Weak Against</h3>
      <ul class="types_rel types_weaknesses">
        <li>
          <ul class="rl ddf">
            <li class="tr_title">x2</li>
          </ul>
        </li>
        <li>
          <ul class="rl hdt">
            <li class="tr_title">/2</li>
          </ul>
        </li>
        <li>
          <ul class="rl ndt">
            <li class="tr_title">-</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>

  <h3>Abilities<h3>
  <ul class="abilities_list">
  ${data.abilities.map(entry => `<li><a target="_blank" href="https://bulbapedia.bulbagarden.net/wiki/${formatAbilityBP(entry.ability.name)}_(Ability)">${formatAbilityDisplay(entry.ability.name)}</a></li>`).join("")}
  </ul>

  <h3>Stats<h3>
  <ul class="stats_list">
  ${data.stats.map(entry => `<li><div class="stat_name_container"><div class="stat_name">${reFormatStatName (entry.stat.name)}:</div><div class="stat_value">${entry.base_stat}</div></div><div class="stat_bar_container"><div class="stat_bar ${entry.stat.name}" style="width: calc(100% * ${entry.base_stat}/255)"></div></div></li>`).join("")}
  </ul>`

  data.types.forEach(type => {
    getTypeData (type.type.url)
  })

  document.querySelector('.results').innerHTML = template;
}




function reFormatStatName (apiName) {
  if( apiName == 'hp'){
    return 'HP'
  } else if ( apiName == 'attack') {
    return 'Attack'
  } else if ( apiName == 'defense') {
    return 'Defense'
  } else if ( apiName == 'special-attack') {
    return 'Sp. Atk'
  } else if ( apiName == 'special-defense') {
    return 'Sp. Def'
  } else if ( apiName == 'speed') {
    return 'Speed'
  } else {
    return apiName
  }
}

function formatAbilityBP (apiAbility) {
  const ablitySubstrings = apiAbility.split('-')
  ablitySubstrings.forEach((substring, i) => {
    ablitySubstrings[i] = substring[0].toUpperCase() + substring.slice(1)
  })
  return ablitySubstrings.join('_')
}

function formatAbilityDisplay (apiAbility) {
  const ablitySubstrings = apiAbility.split('-')
  ablitySubstrings.forEach((substring, i) => {
    ablitySubstrings[i] = substring[0].toUpperCase() + substring.slice(1)
  })
  return ablitySubstrings.join(' ')
}

// types

function displayTypeRelation (relations) {
  const ddt = relations.doubleDamageTo ? `${relations.doubleDamageTo.map(entry =>`<li class="ri type-${entry}">${entry.toUpperCase()}</li>`).join("")}` : ' '
  // console.log(ddt)
  document.querySelector('.ddt').innerHTML += ddt

  const hdf = `
    ${relations.halfDamageFrom.map(entry => `<li class="ri type-${entry}">${entry.toUpperCase()}</li>`).join("")}
  `
  document.querySelector('.hdf').innerHTML += hdf

  const ndf = `
    ${relations.noDamageFrom.map(entry => `<li class="ri type-${entry}">${entry.toUpperCase()}</li>`).join("")}
  `
  document.querySelector('.ndf').innerHTML += ndf

  const ddf = `
    ${relations.doubleDamageFrom.map(entry => `<li class="ri type-${entry}">${entry.toUpperCase()}</li>`).join("")}
  `
  document.querySelector('.ddf').innerHTML += ddf

  const hdt = `
    ${relations.halfDamageTo.map(entry => `<li class="ri type-${entry}">${entry.toUpperCase()}</li>`).join("")}
  `
  document.querySelector('.hdt').innerHTML += hdt

  const ndt = `
    ${relations.noDamageTo.map(entry => `<li class="ri type-${entry}">${entry.toUpperCase()}</li>`).join("")}
  `
  document.querySelector('.ndt').innerHTML += ndt
  checkRepeats ()

}

async function getTypeData (url) {
  const response = await fetch(url)
  const data = await response.json()
  // console.log(data)

  const relations = {
    doubleDamageTo :[],
    doubleDamageFrom :[],
    halfDamageTo :[],
    halfDamageFrom :[],
    noDamageTo :[],
    noDamageFrom :[]
  }

  data.damage_relations.double_damage_to.forEach(ddt => relations.doubleDamageTo.push(ddt.name)),
  data.damage_relations.double_damage_from.forEach(ddt => relations.doubleDamageFrom.push(ddt.name)),
  data.damage_relations.half_damage_to.forEach(ddt => relations.halfDamageTo.push(ddt.name)),
  data.damage_relations.half_damage_from.forEach(ddt => relations.halfDamageFrom.push(ddt.name)),
  data.damage_relations.no_damage_to.forEach(ddt => relations.noDamageTo.push(ddt.name)),
  data.damage_relations.no_damage_from.forEach(ddt => relations.noDamageFrom.push(ddt.name))
  // console.log(relations)
  displayTypeRelation (relations)
  return relations
}



function checkRepeats () {
  document.querySelectorAll('.rl').forEach(list => {
 
    const items = list.querySelectorAll('.ri')

    let repeats = []
    const unfilteredList = []
    items.forEach(item => {
      unfilteredList.push(item.innerText)
    })

    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
    if (findDuplicates(unfilteredList).length >0){
      repeats = [...findDuplicates(unfilteredList)]
      // console.log(repeats)
    }
    let temp = []
    items.forEach(item =>{
      
      if (repeats.includes(item.innerText)  && !temp.includes(item.innerHTML)){
        temp.push(item.innerHTML)
        item.remove()
        // console.log(temp)
      } else if (repeats.includes(item.innerText)){
        item.innerHTML = `${item.innerHTML} x4`
      } 
      
    })

  })
}


document.querySelector('.info').addEventListener('click', e => {
  document.querySelector('.relations').classList.toggle('hidden')
})

document.querySelector('.home').addEventListener('click', e => {
  getAllPokemon ()
})

async function getEvolutions (url) {
  const speciesresponse = await fetch(url)
  const speciesData = await speciesresponse.json()
  // console.log(speciesData)

  const chainResponse = await fetch(speciesData.evolution_chain.url)
  const chainData = await chainResponse.json()

  console.log(chainData)
  let evolution = `<p><span class="evoName">${chainData.chain.species.name[0].toUpperCase() + chainData.chain.species.name.slice(1)}</span> <span>${chainData.chain.evolution_details.length > 0 ? chainData.chain.evolution_details[0].min_level :''}</span></p>`
  
  let current = chainData.chain.evolves_to
  while ( current.length > 0 ){
    current.forEach(possibility => {
      // TODO: Optimize this so that it works with all combinations dynamically
      evolution += `
      <p>
        <span class="evoName">${possibility.species.name[0].toUpperCase() + possibility.species.name.slice(1)}</span>
        ${possibility.evolution_details.length > 0 && possibility.evolution_details[0].min_level != null ? '<span>(lvl: ' + possibility.evolution_details[0].min_level + ')</span>' :''}
        ${possibility.evolution_details.length > 0 && possibility.evolution_details[0].trigger.name == 'use-item' ? '<span>(Item: ' + possibility.evolution_details[0].item.name + ')</span>' :''}
        ${possibility.evolution_details.length > 0 && possibility.evolution_details[0].trigger.name == 'trade' ? '<span>(Trade)</span>' :''}
        ${possibility.evolution_details.length > 0 && possibility.evolution_details[0].known_move_type ? '<span>(With '+possibility.evolution_details[0].known_move_type.name + ' move)</span>' :''}
        ${possibility.evolution_details.length > 0 && possibility.evolution_details[0].location ? '<span>(Location: '+possibility.evolution_details[0].location.name + ')</span>' :''}
        ${possibility.evolution_details.length > 0 && possibility.evolution_details[0].min_level == null && possibility.evolution_details[0].min_happiness > 0 ? '<span>(Happiness: ' + possibility.evolution_details[0].min_happiness + ')</span>' :''}
      </p>`
      current = possibility.evolves_to
    })
    // evolution += `<p>${current[0].species.name[0].toUpperCase() + current[0].species.name.slice(1)}</p>`
    // current = current[0].evolves_to
  }


  
  document.querySelector('.evo_chain').innerHTML = evolution
  document.querySelectorAll('.evo_chain p').forEach( evo => {
    // console.log(evo)
    evo.addEventListener('click', e => {
      
      searchPoke(evo.querySelector('.evoName').innerText)
    })
    const currentPokemon = document.querySelector('.results h2')
    if (evo.querySelector('.evoName').innerText.toLowerCase() == currentPokemon.innerText.toLowerCase()){
      evo.classList.add('selected')
      //.classList.add('selected')
    }
  } )
  return 
}