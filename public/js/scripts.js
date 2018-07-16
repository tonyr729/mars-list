$input = $('.section__top input')[0];
$addButton = $('.button__add')[0];

$(document).ready(() => {
  loadItems();
})

const loadItems = async () => {
  const items = await fetchItems();
  appendItems(await Promise.all(items))
}

const fetchItems = async () => {
  const response = await fetch('/api/v1/items');
  const items = await response.json()
  
  return items;
}

const appendItems = (items) => {
  $cardArea = $('.section__bottom');
  items.forEach(item => {
    $cardArea.append(
      `<div class="div__card">
        <h3>${item.name}</h3>
        <input type="radio" id="packed"/>
        <label for="packed">Packed</label>
      </div>`)
  })
}

const createItem = () => {
  
}



// $addButton.on('click', createItem);