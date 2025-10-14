import {
  StreamNodeSpecificationType,
  StreamNodeSpecificationPackage,
  StreamNodeSpecificationTag,
} from "hcloud-sdk/lib/interfaces/high5/wave";
import Node from "../../Node";
import axios from "axios";

type InputType = "STRING" | "STRING_PASSWORD" | "STRING_LONG" | "NUMBER" | "BOOLEAN";
type OutputType = "NUMBER" | "STRING" | "STRING_MAP";

const BASE = "https://api.clickup.com/api/v2"; // offizielle Basis-URL

enum InputName {
  TOKEN = "ClickUp API Token",
  LIST_ID = "List ID",
  NAME = "Task name",
  DESCRIPTION = "Description (optional)",
  STATUS = "Status (optional)",
  ASSIGNEES = "Assignees (comma-separated user IDs, optional)",
  DUE_DATE = "Due date (ms or ISO, optional)",
  PRIORITY = "Priority (1-4, optional)",
  NOTIFY_ALL = "Notify all (optional)",
}

enum OutputName {
  STATUS = "Status code",
  HEADERS = "Headers",
  BODY = "Body",
  RUN_TIME = "Run time",
  TASK_ID = "Task ID", 
}

export default class ClickUpCreateTask extends Node {
  specification = {
    specVersion: 2,
    name: "ClickUp Create Task",
    originalName: "ClickUp Create Task",
    description: "Creates a task in a ClickUp list via POST /list/{list_id}/task",
    kind: "NODE",
    category: "ClickUp Tasks",
    color: "node-aquaGreen",
    version: { major: 1, minor: 0, patch: 16, changelog: ["Initial"] },
    author: {
      name: "David Merzenich",
      company: "MSP GmbH",
      email: "d.merzenich@moovit-sp.com",
    },
    inputs: [
      { name: InputName.TOKEN, description: "Enter your ClickUp API token", type: "STRING_PASSWORD" as InputType, example: "pk_..." , mandatory: true },
      { name: InputName.LIST_ID, description: "List ID where the task will be created", type: "STRING" as InputType, example: "9002001", mandatory: true },
      { name: InputName.NAME, description: "Task title", type: "STRING" as InputType, example: "My new task", mandatory: true },
      { name: InputName.DESCRIPTION, description: "Task description", type: "STRING_LONG" as InputType, example: "Details...", },
      { name: InputName.STATUS, description: "Target status", type: "STRING" as InputType, example: "in progress" },
      { name: InputName.ASSIGNEES, description: "Comma-separated user IDs", type: "STRING" as InputType, example: "123,456" },
      { name: InputName.DUE_DATE, description: "ms timestamp, or ISO datetime", type: "STRING" as InputType, example: "1735689600000 or 2025-12-31T00:00:00Z" },
      { name: InputName.PRIORITY, description: "1 (urgent) to 4 (low)", type: "NUMBER" as InputType, example: 3 },
      { name: InputName.NOTIFY_ALL, description: "Notify watchers", type: "BOOLEAN" as InputType, example: false },
    ],
    outputs: [
      { name: OutputName.STATUS, description: "HTTP status", type: "NUMBER" as OutputType, example: 200 },
      { name: OutputName.HEADERS, description: "Response headers", type: "STRING_MAP" as OutputType, example: { "Content-Type": "application/json" } },
      { name: OutputName.BODY, description: "Response body as string", type: "STRING" as OutputType, example: "{\"id\":\"task_abc\"}" },
      { name: OutputName.RUN_TIME, description: "Execution time (ms)", type: "NUMBER" as OutputType, example: 120 },
      { name: OutputName.TASK_ID, description: "Created ClickUp task id", type: "STRING", example: "9hcxq" }, // <— NEU
    ],
  };

  private parseAssignees(s?: string): number[] | undefined {
    if (!s || !s.trim()) return undefined;
    return s.split(",").map(x => Number(String(x).trim())).filter(n => Number.isFinite(n));
  }
  private toMs(input?: string): number | undefined {
    if (!input || !input.trim()) return undefined;
    const n = Number(input);
    if (Number.isFinite(n)) return n;
    const t = Date.parse(input);
    return Number.isFinite(t) ? t : undefined;
  }

  async execute(): Promise<void> {
    const started = Date.now();

    const token = String(this.wave.inputs.getInputValueByInputName(InputName.TOKEN) ?? "");
    const listId = String(this.wave.inputs.getInputValueByInputName(InputName.LIST_ID) ?? "").trim();
    const name = String(this.wave.inputs.getInputValueByInputName(InputName.NAME) ?? "").trim();
    const description = this.wave.inputs.getInputValueByInputName(InputName.DESCRIPTION) as string | undefined;
    const status = this.wave.inputs.getInputValueByInputName(InputName.STATUS) as string | undefined;
    const assigneesCsv = this.wave.inputs.getInputValueByInputName(InputName.ASSIGNEES) as string | undefined;
    const due = this.wave.inputs.getInputValueByInputName(InputName.DUE_DATE) as string | undefined;
    const priority = this.wave.inputs.getInputValueByInputName(InputName.PRIORITY) as number | undefined;
    const notifyAll = (this.wave.inputs.getInputValueByInputName(InputName.NOTIFY_ALL) as boolean) ?? false;

    const url = `${BASE}/list/${encodeURIComponent(listId)}/task`;

    const body: any = { name, notify_all: notifyAll };
    if (description) body.description = description;
    if (status) body.status = status;
    const assignees = this.parseAssignees(assigneesCsv);
    if (assignees?.length) body.assignees = assignees;
    const dueMs = this.toMs(due);
    if (typeof dueMs === "number") {
      body.due_date = dueMs;
      // due_date_time kann optional gesetzt werden – wir erkennen es heuristisch am ISO-String:
      if (due && !/^\d+$/.test(due)) body.due_date_time = true;
    }
    if (priority && [1,2,3,4].includes(priority)) body.priority = priority;

    const res = await axios.request({
      method: "POST",
      url,
      headers: { Authorization: token, "Content-Type": "application/json", Accept: "application/json" },
      data: body,
      validateStatus: () => true,
    });
let taskId = "";
let parsed: any = null;

try {
  parsed = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
} catch {
  parsed = null;
}

if (parsed && typeof parsed === "object") {
  // ClickUp-Create liefert die ID ganz oben als 'id'
  taskId = String(
    parsed.id ??
    parsed.task_id ??
    parsed?.task?.id ??
    parsed?.data?.id ??
    ""
  );
}
   

    this.wave.outputs.setOutput(OutputName.STATUS, res.status);
    this.wave.outputs.setOutput(OutputName.TASK_ID, taskId);
    this.wave.outputs.setOutput(OutputName.HEADERS, res.headers || {});
    this.wave.outputs.setOutput(OutputName.BODY, typeof res.data === "string" ? res.data : JSON.stringify(res.data ?? ""));
    this.wave.outputs.setOutput(OutputName.RUN_TIME, Date.now() - started);

    if (res.status >= 400) throw new Error(`HTTP ${res.status} POST ${url}`);
  }
}
