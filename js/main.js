class Component extends Mozart {};
let m = Component.index;
const components = [
    "card", "toolbar"
]

components.forEach(component => new Component(component));