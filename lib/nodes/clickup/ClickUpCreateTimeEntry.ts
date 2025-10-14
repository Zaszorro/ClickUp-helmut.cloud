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
  TEAM_ID = "Team ID (Workspace)",
  TASK_ID = "Task ID (optional)",
  START = "Start (ms or ISO, optional)",
  END = "End (ms or ISO, optional)",
  DURATION = "Duration in ms (optional)",
  DESCRIPTION = "Description (optional)",
  BILLABLE = "Billable (optional)",
  TAGS = "Tags (comma-separated, optional)",
  START_NOW = "Start now (override START)", // steuert, ob Date.now() verwendet wird
}

enum OutputName {
  STATUS = "Status code",
  HEADERS = "Headers",
  BODY = "Body",
  RUN_TIME = "Run time",
  TIME_ENTRY_ID = "Time Entry ID",
}

export default class ClickUpCreateTimeEntry extends Node {
  specification = {
    specVersion: 2,
    name: "ClickUp Create Time Entry",
    originalName: "ClickUp Create Time Entry",
    description: "Creates a time entry via POST /team/{team_id}/time_entries",
    kind: "NODE",
    category: "ClickUp Time Entries",
    color: "node-aquaGreen",
    version: { major: 1, minor: 1, patch: 0, changelog: ["First release"] },
    author: {
      name: "David Merzenich",
      company: "MSP GmbH",
      email: "d.merzenich@moovit-sp.com",
    },
    inputs: [
      { name: InputName.TOKEN, description: "Enter your ClickUp API token", type: "STRING_PASSWORD" as InputType, example: "pk_...", mandatory: true },
      { name: InputName.TEAM_ID, description: "Workspace (team) ID", type: "STRING" as InputType, example: "9010065123", mandatory: true },
      { name: InputName.TASK_ID, description: "Associate with a task", type: "STRING" as InputType, example: "9hcxq" },
      { name: InputName.START, description: "Start time (used only if START_NOW=false)", type: "STRING" as InputType, example: "2025-10-13T08:15:00Z" },
      { name: InputName.END, description: "End time", type: "STRING" as InputType, example: "2025-10-13T09:00:00Z" },
      { name: InputName.DURATION, description: "Duration in milliseconds (optional)", type: "NUMBER" as InputType, example: 2700000 },
      { name: InputName.DESCRIPTION, description: "Description", type: "STRING_LONG" as InputType, example: "Standup + Review" },
      { name: InputName.BILLABLE, description: "Billable?", type: "BOOLEAN" as InputType, example: true },
      { name: InputName.TAGS, description: "Comma-separated labels", type: "STRING" as InputType, example: "clientA,internal" },
      { name: InputName.START_NOW,description: "If true or unset, uses the node's execution time as start",type: "BOOLEAN" as InputType,example: true,},
    ],
    outputs: [
      { name: OutputName.STATUS, description: "HTTP status", type: "NUMBER" as OutputType, example: 200 },
      { name: OutputName.HEADERS, description: "Response headers", type: "STRING_MAP" as OutputType, example: { "Content-Type": "application/json" } },
      { name: OutputName.BODY, description: "Response body as string", type: "STRING" as OutputType, example: "{\"id\":\"time_abc\"}" },
      { name: OutputName.RUN_TIME, description: "Execution time (ms)", type: "NUMBER" as OutputType, example: 120 },
      { name: OutputName.TIME_ENTRY_ID, description: "Created ClickUp time entry id", type: "STRING", example: "time_abc" },
    ],
  };

  // Helpers
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

    // Inputs
    const token = String(this.wave.inputs.getInputValueByInputName(InputName.TOKEN) ?? "");
    const teamId = String(this.wave.inputs.getInputValueByInputName(InputName.TEAM_ID) ?? "").trim();
    const taskId = this.wave.inputs.getInputValueByInputName(InputName.TASK_ID) as string | undefined;
    const startIn = this.wave.inputs.getInputValueByInputName(InputName.START) as string | number | undefined;
    const endIn = this.wave.inputs.getInputValueByInputName(InputName.END) as string | number | undefined;
    const duration = this.wave.inputs.getInputValueByInputName(InputName.DURATION) as number | undefined;
    const description = this.wave.inputs.getInputValueByInputName(InputName.DESCRIPTION) as string | undefined;
    const billable = this.wave.inputs.getInputValueByInputName(InputName.BILLABLE) as boolean | undefined;
    const tagsCsv = this.wave.inputs.getInputValueByInputName(InputName.TAGS) as string | undefined;
    const startNow = this.wave.inputs.getInputValueByInputName(InputName.START_NOW) as boolean | undefined;

    // URL
    const url = `${BASE}/team/${encodeURIComponent(teamId)}/time_entries`;

    // Body
    const body: any = {};
    // Priorität: START_NOW !== false => Date.now(), sonst START parsen
    const startMs = (startNow !== false) ? Date.now() : this.toMs(startIn);
    const endMs = this.toMs(endIn);

    if (typeof startMs === "number") body.start = startMs;
    if (typeof endMs === "number") body.end = endMs;
    if (typeof duration === "number") body.duration = duration;
    if (taskId) body.tid = taskId;
    if (description) body.description = description;
    if (typeof billable === "boolean") body.billable = billable;
    const tags = this.parseTags(tagsCsv);
    if (tags?.length) body.tags = tags;

    // Request
    const res = await axios.request({
      method: "POST",
      url,
      headers: { Authorization: token, "Content-Type": "application/json", Accept: "application/json" },
      data: body,
      validateStatus: () => true,
    });

    // ID robust extrahieren
    let timeId = "";
    let parsed: any = null;
    try { parsed = typeof res.data === "string" ? JSON.parse(res.data) : res.data; } catch {}
    if (parsed && typeof parsed === "object") {
      timeId = String(
        parsed.id ??
        parsed.timer_id ??
        parsed.time_entry_id ??
        parsed?.data?.id ??
        parsed?.time_entry?.id ??
        ""
      );
    }

    // Outputs
    this.wave.outputs.setOutput(OutputName.STATUS, res.status);
    this.wave.outputs.setOutput(OutputName.TIME_ENTRY_ID, timeId);
    this.wave.outputs.setOutput(OutputName.HEADERS, res.headers || {});
    this.wave.outputs.setOutput(OutputName.BODY, typeof res.data === "string" ? res.data : JSON.stringify(res.data ?? ""));
    this.wave.outputs.setOutput(OutputName.RUN_TIME, Date.now() - started);

    if (res.status >= 400) throw new Error(`HTTP ${res.status} POST ${url}`);
  }
}
