function toCurrency(number) {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(number);
}

document.querySelectorAll('.price').forEach(node => {
   node.textContent = toCurrency(node.textContent);
});

const $card = document.querySelector('#card');
if ($card) {
    $card.addEventListener('click', function(e) {
        if (e.target.classList.contains('js-remove')) {
            const id = e.target.dataset.id;

            fetch('/card/remove/' + id, {method: 'DELETE'}).then(function(res) {
                return res.json();
            }).then(function(cart) {
                if (cart.courses.length) {
                    const items = cart.courses.map(course => {
                        return `
                            <tr><td>${course.title}</td><td>${course.count}</td><td><div class="btn btn-primary js-remove" data-id=${course.id}>Удалить</div></td></tr>
                        `
                    }).join('');
                    $card.querySelector('tbody').innerHTML = items;
                    $card.querySelector('.price').innerHTML =  toCurrency(cart.totalPrice);
                } else {
                    $card.innerHTML = `<p>В корзине пока пусто</p>`
                }
            })
        }
    })
}
