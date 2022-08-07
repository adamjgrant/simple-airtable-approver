m.notification.animation_css_library_loaded = false;
m.notification.acts({
    async show_notification(_$, args) {
        await _$.act.load_in_dependencies();

        let notification_element = document.createElement("div");
        notification_element.className = "notification";
        notification_element.classList.add("animate__animated");
        notification_element.classList.add("animate__bounceIn");
        notification_element.innerHTML = `
            <p class="icon animate__animated ${args.animation} animate__delay-1s">${args.icon || ""}</p>
            <h1 class="heading">${args.heading}</h1>
            <p class="message">${args.message}</p>
        `;
        notification_element.style.backgroundColor = args.background_color || "#FFFFFF";
        _$.me().appendChild(notification_element);
        setTimeout(() => { _$.act.hide_notification({ element: notification_element }) }, args.delay || 3000);
    },

    hide_notification(_$, args) {
        const element = args.element;
        element.classList.add("animate__bounceOutDown");
        const parent = element.parentNode
        setTimeout(() => {
            parent.removeChild(element);
        }, 2000);
    },

    priv: {
        load_in_dependencies(_$, args) {
            if (!m.notification.animation_css_library_loaded) {
                return new Promise((resolve, reject) => {
                    // Only load this when it's needed.
                    let link = document.createElement("link");
                    link.href = "css/vendor/animate.css";
                    link.rel = "stylesheet";
                    document.body.appendChild(link);
                    m.notification.animation_css_library_loaded = true;
                    link.addEventListener("load", () => resolve());
                })
            }
            else { return }
        }
    }
});
