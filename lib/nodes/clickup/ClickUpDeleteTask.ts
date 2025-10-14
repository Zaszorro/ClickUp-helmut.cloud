import {
  StreamNodeSpecificationType,
  StreamNodeSpecificationPackage,
  StreamNodeSpecificationTag,
} from "hcloud-sdk/lib/interfaces/high5/wave";
import Node from "../../Node";
import axios from "axios";

type InputType = "STRING" | "STRING_PASSWORD";
type OutputType = "NUMBER" | "STRING" | "STRING_MAP";

const BASE = "https://api.clickup.com/api/v2";

enum InputName {
  TOKEN = "ClickUp API Token",
  TASK_ID = "Task ID",
}

enum OutputName {
  STATUS = "Status code",
  HEADERS = "Headers",
  BODY = "Body",
  RUN_TIME = "Run time",
}

export default class ClickUpDeleteTask extends Node {
  specification = {
    specVersion: 2,
    name: "ClickUp Delete Task",
    originalName: "ClickUp Delete Task",
    description: "Deletes a task via DELETE /task/{task_id}",
    kind: "NODE",
    category: "ClickUp Tasks",
    color: "node-aquaGreen",
    version: { major: 1, minor: 1, patch: 0, changelog: ["First release"] },
    author: {
      name: "David Merzenich",
      company: "MSP GmbH",
      email: "d.merzenich@moovit-sp.com",
    },
    inputs: [
      { name: InputName.TOKEN, description: "Enter your ClickUp API token", type: "STRING_PASSWORD" as InputType, example: "pk_..." , mandatory: true },
      { name: InputName.TASK_ID, description: "Task ID to delete", type: "STRING" as InputType, example: "8h5abc", mandatory: true },
    ],
    outputs: [
      { name: OutputName.STATUS, description: "HTTP status", type: "NUMBER" as OutputType, example: 204 },
      { name: OutputName.HEADERS, description: "Response headers", type: "STRING_MAP" as OutputType, example: { "Content-Type": "application/json" } },
      { name: OutputName.BODY, description: "Response body as string (often empty)", type: "STRING" as OutputType, example: "" },
      { name: OutputName.RUN_TIME, description: "Execution time (ms)", type: "NUMBER" as OutputType, example: 80 },
    ],
  };

  async execute(): Promise<void> {
    const started = Date.now();

    const token = String(this.wave.inputs.getInputValueByInputName(InputName.TOKEN) ?? "");
    const taskId = String(this.wave.inputs.getInputValueByInputName(InputName.TASK_ID) ?? "").trim();

    const url = `${BASE}/task/${encodeURIComponent(taskId)}`;

    const res = await axios.request({
      method: "DELETE",
      url,
      headers: { Authorization: token, Accept: "application/json" },
      validateStatus: () => true,
    });

    this.wave.outputs.setOutput(OutputName.STATUS, res.status);
    this.wave.outputs.setOutput(OutputName.HEADERS, res.headers || {});
    this.wave.outputs.setOutput(OutputName.BODY, typeof res.data === "string" ? res.data : JSON.stringify(res.data ?? ""));
    this.wave.outputs.setOutput(OutputName.RUN_TIME, Date.now() - started);

    if (res.status >= 400) throw new Error(`HTTP ${res.status} DELETE ${url}`);
  }
}
