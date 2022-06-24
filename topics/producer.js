import { AMQPClient } from "@cloudamqp/amqp-client";
import { nanoid } from "nanoid";

async function run() {
	try {
		const amqp = new AMQPClient("amqp://localhost");
		const conn = await amqp.connect();
		const ch = await conn.channel();
		await ch.exchangeDeclare("notification", "topic", { durable: false });
        await ch.basicPublish("notification", "quick.rabbit.pink", Buffer.from(nanoid()));
        await conn.close();
	} catch (e) {
		console.error("ERROR", e);
		e.connection.close();
		setTimeout(run, 1000);
	}
}

run();
