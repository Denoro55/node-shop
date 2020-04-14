const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
});

userSchema.methods.addToCart = function(course) {
    const items = [...this.cart.items];
    const idx = items.findIndex(i => i.courseId.toString() === course._id.toString());

    if (idx >= 0) {
        items[idx].count += 1;
    } else {
        items.push({
            count: 1,
            courseId: course._id
        })
    }

    this.cart.items = items;
    return this.save();
};

userSchema.methods.removeFromCart = function(id) {
    let items = [...this.cart.items];
    const idx = items.findIndex(c => {
        return c.courseId.toString() === id.toString();
    });

    if (items[idx].count > 1) {
        items[idx].count -= 1;
    } else {
        items = items.filter(c => c.courseId.toString() !== id.toString());
    }

    this.cart.items = items;
    return this.save();
};

userSchema.methods.clearCart = function() {
    this.cart = {
        items: []
    };
    return this.save();
};

module.exports = model('User', userSchema);
