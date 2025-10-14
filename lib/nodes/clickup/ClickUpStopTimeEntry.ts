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
  END = "End (ms or ISO, optional)",
}

enum OutputName {
  STATUS = "Status code",
  HEADERS = "Headers",
  BODY = "Body",
  RUN_TIME = "Run time",
  TIME_ENTRY_ID = "Time Entry ID",
}

export default class ClickUpStopTimeEntry extends Node {
  specification = {
    specVersion: 2,
    name: "ClickUp Stop Time Entry",
    originalName: "ClickUp Stop Time Entry",
    description: "Stops the current timer via POST /team/{team_id}/time_entries/stop",
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
      { name: InputName.END, description: "Custom end time (defaults to now if omitted)", type: "STRING" as InputType, example: "2025-10-13T09:45:00Z" },
    ],
    outputs: [
      { name: OutputName.STATUS, description: "HTTP status", type: "NUMBER" as OutputType },
      { name: OutputName.HEADERS, description: "Response headers", type: "STRING_MAP" as OutputType },
      { name: OutputName.BODY, description: "Response body as string", type: "STRING" as OutputType },
      { name: OutputName.RUN_TIME, description: "Execution time (ms)", type: "NUMBER" as OutputType },
      { name: OutputName.TIME_ENTRY_ID, description: "Stopped ClickUp time entry id", type: "STRING", example: "time_abc" },
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

  async execute(): Promise<void> {
    const started = Date.now();

    const token = String(this.wave.inputs.getInputValueByInputName(InputName.TOKEN) ?? "");
    const teamId = String(this.wave.inputs.getInputValueByInputName(InputName.TEAM_ID) ?? "").trim();
    const endIn = this.wave.inputs.getInputValueByInputName(InputName.END) as string | number | undefined;

    const url = `${BASE}/team/${encodeURIComponent(teamId)}/time_entries/stop`;

    const body: any = {};
    const endMs = this.toMs(endIn);
    if (typeof endMs === "number") body.end = endMs;

    const res = await axios.request({
      method: "POST",
      url,
      headers: { Authorization: token, "Content-Type": "application/json", Accept: "application/json" },
      data: body,
      validateStatus: () => true,
    });

    let timeId = "";
    let parsed: any = null;
    try { parsed = typeof res.data === "string" ? JSON.parse(res.data) : res.data; } catch {}
    if (parsed && typeof parsed === "object") {
      timeId = String(parsed.id ?? parsed.timer_id ?? parsed?.data?.id ?? parsed?.time_entry?.id ?? "");
    }

    this.wave.outputs.setOutput(OutputName.STATUS, res.status);
    this.wave.outputs.setOutput(OutputName.TIME_ENTRY_ID, timeId);
    this.wave.outputs.setOutput(OutputName.HEADERS, res.headers || {});
    this.wave.outputs.setOutput(OutputName.BODY, typeof res.data === "string" ? res.data : JSON.stringify(res.data ?? ""));
    this.wave.outputs.setOutput(OutputName.RUN_TIME, Date.now() - started);

    if (res.status >= 400) throw new Error(`HTTP ${res.status} POST ${url}`);
  }
}
