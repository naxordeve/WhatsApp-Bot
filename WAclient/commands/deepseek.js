const axios = require("axios");
var { commands } = require("../../lib/commands");

Command({
  cmd_name: "deepseek",
  category: "AI",
  desc: "Chat with DeepSeek AI",
  })(async (msg) => {
    if (!msg.text) return msg.send("_Please provide a q_");
    let { data } = await axios
      .post("https://ai.clauodflare.workers.dev/chat", {
        model: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
        messages: [{ role: "user", content: msg.text }],
      })
      .catch((e) => e.response);
       let res = data.data.response.split("</think>").pop().trim();
       await msg.send(res);
  });
