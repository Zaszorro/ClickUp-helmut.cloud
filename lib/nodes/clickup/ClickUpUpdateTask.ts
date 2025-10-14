import {
  StreamNodeSpecificationType,
  StreamNodeSpecificationPackage,
  StreamNodeSpecificationTag,
} from "hcloud-sdk/lib/interfaces/high5/wave";
import Node from "../../Node";
import axios from "axios";

type InputType = "STRING" | "STRING_PASSWORD" | "STRING_LONG" | "NUMBER" | "BOOLEAN";
type OutputType = "NUMBER" | "STRING" | "STRING_MAP";

const BASE = "https://api.clickup.com/api/v2";

enum InputName {
  TOKEN = "ClickUp API Token",
  TASK_ID = "Task ID",
  NAME = "Task name (optional)",
  DESCRIPTION = "Description (optional)",
  STATUS = "Status (optional)",
  PRIORITY = "Priority (1-4, optional)",
  DUE_DATE = "Due date (ms or ISO, optional)",
  ADD_ASSIGNEES = "Add assignees (comma-separated IDs, optional)",
  REMOVE_ASSIGNEES = "Remove assignees (comma-separated IDs, optional)",
  ARCHIVED = "Archived (optional)",
  NOTIFY_ALL = "Notify all (optional)",
}

enum OutputName {
  STATUS = "Status code",
  HEADERS = "Headers",
  BODY = "Body",
  RUN_TIME = "Run time",
}

export default class ClickUpUpdateTask extends Node {
  specification = {
    specVersion: 2,
    name: "ClickUp Update Task",
    originalName: "ClickUp Update Task",
    description: "Updates a task via PUT /task/{task_id} (partial body supported)",
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
      { name: InputName.TASK_ID, description: "Task ID to update", type: "STRING" as InputType, example: "8h5abc", mandatory: true },
      { name: InputName.NAME, description: "New name", type: "STRING" as InputType, example: "Renamed task" },
      { name: InputName.DESCRIPTION, description: "New description", type: "STRING_LONG" as InputType, example: "Updated..." },
      { name: InputName.STATUS, description: "New status", type: "STRING" as InputType, example: "complete" },
      { name: InputName.PRIORITY, description: "1 (urgent) to 4 (low)", type: "NUMBER" as InputType, example: 2 },
      { name: InputName.DUE_DATE, description: "ms timestamp, or ISO datetime", type: "STRING" as InputType, example: "1735689600000 or 2025-12-31T00:00:00Z" },
      { name: InputName.ADD_ASSIGNEES, description: "Comma-separated user IDs to add", type: "STRING" as InputType, example: "123,456" },
      { name: InputName.REMOVE_ASSIGNEES, description: "Comma-separated user IDs to remove", type: "STRING" as InputType, example: "789" },
      { name: InputName.ARCHIVED, description: "Archive task", type: "BOOLEAN" as InputType, example: false },
      { name: InputName.NOTIFY_ALL, description: "Notify watchers", type: "BOOLEAN" as InputType, example: false },
    ],
    outputs: [
      { name: OutputName.STATUS, description: "HTTP status", type: "NUMBER" as OutputType, example: 200 },
      { name: OutputName.HEADERS, description: "Response headers", type: "STRING_MAP" as OutputType, example: { "Content-Type": "application/json" } },
      { name: OutputName.BODY, description: "Response body as string", type: "STRING" as OutputType, example: "{\"id\":\"task_abc\"}" },
      { name: OutputName.RUN_TIME, description: "Execution time (ms)", type: "NUMBER" as OutputType, example: 120 },
    ],
  };

  private parseIds(s?: string): number[] | undefined {
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
    const taskId = String(this.wave.inputs.getInputValueByInputName(InputName.TASK_ID) ?? "").trim();

    const name = this.wave.inputs.getInputValueByInputName(InputName.NAME) as string | undefined;
    const description = this.wave.inputs.getInputValueByInputName(InputName.DESCRIPTION) as string | undefined;
    const status = this.wave.inputs.getInputValueByInputName(InputName.STATUS) as string | undefined;
    const priority = this.wave.inputs.getInputValueByInputName(InputName.PRIORITY) as number | undefined;
    const due = this.wave.inputs.getInputValueByInputName(InputName.DUE_DATE) as string | undefined;
    const addAssigneesCsv = this.wave.inputs.getInputValueByInputName(InputName.ADD_ASSIGNEES) as string | undefined;
    const removeAssigneesCsv = this.wave.inputs.getInputValueByInputName(InputName.REMOVE_ASSIGNEES) as string | undefined;
    const archived = this.wave.inputs.getInputValueByInputName(InputName.ARCHIVED) as boolean | undefined;
    const notifyAll = (this.wave.inputs.getInputValueByInputName(InputName.NOTIFY_ALL) as boolean) ?? false;

    const url = `${BASE}/task/${encodeURIComponent(taskId)}`;

    const body: any = { notify_all: notifyAll };
    if (name) body.name = name;
    if (description) body.description = description;
    if (status) body.status = status;
    if (priority && [1,2,3,4].includes(priority)) body.priority = priority;

    const dueMs = this.toMs(due);
    if (typeof dueMs === "number") {
      body.due_date = dueMs;
      if (due && !/^\d+$/.test(due)) body.due_date_time = true;
    }

    const addA = this.parseIds(addAssigneesCsv);
    if (addA?.length) body.add_assignees = addA;
    const remA = this.parseIds(removeAssigneesCsv);
    if (remA?.length) body.remove_assignees = remA;

    if (typeof archived === "boolean") body.archived = archived;

    const res = await axios.request({
      method: "PUT",
      url,
      headers: { Authorization: token, "Content-Type": "application/json", Accept: "application/json" },
      data: body,
      validateStatus: () => true,
    });

    this.wave.outputs.setOutput(OutputName.STATUS, res.status);
    this.wave.outputs.setOutput(OutputName.HEADERS, res.headers || {});
    this.wave.outputs.setOutput(OutputName.BODY, typeof res.data === "string" ? res.data : JSON.stringify(res.data ?? ""));
    this.wave.outputs.setOutput(OutputName.RUN_TIME, Date.now() - started);

    if (res.status >= 400) throw new Error(`HTTP ${res.status} PUT ${url}`);
  }
}
