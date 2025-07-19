export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "POST") {
      const body = await request.json();
      const messages = JSON.parse(await env.MESSAGES_KV.get("messages") || "[]");

      // الرسالة الجديدة
      messages.push({
        name: body.name,
        message: body.message,
        hideName: body.paid ? true : false,
        timestamp: Date.now()
      });

      await env.MESSAGES_KV.put("messages", JSON.stringify(messages));

      return new Response("✅ تم حفظ رسالتك بنجاح", { status: 200 });
    }

    if (request.method === "GET") {
      const today = new Date();
      const birthday = new Date(today.getFullYear(), 6, 17); // 17 يوليو

      if (today.getMonth() === birthday.getMonth() && today.getDate() === birthday.getDate()) {
        const messages = JSON.parse(await env.MESSAGES_KV.get("messages") || "[]");

        return Response.json(messages.map(msg => ({
          message: msg.message,
          name: msg.hideName ? "مجهول" : msg.name
        })));
      } else {
        return new Response("❌ الرسائل تظهر فقط يوم عيد الميلاد", { status: 403 });
      }
    }

    return new Response("Not allowed", { status: 405 });
  }
}