class Component extends Mozart {};
let m = Component.index;
const components = [
    "card", "toolbar", "status_indicator"
]

components.forEach(component => new Component(component));