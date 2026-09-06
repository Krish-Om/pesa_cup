import type { Request, Response } from "express"
import { eventBus } from "../../utils/event-bus"

export function streamLiveScore(req: Request, res: Response) :Promise<void> {
	const token = req.query.token;

	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive")
	res.setHeader("X-Accel-Buffering", "no")
	res.flushHeaders();

	res.write(`data: ${JSON.stringify({ type: "CONNECTED", message: "Live score stream established" })}\n\n`)

	const handleFixtureUpdate = (payload: { fixtureId: number; homeScore: number; awayScore: number; status: string }) => {
		res.write(`data: ${JSON.stringify({ type: "SCORE_UPDATE", data: payload })}\n\n`)
	}

	eventBus.on("fixture_updated", handleFixtureUpdate);

	const heartBeateInterval = setInterval(() => {
		res.write(`:ping\n\n`)
	}, 30000)

	req.on("close", () => {
		clearInterval(heartBeateInterval);
		eventBus.off("fixture_updated", handleFixtureUpdate)
		res.end();
	})
}
