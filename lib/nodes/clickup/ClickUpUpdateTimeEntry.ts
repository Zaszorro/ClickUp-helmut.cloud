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
  TEAM_ID = "Team ID (Workspace)",
  TIMER_ID = "Time Entry ID",
  TASK_ID = "Task ID (optional)",
  START = "Start (ms or ISO, optional)",
  END = "End (ms or ISO, optional)",
  DURATION = "Duration in ms (optional)",
  DESCRIPTION = "Description (optional)",
  BILLABLE = "Billable (optional)",
  TAGS = "Tags (comma-separated, optional)",
}

enum OutputName {
  STATUS = "Status code",
  HEADERS = "Headers",
  BODY = "Body",
  RUN_TIME = "Run time",
  TIME_ENTRY_ID = "Time Entry ID",
}

export default class ClickUpUpdateTimeEntry extends Node {
  specification = {
    specVersion: 2,
    name: "ClickUp Update Time Entry",
    originalName: "ClickUp Update Time Entry",
    description: "Updates a time entry via PUT /team/{team_id}/time_entries/{timer_id}",
    kind: "NODE",
    category: "ClickUp",
    color: "node-aquaGreen",
    version: { major: 1, minor: 0, patch: 0, changelog: ["Initial"] },
    author: {
      name: "David Merzenich",
      company: "MSP GmbH",
      email: "d.merzenich@moovit-sp.com",
    },
    inputs: [
      { name: InputName.TOKEN, description: "Enter your ClickUp API token", type: "STRING_PASSWORD" as InputType, example: "pk_...", mandatory: true },
      { name: InputName.TEAM_ID, description: "Workspace (team) ID", type: "STRING" as InputType, example: "9010065123", mandatory: true },
      { name: InputName.TIMER_ID, description: "Time entry id to update", type: "STRING" as InputType, example: "time_abc", mandatory: true },
      { name: InputName.TASK_ID, description: "Associate with a task", type: "STRING" as InputType, example: "9hcxq" },
      { name: InputName.START, description: "Start time of entry", type: "STRING" as InputType, example: "2025-10-13T08:15:00Z" },
      { name: InputName.END, description: "End time of entry", type: "STRING" as InputType, example: "2025-10-13T09:00:00Z" },
      { name: InputName.DURATION, description: "Duration in milliseconds", type: "NUMBER" as InputType, example: 2700000 },
      { name: InputName.DESCRIPTION, description: "Description", type: "STRING_LONG" as InputType, example: "Review" },
      { name: InputName.BILLABLE, description: "Billable?", type: "BOOLEAN" as InputType, example: true },
      { name: InputName.TAGS, description: "Comma-separated labels", type: "STRING" as InputType, example: "clientA,internal" },
    ],
    outputs: [
      { name: OutputName.STATUS, description: "HTTP status", type: "NUMBER" as OutputType },
      { name: OutputName.HEADERS, description: "Response headers", type: "STRING_MAP" as OutputType },
      { name: OutputName.BODY, description: "Response body as string", type: "STRING" as OutputType },
      { name: OutputName.RUN_TIME, description: "Execution time (ms)", type: "NUMBER" as OutputType },
      { name: OutputName.TIME_ENTRY_ID, description: "Updated ClickUp time entry id", type: "STRING", example: "time_abc" },
    ],
  };

  private toMs(input?: string | number): number | undefined {
    if (input === undefined || input === null) return undefined;
    if (typeof input === "number" && Number.isFinite(input)) return input;
    const s = String(input).trim();
    if (!s) return undefined;
    const n = Number(s);
    if (Number.isFinite(n)) return n;
    const t = Date.parse(s);
    return Number.isFinite(t) ? t : undefined;
  }
  private parseTags(input?: string): string[] | undefined {
    if (!input?.trim()) return undefined;
    return input.split(",").map(t => t.trim()).filter(Boolean);
  }

  async execute(): Promise<void> {
    const started = Date.now();

    const token = String(this.wave.inputs.getInputValueByInputName(InputName.TOKEN) ?? "");
    const teamId = String(this.wave.inputs.getInputValueByInputName(InputName.TEAM_ID) ?? "").trim();
    const timerId = String(this.wave.inputs.getInputValueByInputName(InputName.TIMER_ID) ?? "").trim();
    const taskId = this.wave.inputs.getInputValueByInputName(InputName.TASK_ID) as string | undefined;
    const startIn = this.wave.inputs.getInputValueByInputName(InputName.START) as string | number | undefined;
    const endIn = this.wave.inputs.getInputValueByInputName(InputName.END) as string | number | undefined;
    const duration = this.wave.inputs.getInputValueByInputName(InputName.DURATION) as number | undefined;
    const description = this.wave.inputs.getInputValueByInputName(InputName.DESCRIPTION) as string | undefined;
    const billable = this.wave.inputs.getInputValueByInputName(InputName.BILLABLE) as boolean | undefined;
    const tagsCsv = this.wave.inputs.getInputValueByInputName(InputName.TAGS) as string | undefined;

    const url = `${BASE}/team/${encodeURIComponent(teamId)}/time_entries/${encodeURIComponent(timerId)}`;

    const body: any = {};
    const startMs = this.toMs(startIn);
    const endMs = this.toMs(endIn);
    if (typeof startMs === "number") body.start = startMs;
    if (typeof endMs === "number") body.end = endMs;
    if (typeof duration === "number") body.duration = duration;
    if (taskId) body.tid = taskId;
    if (description) body.description = description;
    if (typeof billable === "boolean") body.billable = billable;
    const tags = this.parseTags(tagsCsv);
    if (tags?.length) body.tags = tags;

    const res = await axios.request({
      method: "PUT",
      url,
      headers: { Authorization: token, "Content-Type": "application/json", Accept: "application/json" },
      data: body,
      validateStatus: () => true,
    });

    let timeId = timerId;
    let parsed: any = null;
    try { parsed = typeof res.data === "string" ? JSON.parse(res.data) : res.data; } catch {}
    if (parsed && typeof parsed === "object") {
      timeId = String(parsed.id ?? parsed.timer_id ?? parsed?.data?.id ?? parsed?.time_entry?.id ?? timeId);
    }

    this.wave.outputs.setOutput(OutputName.STATUS, res.status);
    this.wave.outputs.setOutput(OutputName.TIME_ENTRY_ID, timeId);
    this.wave.outputs.setOutput(OutputName.HEADERS, res.headers || {});
    this.wave.outputs.setOutput(OutputName.BODY, typeof res.data === "string" ? res.data : JSON.stringify(res.data ?? ""));
    this.wave.outputs.setOutput(OutputName.RUN_TIME, Date.now() - started);

    if (res.status >= 400) throw new Error(`HTTP ${res.status} PUT ${url}`);
  }
}
