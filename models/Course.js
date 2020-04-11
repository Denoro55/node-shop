const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');

class Course {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.id = uuid();
    }

    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    async save() {
        const courses = await Course.getAll();
        courses.push(this.toJSON());
        return new Promise((res, rej) => {
            fs.writeFile(Course.getDataPath(), JSON.stringify(courses, null, 2), (err, data) => {
                if (err) {
                    rej(err);
                } else {
                    res(data);
                }
            })
        })
    }

    static getAll() {
        return new Promise((res, rej) => {
            fs.readFile(Course.getDataPath(), 'utf-8', (err, data) => {
                if (err) {
                    rej(err);
                } else {
                    res(JSON.parse(data));
                }
            })
        })
    }

    static async update(course) {
        const courses = await Course.getAll();
        const index = courses.findIndex(c => c.id === course.id);
        courses[index] = course;
        return new Promise((res, rej) => {
            fs.writeFile(Course.getDataPath(), JSON.stringify(courses, null, 2), (err, data) => {
                if (err) {
                    rej(err);
                } else {
                    res(data);
                }
            })
        })
    }

    static async getById(id) {
        const courses = await Course.getAll();
        return courses.find(course => course.id === id);
    }

    static getDataPath() {
        return path.join(__dirname, '..', 'data', 'courses.json');
    }
}

module.exports = Course;
