import { NextRequest } from "next/server";
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { createTRPCContext } from "~/server/api/trpc";
import { createCaller } from "~/server/api/root";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const ctx = await createTRPCContext(req);
    const caller = createCaller(ctx);

    switch (evt.type) {
        case "user.created": {
            const user = evt.data;

            const name = user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null;
            const email = user.email_addresses?.[0]?.email_address ?? null;

            if (!name || !email) { console.warn('Skipping user.created webhook due to missing name or email'); break; }

            await caller.users.create({
                name: name,
                email: email,
                clerk_id: user.id,
            });
            break;
        }

        case "user.updated": {
            const user = evt.data;

            const name = user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null;
            const email = user.email_addresses?.[0]?.email_address ?? null;

            if (!name || !email) { console.warn('Skipping user.updated webhook due to empty name or email'); break; }

            await caller.users.update({
                clerk_id: user.id,
                data: {
                    name: name,
                    email: email,
                },
            });
            break;
        }

        case "user.deleted": {
            const user = evt.data;

            if (!user.id) { console.warn("user.deleted webhook received without an ID"); break; }

            await caller.users.delete({ clerk_id: user.id });
            break;
        }
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}