const style_tag_holder = document.createElement("div");

components.forEach(component => {
    let style_tag = document.createElement("link");
    style_tag.rel = "stylesheet";
    style_tag.href = `css/components/${component}.css`;
    style_tag_holder.appendChild(style_tag);
});

document.head.appendChild(style_tag_holder);