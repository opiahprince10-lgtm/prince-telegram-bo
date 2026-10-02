require("dotenv").config();

const { Bot } = require("node-telegram-bot-api");
const OpenAI = require("openai");

const telegramToken = process.env.BOT_TOKEN;
const openaiKey = process.env.OPENAI_API_KEY;

if (!telegramToken) {
    console.error("❌ BOT_TOKEN is missing from .env");
    process.exit(1);
}

if (!openaiKey) {
    console.error("❌ OPENAI_API_KEY is missing from .env");
    process.exit(1);
}

const bot = new Bot(telegramToken);

const openai = new OpenAI({
    apiKey: openaiKey
});

console.log("🤖 Prince Telegram Bot is starting...");

// ==============================
// /START
// ==============================

bot.command("start", async (ctx) => {
    await ctx.reply(
        `👑 Welcome to Prince Bot!

Hello ${ctx.from?.first_name || "Prince"} ❤️

I'm your personal assistant.

Choose an option below:`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "🤖 AI Assistant",
                            callback_data: "ai"
                        }
                    ],
                    [
                        {
                            text: "💻 Code Generator",
                            callback_data: "code"
                        }
                    ],
                    [
                        {
                            text: "ℹ️ About",
                            callback_data: "about"
                        }
                    ]
                ]
            }
        }
    );
});

// ==============================
// BUTTONS
// ==============================

bot.on("callback_query", async (ctx) => {
    const data = ctx.callbackQuery?.data;

    await ctx.answerCallbackQuery();

    if (data === "ai") {
        await ctx.reply(
            `🤖 AI Assistant is ready!

Send me any question and I'll answer it. 💬`
        );
    }

    if (data === "code") {
        await ctx.reply(
            `💻 Code Generator

This feature is coming next. 🔥`
        );
    }

    if (data === "about") {
        await ctx.reply(
            `👑 Prince Bot

🤖 Personal AI Telegram Bot
💻 Built with Node.js
🚀 Version 1.0`
        );
    }
});

// ==============================
// AI CHAT
// ==============================

bot.on("message", async (ctx) => {
    const text = ctx.message?.text;

    if (!text) {
        return;
    }

    // Ignore commands
    if (text.startsWith("/")) {
        return;
    }

    try {
        await ctx.reply("🤔 Thinking...");

        const response = await openai.responses.create({
            model: "gpt-6-luna",
            input: [
                {
                    role: "user",
                    content: text
                }
            ]
        });

        const answer = response.output_text;

        if (!answer) {
            await ctx.reply("❌ I couldn't generate a response.");
            return;
        }

        await ctx.reply(answer);

    } catch (error) {
        console.error("❌ OpenAI error:", error);

        await ctx.reply(
            "❌ Something went wrong while contacting the AI."
        );
    }
});

// ==============================
// ERROR HANDLER
// ==============================

bot.catch((error) => {
    console.error("❌ Telegram bot error:", error);
});

// ==============================
// START BOT
// ==============================

bot.startPolling()
    .then(() => {
        console.log("✅ Prince Bot is now running!");
    })
    .catch((error) => {
        console.error("❌ Failed to start bot:", error);
    });