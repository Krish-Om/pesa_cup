import type { Request, Response, NextFunction } from "express"

const activeConnections = new Map<string, number>();
const MAX_CONNECTIONS_PER_IP = 5;

export function sseConnectionLimiter(req: Request, res: Response, next: NextFunction) {
	const ip = req.ip || req.socket.remoteAddress || "unknown";
	const currentCount = activeConnections.get(ip) || 0;

	if (currentCount >= MAX_CONNECTIONS_PER_IP) {
		return res.status(429).json({success:false,message:"Too many open live streams from this IP address"})
	}

	activeConnections.set(ip, currentCount + 1);

	req.on("close", () => {
		const count = activeConnections.get(ip) || 1;
		if (count < 1) {
			activeConnections.delete(ip)
		} else {
			activeConnections.set(ip, count - 1);
		}
	})
	next();
}