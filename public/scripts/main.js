function toCurrency(number) {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(number);
}

function toDate(date) {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(date));
}

document.querySelectorAll('.price').forEach(node => {
   node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent);
});

const $card = document.querySelector('#card');
if ($card) {
    $card.addEventListener('click', function(e) {
        if (e.target.classList.contains('js-remove')) {
            const id = e.target.dataset.id;
            const _csrf = e.target.dataset.csrf;

            fetch('/cart/remove/' + id,
                {
                    method: 'DELETE',
                    headers: {
                        'X-XSRF-TOKEN': _csrf
                    }
                })
            .then(function(res) {
                return res.json();
            }).then(function(cart) {
                if (cart.courses.length) {
                    const items = cart.courses.map(course => {
                        return `
                            <tr><td>${course.title}</td><td>${course.count}</td><td><div class="btn btn-primary js-remove" data-csrf=${_csrf} data-id=${course.id}>Удалить</div></td></tr>
                        `
                    }).join('');
                    $card.querySelector('tbody').innerHTML = items;
                    $card.querySelector('.price').innerHTML =  toCurrency(cart.totalPrice);
                } else {
                    $card.innerHTML = `<p>В корзине пока пусто</p>`;
                    document.querySelector('.form-make-order').remove();
                }
            })
        }
    })
}

M.Tabs.init(document.querySelectorAll('.tabs'));
