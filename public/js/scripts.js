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

const createItem = async () => {
  $input = $('.section__top input');
  const itemName = $input.val();

  if ($input.val()) {
    const result = await postItem(itemName)
    console.log(result)
  } else {
    $(".warning").text("Please insert a name for the item");
  }

  appendItems([{name: itemName, isPacked: false}])

  $input.val('')
}

const postItem = async (itemName) => {
  const url = '/api/v1/items';
  const item = {
    name: itemName,
    isPacked: false
  };
  try {
    const response = await fetch(url, {
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
    const result = await response.json()
  } catch (error) {
    console.log(error)
  }
}




$('.button__add').on('click', createItem);