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
}

enum OutputName {
  STATUS = "Status code",
  HEADERS = "Headers",
  BODY = "Body",
  RUN_TIME = "Run time",
  TIME_ENTRY_ID = "Time Entry ID",
}

export default class ClickUpDeleteTimeEntry extends Node {
  specification = {
    specVersion: 2,
    name: "ClickUp Delete Time Entry",
    originalName: "ClickUp Delete Time Entry",
    description: "Deletes a time entry via DELETE /team/{team_id}/time_entries/{timer_id}",
    kind: "NODE",
    category: "ClickUp Time Entries",
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
      { name: InputName.TIMER_ID, description: "Time entry id to delete", type: "STRING" as InputType, example: "time_abc", mandatory: true },
    ],
    outputs: [
      { name: OutputName.STATUS, description: "HTTP status", type: "NUMBER" as OutputType },
      { name: OutputName.HEADERS, description: "Response headers", type: "STRING_MAP" as OutputType },
      { name: OutputName.BODY, description: "Response body as string", type: "STRING" as OutputType },
      { name: OutputName.RUN_TIME, description: "Execution time (ms)", type: "NUMBER" as OutputType },
      { name: OutputName.TIME_ENTRY_ID, description: "Deleted ClickUp time entry id", type: "STRING", example: "time_abc" },
    ],
  };

  async execute(): Promise<void> {
    const started = Date.now();

    const token = String(this.wave.inputs.getInputValueByInputName(InputName.TOKEN) ?? "");
    const teamId = String(this.wave.inputs.getInputValueByInputName(InputName.TEAM_ID) ?? "").trim();
    const timerId = String(this.wave.inputs.getInputValueByInputName(InputName.TIMER_ID) ?? "").trim();

    const url = `${BASE}/team/${encodeURIComponent(teamId)}/time_entries/${encodeURIComponent(timerId)}`;

    const res = await axios.request({
      method: "DELETE",
      url,
      headers: { Authorization: token, Accept: "application/json" },
      validateStatus: () => true,
    });

    // Some DELETE endpoints return empty body; we still return the ID we tried to delete
    const bodyString = typeof res.data === "string" ? res.data : JSON.stringify(res.data ?? "");

    this.wave.outputs.setOutput(OutputName.STATUS, res.status);
    this.wave.outputs.setOutput(OutputName.TIME_ENTRY_ID, timerId);
    this.wave.outputs.setOutput(OutputName.HEADERS, res.headers || {});
    this.wave.outputs.setOutput(OutputName.BODY, bodyString);
    this.wave.outputs.setOutput(OutputName.RUN_TIME, Date.now() - started);

    if (res.status >= 400) throw new Error(`HTTP ${res.status} DELETE ${url}`);
  }
}
