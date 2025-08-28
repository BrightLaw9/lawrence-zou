import OpenAI from "openai";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function readFileSafe(filePath: string) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (err) {
    // return null if file doesn't exist or can't be read
    return null;
  }
}

const tools = [
    {
        type: "function",
        function: { 
            name: "readIndustryExperience",
            description: "Reads the industry experiences that Lawrence has. Note that in these experiences may have some skills listed."
        }
    },
    {
        type: "function",
        function: { 
            name: "readProjects",
            description: "Reads the projects that Lawrence has worked on",
        }
    },
    {
        type: "function",
        function: { 
            name: "readOverallExperience",
            description: "Reads the overall experience, including education, awards, and notable achievements.",
        }
    },
    {
        type: "function",
        function: { 
            name: "readInterests",
            description: "Reads the interests and what resonates with Lawrence. Gets his values and hobbies.",
        }
    },
    {
        type: "function",
        function: {
            name: "readStartupExperience",
            description: "Reads the startups that Lawrence is working on. Including hardware startup and high student job startup",
        }
    }
]

async function readIndustryExperience() { 
    const industryExperiencePath = path.resolve("app/api/openai/data/industry_experience.json");
    return await readFileSafe(industryExperiencePath);
}

async function readProjects() {
    const projectsPath = path.resolve("app/api/openai/data/projects.json");
    return await readFileSafe(projectsPath);
}

async function readOverallExperience() {
    const overallExperiencePath = path.resolve("app/api/openai/data/overall.json");
    return await readFileSafe(overallExperiencePath);
}

async function readInterests() {
    const interestsPath = path.resolve("app/api/openai/data/interests.json");
    return await readFileSafe(interestsPath);
}

async function readStartupExperience() {
    const startupExperiencePath = path.resolve("app/api/openai/data/startups.json");
    return await readFileSafe(startupExperiencePath);
}

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // read system prompt from ./data/system_prompt.txt relative to the current working directory
  const systemPromptPath = path.resolve("app/api/openai/data/system_prompt.txt");
  const system_prompt = (await readFileSafe(systemPromptPath)) || "";

  // include the system prompt (if any) as the system message; user prompt follows
  const messages = [] as { role: string; tool_call_id?: string; content: string }[];
  if (system_prompt) messages.push({ role: "system", content: system_prompt });
  messages.push({ role: "user", content: prompt });

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: messages as any,
    tools: tools as any,
  });

  const choice = completion.choices[0].message;
  console.log("First completion message", choice);

  const tool_calls_res = [];

  // Check if the model requested a tool call
  if (choice.tool_calls?.length) {
    for (const toolCall of choice.tool_calls) {
      const fn = toolCall.function;
      // console.log("Tool call requested:", fn.name, fn.arguments);
      if (fn.name === "readIndustryExperience") {
        tool_calls_res.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content:  await readIndustryExperience() ?? ""
        });
      }
      else if (fn.name === "readProjects") {
        tool_calls_res.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content:  await readProjects() ?? ""
        });
      }
      else if (fn.name === "readOverallExperience") {
        tool_calls_res.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content:  await readOverallExperience() ?? ""
        });
      }
      else if (fn.name === "readInterests") {
        tool_calls_res.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content:  await readInterests() ?? ""
        });
      }
      else if (fn.name === "readStartupExperience") {
        tool_calls_res.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content:  await readStartupExperience() ?? ""
        });
      }
    }
    // console.log("Following up");
    // Optionally send the result back to the model for further reasoning
    const followUp = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
        ...messages,
        choice,
        ...tool_calls_res,
        {
          role: "user", 
          content: "Based on the tool response, take the json and rank it to the relevance of the user's original query.\
          Ideally top 3 but more or less can be provided depending on relevance. cardDirection should be horizontal for industryExperience, and projects is vertical.\
          The rest can be decided which direction is the most appropriate of horizontal and vertical to format.\
          Your response should follow the form: {\"text\": \"general text answering user's query\", \"cards\": <entries in the tool call ranked>, \"cardDirection\": \"horizontal\" | \"vertical\"}",
        }
    ] as any,
    });
    return NextResponse.json(followUp.choices[0].message.content);
  }

  return NextResponse.json({ text: choice.content });
}