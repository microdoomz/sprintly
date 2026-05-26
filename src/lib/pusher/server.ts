import Pusher from "pusher";

let pusherInstance: Pusher | null = null;

export function getPusherServer(): Pusher | null {
  if (
    !process.env.PUSHER_APP_ID ||
    !process.env.PUSHER_KEY ||
    !process.env.PUSHER_SECRET
  ) {
    return null;
  }

  if (!pusherInstance) {
    pusherInstance = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER || "ap2",
      useTLS: true,
    });
  }

  return pusherInstance;
}

// Helper to trigger events safely (no-op if Pusher not configured)
export async function triggerEvent(
  channel: string,
  event: string,
  data: unknown
) {
  const pusher = getPusherServer();
  if (!pusher) return;

  try {
    await pusher.trigger(channel, event, data);
  } catch (error) {
    console.error("Pusher trigger error:", error);
  }
}
