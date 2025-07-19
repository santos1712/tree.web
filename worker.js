export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // إنشاء مناسبة
    if (pathname === "/create" && request.method === "POST") {
      const body = await request.json();
      const eventId = Math.random().toString(36).substring(2, 8);
      const eventKey = `event:${eventId}`;
      const messagesKey = `messages:${eventId}`;

      await env.MESSAGES_KV.put(eventKey, JSON.stringify({
        name: body.name,
        occasion: body.occasion,
        date: body.date
      }));

      await env.MESSAGES_KV.put(messagesKey, JSON.stringify([]));

      return Response.json({ id: eventId });
    }

    // إرسال رسالة
    if (pathname.startsWith("/send") && request.method === "POST") {
      const id = url.searchParams.get("id");
      if (!id) return new Response("Invalid ID", { status: 400 });

      const key = `messages:${id}`;
      const body = await request.json();
      const messages = JSON.parse(await env.MESSAGES_KV.get(key) || "[]");

      messages.push({
        name: body.name,
        message: body.message,
        hideName: body.paid || false,
        timestamp: Date.now()
      });

      await env.MESSAGES_KV.put(key, JSON.stringify(messages));

      return new Response("تم الإرسال ✅");
    }

    // عرض الرسائل
    if (pathname.startsWith("/view") && request.method === "GET") {
      const id = url.searchParams.get("id");
      if (!id) return new Response("Invalid ID", { status: 400 });

      const eventKey = `event:${id}`;
      const messagesKey = `messages:${id}`;
      const event = JSON.parse(await env.MESSAGES_KV.get(eventKey) || "null");
      if (!event) return new Response("Not found", { status: 404 });

      const today = new Date().toISOString().split("T")[0];
      if (event.date !== today) {
        return new Response("❌ الرسائل تظهر فقط في تاريخ المناسبة", { status: 403 });
      }

      const messages = JSON.parse(await env.MESSAGES_KV.get(messagesKey) || "[]");

      return Response.json(messages.map(msg => ({
        message: msg.message,
        name: msg.hideName ? "مجهول" : msg.name
      })));
    }

    return new Response("Not found", { status: 404 });
  }
}