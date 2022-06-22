import { AMQPClient } from "@cloudamqp/amqp-client";

async function run() {
	try {
		const amqp = new AMQPClient("amqp://localhost");
		const conn = await amqp.connect();
		const ch = await conn.channel();
		await ch.exchangeDeclare("logs", "fanout", { durable: false });
        const q = await ch.queue("", { exclusive: true });
        await q.bind("logs");
        const consumer = await q.subscribe({ noAck: true }, async (msg) => {
            console.log(msg.bodyToString());
        });
		await consumer.wait();
	} catch (e) {
		console.error("ERROR", e);
		e.connection.close();
		setTimeout(run, 1000);
	}
}

run();
