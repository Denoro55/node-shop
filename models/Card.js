const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'card.json');

class Card {
    static async fetchAll() {
        return new Promise((res, rej) => {
            fs.readFile(p, 'utf-8', (err, data) => {
                if (err) {
                    rej(err)
                } else {
                    res(JSON.parse(data));
                }
            })
        })
    }

    static async removeById(id) {
        const card = await Card.fetchAll();
        const idx = card.courses.findIndex(c => c.id === id);
        const course = card.courses[idx];

        if (course.count > 1) {
            course.count -= 1;
            card.courses[idx] = course;
        } else {
            card.courses = card.courses.filter(c => c.id !== id);
        }

        card.totalPrice -= course.price;

        return new Promise((res, rej) => {
            fs.writeFile(p, JSON.stringify(card, null, 2), (err, data) => {
                if (err) {
                    rej(err)
                } else {
                    res(card);
                }
            })
        })
    }

    static async add(course) {
        const card = await Card.fetchAll();
        const idx = card.courses.findIndex(c => c.id === course.id);
        const candidate = card.courses[idx];

        if (candidate) {
            candidate.count += 1;
            card.courses[idx] = candidate;
        } else {
            course.count = 1;
            card.courses.push(course);
        }

        card.totalPrice += +course.price;

        return new Promise((res, rej) => {
            fs.writeFile(p, JSON.stringify(card, null, 2), (err, data) => {
                if (err) {
                    rej(err)
                } else {
                    res();
                }
            })
        })
    }
}

module.exports = Card;
