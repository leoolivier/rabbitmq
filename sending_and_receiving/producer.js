import { AMQPClient } from "@cloudamqp/amqp-client";
import { nanoid } from "nanoid";

async function run() {
	try {
		const amqp = new AMQPClient("amqp://localhost");
		const conn = await amqp.connect();
		const ch = await conn.channel();
		const q = await ch.queue("wecraft", { durable: true });
		for (let i = 0; i < 20; i++) {
			setTimeout(async () => {
				await q.publish(nanoid(), { deliveryMode: 2 })
			}, i * 1500);
		}
	} catch (e) {
		console.error("ERROR", e);
		e.connection.close();
		setTimeout(run, 1000);
	}
}

run();
