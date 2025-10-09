import Catalog from "./lib/Catalog";
import ClickUpCreateTask from "./lib/nodes/clickup/ClickUpCreateTask";
import ClickUpDeleteTask from "./lib/nodes/clickup/ClickUpDeleteTask";
import ClickUpUpdateTask from "./lib/nodes/clickup/ClickUpUpdateTask";

export default new Catalog(
    "ClickUp Catalog",
    "Catalog to connect to ClickUp",
    "https://app.helmut.cloud/img/logo_white.webp",
    "1.5.0",
    ClickUpCreateTask,
    ClickUpUpdateTask,
    ClickUpDeleteTask
);