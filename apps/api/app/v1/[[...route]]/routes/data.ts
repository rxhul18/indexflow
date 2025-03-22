import { Hono } from "hono";

// const CACHE_EXPIRY = 169;

const data = new Hono();

export type DataApiType = typeof data;
export default data;
