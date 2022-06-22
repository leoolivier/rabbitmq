import { AMQPClient } from "@cloudamqp/amqp-client";
import { nanoid } from "nanoid";

async function run() {
	try {
		const amqp = new AMQPClient("amqp://localhost");
		const conn = await amqp.connect();
		const ch = await conn.channel();
		const q = await ch.queue("", { exclusive: true });
        const msg = process.argv.slice(2).join(' ') || "Hello World!";
		await q.publish(`${nanoid()}: ${msg}`, { deliveryMode: 1 })
        await conn.close();
	} catch (e) {
		console.error("ERROR", e);
		e.connection.close();
		setTimeout(run, 1000);
	}
}

run();
