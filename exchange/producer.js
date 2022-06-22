import { AMQPClient } from "@cloudamqp/amqp-client";
import { nanoid } from "nanoid";

async function run() {
	try {
		const amqp = new AMQPClient("amqp://localhost");
		const conn = await amqp.connect();
		const ch = await conn.channel();
		await ch.exchangeDeclare("logs", "fanout", { durable: false });
        for (let i = 0; i < 100; i++) {
            await ch.basicPublish("logs", "", Buffer.from(nanoid()));
        }
        await conn.close();
	} catch (e) {
		console.error("ERROR", e);
		e.connection.close();
		setTimeout(run, 1000);
	}
}

run();
