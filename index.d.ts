declare module "tiny-discord" {
	import EventEmitter from "events"

	export type DiscordEvent = "APPLICATION_COMMAND_CREATE | APPLICATION_COMMAND_DELETE | APPLICATION_COMMAND_UPDATE | CHANNEL_CREATE | CHANNEL_DELETE | CHANNEL_PINS_UPDATE | CHANNEL_UPDATE | GUILD_BAN_ADD | GUILD_BAN_REMOVE | GUILD_CREATE | GUILD_DELETE | GUILD_EMOJIS_UPDATE | GUILD_INTEGRATIONS_UPDATE | GUILD_MEMBER_ADD | GUILD_MEMBER_REMOVE | GUILD_MEMBERS_CHUNK | GUILD_MEMBER_UPDATE | GUILD_ROLE_CREATE | GUILD_ROLE_DELETE | GUILD_ROLE_UPDATE | GUILD_SCHEDULED_EVENT_CREATE | GUILD_SCHEDULED_EVENT_UPDATE | GUILD_SCHEDULED_EVENT_DELETE | GUILD_SCHEDULED_EVENT_USER_ADD | GUILD_SCHEDULED_EVENT_USER_REMOVE | GUILD_STICKERS_UPDATE | GUILD_UPDATE | INTEGRATION_CREATE | INTEGRATION_DELETE | INTEGRATION_UPDATE | INTERACTION_CREATE | INVITE_CREATE | INVITE_DELETE | MESSAGE_CREATE | MESSAGE_DELETE | MESSAGE_DELETE_BULK | MESSAGE_REACTION_ADD | MESSAGE_REACTION_REMOVE | MESSAGE_REACTION_REMOVE_ALL | MESSAGE_REACTION_REMOVE_EMOJI | MESSAGE_UPDATE | PRESENCE_UPDATE | STAGE_INSTANCE_CREATE | STAGE_INSTANCE_DELETE | STAGE_INSTANCE_UPDATE | READY | RESUMED | THREAD_CREATE | THREAD_DELETE | THREAD_LIST_SYNC | THREAD_MEMBERS_UPDATE | THREAD_MEMBER_UPDATE | THREAD_UPDATE | TYPING_START | USER_UPDATE | VOICE_SERVER_UPDATE | VOICE_STATE_UPDATE | WEBHOOKS_UPDATE"

	export interface Interaction {
		id: string
		type: number
		data?: Record<string, any>
		guild_id?: string
		channel_id?: string
		member?: Record<string, any>
		user?: Record<string, any>
		token: string
		version: number
		message?: Record<string, any>
	}
	export interface InteractionResponse {
		type: number
		data?: Record<string, any>
	}
	export interface InteractionServerOptions {
		key: string
		path?: string
		server?: import("net").Server | import("http2").SecureServerOptions | import("http").ServerOptions
	}
	export class InteractionServer extends EventEmitter {
		constructor(options: InteractionServerOptions)
		on(event: "interaction", callback: (data: Interaction) => InteractionResponse | Promise<InteractionResponse>): this
		on(event: "error", callback: (error: Error) => void): this
		listen(port: number): Promise<void>
		close(): Promise<void>
	}

	export interface ShardOptions {
		token: string
		intents: number
		id?: number
		total?: number
		large_threshold?: number
		presence?: {
			since: number | null
			afk: boolean
			status: "online" | "dnd" | "idle" | "invisible" | "offline"
			activities: Record<string, any>[]
		}
		properties?: {
			$os: string
			$browser: string
			$device: string
		}
		version?: number
		encoding?: "json" | "etf"
		compression?: 0 | 1 | 2
		url?: string
		session?: string
		sequence?: number
		identifyHook?: (id: number) => { time: number, ask?: boolean } | Promise<{ time: number, ask?: boolean }>
	}
	export interface ShardEvent {
		op: number
		d: Record<string, any>
		s: number
		t: string
	}
	export interface ShardReady {
		v: string
		user: Record<string, any>
		guilds: Record<string, any>[]
		session_id: string
		shard?: [number, number]
		application: Record<string, any>
	}
	export interface ShardResumed {
		replayed: number
	}
	export interface PresenceUpdateOptions {
		since?: number
		afk?: boolean
		status?: "online" | "dnd" | "idle" | "invisible" | "offline"
		activities?: Record<string, any>[]
	}
	export interface RequestGuildMembersOptions {
		guild_id: string
		query?: string
		limit?: number
		presences?: boolean
		user_ids?: string[]
		timeout?: number
	}
	export interface GuildMembersResult {
		guild_id: string
		members: Record<string, any>[]
		presences: Record<string, any>[]
		not_found: string[]
	}
	export interface UpdateVoiceStateOptions {
		guild_id: string
		channel_id?: string
		self_mute?: boolean
		self_deaf?: boolean
		wait_for_server?: boolean
		timeout?: number
	}
	export interface VoiceStateResult {
		guild_id: string
		channel_id?: string
		user_id: string
		member?: Record<string, any>
		session_id:	string
		deaf: boolean
		mute: boolean
		self_deaf: boolean
		self_mute: boolean
		self_stream?: boolean
		self_video:	boolean
		suppress: boolean
		request_to_speak_timestamp?: string
		token?: string,
		endpoint?: string
	}
	export class WebsocketShard extends EventEmitter {
		constructor(options: ShardOptions)
		on(event: "event", callback: (data: ShardEvent) => void): this
		on(event: "debug", callback: (data: string) => void): this
		on(event: "close", callback: (data?: Error) => void): this
		on(event: "ready", callback: (data: ShardReady) => void): this
		on(event: "resumed", callback: (data: ShardResumed) => void): this
		connect(): Promise<void>
		send(data: { op: number, d: Record<string, any> }): Promise<void>
		updatePresence(presence: PresenceUpdateOptions): Promise<void>
		requestGuildMembers(options: RequestGuildMembersOptions): Promise<GuildMembersResult>
		updateVoiceState(state: UpdateVoiceStateOptions): Promise<VoiceStateResult>
		ping(data: any): Promise<number>
		close(): Promise<void>
		readonly lastPing: number
		readonly status: number
		readonly connectedAt: number
		readonly readyAt: number
		readonly identifiedAt: number
		token: string
		intents: number
		id: number
		total: number
		large_threshold?: number
		presence?: ShardOptions["presence"]
		properties: ShardOptions["properties"]
		version: number
		encoding: ShardOptions["encoding"]
		compression: ShardOptions["compression"]
		url: string
		session?: string
		sequence: number
		identifyHook?: ShardOptions["identifyHook"]
	}

	export interface InternalSharderOptions {
		options: Omit<ShardOptions, "session" | "sequence" | "id" | "total">
		total: number
		ids?: number[]
		shardOptions?: Record<string | number, Omit<ShardOptions, "token" | "intents" | "id" | "total">>
		timeout?: number
		session_start_limit?: {
			max_concurrency: number
			total: number
			remaining: number
			reset_after: number
		}
	}
	export interface ControllerObject {
		total: number
		remaining: number
		resetTimestamp: number
		concurrency: number
		timeout: number
	}
	export class InternalSharder extends EventEmitter {
		constructor(options: InternalSharderOptions)
		on(event: DiscordEvent, callback: (data: Record<string, any>, id: number) => void): this
		on(event: "event", callback: (data: ShardEvent, id: number) => void): this
		on(event: "debug", callback: (data: string, id: number) => void): this
		on(event: "ready", callback: (data: ShardReady, id: number) => void): this
		on(event: "resumed", callback: (data: ShardResumed, id: number) => void): this
		on(event: "close", callback: (data: Error, id: number) => void): this
		connect(): Promise<void>
		close(): Promise<void>
		getAveragePing(): number
		getSessions(): Record<string | number, { session: string, sequence: number }>
		options: InternalSharderOptions["options"]
		shardOptions: Record<string | number, InternalSharderOptions["shardOptions"]>
		ids: number[]
		total: number
		shards: Map<number, WebsocketShard>
		controller: ControllerObject | null
	}

	export interface RestClientOptions {
		token: string
		version?: number
		type?: "bearer" | "bot"
		retries?: number
		timeout?: number
	}
	export interface RestRequestOptions {
		path: string
		method: string
		body?: Record<string, any>
		headers?: Record<string, any>
		options?: import("https").RequestOptions
		retries?: number
		timeout?: number
		cdn?: boolean
	}
	export interface RestResponse {
		status: number
		headers: Record<string, any>
		body: Record<string, any> | string | Buffer
	}
	interface AbortablePromise<T> extends Promise<T> {
		abort(reason?: string): void
	}
	export class RestClient {
		constructor(options: RestClientOptions)
		request(options: RestRequestOptions): AbortablePromise<RestResponse>
		get(path: string, options?: RestRequestOptions): AbortablePromise<RestResponse>
		delete(path: string, options?: RestRequestOptions): AbortablePromise<RestResponse>
		post(path: string, body: Record<string, any>, options?: RestRequestOptions): AbortablePromise<RestResponse>
		patch(path: string, body: Record<string, any>, options?: RestRequestOptions): AbortablePromise<RestResponse>
		put(path: string, body?: Record<string, any>, options?: RestRequestOptions): AbortablePromise<RestResponse>
		cdn(path: string, options?: RestRequestOptions): AbortablePromise<RestResponse>
	}
}
