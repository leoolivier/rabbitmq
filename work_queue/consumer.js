import { AMQPClient } from "@cloudamqp/amqp-client";

async function run() {
	try {
		const amqp = new AMQPClient("amqp://localhost");
		const conn = await amqp.connect();
		const ch = await conn.channel();
		const q = await ch.queue("patate");
		ch.prefetch(1);
		const consumer = await q.subscribe({ noAck: false }, async (msg) => {
			const secs = msg.bodyToString().split(".").length - 1;
			console.log(msg.bodyToString());
			setTimeout(() => {
				console.log("[x] Done");
				msg.ack();
			}, secs * 1000);
		});
		await consumer.wait();
	} catch (e) {
		console.error("ERROR", e);
		e.connection.close();
		setTimeout(run, 1000);
	}
}

run();
