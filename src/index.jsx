import React from "react";

import "./styles.css";
import { PanelController } from "./controllers/PanelController.jsx";
import { MainView } from "./panels/MainView.jsx";

import { entrypoints } from "uxp";

const mainViewController =  new PanelController(() => <MainView/>, { id: "mainView", menuItems: [
    { id: "reload2", label: "Reload Plugin", enabled: true, checked: false, oninvoke: () => location.reload() }
] });

entrypoints.setup({
    plugin: {
        create(plugin) {
            /* optional */
        },
        destroy() {
            /* optional */
        }
    },
    panels: {
        mainView: mainViewController
    }
});
