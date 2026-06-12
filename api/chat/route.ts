import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";


const ai = new GoogleGenAI({});

export async function POST(req: NextRequest) {
  try {
    const { history } = await req.json();

    if (!history || !Array.isArray(history)) {
      return NextResponse.json(
        { error: "История чата (history) обязательна и должна быть массивом" },
        { status: 400 }
      );
    }

    
    const lastMessage = history[history.length - 1];
    const userPrompt = lastMessage?.parts?.[0]?.text;

    if (!userPrompt) {
      return NextResponse.json(
        { error: "Промпт не найден в последнем сообщении" },
        { status: 400 }
      );
    }

    
    
    const formattedHistory = history.slice(0, -1).map((msg) => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.parts[0].text }],
    }));

    
    const chat = ai.chats.create({
      model: "gemini-2.5-flash", 
      history: formattedHistory,
    });

    
    const responseStream = await chat.sendMessageStream({
      message: userPrompt,
    });

    
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          
          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });

  } catch (error: any) {
    console.error("Ошибка в работе API Gemini:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера при генерации ответа" },
      { status: 500 }
    );
  }
}