$(document).ready(() => {
  loadItems();
})

const loadItems = async () => {
  const items = await fetchItems();
  appendItems(await Promise.all(items))
}

const fetchItems = async () => {
  const response = await fetch('/api/v1/items');
  const items = await response.json();
  
  return items;
}

const appendItems = (items) => {
  $cardArea = $('.section__bottom');
  items.forEach(item => {
    $cardArea.append(
      `<div class="div__card">
        <h3>${item.name}</h3>
        <input type="checkbox" id="packed" name="${item.id}" ${item.isPacked ? "checked" : ""}/>
        <label for="packed">Packed</label>
        <button class="button__delete" id=${item.id}>Delete Item</button>
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

const markedAsPacked = (event) => {
  if (event.target.id === "packed") { 
    const id = event.target.name;
    const value = event.target.checked;

    patchItem(id, value)
  }
}

const patchItem= async (id, value) => {
  const response = await fetch(`/api/v1/items/${id}`, {
    body: JSON.stringify({item: {isPacked: value}}),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PATCH'
  });
} 

const deleteItem = (event) => {
  if (event.target.className === "button__delete") {
    const id = event.target.id;
    fetch(`/api/v1/items/${id}`, {
      method: 'DELETE'
    });

    event.target.closest('div').remove();
  }

}



$('.button__add').on('click', createItem);
$('.section__bottom').on('click', markedAsPacked, deleteItem);