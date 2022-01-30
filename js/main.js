class Component extends Mozart {};
let m = Component.index;

const script_tag_holder = document.createElement("div");
const main_script = document.getElementById("main_script");
let promises = [];

components.forEach(component => {
    new Component(component);

    ["actions", "events", "routes"].forEach(mozart_type => {
        let script_tag = document.createElement("script");
        script_tag.type = "module";
        script_tag.src = `js/components/${component}/${component}.${mozart_type}.js`;
        script_tag_holder.appendChild(script_tag);

        promises.push(new Promise((resolve, reject) => {
            script_tag.onload = () => resolve()
            script_tag.onerror = () => reject();
        }));
    });
});

Promise
    .allSettled(promises)
    .then(() => {
        Mozart.init();
    });

document.head.appendChild(script_tag_holder);
main_script.parentNode.insertBefore(script_tag_holder, script_tag_holder.nextSibling);