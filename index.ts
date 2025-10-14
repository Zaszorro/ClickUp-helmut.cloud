import Catalog from "./lib/Catalog";
import ClickUpCreateTask from "./lib/nodes/clickup/ClickUpCreateTask";
import ClickUpDeleteTask from "./lib/nodes/clickup/ClickUpDeleteTask";
import ClickUpUpdateTask from "./lib/nodes/clickup/ClickUpUpdateTask";
import ClickUpCreateTimeEntry from "./lib/nodes/clickup/ClickUpCreateTimeEntry";
import ClickUpUpdateTimeEntry from "./lib/nodes/clickup/ClickUpUpdateTimeEntry";
import ClickUpDeleteTimeEntry from "./lib/nodes/clickup/ClickUpDeleteTimeEntry";
import ClickUpStopTimeEntry from "./lib/nodes/clickup/ClickUpStopTimeEntry";
import ClickUpStartTimeEntry from "./lib/nodes/clickup/ClickUpStartTimeEntry";


export default new Catalog(
    "ClickUp Catalog",
    "Catalog to connect to ClickUp",
    "https://app.helmut.cloud/img/logo_white.webp",
    "1.5.0",
    ClickUpCreateTask,
    ClickUpUpdateTask,
    ClickUpDeleteTask,
    ClickUpCreateTimeEntry,
    ClickUpUpdateTimeEntry,
    ClickUpDeleteTimeEntry,
    ClickUpStartTimeEntry,
    ClickUpStopTimeEntry
);